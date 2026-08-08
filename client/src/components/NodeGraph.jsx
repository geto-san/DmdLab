// A quiet, ambient node-graph — the site's signature visual motif.
// Pure SVG + CSS animation (no canvas/JS loop), respects prefers-reduced-motion
// via the global animation-duration override in index.css.
const NODES = [
  { x: 60, y: 80 }, { x: 180, y: 40 }, { x: 300, y: 110 },
  { x: 120, y: 190 }, { x: 260, y: 220 }, { x: 380, y: 60 },
  { x: 400, y: 200 }, { x: 40, y: 260 }, { x: 340, y: 300 },
];

const EDGES = [
  [0, 1], [1, 2], [1, 5], [0, 3], [3, 4], [2, 4],
  [2, 5], [4, 8], [5, 6], [6, 8], [3, 7],
];

const NodeGraph = ({ className = '' }) => (
  <svg
    viewBox="0 0 440 340"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <g stroke="var(--color-signal-soft)" strokeOpacity="0.35" strokeWidth="1">
      {EDGES.map(([a, b], i) => (
        <line
          key={i}
          x1={NODES[a].x} y1={NODES[a].y}
          x2={NODES[b].x} y2={NODES[b].y}
          strokeDasharray="1 7"
          style={{ animation: `edge-flow ${6 + (i % 4)}s linear infinite` }}
        />
      ))}
    </g>
    <g fill="var(--color-amber)">
      {NODES.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r="3"
          style={{
            animation: `node-pulse ${3 + (i % 3)}s ease-in-out infinite`,
            animationDelay: `${i * 0.35}s`,
          }}
        />
      ))}
    </g>
  </svg>
);

export default NodeGraph;
