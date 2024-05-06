import { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [grid, setGrid] = useState(Array(9).fill(""));
  const [Xchance, SetXChance] = useState(true); //if true then chance is of X otherwise 0
  const [winner, setWinner] = useState("");

  const isDraw = (grid, winner) => {
    if (winner) {
      return false;
    }
    const isGridFilled = grid.every((cell) => cell !== "");
    return isGridFilled;
  };

  const gotWinner = (index, updatedGrid) => {
    let diagnoal1, diagnoal2;
    const row = Math.floor(index / 3);
    const col = index % 3;
    if (index === 0 || index === 4 || index === 8) {
      diagnoal1 = true;
    }
    if (index === 2 || index === 4 || index === 6) {
      diagnoal2 = true;
    }
    if (
      updatedGrid[row * 3] === updatedGrid[row * 3 + 1] &&
      updatedGrid[row * 3 + 1] === updatedGrid[row * 3 + 2] &&
      updatedGrid[row * 3] !== ""
    ) {
      return updatedGrid[row * 3];
    }
    if (
      updatedGrid[col] === updatedGrid[col + 3] &&
      updatedGrid[col + 3] === updatedGrid[col + 6] &&
      updatedGrid[col] !== ""
    ) {
      return updatedGrid[col];
    }
    if (diagnoal1) {
      if (
        updatedGrid[0] === updatedGrid[4] &&
        updatedGrid[4] === updatedGrid[8] &&
        updatedGrid[0] !== ""
      ) {
        return updatedGrid[0];
      }
    }
    if (diagnoal2) {
      if (
        updatedGrid[2] === updatedGrid[4] &&
        updatedGrid[4] === updatedGrid[6] &&
        updatedGrid[2] !== ""
      ) {
        return updatedGrid[2];
      }
    }
  };
  const clickHandler = (index) => {
    if (winner) {
      return;
    }
    if (grid[index] || winner) return;

    let inputValue = Xchance ? "X" : "0";

    const updatedGrid = grid.map((cell, idx) => {
      if (idx === index) {
        return inputValue;
      }
      return cell;
    });
    setGrid(updatedGrid);
    SetXChance(!Xchance);
    const tempWinner = gotWinner(index, updatedGrid);
    setWinner(tempWinner);
  };
  useEffect(() => {
    const draw = isDraw(grid, winner);
    if (draw) {
      return;
    }
  }, [grid, winner]);
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
              onClick={() => clickHandler(index)}
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
