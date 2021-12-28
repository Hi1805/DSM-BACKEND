import bcrypt from "bcrypt";
import DeviceDetector from "device-detector-js";
import { Request, Response } from "express";
import * as generate from "generate-password";
import geoip from "geoip-lite";
import * as jwt from "jsonwebtoken";
import { toNumber, toString } from "lodash";
import moment from "moment";
import { totp } from "otplib";
import * as requestIp from "request-ip";
import { sendMail } from "../helpers/send";
import { bodyRequestEmail, ClassesResponse, Student } from "../types";
import { db } from "./../shared";
class DSMController {
  async sendEmail(req: Request, res: Response) {
    try {
      const { type_send, subject, content, files }: bodyRequestEmail = req.body;
      const data = (await db.collection(type_send).get()).docs.map(
        (doc: any) => doc.data() as Student
      );
      for (const doc of data) {
        await sendMail(doc.email, subject, content, files);
      }
      // send mail with defined transport object
      return res.status(200).send({
        message: "send mail successfully",
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
      ).docs.map((doc: any) => {
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
        status: user.data() !== null,
        user_ip: clientIp,
        location: location,
        client: device.client,
        os: device.os,
        device: device.device,
        email,
      });
      if (!user) {
        throw new Error("Email or username is incorrect ");
      }
      // system password

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
          expiresIn: "1d",
        }
      );
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

  async getListHistory(req: Request, res: Response) {
    try {
      const { date } = req.query;
      const TODAY_START = date
        ? new Date(toString(date)).setHours(0, 0, 0, 0)
        : new Date().setHours(0, 0, 0, 0);
      const TODAY_END = date
        ? new Date(toString(date)).setHours(23, 59, 59, 999)
        : new Date().setHours(23, 59, 59, 999);
      const histories = (
        await db
          .collection("history")
          .where("date", ">", new Date(TODAY_START))
          .where("date", "<", new Date(TODAY_END))
          .get()
      ).docs.map((doc: any) => ({
        ...doc.data(),
        id: doc.id,
        date: new Date(doc.data().date._seconds * 1000).toISOString(),
      }));

      return res.status(200).send(histories);
    } catch (error: any) {
      console.log(error);
      return res.status(500).send({
        message: error.message,
        histories: [],
      });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user = (
        await db.collection("accounts").where("email", "==", email).get()
      ).docs[0];
      if (!user) {
        throw new Error("Email is not exist");
      }

      const token = jwt.sign(
        {
          uid: user.id,
          email,
        },
        process.env.ACCESS_TOKEN_SECRET || "",
        {
          expiresIn: "5m",
        }
      );
      totp.options = {
        step: 60 * 5, // 5 minutes
      };
      const otp = totp.generate(token);
      const message = await sendMail(
        email,
        "Your OTP for School Data Management",
        `
        <h2>Your OTP for School Data Management</h2>
        <h4>Your OTP is: <strong style="font-size:1rem">${otp}</strong></h4>
        <h4>Please use this OTP to reset your password</h4>
        <h4>This OTP will expire in 5 minutes</h4>
        <h4>If you did not request this, please ignore this email</h4>
        <h4>Thank you, OFA Team</h4>
        <a href="https://data-school-management.vercel.app/forgot-password">Website: School Data Management</a>
      `
      );
      return res.status(200).send({
        message,
        token,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).send({
        message: error.message,
      });
    }
  }

  async checkingOtp(req: Request, res: Response) {
    try {
      const { otp } = req.body;
      const { uid, email, token } = req.body.user;
      console.log(token);

      const isSafeOtp = totp.check(otp, token || "");
      if (!isSafeOtp) {
        throw new Error("OTP is not valid");
      }
      const newPassword = generate.generate({
        length: 10,
        uppercase: true,
        lowercase: true,
        numbers: true,
      });

      const encode_password = await bcrypt.hash(newPassword, 10);

      await db.collection("accounts").doc(uid).set(
        {
          password: encode_password,
        },
        { merge: true }
      );
      await sendMail(
        email,
        "Your New Password For School Data Management",
        `
        <h2>Your New Password For School Data Management</h2>
        <h4>Your new password is: <strong style="font-size:1rem">${newPassword}</strong></h4>
        <h4>Please use this password to login</h4>
        <h4>Please You can change your new password to be more secure</h4>
        <h4>Thank you, OFA Team</h4>
        <a href="https://data-school-management.vercel.app/login">Website: School Data Management</a>
      `
      );
      return res.status(200).send({
        message: "OTP is confirmed",
      });
    } catch (error) {
      return res.status(500).send({
        message: "OTP is not valid",
      });
    }
  }
}

export default new DSMController();
