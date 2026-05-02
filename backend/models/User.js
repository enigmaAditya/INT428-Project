const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  incomeRange: { type: String, default: '' },
  netWorth: { type: Number, default: 0 },
  liquidityRatio: { type: Number, default: 45 },
  sourceOfWealth: { type: String, default: '' },
  riskTolerance: { type: String, default: 'Moderate' },
  primaryObjective: { type: String, default: 'Capital Growth' },
  tradingAutonomy: { type: String, default: 'Advisor Only' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
