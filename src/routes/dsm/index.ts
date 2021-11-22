import * as express from "express";
import DSMController from "../../controllers/DSM-controller";
import { authenticateToken } from "../../middlewares";
const DSMRouter = express.Router();
DSMRouter.post("/send-email", authenticateToken, DSMController.sendEmail);
DSMRouter.get("/classes", authenticateToken, DSMController.getClasses);
DSMRouter.get("/login", DSMController.login);
export { DSMRouter };
