import * as nodemailer from "nodemailer";
import { File } from "../types";
const { google } = require("googleapis");
export const sendMail = async (
  email: string,
  subject: string,
  content: string,
  files?: File[]
) => {
  try {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID_EMAIL,

      process.env.CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );
    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
    const accessToken = await oAuth2Client.getAccessToken();
    // create reusable transporter object using the default SMTP transport
    console.log("run");
    const transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        type: "OAuth2",
        user: "smartattendance01pro@gmail.com",
        clientId: process.env.CLIENT_ID_EMAIL,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
      logger: false,
    });
    await transporter
      .sendMail({
        from: '"SCHOOL DATA MANAGEMENT 👻" <OFA@gmail.com>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        html: `<div">${content}</div>`, // html body
        attachments: files,
      })
      .then(() => {
        return `Sent email ${email} successfully`;
      })
      .catch(() => {
        return `Sent email ${email} went wrong`;
      });
  } catch (error) {
    console.log(error);
    return `Sent email ${email} went wrong`;
  }
};
