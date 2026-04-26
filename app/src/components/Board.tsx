import React, { useCallback } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { Square } from "./Square";
import { Colors } from "../utils/constants";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

interface BoardStore {
  chess: {
    board: () => ({ type: string; color: string } | null)[][];
    inCheck: () => boolean;
    turn: () => string;
    fen: () => string;
  };
  selectedSquare: string | null;
  legalMoves: string[];
  lastMove: { from: string; to: string } | null;
  isBoardFlipped: boolean;
  selectSquare: (sq: string | null) => void;
  makeMove: (m: { from: string; to: string; promotion?: string }) => boolean;
}

interface BoardProps {
  useStore: () => BoardStore;
}

export function Board({ useStore }: BoardProps) {
  const { width } = useWindowDimensions();
  const boardSize = Math.min(width - 32, 560);
  const pieceSize = boardSize / 8;
  const {
    chess,
    selectedSquare,
    legalMoves,
    lastMove,
    isBoardFlipped,
    selectSquare,
    makeMove,
  } = useStore();
  const board = chess.board();

  const handlePress = useCallback(
    (row: number, col: number) => {
      const file = FILES[col];
      const rank = String(8 - row);
      const square = `${file}${rank}`;
      if (selectedSquare && legalMoves.includes(square)) {
        makeMove({ from: selectedSquare, to: square });
      } else {
        selectSquare(square);
      }
    },
    [selectedSquare, legalMoves, makeMove, selectSquare],
  );

  const isInCheck = chess.inCheck();
  const turn = chess.turn();
  const kingSquare = findKing(board, turn);

  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        {(isBoardFlipped ? [...FILES].reverse() : FILES).map((f) => (
          <View key={f} style={{ width: boardSize / 8, alignItems: "center" }}>
            <Text style={{ fontSize: 10, color: Colors.textSecondary }}>
              {f}
            </Text>
          </View>
        ))}
      </View>
      <View
        style={{
          width: boardSize,
          height: boardSize,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {board.map((rowArr, row) =>
          rowArr.map((piece, col) => {
            const file = FILES[col];
            const rank = String(8 - row);
            const sq = `${file}${rank}`;
            return (
              <Square
                key={sq}
                row={row}
                col={col}
                piece={piece}
                isLegalMove={legalMoves.includes(sq)}
                isCapture={
                  !!piece &&
                  legalMoves.includes(sq) &&
                  sq !== selectedSquare
                }
                isLastMove={
                  !!lastMove &&
                  (lastMove.from === sq || lastMove.to === sq)
                }
                isCheck={isInCheck && kingSquare === sq}
                isSelected={selectedSquare === sq}
                onPress={handlePress}
                pieceSize={pieceSize}
                isFlipped={isBoardFlipped}
              />
            );
          }),
        )}
      </View>
    </View>
  );
}

function findKing(
  board: ({ type: string; color: string } | null)[][],
  color: string,
): string | null {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.type === "k" && p.color === color)
        return `${FILES[c]}${8 - r}`;
    }
  }
  return null;
}
