import { Request, Response } from "express";
import { toString } from "lodash";
import { bodyRequestEmail, ClassesResponse } from "../types";
import { db } from "./../shared";
import { sendMail } from "../helpers/send";

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
}

export default new DSMController();
