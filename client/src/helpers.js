import toastr from "toastr";
import cookie from "js-cookie";
import axios from "axios";

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

export function validatePassword(password) {
  const passLength = password.length;
  return !passLength ? null : passLength < 6 ? false : true;
}

export const client = axios.create({
  baseURL: `${process.env.VUE_APP_BASE_URL}/api`,
});

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
    client.defaults.headers = { token: response.token };

    commit("setUser", response.user);
    notify("success", data.message);

    payload.$socket.client.emit("userOnboard", response.user);
    payload.$router.push("/playground");
  } catch (error) {
    if (error.response?.status === 401) {
      payload.shouldLogout = true;
      state.loading = false;
      return (payload.message = error.response.data.errors[0]);
    }
    handleErrors(error);
  }
  state.loading = false;
}

export const currentUser = (user, userList) => {
  return userList.find((item) => item._id.toString() === user._id?.toString());
};

export function signOut(state) {
  state.$socket.client.emit("userLeft", state.currentUser);
  state.$router.push("/");
  notify("success", "Logout successful");
  cookie.remove("token");
}

export const capitalize = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const makeRequest = async (kwargs) => {
  const { method, path, reqBody, onSuccess } = kwargs;
  return client[method](`/${path}`, reqBody)
    .then(({ data }) => {
      onSuccess(data);
    })
    .catch((error) => handleErrors(error));
};
