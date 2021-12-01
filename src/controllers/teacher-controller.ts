import { toNumber, toString } from "lodash";
import { db } from "../shared";
import { Request, Response } from "express";
import { Teacher } from "../types";
import { createID, isValidRequest } from "../helpers";

class TeacherController {
  async getListTeacher(req: Request, res: Response) {
    try {
      const { page, size, isSort } = req.query;

      if (!page || !size) {
        return res.send(200).send([]);
      }
      const offset = toNumber(size) * toNumber(page) - toNumber(size);
      if (toNumber(size) <= 0 || toNumber(page) <= 0) {
        return res.status(200).send([]);
      }
      const total = await (await db.collection("teachers").get()).size;
      let teachers: Teacher[] = [];
      if (isSort === "true") {
        teachers = (
          await db
            .collection("teachers")
            .orderBy("last_name")
            // .orderBy("first_name")
            .limit(toNumber(size))
            .offset(offset)
            .get()
        ).docs.map((doc) => doc.data() as Teacher);
      } else {
        teachers = (
          await db
            .collection("teachers")
            .orderBy("last_name", "desc")
            // .orderBy("first_name")
            .limit(toNumber(size))
            .offset(offset)
            .get()
        ).docs.map((doc) => doc.data() as Teacher);
      }

      return res.status(200).send({
        list: teachers,
        total,
        pagination: {
          page,
          size,
        },
      });
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
      const {
        date_of_birth,
        grade,
        Class,
        gender,
        first_name,
        last_name,
        email,
      }: Teacher = req.body;
      const { status, message } = await isValidRequest(
        {
          first_name,
          last_name,
          gender,
          date_of_birth,
          email,
          grade: toNumber(grade),
          Class: toString(Class),
        },
        "teacher"
      );
      if (status) {
        const { total } = (await (
          await db.collection("total").doc("total_teacher").get()
        ).data()) as { total: number };
        const id = createID("teacher", total, date_of_birth, Class);
        await db
          .collection("teachers")
          .doc(id)
          .set({
            ...req.body,
            id,
          });
        await db
          .collection("total")
          .doc("total_teacher")
          .set(
            {
              total: total + 1,
            },
            {
              merge: true,
            }
          );
        return res.status(201).send({
          message: "Create teacher successfully",
        });
      } else
        return res.status(400).send({
          message: message,
        });
    } catch (error: any) {
      return res.status(500).send({
        message: error.message,
      });
    }
  }
  async editTeacher(req: Request, res: Response) {
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
      }: Teacher = req.body;
      console.log(req.body);

      if (!id) {
        throw new Error("ID invalid");
      }
      const { status, message } = await isValidRequest(
        {
          first_name,
          last_name,
          gender,
          date_of_birth,
          email,
          grade: toNumber(grade),
          Class: toString(Class),
        },
        "teacher"
      );

      if (status) {
        const { id: uid } = (
          await db.collection("teachers").doc(id).get()
        ).data() as Teacher;
        await db
          .collection("teachers")
          .doc(uid)
          .set(
            {
              ...req.body,
            },
            { merge: true }
          );
        return res.status(200).send({
          message: `Edit teacher ${id} successfully `,
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
