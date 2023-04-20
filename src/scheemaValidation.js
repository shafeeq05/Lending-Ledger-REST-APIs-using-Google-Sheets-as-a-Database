const {z} = require("zod") //require zod module for data validation

//create scheema for data validation---------------------
const sheetScheema = z.object({  
    Name: z.string().min(1,{message:"Name required"}),
    Type: z.string().min(1,{message:"Type required"}),
    Amount: z.number().min(1,{message:"Amount required"}),
    Discription: z.string().optional()
    
})

//export the module----------------------------------------
module.exports = sheetScheema