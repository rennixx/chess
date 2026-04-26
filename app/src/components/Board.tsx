import React, { useCallback } from "react";
import { View, Text, useWindowDimensions, Pressable, StyleSheet } from "react-native";
import { Piece } from "./Piece";
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
  const squareSize = boardSize / 8;
  const pieceSize = squareSize * 0.90;

  const { chess, selectedSquare, legalMoves, lastMove, isBoardFlipped, selectSquare, makeMove } = useStore();
  const board = chess.board();

  const handlePress = useCallback((row: number, col: number) => {
    const file = FILES[col];
    const rank = String(8 - row);
    const square = `${file}${rank}`;
    if (selectedSquare && legalMoves.includes(square)) {
      makeMove({ from: selectedSquare, to: square });
    } else {
      selectSquare(square);
    }
  }, [selectedSquare, legalMoves, makeMove, selectSquare]);

  const isInCheck = chess.inCheck();
  const turn = chess.turn();
  const kingSquare = findKing(board, turn);

  const fileLabels = isBoardFlipped ? [...FILES].reverse() : FILES;

  return (
    <View style={styles.wrapper}>
      <View style={{ flexDirection: "row", width: boardSize }}>
        {fileLabels.map((f) => (
          <View key={f} style={{ width: squareSize, height: 16, alignItems: "center" }}>
            <Text style={{ fontSize: 10, color: Colors.textSecondary }}>{f}</Text>
          </View>
        ))}
      </View>
      <View style={{ width: boardSize, height: boardSize }}>
        {board.map((rowArr, row) =>
          <View key={row} style={{ flexDirection: "row" }}>
            {rowArr.map((piece, col) => {
              const file = FILES[col];
              const rank = String(8 - row);
              const sq = `${file}${rank}`;
              const displayRow = isFlipped(isBoardFlipped, row, col) ? 7 - row : row;
              const displayCol = isFlipped(isBoardFlipped, row, col) ? 7 - col : col;
              const isLight = (displayRow + displayCol) % 2 === 0;
              const isLast = !!lastMove && (lastMove.from === sq || lastMove.to === sq);
              const isKingCheck = isInCheck && kingSquare === sq;
              const isSel = selectedSquare === sq;
              const isLegal = legalMoves.includes(sq);
              const isCapt = !!piece && isLegal && sq !== selectedSquare;

              const bgColor = isSel ? Colors.accent : isLight ? Colors.boardLight : Colors.boardDark;

              return (
                <Pressable key={sq} onPress={() => handlePress(row, col)} style={[styles.square, { width: squareSize, height: squareSize, backgroundColor: bgColor }]}>
                  {isLast && <View style={[styles.overlay, { backgroundColor: Colors.lastMove }]} />}
                  {isKingCheck && piece?.type === "k" && <View style={[styles.overlay, { backgroundColor: Colors.check }]} />}
                  <View style={styles.pieceContainer}>
                    <Piece piece={piece} size={pieceSize} />
                  </View>
                  {isLegal && !isCapt && (
                    <View style={[styles.legalDot, { width: squareSize * 0.25, height: squareSize * 0.25, borderRadius: squareSize * 0.125, backgroundColor: Colors.legalMove }]} />
                  )}
                  {isLegal && isCapt && (
                    <View style={[styles.captureRing, { borderRadius: squareSize * 0.5, borderWidth: 3, borderColor: Colors.legalMove }]} />
                  )}
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}

function isFlipped(boardFlipped: boolean, _row: number, _col: boolean): any {
  return boardFlipped;
}

function findKing(board: ({ type: string; color: string } | null)[][], color: string): string | null {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.type === "k" && p.color === color) return `${FILES[c]}${8 - r}`;
    }
  }
  return null;
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center" },
  square: { justifyContent: "center", alignItems: "center", position: "relative", overflow: "visible" },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  pieceContainer: { justifyContent: "center", alignItems: "center", zIndex: 10, elevation: 10 },
  legalDot: { position: "absolute" },
  captureRing: { position: "absolute", top: 3, left: 3, right: 3, bottom: 3 },
});
