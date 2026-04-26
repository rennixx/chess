import React from "react";
import DarkBishop from "../assets/dark_bishop.svg";
import DarkKing from "../assets/dark_king.svg";
import DarkKnight from "../assets/dark_knight.svg";
import DarkPawn from "../assets/dark_pawn.svg";
import DarkQueen from "../assets/dark_queen.svg";
import DarkRook from "../assets/dark_rook.svg";
import LightBishop from "../assets/light_bishop.svg";
import LightKing from "../assets/light_king.svg";
import LightKnight from "../assets/light_knight.svg";
import LightPawn from "../assets/light_pawn.svg";
import LightQueen from "../assets/light_queen.svg";
import LightRook from "../assets/light_rook.svg";

const PIECE_MAP: Record<
  string,
  React.FC<{ width?: number; height?: number }>
> = {
  pb: DarkPawn,
  nb: DarkKnight,
  bb: DarkBishop,
  rb: DarkRook,
  qb: DarkQueen,
  kb: DarkKing,
  pw: LightPawn,
  nw: LightKnight,
  bw: LightBishop,
  rw: LightRook,
  qw: LightQueen,
  kw: LightKing,
};

interface PieceProps {
  piece: { type: string; color: string } | null;
  size: number;
}

export function Piece({ piece, size }: PieceProps) {
  if (!piece) return null;
  const key = `${piece.type}${piece.color}`;
  const SvgComponent = PIECE_MAP[key];
  if (!SvgComponent) return null;
  return <SvgComponent width={size} height={size} />;
}
