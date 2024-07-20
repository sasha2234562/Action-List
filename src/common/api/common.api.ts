import axios from "axios";

export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "50659ead-1a5f-4716-a050-11b2b876ac95",
    "Authorization": "dec85456-73ff-40f0-8666-e20b33676d38"
  },
});
