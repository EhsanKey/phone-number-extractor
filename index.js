const axios = require("axios");
const { parse } = require("node-html-parser");
const fs = require("fs");

let numberErrors = 0;
let numberSuccess = 0;

const root_damins = fs.readFileSync("root-damins.txt", "utf8").split("\n");

const runApp = async () => {
  numberErrors = 0;
  numberSuccess = 0;

  fs.writeFileSync("mobileNumbers.txt", "");
  fs.writeFileSync("errors.txt", "");

  for (const root_damin of root_damins) {
    try {
      const response = await axios.get(`https://${root_damin}`);
      const parsedResponse = parse(response.data);

      const mobileRegex = /(\+98|0)?9\d{9}/g;
      const mobileNumbers = parsedResponse.toString().match(mobileRegex);

      if (mobileNumbers && mobileNumbers.length > 0) {
        fs.appendFileSync("mobileNumbers.txt", mobileNumbers.join("\n") + "\n");
        numberSuccess++;
      }
    } catch (err) {
      numberErrors++;
      fs.appendFileSync("errors.txt", `${root_damin}\n`);
    }
  }

  console.log(`Number of errors: ${numberErrors}`);
  console.log(`Number of success: ${numberSuccess}`);
};

runApp();
