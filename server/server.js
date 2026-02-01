import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";



const app = express();
app.use(cors())

let CanvaArray=[];
const  server   = createServer(app)

const io =new Server(server,{
    cors:{
        origin:"https://localhost:5173",
        methods:["GET","POST"]
    }
})

io.on("connection",(socket)=>{
    console.log(`User connected: ${socket.id}`)

    socket.on("request-for-history",()=>{    //when a new user connects and requests for existing canvas data
        socket.emit("usersCanvasHistory",CanvaArray);  //sending the existing canvas data to the newly connected user
    });

    socket.on("canvas-data",(data)=>{
        CanvaArray.push(data);  //saving the Canvas data of each user in server memory
        socket.broadcast.emit("canvas-data",data);         //broadcasting the data to all other clients except the sender

    })

    socket.on("clear-canvas",()=>{
        CanvaArray=[];           //clearing the server memory of canvas data

       socket.emit("clear-canvas");  //notifying all connected clients to clear their canvas
    })

    

    
    socket.on("disconnect",()=>{
        console.log(`User disconnected: ${socket.id}`)
    }              )


   
})





server.listen  (3000,()=>{
    console.log("Server is running on port 3000")
})

