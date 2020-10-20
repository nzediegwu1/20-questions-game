import toastr from "toastr";
import axios from "axios";
import cookie from "js-cookie";

toastr.options = {
  closeButton: true,
  positionClass: "toast-top-center",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

export const notify = (toastType, toastMessage) => {
  toastr.remove();
  toastr[toastType](toastMessage);
};

export const handleErrors = ({ response, message }) => {
  if (response) {
    return response.data.errors.forEach((error) => {
      notify("error", error);
    });
  }
  return notify("error", message);
};

export const client = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  headers: {
    token: cookie.get("token"),
  },
  /* other custom settings */
});

export function validatePassword(password) {
  const passLength = password.length;
  return !passLength ? null : passLength < 6 ? false : true;
}

export async function onboard(store, payload, type) {
  const { commit, state } = store;
  state.loading = true;
  if (cookie.get("token")) {
    notify("warning", `Already logged in as ${state.user.nickname}`);
    return payload.$router.push("/playground");
  }
  try {
    const { data } = await client.post(`/${type}`, payload.form);
    const response = data.data;

    cookie.set("token", response.token);
    commit("setUser", response.user);
    notify("success", data.message);

    payload.$socket.emit("userOnboard", response.user);
    payload.$router.push("/playground");
  } catch (error) {
    handleErrors(error);
  }
  state.loading = false;
}

export const currentUser = (user, userList) => {
  return userList.find((item) => item._id.toString() === user._id?.toString());
};
