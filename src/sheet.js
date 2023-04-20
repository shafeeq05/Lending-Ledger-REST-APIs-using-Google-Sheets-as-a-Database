//require googleapi module from node_modules-------------------------
const { google } = require("googleapis"); 

require ('dotenv').config({path:'../.env'})
console.log(process.env.GOOGLE_API);

//destructuring credentials.json file for my private_key and clint_email
const { private_key, client_email } = require("../credentials.json");

//assign sheet id into variable---------------------------------------
const sheetid = "19exs0rHJ6piDaCU69BGXLunAfxwhXwjh6m_-8gqZ5oI";

//create clint instence for auth-------------------------------------
const clint = new google.auth.JWT(client_email, null, private_key, [
  process.env.GOOGLE_API,
]);

//create instense of google sheet APIs--------------------------------
const googleSheet = google.sheets({version:'v4',auth:clint})



//export the contents in the module
module.exports = {googleSheet,sheetid,clint}

