export type Point = { x: number; y: number };

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export type Song = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  url: string;
  cover: string;
};
