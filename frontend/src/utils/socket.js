import { io } from "socket.io-client";




/** Just to keep the same socket instance */
const socket = io("http://localhost:4000");



export default socket