import { toNumber } from "lodash";
import { db } from "../shared";
import { Request, Response } from "express";
import { ProfileTemplate } from "../types";

class TeacherController {
  async getListTeacher(req: Request, res: Response) {
    try {
      const { begin, size } = req.query;
      const first = db
        .collection("teachers")
        .orderBy("first_name")
        .limit(toNumber(begin));

      const teachers = await first.get().then(async (documentSnapshots) => {
        var lastVisible =
          documentSnapshots.docs[documentSnapshots.docs.length - 1];
        const next = db
          .collection("teachers")
          .orderBy("last_name")
          .startAfter(lastVisible)
          .limit(toNumber(size));
        return await next.get().then((doc) => {
          const list: ProfileTemplate[] = [];
          doc.forEach((teacher) => {
            list.push({ ...(teacher.data() as ProfileTemplate) });
          });
          return list;
        });
      });
      return res.status(200).send(teachers);
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  async getTotalTeacher(req: Request, res: Response) {
    try {
      const total = (await db.collection("teachers").get()).size;
      return res.status(200).send({
        total,
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  async addTeacher(req: Request, res: Response) {
    try {
    } catch (error) {}
  }
}

export default new TeacherController();