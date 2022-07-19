const express = require("express");

const nodemailer = require("nodemailer");
const multiparty = require("multiparty");
const path = require("path");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// instantiate an express app
const app = express();


app.use(express.static(path.join(__dirname, "/")));
app.use(express.static(__dirname + '/ru'));


app.post("/email", (req, res) => {

  const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL, // (your mail)
          pass: process.env.PASS, // (your pass mail)
        }
      },
      {
        from: `Mailer Test <${process.env.EMAIL}>` // (your mail)
      });

  let form = new multiparty.Form();
  let data = "";

  form.parse(req, function (err, fields) {
    Object.keys(fields).forEach(function (property) {
    data += `<li>${property}: ${fields[property].toString()}</li>`
    });
    const mail = {
      sender: `New message`,
      to: process.env.EMAIL, // receiver email,
      subject: 'New order',
      html:`
      <h2>CLIENT INFO</h2>
       <ul>
          ${data}
       </ul>
      `
    };
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong.");
      } else {
        res.status(200).send("Email successfully sent to recipient!");
      }
    });
  });
});

// //Index page (static HTML)
// app.route("/").get(function (req, res) {
//   res.sendFile(process.cwd() + "/public/index.html");
// });

/*************************************************/
// Express server listening...
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
