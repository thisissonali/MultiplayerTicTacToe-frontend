import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const Home = () => {
  const [dataa, setDataa] = useState(null);

  const socket = useMemo(() => io(import.meta.env.VITE_SOCKET_URL || "/"), []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id);
    });

    socket.on("data", (data, newRoom) => {
      console.log(data[newRoom]);
      setDataa(data[newRoom]);
    });
    return () => {
      socket.off("connect");
      socket.off("data");
    };
  }, [socket, dataa]);

  const isDraw = (grid, winner) => {
    if (winner || !grid || grid.length !== 9) {
      return false;
    }
    const isGridFilled = grid.every((cell) => cell !== "");
    return isGridFilled;
  };

  const handleClick = (index) => {
    socket.emit("click-event", index);
  };

  const handlePlayAgainClick = () => {
    socket.emit("request-new-room");
  };

  return (
    <div className="outer-wrap">
      <div className="chance-class">
        {dataa &&
          !dataa.winner &&
          !isDraw(dataa.gridVal, dataa.winner) &&
          socket.id === dataa.connecIdsArr[0] && (
            <div className="xorzero">You are : X</div>
          )}
        {dataa &&
          !dataa.winner &&
          !isDraw(dataa.gridVal, dataa.winner) &&
          socket.id === dataa.connecIdsArr[1] && (
            <div className="xorzero">You are : 0</div>
          )}
        <></>
      </div>
      <>
        {dataa === null ? (
          <div className="outer-msg">
            <div className="msgg">
              <h1 className="msg-h1">You are alone in the room</h1>
              <div>Waiting for another player to join...</div>
            </div>
          </div>
        ) : (
          <div className="outer-1">
            {!dataa.winner && !isDraw(dataa.gridVal, dataa.winner) ? (
              dataa.chance ? (
                <>
                  {socket.id === dataa.connecIdsArr[0] && <h1>Your Turn</h1>}
                  {socket.id === dataa.connecIdsArr[1] && (
                    <h1 className="turnClass">X Is Playing Its Turn</h1>
                  )}
                </>
              ) : (
                <>
                  {socket.id === dataa.connecIdsArr[0] && (
                    <h1 className="turnClass">0 Is Playing Its Turn</h1>
                  )}
                  {socket.id === dataa.connecIdsArr[1] && <h1>Your Turn</h1>}
                </>
              )
            ) : (
              <h1></h1>
            )}

            <div className="grid">
              {dataa.winner ? (
                <div className="result">{`${dataa.winner} wins`}</div>
              ) : isDraw(dataa.gridVal, dataa.winner) ? (
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
            {(dataa.winner || isDraw(dataa.gridVal, dataa.winner)) && (
              <button
                onClick={() => handlePlayAgainClick()}
                className="play-agn"
              >
                Find New Match
              </button>
            )}
          </div>
        )}
      </>
    </div>
  );
};

export default Home;
