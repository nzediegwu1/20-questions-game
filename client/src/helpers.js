import toastr from "toastr";
import axios from "axios";

toastr.options = {
  closeButton: true,
  positionClass: "toast-top-center",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut"
};

export const notify = (toastType, toastMessage) => {
  toastr.remove();
  toastr[toastType](toastMessage);
};

export const handleErrors = ({ response, message }) => {
  if (response) {
    return response.data.errors.forEach(error => {
      notify("error", error);
    });
  }
  return notify("error", message);
};

export const client = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL
  /* other custom settings */
});

export function validatePassword(password) {
  const passLength = password.length;
  return !passLength ? null : passLength < 6 ? false : true;
}

export async function onboard(store, payload, type) {
  const { commit, state } = store;
  state.loading = true;
  try {
    const { data } = await client.post(`/${type}`, payload);
    localStorage.token = data.data.token;
    commit("setUser", data.data.user);
    notify("success", data.message);
  } catch (error) {
    handleErrors(error);
  }
  state.loading = false;
}
