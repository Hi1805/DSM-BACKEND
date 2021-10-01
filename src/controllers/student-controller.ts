import { get, toNumber, toString } from "lodash";
import { db } from "../shared";
import { Request, Response } from "express";
import { Student } from "../types";
import { createID } from "../helpers";

class StudentController {
  async getListStudent(req: Request, res: Response) {
    try {
      const { page, size } = req.query;
      //offset : value start
      const offset = toNumber(size) * toNumber(page) - toNumber(size);

      const students = (
        await db
          .collection("students")
          .orderBy("last_name")
          .limit(toNumber(size))
          .offset(offset)
          .get()
      ).docs.map((doc) => doc.data());

      return res.status(200).send(students);
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  async getTotalStudent(req: Request, res: Response) {
    try {
      const total = (await db.collection("students").get()).size;
      return res.status(200).send({
        total,
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  async createStudent(req: Request, res: Response) {
    try {
      const { date_of_birth, grade, Class }: Student = req.body;
      const { total } = (await (
        await db.collection("classes").doc(toString(grade)).get()
      ).data()) as { total: number };
      const id = createID("student", total, date_of_birth, Class);
      await db
        .collection("students")
        .doc(id)
        .set({
          ...req.body,
          id,
        });
      await db
        .collection("classes")
        .doc(toString(grade))
        .set(
          {
            total: total + 1,
          },
          {
            merge: true,
          }
        );
      return res.status(201).send({
        message: "create Student successfully",
      });
    } catch (error) {
      return res.status(500).send({
        message: "create Student failed",
      });
    }
  }
  async editStudent(req: Request, res: Response) {
    try {
      const { id }: Student = req.body;
      if (!id) {
        throw new Error("Student not Exist");
      }
      await db
        .collection("students")
        .doc(id)
        .set(
          {
            ...req.body,
          },
          { merge: true }
        );
      return res.status(200).send({
        message: "edit Student successfully",
      });
    } catch (error) {
      return res.status(500).send({
        message: "edit Student failed",
      });
    }
  }
  async deleteStudent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new Error("Student not Exist");
      }
      await db.collection("students").doc(id).delete();
      return res.status(200).send({
        message: "delete Student successfully",
      });
    } catch (error) {
      return res.status(500).send({
        message: "delete Student failed",
      });
    }
  }
}

export default new StudentController();
