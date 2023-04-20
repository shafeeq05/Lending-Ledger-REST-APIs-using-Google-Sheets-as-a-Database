const express = require("express")//require express module from node_modules

const crypto = require('crypto');//require crypto module from node_module

//require instens of googlesheet clint, and sheet id from sheet module----
const {googleSheet,sheetid,clint} = require('./sheet'); 

//require sheet Sheema from scheemaValidation module-----------------------
const sheetScheema = require("./scheemaValidation");

const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())


// post data to the googlesheet-------------------------------
app.post('/ledger',async(req,res)=>{
    
   try {
    const allBody = sheetScheema.parse(req.body)
    const valuesArray = Object.values(allBody)
   console.log(valuesArray);
    const key = crypto.randomBytes(6).toString('hex');
    const date = new Date()
    let curentDate = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
    valuesArray.unshift(key,curentDate)
    await googleSheet.spreadsheets.values.append({
        spreadsheetId:sheetid,
        range:'sheet1!A2:F1000',
        insertDataOption:'INSERT_ROWS',
        valueInputOption:'RAW',
        requestBody:{
            values:[valuesArray]
        }
    })
    res.status(200).json("Posted successfully")
    
   } catch (error) {
    console.log("error",error)
    res.sendStatus(400)
   }
})

//get all data from google sheet -------------------------------------
app.get('/ledger',async(req,res)=>{
try {
    const getRow = await googleSheet.spreadsheets.values.get({
        auth:clint,
        spreadsheetId:sheetid,
        range:"Sheet1"
    })
    res.status(200).json(getRow.data.values)
    
} catch (error) {
    res.status(400).json("Bad request")
}

})

//get a row from google sheet using row id--------------------------
app.get('/ledger/:id',async(req,res)=>{
    try {
        console.log(req.params.id);
        const getRow = await googleSheet.spreadsheets.values.get({
            auth:clint,
            spreadsheetId:sheetid,
            range:"Sheet1"
        })
        
      const findRow = getRow.data.values.find((arr)=> arr[0]===req.params.id)
      res.status(200).json(findRow)
      console.log(getRow.data.values);
        
    } catch (error) {
        console.log(error);
    }
   
})

//delete row finding userid-----------------------------------------------------
app.delete('/ledger/:id',async(req,res)=>{
    try {
        console.log(req.params.id);
        const getRow = await googleSheet.spreadsheets.values.get({
            auth:clint,
            spreadsheetId:sheetid,
            range:"Sheet1"
        })
        const rowIndex = getRow.data.values.findIndex((arr)=> arr[0]===req.params.id)
        if(rowIndex>0){
        console.log(rowIndex+1);

       

       const update =  await googleSheet.spreadsheets.values.batchUpdate({
           spreadsheetId:sheetid,
           auth:clint,
           resource: {
            
            data: [
              {
                range: `Sheet1!${rowIndex + 1}:${rowIndex + 6}`,
                values: [Array(6).fill('')],
                
              },
            ],
            valueInputOption: 'USER_ENTERED',
          }
            
          });
          res.status(200).json("deleted")
          console.log(getRow.data.values);
        //   console.log(update);
        }
        else{
           throw new Error("id not found")
        }
        

    } catch (error) {
        res.status(404).json(error.message)
        console.log("id not found");
    }

})



//run node server at port no 3000
app.listen(3000,()=>console.log("server connected"))