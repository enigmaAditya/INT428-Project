const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');
const YahooFinance = require('yahoo-finance2').default;
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

console.log('Initializing Groq...');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
console.log('Initializing Yahoo Finance...');
const yahooFinance = new YahooFinance();

console.log('Starting server...');
const server = app.listen(port, () => {
    console.log(`Neural Ultra-Stable Server running on port ${port}`);
});

process.on('exit', (code) => {
    console.log(`Process exited with code: ${code}`);
});

process.on('uncaughtException', (err) => {
    console.log(`Uncaught Exception: ${err.message}`);
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});
