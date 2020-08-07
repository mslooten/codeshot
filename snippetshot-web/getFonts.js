require("dotenv").config();

const https = require("https");
const fs = require("fs");

const file = fs.createWriteStream("./fonts/monolisa.css");

const request = https.get(process.env.MONOLISA, function (response) {
  response.pipe(file);
});
