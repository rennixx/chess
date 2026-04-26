import React from "react";
import { Pressable, View } from "react-native";
import { Piece } from "./Piece";
import { Colors } from "../utils/constants";

interface SquareProps {
  row: number;
  col: number;
  piece: { type: string; color: string } | null;
  isLegalMove: boolean;
  isCapture: boolean;
  isLastMove: boolean;
  isCheck: boolean;
  isSelected: boolean;
  onPress: (row: number, col: number) => void;
  pieceSize: number;
  isFlipped: boolean;
}

export function Square({
  row,
  col,
  piece,
  isLegalMove,
  isCapture,
  isLastMove,
  isCheck,
  isSelected,
  onPress,
  pieceSize,
  isFlipped,
}: SquareProps) {
  const displayRow = isFlipped ? 7 - row : row;
  const displayCol = isFlipped ? 7 - col : col;
  const isLight = (displayRow + displayCol) % 2 === 0;
  const backgroundColor = isSelected
    ? Colors.accent
    : isLight
      ? Colors.boardLight
      : Colors.boardDark;

  return (
    <Pressable
      onPress={() => onPress(row, col)}
      style={{
        width: "12.5%",
        aspectRatio: 1,
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {isLastMove && (
        <View
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: Colors.lastMove,
          }}
        />
      )}
      {isCheck && piece?.type === "k" && (
        <View
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: Colors.check,
          }}
        />
      )}
      <Piece piece={piece} size={pieceSize * 0.8} />
      {isLegalMove && !isCapture && (
        <View
          style={{
            position: "absolute",
            width: pieceSize * 0.25,
            height: pieceSize * 0.25,
            borderRadius: pieceSize * 0.125,
            backgroundColor: Colors.legalMove,
          }}
        />
      )}
      {isLegalMove && isCapture && (
        <View
          style={{
            position: "absolute",
            inset: 2,
            borderRadius: pieceSize * 0.5,
            borderWidth: 3,
            borderColor: Colors.legalMove,
          }}
        />
      )}
    </Pressable>
  );
}
