// accounts.js
const accounts = new Map(); 
// username => { password, discordId }

function createAccount(username, password, discordId) {
  accounts.set(username, {
    password,
    discordId
  });
}

function login(username, password) {
  const acc = accounts.get(username);
  if (!acc) return false;
  if (acc.password !== password) return false;
  return acc;
}

function getByUsername(username) {
  return accounts.get(username);
}

function getAllAccounts() {
  return accounts;
}

module.exports = {
  createAccount,
  login,
  getByUsername,
  getAllAccounts
};
