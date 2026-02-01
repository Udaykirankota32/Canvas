import { useRef, useEffect, useState } from "react";
import { initiateSocketConnection } from "./websocket.jsx";
import Canvas from "./canvas.jsx";
import ToolsBar from "./ToolsBar.jsx";
import OnlineUsersDashboard  from "./OnlineUsersDashboard.jsx";
import "./App.css";

const App = () => {
  const [socketConnected, setSocketConnected] = useState(false);
  const activeTool = useRef("brush");
  const activeColor = useRef("#000000");
  const brushSize = useRef(5);

  useEffect(() => {
    const connectSocket = async () => {
      const isConnected = await initiateSocketConnection();
      if (isConnected) {
        setSocketConnected(true);
      }
    };

    connectSocket();
  }, []);

  if (!socketConnected) return <div>Connecting to the server...</div>;

  const changeActiveTool = (tool) => {
    activeTool.current = tool;
  };

  const changeActiveColor = (color) => {
    if (activeTool.current === "brush") {
      activeColor.current = color;
    }
  };

  const changeBrushSize = (size) => {
    brushSize.current = size;
  };

  return (
    <div className="Canvas-Editor-Container">
      <div className="Canvas-Editor-BoxContainer">
        <ToolsBar
          
          changeActiveTool={changeActiveTool}
          changeActiveColor={changeActiveColor}
          changeBrushSize={changeBrushSize}
        />
        <div className="Canvas-Container">
          <Canvas
            activeTool={activeTool}
            activeColor={activeColor}
            brushSize={brushSize}
          />
        </div>
         <OnlineUsersDashboard />
      </div>
    </div>
  );
};

export default App;
