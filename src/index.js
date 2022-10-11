/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');
const app = express();
const path = require('path');
const nodemailer = require('nodemailer');

const router = express.Router();
require('dotenv').config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

let transport = nodemailer.createTransport({
  maxConnections: 2,
  pool: true,
  host: process.env.stmp_link,
  port: 587,
  secure: false,
  auth: {
    user: 'comunicaciones@bonetconsulting.com',
    pass: process.env.outlook_password,
  },
});

function sendContactMail(name, email, asunto, mensaje) {
  let mailOptions = {
    from: 'Bonet Consulting <comunicaciones@bonetconsulting.com>',
    to: `programacion@bonetconsulting.com,sali@bonetconsulting.com`,
    subject: 'Contacto Bonet',
    attachments: [
      {
        filename: 'bonetlogo.png.jpg',
        path: `${__dirname}/public/images/bonetlogo.png`,
        cid: 'logo', //same cid value as in the html img src
      },
    ],
    html: `
      <html>
      <body>
        <table cellspacing="0" style="width: 500px; height: 200px; border:1px solid #d1d1d1; padding:10px;background:#eeeeee">
        <img src="cid:logo">
        <hr style="width:450px; margin:auto; border:1px solid black; margin-top:-19px"></hr>  
        <h3 style="font-family:sans-serif; color:#373737; font-size:30px; font-weight:300">${asunto}</h3> 
          <div width="10%">
            <div style=" position:relative;">
              <b style="color: #00a1ff; font-size:23px; font-weight: 800;"> >  </b> <span style="font-family:sans-serif; font-size: 18px; color:#3a3a3a;font-weight:600">Nombre y apellido: </span ><span style="font-size: 19px; color:#3a3a3a; font-weight:300;">${name}</span>
            <br/>
              <b style="color: #00a1ff; font-size:23px; font-weight: 800;"> >  </b> <span style="font-family:sans-serif; font-size: 18px; color:#3a3a3a; font-weight:600">e-mail:</span>    <span style="font-size: 19px; color:#ffffff; font-weight:300;">${email}</span>
            <br/>
              <b style="color: #00a1ff; font-size:23px; font-weight: 800;"> >  </b>
               <span style="font-family:sans-serif; font-size: 18px; color:#3a3a3a; font-weight:600;">Mensaje:</span> 
               <br/><b style="display:none; color: #00a1ff; font-size:23px; font-weight: 800; "> >  </b> <span style="width:50px; position:absolute;  margin:auto; font-size: 19px; color: #3a3a3a; font-weight:300; text-align:justify">${mensaje} </span>
              </div>
          </div>
        </table>
      </body>
      </html>`,
  };
  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return; //(error)
    }
  });
} //  res.send("HOLA MUNDO") //__dirname : It will resolve to your project folder.

//app.use('/', function(req, res) {
//});

app.use('/contactLanding', (req, res) => {
  const { name, email, asunto, mensaje } = req.body;
  if (email.trim() != '') {
    sendContactMail(name, email, asunto, mensaje);
    res.redirect('./contact.html');
  } else {
  }
});

// // router.post("/contactLanding", (req, res) => {
// //   sendContactMail();

// //   res.send("hello");
// //   console.log("fsgf");
// // });

app.listen(process.env.PORT || 3000);
console.log('Server on port 3000');
