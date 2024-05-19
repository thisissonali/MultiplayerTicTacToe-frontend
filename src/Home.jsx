import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./App.css";

const Home = () => {
  const navigate = useNavigate();
  const [dataa, setDataa] = useState({
    gridVal: [],
    chance: true,
    connecIdsArr: [],
    winner: '',
  });
  const [activeChanceBgColorX, setBgColorX] = useState("white");
  const [activeChanceBgColor0, setBgColor0] = useState("white");

  const socket = useMemo(() => io(import.meta.env.VITE_SOCKET_URL || '/'), []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id);
    });

    socket.on("data", (dataa) => {
      console.log(dataa["room1"]);
      setDataa(dataa["room1"]);
    });

    if (dataa.chance) {
      setBgColorX("red");
      setBgColor0("white");
    } else {
      setBgColorX("white");
      setBgColor0("red");
    }
    return () => {
      socket.off("connect");
      socket.off("data");
    };
  }, [socket, dataa]);

  const isDraw = (grid, winner) => {
    if (winner || !grid) {
      return false;
    }
    const isGridFilled = grid.every((cell) => cell !== "");
    return isGridFilled;
  };

  const handleClick = (index) => {
    socket.emit("click-event", index);
  };
  const handlePlayAgainClick = () => {
    setDataa({
      gridVal: Array(9).fill(""),
      chance: true,
      connecIdsArr: dataa.connecIdsArr,
      winner: "",
    });
    navigate("/");
  };
  return (
    <div className="container">
      {!dataa.winner && !isDraw(dataa.gridVal, dataa.winner) ? (
        dataa.chance ? (
          dataa.connecIdsArr.length > 0 &&
          socket.id === dataa.connecIdsArr[0] && <h1>Your Turn</h1>
        ) : (
          dataa.connecIdsArr.length > 0 &&
          socket.id === dataa.connecIdsArr[1] && <h1>Your Turn</h1>
        )
      ) : (
        <h1></h1>
      )}

      <div className="outer">
        {!dataa.winner && !isDraw(dataa.gridVal, dataa.winner) && (
          <div
            className="chance"
            style={{ backgroundColor: activeChanceBgColorX }}
          >
            X
          </div>
        )}
        <div className="grid">
          {dataa.winner ? (
            <div className="result">{`${dataa.winner} wins`}</div>
          ) : isDraw(dataa.gridVal  , dataa.winner) ? (
            <div className="result">It's a draw!</div>
          ) : (
            dataa.gridVal.map((cell, index) => (
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
        {!dataa.winner && !isDraw(dataa.gridVal, dataa.winner) && (
          <div
            className="chance"
            style={{ backgroundColor: activeChanceBgColor0 }}
          >
            0
          </div>
        )}
      </div>
      {dataa.winner || isDraw(dataa.gridVal, dataa.winner) ? (
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
