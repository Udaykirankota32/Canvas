import { useState } from "react";
import { FaPaintBrush, FaEraser, FaArrowLeft } from "react-icons/fa";
import { LiaUndoSolid,LiaRedoSolid  } from "react-icons/lia";
import ReactModal from "react-modal";
import {getSocket} from "./websocket.jsx";
import "./ToolsBar.css";

const ToolsBar = (props) => {
  const { changeActiveTool, changeActiveColor, changeBrushSize, } = props;
  const [activeToolState, changeActiveToolState] = useState("brush");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [roomMode, setRoomModeState] = useState(null); // "create" or "join"
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentRoomId, setCurrentRoomId] = useState(null);

  const closeModal = () => {
    setModalIsOpen(false);
    setRoomModeState(null);
    setRoomId("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleCreateRoom = () => {
    const generatedRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(generatedRoomId);
    setRoomModeState("create");
  };

  const handleJoinRoom = () => {
    setRoomModeState("join");
  };

  const confirmCreateRoom = () => {
    if (password === confirmPassword) {
      setCurrentRoomId(roomId);
      closeModal();
    } else {
      alert("Passwords do not match!");
    }
  };

  const confirmJoinRoom = () => {
    if (roomId && password) {
      setCurrentRoomId(roomId);
      closeModal();
    } else {
      alert("Please enter Room ID and Password!");
    }
  };

  return (
    <div className="ToolsBarContainer">
      <h1 className="mainTitle">Canvas ToolKit</h1>
      <div
        className={
          activeToolState === "brush"
            ? "ToolsBarButtonBox active"
            : "ToolsBarButtonBox"
        }
      >
        <FaPaintBrush size={24} />
        <button
          className={
            activeToolState === "brush" ? "toolButton  active" : "toolButton "
          }
          title="Brush Tool"
          onClick={() => {
            changeActiveTool("brush");
            changeActiveToolState("brush");
          }}
        >
          Brush
        </button>
      </div>
      <div
        className={
          activeToolState === "eraser"
            ? "ToolsBarButtonBox active"
            : "ToolsBarButtonBox"
        }
      >
        <FaEraser size={24} />
        <button
          className={
            activeToolState === "eraser" ? "toolButton  active" : "toolButton "
          }
          title="Eraser Tool"
          onClick={() => {
            changeActiveTool("eraser");
            changeActiveToolState("eraser");
          }}
        >
          Eraser
        </button>
      </div>
      <input
        type="color"
        disabled={activeToolState !== "brush"}
        className="colorSelector"
        onChange={(e) => {
          changeActiveColor(e.target.value);
        }}
      />
      <input
        type="range"
        min="1"
        max="50"
        className="brushWidthSelector"
        onChange={(e) => {
          changeBrushSize(e.target.value);
        }}
      />
      <div className="BottomButtonsBox">
        <button
          className="bottomBtns ClearButton"
          onClick={() => {
            const socket = getSocket();
            socket.emit("clear-canvas");
          }}
        >
          Clear
        </button>
        {currentRoomId ? (
          <>
            <button
              className="bottomBtns ExitButton"
              onClick={() => {
                setCurrentRoomId(null);
              }}
            >
              Exit Room
            </button>
            <div className="RoomIdDisplay">Room ID: {currentRoomId}</div>
          </>
        ) : (
          <button
            className="bottomBtns RoomButton"
            onClick={() => {
              setModalIsOpen(true);
            }}
          >
            Canvas Room
          </button>
        )}
        {/* Modal for Room Creation/Joining */}
        <ReactModal  
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="ReactModal__Content"
          overlayClassName="ReactModal__Overlay"
          contentLabel="Room Modal"
        >
          <button className="modalCloseButton" onClick={closeModal}>X</button>
          {roomMode && (
            <button className="modalBackButton" onClick={() => setRoomModeState(null)}>
              <FaArrowLeft /> Back
            </button>
          )}
          {roomMode === "create" ? (
            <div className="ContentAlignment">
              <h2>Create Room</h2>
              <p>Room ID: {roomId}</p>
              <input
                className="modalInput"
                type="password"
                placeholder="Set Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
              className="modalInput"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button className="modalButton" onClick={confirmCreateRoom}>Create</button>
            </div>
          ) : roomMode === "join" ? (
            <div className="ContentAlignment">
              <h2>Join Room</h2>
              <input
                className="modalInput"
                type="text"
                placeholder="Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <input
              className="modalInput"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="modalButton" onClick={confirmJoinRoom}>Join</button>
            </div>
          ) : (
            <div className="ContentAlignment">
              <button className="modalButton" onClick={handleCreateRoom}>Create Room</button>
              <div>OR</div>
              <button className="modalButton" onClick={handleJoinRoom}>Join Room</button>
            </div>
          )}
        </ReactModal>
      </div>
      <div className="UndoRedoButtonBox">
        <button
          className="undoRedoBtns"
          title="Undo"
          onClick={() => {
            const socket = getSocket();
            socket.emit("undo-canvas", socket.id);
          }}
        >
          <LiaUndoSolid size={30} />
        </button>
        <button
          className="undoRedoBtns"
          title="Redo"
          onClick={() => {
            const socket = getSocket();
            socket.emit("redo-canvas", socket.id);
          }}
        >
          <LiaRedoSolid size={30} />
        </button>
      </div>
    </div>
  );
};

export default ToolsBar;
