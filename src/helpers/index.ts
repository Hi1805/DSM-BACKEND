import { toNumber } from "lodash";
import { ProfileTemplate } from "../types";
export const createID = (
  type: "student" | "teacher",
  total: number,
  info: ProfileTemplate
) => {
  const code = type === "student" ? "ST" : "TC";
  const year = new Date(info.date_of_birth).getFullYear();
  return type === "student"
    ? code + info.class + year + total
    : code + info.class + year + toNumber(total);
};
