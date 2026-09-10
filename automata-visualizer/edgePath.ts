import type { Position } from './Position.js';

export function edgePath(from: Position, to: Position, curvature: number = 0): string {
  if (curvature === 0) {
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  }

  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length === 0) {
    return `M ${from.x} ${from.y}`;
  }

  const normalX = -dy / length;
  const normalY = dx / length;

  const controlX = midX + normalX * curvature;
  const controlY = midY + normalY * curvature;

  return `M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`;
}

export function edgeLabelPosition(from: Position, to: Position, curvature: number): Position {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  if (curvature === 0) {
    return { x: midX, y: midY };
  }

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  const normalX = -dy / length;
  const normalY = dx / length;

  const labelOffset = curvature + Math.sign(curvature) * 15;
  return {
    x: midX + normalX * labelOffset,
    y: midY + normalY * labelOffset,
  };
}

export function selfLoopPath(center: Position, stateRadius: number, loopSize: number = 40): string {
  const startX = center.x - stateRadius * 0.7;
  const startY = center.y - stateRadius * 0.7;
  const endX = center.x + stateRadius * 0.7;
  const endY = center.y - stateRadius * 0.7;

  const ctrl1X = center.x - loopSize;
  const ctrl1Y = center.y - stateRadius - loopSize;
  const ctrl2X = center.x + loopSize;
  const ctrl2Y = center.y - stateRadius - loopSize;

  return `M ${startX} ${startY} C ${ctrl1X} ${ctrl1Y} ${ctrl2X} ${ctrl2Y} ${endX} ${endY}`;
}

export function selfLoopLabelPosition(center: Position, stateRadius: number, loopSize: number = 40): Position {
  return { x: center.x, y: center.y - stateRadius - loopSize - 10 };
}

