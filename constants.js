require("dotenv").config();

const auth = {
  type: "OAuth2",
  user: "kethesainikhil@gmail.com",
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
};

const mailoptions = {
  from: "kethesainikhil@gmail.com",
  to: "nikhilkethe007@gmail.com",
  subject: "Gmail API NodeJS",
};

module.exports = {
  auth,
  mailoptions,
};