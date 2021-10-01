import * as nodemailer from "nodemailer";
import { Request, Response } from "express";
import { toString } from "lodash";
import { bodyRequestEmail, ProfileTemplate } from "../types";
import { db } from "../shared";
const { google } = require("googleapis");

// DSM Data School Managment
class DSMController {
  async sendEmail(req: Request, res: Response) {
    try {
      const { email, subject, content, files }: bodyRequestEmail = req.body;
      const oAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
      );
      oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
      const accessToken = await oAuth2Client.getAccessToken();
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          type: "OAuth2",
          user: "smartattendance01pro@gmail.com",
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken: accessToken,
        },
        logger: true,
      });
      // send mail with defined transport object
      return await transporter
        .sendMail({
          from: '"OFA 👻" <OFA@gmail.com>', // sender address
          to: toString(email), // list of receivers
          subject: subject, // Subject line
          text: `<div>${content}</div>`, // plain text body
          html: `<div>${content}</div>`, // html body
        })
        .then(() => {
          return res.status(200).send(`Sent email ${email} successfully`);
        })
        .catch(() => {
          return res.status(500).send(`Sent email ${email} went wrong`);
        });
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  async getListTeacher(req: Request, res: Response) {
    try {
      const teachers = await db
        .collection("teachers")
        .get()
        .then((query: any) => {
          let list: ProfileTemplate[] = [];
          query.forEach((teacher: any) => {
            list.push({ ...(teacher.data() as ProfileTemplate) });
          });
          return list;
        });
      return res.status(200).send(teachers);
    } catch (error) {
      return res.status(500).send(error);
    }
  }
}

export default new DSMController();
