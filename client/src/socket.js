import { io } from "socket.io-client";
import server from "./server";

const URL = `${server}/socket`;

export const socket = io(URL);
