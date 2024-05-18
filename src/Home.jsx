import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./App.css";

const Home = () => {
  const navigate = useNavigate();  
  const [grid, setGrid] = useState(Array(9).fill(""));
  const [Xchance, SetXChance] = useState(true); //if true then chance is of X otherwise 0
  const [winner, setWinner] = useState("");
  const [activeChanceBgColorX, setBgColorX] = useState("white");
  const [activeChanceBgColor0, setBgColor0] = useState("white");
  const [connectedSockets, setConnectedSockets] = useState([]);

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
    });
    socket.on("grid-manip", (grid) => {
      console.log("hey",grid);
      setGrid(grid);
    });
    socket.on("chance-event", (Xchance) => {
      SetXChance(Xchance);
    });
    socket.on("winner-event", (winner) => {
      setWinner(winner);
    });
    socket.on("connected-sockets", (connecIdsArr) => {
      setConnectedSockets(connecIdsArr);
    });
    if (Xchance) {
      setBgColorX("red");
      setBgColor0("white");
    } else {
      setBgColorX("white");
      setBgColor0("red");
    }
    return () => {
      socket.off("connect");
      socket.off("temp");
      socket.off("room-event");
      socket.off("grid-manip");
      socket.off("chance-event");
      socket.off("winner-event");
      socket.off("msgg");
      socket.off("connected-sockets");
    };
  }, [socket, Xchance]);

  const isDraw = (grid, winner) => {
    if (winner) {
      return false;
    }
    const isGridFilled = grid.every((cell) => cell !== "");
    return isGridFilled;
  };
  const handleClick = (index) => {
    socket.emit("click-event", index);
  };
  const handlePlayAgainClick = () =>{
    setGrid(Array(9).fill(""));
    SetXChance(true);
    setWinner("");
    navigate("/");
  }
  return (
    <div className="container">
      {!winner && !isDraw(grid, winner) ? (
        Xchance ? (
          connectedSockets.length > 0 &&
          socket.id === connectedSockets[0] && <h1>Your Turn</h1>
        ) : (
          connectedSockets.length > 0 &&
          socket.id === connectedSockets[1] && <h1>Your Turn</h1>
        )
      ) : (
        <h1></h1>
      )}

      <div className="outer">
        {!winner && !isDraw(grid, winner) && (
          <div
            className="chance"
            style={{ backgroundColor: activeChanceBgColorX }}
          >
            X
          </div>
        )}
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
        {!winner && !isDraw(grid, winner) && (
          <div
            className="chance"
            style={{ backgroundColor: activeChanceBgColor0 }}
          >
            0
          </div>
        )}
      </div>
      {winner || isDraw(grid, winner) ? (
        <button onClick={() => handlePlayAgainClick()} className="play-agn">
          Play Again
        </button>
      ) : (
        <span></span>
      )}
    </div>
  );
};

export default Home;
