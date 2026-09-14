import type { Position } from './Position.js';

function offsetToBoundary(from: Position, to: Position, radius: number): Position {
  if (radius <= 0) return from;

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);

  if (length === 0) return { ...from };

  return {
    x: from.x + (dx / length) * radius,
    y: from.y + (dy / length) * radius
  };
}

export function edgePath(from: Position, to: Position, curvature: number = 0, stateRadius: number = 0): string {
  const start = offsetToBoundary(from, to, stateRadius);
  const end = offsetToBoundary(to, from, stateRadius);

  if (curvature === 0) {
    return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  }

  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length === 0) {
    return `M ${start.x} ${start.y}`;
  }

  const normalX = -dy / length;
  const normalY = dx / length;

  const controlX = midX + normalX * curvature;
  const controlY = midY + normalY * curvature;

  return `M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`;
}

export function edgeLabelPosition(from: Position, to: Position, curvature: number, stateRadius: number = 0): Position {
  const start = offsetToBoundary(from, to, stateRadius);
  const end = offsetToBoundary(to, from, stateRadius);
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;

  if (curvature === 0) {
    return { x: midX, y: midY };
  }

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length === 0) {
    return { x: midX, y: midY };
  }

  const normalX = -dy / length;
  const normalY = dx / length;

  const labelOffset = curvature + Math.sign(curvature) * 15;

  return {
    x: midX + normalX * labelOffset,
    y: midY + normalY * labelOffset
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

