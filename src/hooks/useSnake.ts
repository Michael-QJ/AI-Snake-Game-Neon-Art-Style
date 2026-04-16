import { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction, GameStatus } from '../types';

const GRID_SIZE = 20;
const INITIAL_SPEED = 90;
const MIN_SPEED = 45;
const SPEED_INCREMENT = 3;

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

const getRandomPoint = (excludePoints: Point[] = []): Point => {
  let point: Point;
  do {
    point = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (excludePoints.some(p => p.x === point.x && p.y === point.y));
  return point;
};

export function useSnake() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>(getRandomPoint(INITIAL_SNAKE));
  const [direction, setDirection] = useState<Direction>(Direction.UP);
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const directionRef = useRef<Direction>(Direction.UP);
  const gameLoopRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setFood(getRandomPoint(INITIAL_SNAKE));
    setDirection(Direction.UP);
    directionRef.current = Direction.UP;
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setStatus('IDLE');
  }, []);

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (directionRef.current) {
        case Direction.UP:
          newHead.y = (newHead.y - 1 + GRID_SIZE) % GRID_SIZE;
          break;
        case Direction.DOWN:
          newHead.y = (newHead.y + 1) % GRID_SIZE;
          break;
        case Direction.LEFT:
          newHead.x = (newHead.x - 1 + GRID_SIZE) % GRID_SIZE;
          break;
        case Direction.RIGHT:
          newHead.x = (newHead.x + 1) % GRID_SIZE;
          break;
      }

      // Self collision
      if (prevSnake.some(p => p.x === newHead.x && p.y === newHead.y)) {
        setStatus('GAME_OVER');
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(getRandomPoint(newSnake));
        setSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (directionRef.current !== Direction.DOWN) setDirection(Direction.UP);
          break;
        case 'ArrowDown':
        case 's':
          if (directionRef.current !== Direction.UP) setDirection(Direction.DOWN);
          break;
        case 'ArrowLeft':
        case 'a':
          if (directionRef.current !== Direction.RIGHT) setDirection(Direction.LEFT);
          break;
        case 'ArrowRight':
        case 'd':
          if (directionRef.current !== Direction.LEFT) setDirection(Direction.RIGHT);
          break;
        case ' ':
          if (status === 'PLAYING') setStatus('PAUSED');
          else if (status === 'PAUSED' || status === 'IDLE') setStatus('PLAYING');
          else if (status === 'GAME_OVER') resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [status, resetGame]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (status === 'PLAYING') {
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      clearInterval(gameLoopRef.current);
    }

    return () => clearInterval(gameLoopRef.current);
  }, [status, moveSnake, speed]);

  return {
    snake,
    food,
    direction,
    status,
    score,
    setStatus,
    resetGame,
    gridSize: GRID_SIZE,
  };
}
