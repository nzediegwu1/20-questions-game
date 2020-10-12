import { object, string } from "yup";

const shortText = field =>
  string()
    .trim()
    .min(1, `${field} should be 1 or more characters`)
    .max(100, `${field} should not be more than 100 characters`);

export const signup = object().shape({
  fullname: shortText("name")
});

export const validateOption = {
  abortEarly: false,
  strict: true
};
