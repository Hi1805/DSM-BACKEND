import * as express from "express";
import { authenticateToken } from "../middlewares";
import privateRouter from "./private";
import publicRouter from "./public";

const apiRouter = express.Router();
apiRouter.use("/private", authenticateToken, privateRouter);
apiRouter.use("/public", publicRouter);

export default apiRouter;
