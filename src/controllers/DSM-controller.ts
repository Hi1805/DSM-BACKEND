import { Request, Response } from "express";
import { bodyRequestEmail, ClassesResponse } from "../types";
import { db } from "./../shared";
import { sendMail } from "../helpers/send";
import * as jwt from "jsonwebtoken";
import DeviceDetector from "device-detector-js";
import geoip from "geoip-lite";
import * as requestIp from "request-ip";
import bcrypt from "bcrypt";
import { rest, toString } from "lodash";

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
      const clientIp = requestIp.getClientIp(req) || "";

      const user =
        (await db.collection("accounts").where("email", "==", email).get())
          .docs[0] ||
        (await db.collection("accounts").where("username", "==", email).get())
          .docs[0];

      const location = geoip.lookup(clientIp);

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
        throw new Error("Email or username is incorrect ");
      }
      const { password: sysPassword } = user.data() as { password: string };
      const isCorrectPassword = await bcrypt.compare(
        toString(password),
        sysPassword
      );
      if (!isCorrectPassword) {
        throw new Error("Password is incorrect");
      }
      const token = jwt.sign(
        {
          uid: user.id,
          ip_address: clientIp,
        },
        process.env.ACCESS_TOKEN_SECRET || "",
        {
          expiresIn: "7d",
        }
      );
      console.log({ token });

      return res.json({
        token,
      });
    } catch (error: any) {
      console.log(error.message);

      return res.status(400).send({
        message: error.message,
      });
    }
  }
  async changePassword(req: Request, res: Response) {
    try {
      const { newPassword, oldPassword } = req.body;
      const { uid } = req.body.user;

      const user = (await db.collection("accounts").doc(uid).get()).data();
      if (!user) {
        throw new Error("User is not a valid");
      }
      const isCorrectOldPassword = await bcrypt.compare(
        toString(oldPassword),
        user.password
      );
      if (!isCorrectOldPassword) {
        throw new Error("Old password not correct");
      }
      // encode new password
      const encode_password = await bcrypt.hash(toString(newPassword), 10);
      await db.collection("accounts").doc(uid).set(
        {
          updated_at: new Date(),
          password: encode_password,
        },
        {
          merge: true,
        }
      );
      return res.status(201).json({
        message: "Change password is successfully",
      });
    } catch (error: any) {
      console.log(error.message);
      return res.status(500).json({
        message: error.message,
      });
    }
  }
}

export default new DSMController();
