const express = require("express")
const cors = require("cors");
const app =  express();
const z = require("zod");
const axios = require("axios")
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

require('dotenv').config()
app.use(cors(
    {
        origin: "*",
    }
));
app.use(express.json())

const referDetailsSchema = z.object({
    referrerEmail : z.string().email({message:"Valid Email is required"}),
                referrerName :z.string().min(4,{message:"Name should be atleast more than 4 characters"}),
                referrerPhoneNo : z.string().min(10,{message:"Phone Number should be 10 or more"}),
                refereeEmail:  z.string().email({message:"Valid Email is required"}),
                refereeName: z.string().min(4,{message:"Name should be atleast more than 4 characters"}),
                refereePhoneNo:z.string().min(10,{message:"Phone Number should be 10 or more"}),
  });



app.get("/",(req,res)=>{
    res.send("hello world")
})

app.post("/insertRefer",async (req,res)=>{
    const result = referDetailsSchema.safeParse(req.body)

        if (!result.success) {
            res.status(400).json({
                "message":result.error.issues[0].message
            })
        }
        else{  
    try {

        const alreadyReferred = await prisma.refereeDetails.findFirst({
            where:{
                refereeEmail:req.body.refereeEmail
            }
        })


        if(alreadyReferred){
            res.status(400).json({
                "message":"The Email address got already referred"
            })
        }

        else{
            const alreadyAddedUser = await prisma.refererDetails.findFirst({
                where:{
                    referrerEmail : req.body.referrerEmail
                }
            })
            if(alreadyAddedUser){
    
                const referInfo = await prisma.refereeDetails.create({
                    data:{
                        referedBy: alreadyAddedUser.id,
                        refereeEmail:  req.body.refereeEmail,
                        refereeName: req.body.refereeName,
                        refereePhoneNo : req.body.refereePhoneNo
                    }
                })
            }
            else{
    
            const referedBy = await prisma.refererDetails.create({
                data:{
                    referrerEmail :req.body.referrerEmail ,
                    referrerName :req.body.referrerName,
                    referrerPhoneNo :req.body.referrerPhoneNo ,
                }
                
            }
                )
    
            const referedTo = await prisma.refereeDetails.create({
                data:{
                    referedBy:referedBy.id,
                    refereeEmail:  req.body.refereeEmail,
                    refereeName: req.body.refereeName,
                    refereePhoneNo : req.body.refereePhoneNo
                }
            })
                
            }
                res.status(200).json({
                    "message":"You Successfully Refered Keep it up",
                })

        }
        
    } catch (error) {
        res.status(400).json({
            "message":"Error in insering into the data"
        })
    }
        }
})


//to stop from spinning down the inactivity
const url = `${process.env.BACKEND_URL}` // Replace with your Render URL
const interval = 30000; // Interval in milliseconds (30 seconds)

function reloadWebsite() {
  axios.get(url)
    .then(response => {
      console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
    })
    .catch(error => {
      console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
    });
}


setInterval(reloadWebsite, interval);








app.listen(4000,()=>{
    console.log("server running at 4000")
})


