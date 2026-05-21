import type { MomentumPoint } from "@/types";

function createPath(points: number[], width: number, height: number) {
  const max = 100;
  const min = 0;
  const step = width / Math.max(points.length - 1, 1);

  return points
    .map((value, index) => {
      const x = index * step;
      const normalized = (value - min) / (max - min);
      const y = height - normalized * height;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

export function MomentumSparkline({ points }: { points: MomentumPoint[] }) {
  const width = 420;
  const height = 144;
  const homePath = createPath(
    points.map((point) => point.home),
    width,
    height
  );
  const awayPath = createPath(
    points.map((point) => point.away),
    width,
    height
  );

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full min-h-[150px] w-full"
      role="img"
      aria-label="Momentum trend chart"
    >
      <defs>
        <linearGradient id="homeMomentum" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="awayMomentum" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#ffd166" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ff3b6b" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      {[24, 48, 72, 96, 120].map((y) => (
        <line key={y} x1="0" x2={width} y1={y} y2={y} stroke="rgba(255,255,255,0.08)" />
      ))}
      <path d={awayPath} fill="none" stroke="url(#awayMomentum)" strokeWidth="3" strokeLinecap="round" />
      <path d={homePath} fill="none" stroke="url(#homeMomentum)" strokeWidth="4" strokeLinecap="round" />
      {points.map((point, index) => {
        const x = (index * width) / Math.max(points.length - 1, 1);
        const y = height - (point.home / 100) * height;

        return (
          <circle
            key={point.over}
            cx={x}
            cy={y}
            r={index === points.length - 1 ? 5 : 3}
            fill={index === points.length - 1 ? "#dffcff" : "#00e5ff"}
            opacity={index === points.length - 1 ? 1 : 0.72}
          />
        );
      })}
    </svg>
  );
}
