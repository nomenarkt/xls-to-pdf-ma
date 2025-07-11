import axios from "axios";
import { getConfig } from "../config";

const instance = axios.create({
  baseURL: getConfig().apiBaseUrl,
});

export default instance;
