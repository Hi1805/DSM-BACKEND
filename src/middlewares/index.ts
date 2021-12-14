import { NextFunction, Response, Request } from "express";
import * as jwt from "jsonwebtoken";

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).send({
        message: "user went wrong",
      });
    }
    const token = authHeader.split("Bearer")[1].trim();

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "", (err, user) => {
      if (err) {
        throw new Error("user went wrong");
      }
      req.body.user = {
        ...user,
        token: token,
      };
      next();
    });
  } catch (error: any) {
    console.log(error.message);

    return res.status(401).send({
      message: "something went wrong",
    });
  }
}
