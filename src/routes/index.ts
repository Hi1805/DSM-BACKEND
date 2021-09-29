import * as express from "express";
import { sendEmailController } from "../controllers/send";

const router = express.Router();

/**
 * @swagger
 * /send:
 *   post:
 *     summary: Send Email With Data School Managment
 *     tags: [email]
 *     requestBody:
 *       required: true
 *       content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  email:
 *                      type: string
 *                      example : huydeptrai@gmail.com
 *                  subject:
 *                      type: string
 *                      example : Thong bao di Lao Dong
 *                  content:
 *                      type: string
 *                      example : Ban Le Dang Trung mai nho di don nha ve sinh
 *     responses:
 *       200:
 *         description: The email was successfully created
 *         content:
 *               type : string
 *       500:
 *         description: Some server error
 */
router.post("/send", sendEmailController);

export default router;
