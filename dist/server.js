const express=require("express"),nodemailer=require("nodemailer"),multiparty=require("multiparty"),path=require("path");require("dotenv").config();const PORT=process.env.PORT||5e3,app=express();app.use(express.static(path.join(__dirname,"/"))),app.use(express.static(__dirname+"/ru")),app.post("/email",((e,s)=>{const r=nodemailer.createTransport({host:"smtp.gmail.com",port:587,secure:!1,auth:{user:process.env.EMAIL,pass:process.env.PASS}},{from:`Mailer Test <${process.env.EMAIL}>`});let t=new multiparty.Form,n="";t.parse(e,(function(e,t){Object.keys(t).forEach((function(e){n+=`<li>${e}: ${t[e].toString()}</li>`}));const o={sender:"New message",to:process.env.EMAIL,subject:"New order",html:`\n      <h2>CLIENT INFO</h2>\n       <ul>\n          ${n}\n       </ul>\n      `};r.sendMail(o,((e,r)=>{e?(console.log(e),s.status(500).send("Something went wrong.")):s.status(200).send("Email successfully sent to recipient!")}))}))})),app.listen(PORT,(()=>{console.log(`Listening on port ${PORT}...`)}));