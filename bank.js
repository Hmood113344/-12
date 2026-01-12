// bank.js
const bank = new Map();
// discordId => balance

function getBalance(id) {
  if (!bank.has(id)) bank.set(id, 50000);
  return bank.get(id);
}

function addBalance(id, amount) {
  bank.set(id, getBalance(id) + amount);
}

function deductBalance(id, amount) {
  const bal = getBalance(id);
  if (bal < amount) return false;
  bank.set(id, bal - amount);
  return true;
}

module.exports = {
  getBalance,
  addBalance,
  deductBalance
};
