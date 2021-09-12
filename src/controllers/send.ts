import { google } from 'googleapis';
import * as nodemailer from 'nodemailer';
import { Request, Response } from 'express';
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
async function sendEmailController(req: Request, res: Response) {
  try {
    const { email } = req.params;
    console.log(email);
    console.log(process.env.REFRESH_TOKEN);
    const tokenAccess = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'smartattendance01pro@gmail.com',
        clientId: process.env.CLIENT_ID || '',
        clientSecret: process.env.CLIENT_SECRET || '',
        refreshToken: process.env.REFRESH_TOKEN || '',
        accessToken: tokenAccess.token || '',
      },
    });
    const mailOptions = {
      from: `Smart Attendance <>`,
      to: `${email}`,
      subject: 'Trường Trung Học Cơ Sở Đức Trí',
      text: 'Smart Bot',
      html: `<h1>From:Admin</h1>
        <h3></h3>
        <p></p> `,
      attachments: [],
    };

    const result = await transport.sendMail(mailOptions);
    return res.status(201).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export { sendEmailController };
