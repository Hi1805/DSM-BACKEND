import { Request, Response } from "express";
import { toString } from "lodash";
import { bodyRequestEmail, ClassesResponse } from "../types";
import { auth, db } from "./../shared";
import { sendMail } from "../helpers/send";
import * as jwt from "jsonwebtoken";
// DSM Data School Managment
class DSMController {
  async sendEmail(req: Request, res: Response) {
    try {
      const { email, subject, content, files }: bodyRequestEmail = req.body;
      const message = await sendMail(email, subject, content, files);
      // send mail with defined transport object
      return res.status(200).send({
        message: message,
      });
    } catch (error) {
      return res.status(500).send({
        message: "send email failed",
        error,
      });
    }
  }
  async getClasses(req: Request, res: Response) {
    try {
      const grades: ClassesResponse[] = (
        await db.collection("classes").get()
      ).docs.map((doc) => {
        const data = { ...doc.data() };
        return { ...data, ...{ total: undefined } } as ClassesResponse;
      });
      return res.status(200).send(grades);
    } catch (error) {
      return res.status(500).send({
        message: "get classes failed",
      });
    }
  }
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = (
        await db
          .collection("accounts")
          .where("email", "==", email)
          .where("password", "==", password)
          .get()
      ).docs;
      if (!user.length) {
        throw new Error("Email or password incorrect ");
      }
      return res.json({
        token: jwt.sign(
          {
            email: email,
            password,
          },
          process.env.ACCESS_TOKEN_SECRET || ""
        ),
      });
    } catch (error: any) {
      return res.status(401).send({
        message: error.message,
      });
    }
  }
}

export default new DSMController();
