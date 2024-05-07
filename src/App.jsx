import { useEffect, useMemo, useState } from "react";
// import socket from "./SocketService";
import "./App.css";
import { io } from "socket.io-client";

const App = () => {
  const [grid, setGrid] = useState(Array(9).fill(""));
  const [Xchance, SetXChance] = useState(true); //if true then chance is of X otherwise 0
  const [winner, setWinner] = useState("");
  
  const socket = useMemo(() => io("http://localhost:8000"), []);
 
  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id);
      
    });
    socket.on("temp", (message) => {
      console.log(message);
    });
    socket.on("room-event", (message) => {
      console.log(message);
    })
    socket.on("grid-manip", (grid) => {
      console.log(grid);
      setGrid(grid);
    });
    socket.on("chance-event", (Xchance) => {
      SetXChance(Xchance);
    });
    socket.on("winner-event", (winner) => {
      setWinner(winner);
    });
    return () => {
      socket.off("connect");
      socket.off("temp");
      socket.off("room-event");
      socket.off("grid-manip");
      socket.off("chance-event");
      socket.off("winner-event");
    };
  }, [socket]);
  
  const isDraw = (grid, winner) => {
    if (winner) {
      return false;
    }
    const isGridFilled = grid.every((cell) => cell !== "");
    return isGridFilled;
  };
  const handleClick = (index) => {
    socket.emit("click-event",index);
  }
  return (
    <div className="container">
      <div className="grid">
        {winner ? (
          <div className="result">{`${winner} wins`}</div>
        ) : isDraw(grid, winner) ? (
          <div className="result">It's a draw!</div>
        ) : (
          grid.map((cell, index) => (
            <button
              key={index}
              className="cells"
              onClick={() => handleClick(index)}
            >
              {cell}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
