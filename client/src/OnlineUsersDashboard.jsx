import  {useEffect,useState} from "react";
import {getSocket} from"./websocket.jsx";
import { IoLogoOctocat } from "react-icons/io5";

import "./OnlineUsersDashboard.css";


const OnlineUsersDashboard=()=>{
    const [userList,setUserList]=useState([]);


    useEffect(()=>{
       const socket=getSocket() ;                                                      // Simulate fetching online users from a server
        socket.on("users-update",setUserList);

        return () =>{
            socket.off("users-update",setUserList)
        }
    },[])


     return (
    <div className="dashboard-container">
      <h3 className="users-main-title">Online Users</h3>
      {userList.map((user) => (
        <div key={user.id} className="user-item">
          <IoLogoOctocat size={25}  style={{color:user.color}}/>
          {user.id.slice(0, 5)}
        </div>
      ))}
    </div>
  );
}

export default OnlineUsersDashboard