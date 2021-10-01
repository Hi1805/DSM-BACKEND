import { toNumber } from "lodash";
import { db } from "../shared";
import { Request, Response } from "express";
import { Teacher } from "../types";
import { createID } from "../helpers";

class TeacherController {
  async getListTeacher(req: Request, res: Response) {
    try {
      const { page, size } = req.query;
      const offset = toNumber(size) * toNumber(page) - toNumber(size);
      if (toNumber(size) <= 0 || toNumber(page) <= 0) {
        return res.status(200).send([]);
      }
      const teachers = (
        await db
          .collection("teachers")
          .orderBy("last_name")
          .limit(toNumber(size))
          .offset(offset)
          .get()
      ).docs.map((doc) => doc.data());
      return res.status(200).send(teachers);
    } catch (error) {
      return res.status(500).send({
        message: "get teachers failed",
      });
    }
  }

  async getTotalTeacher(req: Request, res: Response) {
    try {
      const total = (await db.collection("teachers").get()).size;
      return res.status(200).send({
        total,
      });
    } catch (error) {
      return res.status(500).send({
        message: "get total failed",
      });
    }
  }
  async createTeacher(req: Request, res: Response) {
    try {
      const { date_of_birth }: Teacher = req.body;
      const { total } = (await (
        await db.collection("total").doc("total_teacher").get()
      ).data()) as { total: number };

      const id = createID("teacher", total, date_of_birth);
      await db
        .collection("teachers")
        .doc(id)
        .set({
          ...req.body,
          id,
        });
      await db
        .collection("classes")
        .doc("total_teacher")
        .set({
          total: total + 1,
        });
      return res.status(201).send({
        message: "create teacher successfully",
      });
    } catch (error) {
      return res.status(500).send({
        message: "create teacher failed",
      });
    }
  }
  async editTeacher(req: Request, res: Response) {
    try {
      const { id }: Teacher = req.body;
      if (!id) {
        throw new Error("Teacher not Exist");
      }
      await db
        .collection("teachers")
        .doc(id)
        .set(
          {
            ...req.body,
          },
          { merge: true }
        );
      return res.status(200).send({
        message: "edit teacher successfully",
      });
    } catch (error) {
      return res.status(500).send({
        message: "edit teacher failed",
      });
    }
  }
  async deleteTeacher(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new Error("Teacher not Exist");
      }
      await db.collection("teachers").doc(id).delete();
      return res.status(200).send({
        message: "delete teacher successfully",
      });
    } catch (error) {
      return res.status(500).send({
        message: "delete teacher failed",
      });
    }
  }
}

export default new TeacherController();
