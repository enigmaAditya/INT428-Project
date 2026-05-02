const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');
const YahooFinance = require('yahoo-finance2').default;
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const port = process.env.PORT || 5002;

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to Neural Database (MongoDB)'))
  .catch(err => console.error('Database Connection Error:', err));

app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
const authRoutes = require('./routes/auth');
const auth = require('./middleware/auth');
app.use('/api/auth', authRoutes);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const yahooFinance = new YahooFinance();

// Persistence
const DB_PATHS = {
  profile: path.join(__dirname, 'data', 'userProfile.json'),
  portfolio: path.join(__dirname, 'data', 'portfolios.json')
};

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const readDB = (key) => {
  try {
    const data = fs.readFileSync(DB_PATHS[key], 'utf8');
    return JSON.parse(data || (key === 'portfolio' ? '[]' : '{}'));
  } catch (e) { return key === 'portfolio' ? [] : {}; }
};

const writeDB = (key, data) => fs.writeFileSync(DB_PATHS[key], JSON.stringify(data, null, 2));

// Technical Engine
const getTechnicalAnalysis = async (symbol) => {
  try {
    const hist = await yahooFinance.historical(symbol, { period1: new Date(Date.now() - 60*24*60*60*1000), period2: new Date(), interval: '1d' });
    const prices = hist.map(d => d.close).filter(p => p !== null);
    if (prices.length < 30) return "Insufficient data for audit.";
    
    let gains = 0, losses = 0;
    for (let i = prices.length - 14; i < prices.length; i++) {
      const diff = prices[i] - prices[i-1];
      diff >= 0 ? gains += diff : losses -= diff;
    }
    const rsi = 100 - (100 / (1 + (gains / (losses || 1))));
    const shortMA = prices.slice(-12).reduce((a, b) => a + b) / 12;
    const longMA = prices.slice(-26).reduce((a, b) => a + b) / 26;
    
    const signal = (rsi < 35 && shortMA > longMA) ? 'BULLISH BUY' : (rsi > 65 && shortMA < longMA) ? 'BEARISH SELL' : 'NEUTRAL';
    return `Audit for ${symbol}: RSI ${rsi.toFixed(1)}, MACD Momentum: ${shortMA > longMA ? 'Positive' : 'Negative'}. Overall: ${signal}.`;
  } catch (e) { return "Technical stream unavailable."; }
};

const getTrendData = async (symbol) => {
  try {
    const hist = await yahooFinance.historical(symbol, { period1: new Date(Date.now() - 30*24*60*60*1000), period2: new Date(), interval: '1d' });
    return { symbol, data: hist.map(d => ({ date: d.date, price: d.close })) };
  } catch (e) { return null; }
};

// RELIABLE MANUAL RAG ENGINE
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    const profile = readDB('profile');

    // Step 1: Detect Intent & Symbols using AI for accuracy
    const extractCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Extract stock ticker symbols (e.g., AAPL for Apple, TSLA for Tesla) from the user's message. If the user mentions an Indian company (like Reliance, TCS, Zomato), you MUST append '.NS' to the ticker (e.g., RELIANCE.NS, TCS.NS, ZOMATO.NS). Return ONLY a comma-separated list of symbols. If no companies/stocks are mentioned, return exactly 'NONE'." },
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0
    });
    
    let symbols = [];
    const extractedText = extractCompletion.choices[0].message.content.trim();
    if (extractedText !== 'NONE') {
      symbols = extractedText.split(',').map(s => s.trim().toUpperCase());
    }
    const isTechnical = message.toLowerCase().includes('audit') || message.toLowerCase().includes('why') || message.toLowerCase().includes('recommend');
    const isTrend = message.toLowerCase().includes('trend') || message.toLowerCase().includes('graph') || message.toLowerCase().includes('30 day');

    let context = `User Profile: ${JSON.stringify(profile)}\n`;

    // Step 2: Retrieve Data (RAG)
    if (symbols.length > 0) {
      const stats = await Promise.all(symbols.map(s => yahooFinance.quote(s).catch(() => null)));
      const validStats = stats.filter(s => s);
      if (validStats.length > 0) {
        context += `Live Market Context: ${JSON.stringify(validStats.map(s => ({ symbol: s.symbol, price: s.regularMarketPrice, pe: s.trailingPE, cap: s.marketCap })))}\n`;
      }

      if (isTechnical) {
        const audits = await Promise.all(symbols.slice(0, 2).map(s => getTechnicalAnalysis(s)));
        context += `Technical Audits: ${audits.join(' ')}\n`;
      }
    }

    // Step 3: Generate Response
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are the Neural Core Advisor, a specialized AI strictly focused on finance, stock markets, and investments. You are provided with LIVE, REAL-TIME market data in the 'Context' section. ALWAYS use this context to answer the user's question. NEVER say you don't have real-time access. You should respond politely to greetings (like hi, hello, etc.). Use MARKDOWN (bold, italics, headers, lists) to organize your responses beautifully. However, if the user asks about ANY other topic outside of finance, trading, economics, or the provided market context, you must reply exactly with: 'I can't help you with that.'. Do not apologize, do not explain why. Be professional and concise." },
        ...history.slice(-4).map(m => ({ role: m.role, content: m.content.replace(/\[CHART_DATA:.*?\]/g, '') })),
        { role: "user", content: `Context: ${context}\n\nQuestion: ${message}` }
      ],
      model: "llama-3.3-70b-versatile",
    });

    let reply = chatCompletion.choices[0].message.content;

    // Step 4: Inject Charts if needed
    if (isTrend && symbols.length > 0) {
      const trend = await getTrendData(symbols[0]);
      if (trend) reply += `\n\n[CHART_DATA:${JSON.stringify(trend)}]`;
    }

    res.json({ reply });
  } catch (error) {
    console.error('[SERVER ERROR]', error);
    res.status(500).json({ error: 'Neural bridge failed.' });
  }
});

// Dashboard APIs
app.get('/api/market/:symbol/history', async (req, res) => {
  const { symbol } = req.params;
  try {
    // Use chart API which is more reliable for NSE stocks
    const chart = await yahooFinance.chart(symbol, { 
      period1: new Date(Date.now() - 40*24*60*60*1000), 
      interval: '1d' 
    });
    
    if (!chart || !chart.quotes) throw new Error('No chart data found');

    const processedData = chart.quotes.map(q => ({
      name: new Date(q.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: q.close || q.adjclose || q.high || q.low
    })).filter(q => q.value !== null && q.value !== undefined).slice(-20);

    if (processedData.length === 0) throw new Error('No valid market points');
    res.json(processedData);
  } catch (e) {
    console.error(`[REAL-DATA ERROR] ${symbol}:`, e.message);
    res.status(500).json({ error: `Market stream unavailable: ${e.message}` });
  }
});

app.get('/api/market/:symbol', async (req, res) => {
  try {
    const d = await yahooFinance.quote(req.params.symbol);
    res.json({ 
      symbol: d.symbol, 
      price: d.regularMarketPrice, 
      change: d.regularMarketChangePercent,
      currency: d.currency || (d.symbol.endsWith('.NS') ? 'INR' : 'USD')
    });
  } catch (e) { res.status(404).json({ error: 'Not found' }); }
});

app.get('/api/portfolio', auth, async (req, res) => {
  try {
    const Portfolio = require('./models/Portfolio');
    const items = await Portfolio.find({ user: req.userId });
    
    // Fetch live prices for all portfolio items
    const updated = await Promise.all(items.map(async (item) => {
      try {
        const live = await yahooFinance.quote(item.symbol);
        return { 
          _id: item._id,
          symbol: item.symbol,
          name: item.name,
          qty: item.qty,
          avgCost: item.avgCost,
          sector: item.sector,
          price: live.regularMarketPrice || item.avgCost, 
          change: live.regularMarketChangePercent || 0 
        };
      } catch (e) {
        return {
          _id: item._id,
          symbol: item.symbol,
          name: item.name,
          qty: item.qty,
          avgCost: item.avgCost,
          sector: item.sector,
          price: item.avgCost,
          change: 0
        };
      }
    }));
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

app.post('/api/portfolio', auth, async (req, res) => {
  try {
    const Portfolio = require('./models/Portfolio');
    const { symbol, name, qty, avgCost, sector } = req.body;
    
    const newItem = new Portfolio({
      user: req.userId,
      symbol: symbol.toUpperCase(),
      name: name || symbol.toUpperCase(),
      qty: Number(qty),
      avgCost: Number(avgCost),
      sector: sector || 'Trading'
    });
    
    await newItem.save();
    res.json({ success: true, item: newItem });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to portfolio' });
  }
});

app.get('/api/profile', auth, async (req, res) => {
  try {
    const User = require('./models/User');
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.post('/api/profile', auth, async (req, res) => {
  try {
    const User = require('./models/User');
    const { incomeRange, netWorth, liquidityRatio, sourceOfWealth, riskTolerance, primaryObjective, tradingAutonomy } = req.body;
    await User.findByIdAndUpdate(req.userId, {
      incomeRange,
      netWorth,
      liquidityRatio,
      sourceOfWealth,
      riskTolerance,
      primaryObjective,
      tradingAutonomy
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

app.listen(port, () => {
  console.log(`Neural Ultra-Stable Server running on port ${port}`);
  // Keep-alive heartbeat to prevent immediate exit in some environments
  setInterval(() => {}, 1000 * 60 * 60);
});
