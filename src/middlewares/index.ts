import { NextFunction, Response, Request } from "express";
import * as jwt from "jsonwebtoken";

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).send({
        message: "user went wrong",
      });
    }
    jwt.verify(
      authHeader,
      process.env.ACCESS_TOKEN_SECRET || "deptraivocung",
      (err, user) => {
        if (err) {
          return res.status(401).send({
            message: "user went wrong",
          });
        }
        req.body.user = user;
        res.status(201).send({
          message: "login successfully",
          code: "201",
        });
        next();
      }
    );
  } catch (error) {
    return res.status(401).send({
      message: "something went wrong",
    });
  }
}
