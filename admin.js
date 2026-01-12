// admin.js
const accounts = require("./accounts");

function isAdmin(member) {
  return member.permissions.has("Administrator");
}

function loginAsUser(username) {
  return accounts.getByUsername(username);
}

module.exports = {
  isAdmin,
  loginAsUser
};
