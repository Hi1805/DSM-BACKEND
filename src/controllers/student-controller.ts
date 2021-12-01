import { toNumber, toString } from "lodash";
import { db } from "../shared";
import { Request, Response } from "express";
import { Student } from "../types";
import { createID, isValidRequest } from "../helpers";
import { algoliaStudent } from "./../shared/connect";

class StudentController {
  async getListStudent(req: Request, res: Response) {
    try {
      const { page, size, isSort } = req.query;
      //offset : value start
      if (!page || !size) {
        return res.send(200).send([]);
      }

      const offset = toNumber(size) * toNumber(page) - toNumber(size);
      if (toNumber(size) <= 0 || toNumber(page) <= 0) {
        return res.status(200).send([]);
      }
      const total = await (await db.collection("students").get()).size;
      let students: Student[] = [];
      if (isSort === "true") {
        students = (
          await db
            .collection("students")
            .orderBy("last_name")
            // .orderBy("first_name")
            .limit(toNumber(size))
            .offset(offset)
            .get()
        ).docs.map((doc) => doc.data() as Student);
      } else {
        students = (
          await db
            .collection("students")
            .orderBy("last_name", "desc")
            // .orderBy("first_name")
            .limit(toNumber(size))
            .offset(offset)
            .get()
        ).docs.map((doc) => doc.data() as Student);
      }

      return res.status(200).send({
        list: students,
        total,
        pagination: {
          page,
          size,
        },
      });
    } catch (error: any) {
      console.log(error.message);

      return res.status(500).send({
        message: "get list students failed",
        error: error.message,
      });
    }
  }

  async getInfoStudent(req: Request, res: Response) {
    try {
      const { id } = req.query;
      const student = (
        await db.collection("students").doc(toString(id)).get()
      ).data();
      return res.status(200).send(student);
    } catch (error) {
      return res.status(404).send({
        message: "student not found",
      });
    }
  }

  async getTotalStudent(req: Request, res: Response) {
    try {
      const total = (await db.collection("students").get()).size;
      return res.status(200).send({
        total,
      });
    } catch (error: any) {
      console.log(error.message);

      return res.status(500).send({
        message: "get total student failed",
      });
    }
  }
  async createStudent(req: Request, res: Response) {
    try {
      const {
        date_of_birth,
        grade,
        Class,
        gender,
        first_name,
        last_name,
        email,
      }: Student = req.body;
      const { status, message } = await isValidRequest({
        first_name,
        last_name,
        gender,
        date_of_birth,
        email,
        grade: toNumber(grade),
        Class: toString(Class),
      });
      if (status) {
        const { total } = (await (
          await db.collection("classes").doc(toString(grade)).get()
        ).data()) as { total: number };
        const uid_student = createID("student", total, date_of_birth, Class);
        await db
          .collection("students")
          .doc(uid_student)
          .set({
            ...req.body,
            id: uid_student,
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
          message: "Create Student successfully",
        });
      } else
        return res.status(400).send({
          message: message,
        });
    } catch (error: any) {
      console.log(error);

      return res.status(500).send({
        message: error.message,
      });
    }
  }
  async editStudent(req: Request, res: Response) {
    try {
      const {
        id,
        first_name,
        last_name,
        gender,
        date_of_birth,
        email,
        grade,
        Class,
      }: Student = req.body;

      if (!id) {
        throw new Error("ID invalid");
      }
      const { status, message } = await isValidRequest({
        first_name,
        last_name,
        gender,
        date_of_birth,
        email,
        grade: toNumber(grade),
        Class: toString(Class),
      });

      if (status) {
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
          message: `Edit student ${id} successfully `,
        });
      }
      return res.status(500).send({
        message,
      });
    } catch (error: any) {
      return res.status(500).send({
        message: error.message,
      });
    }
  }
  async deleteStudent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new Error("ID not Exist");
      }
      await db.collection("students").doc(id).delete();
      return res.status(200).send({
        message: "Delete student successfully",
      });
    } catch (error: any) {
      return res.status(500).send({
        message: error.message,
      });
    }
  }
  async searchStudent(req: Request, res: Response) {}
}

export default new StudentController();
