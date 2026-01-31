import { io } from "socket.io-client";
let socket=null;

export const initiateSocketConnection=()=>{
    if(!socket ){
        socket=io("http://localhost:3000",{
            transports:['websocket','polling'],
            autoConnect:true,

        }
        )};
        return socket; 
    }

export const getSocket=()=>{
    return socket;
};
