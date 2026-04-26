import React from "react";
import DarkBishop from "../../../icons/dark_bishop.svg";
import DarkKing from "../../../icons/dark_king.svg";
import DarkKnight from "../../../icons/dark_knight.svg";
import DarkPawn from "../../../icons/dark_pawn.svg";
import DarkQueen from "../../../icons/dark_queen.svg";
import DarkRook from "../../../icons/dark_rook.svg";
import LightBishop from "../../../icons/light_bishop.svg";
import LightKing from "../../../icons/light_king.svg";
import LightKnight from "../../../icons/light_knight.svg";
import LightPawn from "../../../icons/light_pawn.svg";
import LightQueen from "../../../icons/light_queen.svg";
import LightRook from "../../../icons/light_rook.svg";

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
