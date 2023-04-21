//require googleapi module from node_modules-------------------------
const { google } = require("googleapis"); 

require ('dotenv').config({path:'../.env'})


//destructuring credentials.json file for my private_key and clint_email
const { private_key, client_email } = require("../credentials.json");

//assign sheet id into variable---------------------------------------
const sheetid = process.env.SHEET_ID;
console.log(sheetid);
//create clint instence for auth-------------------------------------
const clint = new google.auth.JWT(client_email, null, private_key, [
  process.env.GOOGLE_API,
]);

//create instense of google sheet APIs--------------------------------
const googleSheet = google.sheets({version:'v4',auth:clint})



//export the contents in the module
module.exports = {googleSheet,sheetid,clint}

