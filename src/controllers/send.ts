import * as nodemailer from 'nodemailer';
import { Request, Response } from 'express';

async function sendEmailController(req: Request, res: Response) {
  try {
    const { email } = req.params;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.USER|| "", // generated ethereal user
        pass: process.env.PASS || "", // generated ethereal password
      },
      logger:true
    });
    const emails = ["ripker1805@gmail.com"];
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"OFA 👻" <foo@example.com>', // sender address
      to: emails.join(","), // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });
    return res.status(200).send(info.response)
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export { sendEmailController };
