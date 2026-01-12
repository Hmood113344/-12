// credit.js
const credit = new Map();
// discordId => data

function getUser(id) {
  if (!credit.has(id)) {
    credit.set(id, {
      score: 100,
      delays: 0,
      paid: 0,
      banned: false
    });
  }
  return credit.get(id);
}

function evaluate(id) {
  const u = getUser(id);
  if (u.banned) return "banned";
  if (u.score >= 80) return "auto";
  if (u.score >= 50) return "review";
  return "reject";
}

function success(id) {
  const u = getUser(id);
  u.paid++;
  u.score = Math.min(100, u.score + 5);
}

function delay(id) {
  const u = getUser(id);
  u.delays++;
  u.score -= 20;
  if (u.score <= 20) u.banned = true;
}

function status(id) {
  const u = getUser(id);
  if (u.banned) return "🚫 محظور";
  if (u.score >= 80) return "🟢 موثوق";
  if (u.score >= 50) return "🟡 تحت المراقبة";
  return "🔴 متعثر";
}

module.exports = {
  evaluate,
  success,
  delay,
  status
};
