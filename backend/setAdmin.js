const admin = require("./firebase");

async function setAdmin(uid) {
  await admin.auth().setCustomUserClaims(uid, { admin: true });
  console.log("User set as admin");
}

setAdmin("AImBTOuuEuMfB9Mb3tYKI4ky1KA3");
