import toastr from "toastr";
import axios from "axios";

export const handleErrors = ({ errors, name, response, message }) => {
  if (errors) return errors.map(error => toastr.error(error, name));
  if (response && response.status < 500) {
    return Object.entries(response.data).map(([key, value]) =>
      toastr.error(value, key)
    );
  }
  return toastr.error(message);
};

export const client = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL
  /* other custom settings */
});
