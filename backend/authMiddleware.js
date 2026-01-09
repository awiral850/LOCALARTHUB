const admin = require("./firebase");

async function verifyUser(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(403).json({ message: "Invalid token" });
  }
}

// optional verify: if token present decode and attach req.user, otherwise continue
async function optionalVerifyUser(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next();

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
  } catch (e) {
    // ignore invalid token, proceed as unauthenticated
  }
  next();
}

module.exports = {
  verifyUser,
  optionalVerifyUser
};
