import { toLower } from "lodash";
import { db } from "../shared";
import { ClassesResponse } from "../types";

function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validateName(name: string) {
  const regexOnlyLetter =
    /^[ a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/;
  return regexOnlyLetter.test(name.toLowerCase());
}

interface isValidParams {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  email: string;
  Class: string;
  grade: number;
}
type typeValid = "student" | "teacher";
export const isValidRequest = async (
  {
    first_name,
    last_name,
    date_of_birth,
    gender,
    email,
    grade,
    Class,
  }: isValidParams,
  type: typeValid = "student"
) => {
  try {
    if (!validateName(first_name)) {
      throw new Error("First name is not valid");
    }
    if (!validateName(last_name)) {
      throw new Error("Last name is not valid");
    }
    const date = new Date(date_of_birth);
    if (date.getFullYear() > 2005 || date.getFullYear() < 1900) {
      throw new Error("Date of birth between 2005 and 1900");
    }
    if (!["male", "female"].includes(toLower(gender))) {
      throw new Error("Gender not valid");
    }
    if (!validateEmail(email)) {
      throw new Error("Email not valid");
    }

    if (type === "student" || grade || Class) {
      const collectionClass = await (
        await db.collection("classes").get()
      ).docs.map((item) => item.data() as ClassesResponse);
      const grades = collectionClass.map((item) => item.grade);
      if (!grades.includes(grade)) {
        throw new Error("Grade is not valid");
      }
      const classes = collectionClass.find(
        (item) => item.grade === grade
      )?.values;
      if (!classes || !classes.includes(Class)) {
        throw new Error("Class is not valid");
      }
    }

    return {
      status: true,
      message: "",
    };
  } catch (error: any) {
    console.log("error", error);

    return {
      status: false,
      message: error.message,
    };
  }
};
