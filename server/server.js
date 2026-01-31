import express from "express";

const app = express();
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

app.use(cors())

const  server   = createServer(app)

const io =new Server(server,{
    cors:{
        origin:"https://localhost:5173",
        methods:["GET","POST"]
    }
})

io.on("connection",(sockets)=>{
    console.log(`User connected: ${sockets.id}`)

    sockets.on("canvas-data",(data)=>{
        //broadcasting the data to all other clients except the sender
        sockets.broadcast.emit("canvas-data",data);
    })

    sockets.on("disconnect",()=>{
        console.log(`User disconnected: ${sockets.id}`)
    })
   
})



server.listen  (3000,()=>{
    console.log("Server is running on port 3000")
})

