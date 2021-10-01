import { toNumber, toString } from "lodash";
import { Teacher } from "../types";
export const createID = (
  type: "student" | "teacher",
  total: number,
  date_of_birth: string,
  Class?: string
) => {
  const code = type === "student" ? "ST" : "TC";
  const year = new Date(date_of_birth).getFullYear();
  return type === "student"
    ? code + Class + year + total
    : code + year + toNumber(total);
};
