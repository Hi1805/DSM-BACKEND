import { Request, Response } from "express";
import { bodyRequestEmail, ClassesResponse } from "../types";
import { db } from "./../shared";
import { sendMail } from "../helpers/send";
import * as jwt from "jsonwebtoken";
import DeviceDetector from "device-detector-js";
import geoip from "geoip-lite";
import * as requestIp from "request-ip";

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

      const user_agent = req.headers["user-agent"];
      if (!email && password && user_agent) {
        throw new Error("Info login not valid");
      }
      let clientIp = requestIp.getClientIp(req) || "";

      const user = (
        await db
          .collection("accounts")
          .where("email", "==", email)
          .where("password", "==", password)
          .get()
      ).docs[0];
      const location = geoip.lookup(clientIp);
      if (clientIp.substr(0, 7) == "::ffff:") {
        clientIp = clientIp.substr(7);
      }
      const deviceDetector = new DeviceDetector();
      const device = deviceDetector.parse(user_agent || "");

      await db.collection("history").add({
        date: new Date(),
        status: typeof user !== undefined,
        user_ip: clientIp,
        location: location,
        client: device.client,
        os: device.os,
        device: device.device,
      });
      if (!user) {
        throw new Error("Email or password incorrect ");
      }
      return res.json({
        token: jwt.sign(
          {
            email: email,
            password,
          },
          process.env.ACCESS_TOKEN_SECRET || "",
          {
            expiresIn: "1d",
          }
        ),
      });
    } catch (error: any) {
      console.log(error.message);

      return res.status(401).send({
        message: error.message,
      });
    }
  }
  async changePassword(req: Request, res: Response) {
    try {
    } catch (error: any) {
      console.log(error.message);
    }
  }
}

export default new DSMController();
