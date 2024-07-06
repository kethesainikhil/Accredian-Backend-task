const express = require("express")
const cors = require("cors");
const app =  express();
const z = require("zod");
const axios = require("axios")
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

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
//send email using google api
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail({ to, subject, text, html }) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'kethesainikhil@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: 'kethesainikhil@gmail.com',
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    throw new Error('Error sending email: ' + error.message);
  }
}

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
                const{refereeEmail} = req.body;
                try {
                    const result = await sendMail({ to:refereeEmail, 
                        subject:`You got referral by ${alreadyAddedUser.referrerName} to Join Accredian`,
                         text :"Referral Alert", html: `<!DOCTYPE html>
                                        <html lang="en">
                                        <head>
                                            <meta charset="UTF-8">
                                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                            <title>Welcome to Accredian</title>
                                        </head>
                                        <body style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px;">
                                            <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                                                <h2 style="color: #333333;">Welcome to Accredian!</h2>
                                                <p>Hello,</p>
                                                <p>You have been referred to Accredian by Email: ${alreadyAddedUser.referrerEmail} special. We're thrilled to welcome you!</p>
                                                <p>At Accredian, we strive to provide top-notch services tailored to your needs. Whether you're looking for solutions or support, we're here to assist you every step of the way.</p>
                                                <p>If you have any questions or need assistance, please don't hesitate to contact us. We look forward to serving you.</p>
                                                <p>Best regards,</p>
                                                <p>The Accredian Team</p>
                                            </div>
                                        </body>
                                        </html>
                                                ` });
                  } catch (error) {
                    console.error(error);
                    res.status(500).json({ message: 'Error sending email', error: error.message });
                  }
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

            try {
                const result = await sendMail({ to:referedTo.refereeEmail, 
                    subject:`You got referral by ${referedBy.referrerName} to Join Accredian`,
                     text :"Referral Alert", html: `<!DOCTYPE html>
                                    <html lang="en">
                                    <head>
                                        <meta charset="UTF-8">
                                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                        <title>Welcome to Accredian</title>
                                    </head>
                                    <body style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px;">
                                        <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                                            <h2 style="color: #333333;">Welcome to Accredian!</h2>
                                            <p>Hello,</p>
                                            <p>You have been referred to Accredian by Email: ${referedBy.referrerEmail} special. We're thrilled to welcome you!</p>
                                            <p>At Accredian, we strive to provide top-notch services tailored to your needs. Whether you're looking for solutions or support, we're here to assist you every step of the way.</p>
                                            <p>If you have any questions or need assistance, please don't hesitate to contact us. We look forward to serving you.</p>
                                            <p>Best regards,</p>
                                            <p>The Accredian Team</p>
                                        </div>
                                    </body>
                                    </html>
                                            ` });
              } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error sending email', error: error.message });
              }
                
            }
                res.status(200).json({
                    "message":"You Successfully Refered Keep it up",
                })

        }
        
    } catch (error) {
        res.status(400).json({
            "message":"Error in insering into the data "
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


