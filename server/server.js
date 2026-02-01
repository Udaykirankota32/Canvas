import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { createRoom,joinRoom,exitRoom,rooms } from "./room.js";
import {getAllUsers,addUser,removeUser} from "./users.js"




const app = express();
app.use(cors())

let CanvaArray=[];
let usersRedoStacks={};


const  server   = createServer(app)
const PORT = process.env.PORT || 3000;


const io =new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
})

io.on("connection",(socket)=>{
    console.log(`User connected: ${socket.id}`)

    //---------user management---------//
    const user=addUser(socket.id);
    io.emit("users-update",getAllUsers());  

    socket.on("disconnect",()=>{
        console.log(`User disconnected: ${socket.id}`)
        removeUser(socket.id);
        io.emit("users-update",getAllUsers());  
    })
     

    //---------canvas management---------//



    
    socket.on("request-for-history",()=>{    //when a new user connects and requests for existing canvas data
        socket.emit("usersCanvasHistory",CanvaArray);  //sending the existing canvas data to the newly connected user
    });

    socket.on("canvas-data",(data)=>{
        CanvaArray.push(data);  //saving the Canvas data of each user in server memory

        socket.broadcast.emit("canvas-data",data);         //broadcasting the data to all other clients except the sender

    })

    socket.on("clear-canvas", () => {
        CanvaArray = []; // clearing the server memory of canvas data
        io.emit("clear-canvas"); // notifying all connected clients to clear their canvas
    })


    socket.on("Create-Room",(roomId,password)=>{ //creating a new room
        createRoom (roomId,password)
        socket.join(roomId)
        console.log(`Room ${roomId} created by ${socket.id}`)
    })

    socket.on("Join-Room",(roomId,password)=>{  //joining an existing room      
        const room=joinRoom(roomId)
        if(room){
            if(room.password===password){ 
                room.users.add(socket.id)
                socket.join(roomId)
                socket.emit("usersCanvasHistory",room.canvasData); //sending existing canvas data of the room to the newly joined user
                socket.emit("Join-Room-Status",{status:"success",message:"Joined Room Successfully"})
            }
            else{
                socket.emit("Join-Room-Status",{status:"failure",message:"Incorrect Password"})
            }           
        }
        else{
            socket.emit("Join-Room-Status",{status:"failure",message:"Room Not Found"})
        }
    })
    
    socket.on("Create-Room",(roomId,password)=>{ //creating a new room
        createRoom (roomId,password)
        socket.join(roomId)
        console.log(`Room ${roomId} created by ${socket.id}`)
    })

    socket.on("Join-Room",(roomId,password)=>{  //joining an existing room      
        const room=joinRoom(roomId)
        if(room){
            if(room.password===password){ 
                room.users.add(socket.id)
                socket.join(roomId)
                socket.emit("usersCanvasHistory",room.canvasData); //sending existing canvas data of the room to the newly joined user
                socket.emit("Join-Room-Status",{status:"success",message:"Joined Room Successfully"})
            }
            else{
                socket.emit("Join-Room-Status",{status:"failure",message:"Incorrect Password"})
            }           
        }
        else{
            socket.emit("Join-Room-Status",{status:"failure",message:"Room Not Found"})
        }
    })


    socket.on("exit-Room",(roomId)=>{
        if(exitRoom(roomId)){
            socket.leave(roomId)

            socket.emit("Exit-Room-Status",{status:"success",message:"Exited Room Successfully"})
        }
        else{
            socket.emit("Exit-Room-Status",{status:"failure",message:"Room Not Found"})
        }
    })
 

    //handling canvas data within rooms

    socket.on("canvas-data-in-room",({roomId,stroke})=>{
        const room =rooms.get(roomId);
        if(!room) return;
        room.to(roomId).emit("canvas-data-in-room",stroke);
    })

    socket.on("request-for-history-in-room",(roomId)=>{    //when a new user connects and requests for existing canvas data
        const room =rooms.get(roomId);
        if(!room) return;
        socket.emit("usersCanvasHistory-in-room",room.canvasData);  //sending the existing canvas data to the newly connected user
    });

    socket.on("clear-canvas-in-room",(roomId)=>{
        const room =rooms.get(roomId);
        if(!room) return;
        room.canvasData=[];           //clearing the server memory of canvas data               
        room.to(roomId).emit("clear-canvas-in-room");  //notifying all connected clients to clear their canvas
    })

    //undo Redo handling

    socket.on("undo-canvas", (userId) => {
        let userCanvasHistory = CanvaArray.filter(stroke => stroke.userId === userId);
        let nonUserHistory = CanvaArray.filter(stroke => stroke.userId !== userId);
        if (userCanvasHistory.length === 0) return;

        const undoneStroke = userCanvasHistory.pop();
        if (!usersRedoStacks[userId]) usersRedoStacks[userId] = [];
        usersRedoStacks[userId].push(undoneStroke);

        CanvaArray = [...nonUserHistory, ...userCanvasHistory];
        io.emit("usercanvas-data", CanvaArray); // Broadcast updated canvas data
    });

    socket.on("redo-canvas", (userId) => {
        if (!usersRedoStacks[userId] || usersRedoStacks[userId].length === 0) return;

        const redoneStroke = usersRedoStacks[userId].pop();
        CanvaArray.push(redoneStroke);

        io.emit("usercanvas-data", CanvaArray); // Broadcast updated canvas data
    });
    

    

    
    socket.on("disconnect",()=>{
        console.log(`User disconnected: ${socket.id}`)
    }              )


   
})






server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});


