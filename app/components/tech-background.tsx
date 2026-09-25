"use client";

import { useEffect, useRef } from "react";

/* ── Potongan kode yang melayang ── */
const CODE_TOKENS = [
  "{ }", "</>", "const", "01", "10", "=>", "[ ]", "if()",
  "fn()", "&&", "null", "00", "11", "return", "true", "//", "class", "<div>",
];

type FloatToken = {
  x: number; y: number;
  text: string; speed: number; opacity: number;
  size: number; drift: number;
};

type ScanLine = {
  y: number; speed: number; opacity: number; blur: number;
};

type Node = {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
};

const CONNECT_DIST = 130;
const NODE_COUNT = 28;

export default function TechBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = 0, h = 0;
    let gridOffset = 0;

    /* ── Tokens ── */
    const tokens: FloatToken[] = [];

    function spawnToken(): FloatToken {
      return {
        x: Math.random() * w,
        y: h + 20,
        text: CODE_TOKENS[Math.floor(Math.random() * CODE_TOKENS.length)],
        speed: 0.12 + Math.random() * 0.22,
        opacity: 0.045 + Math.random() * 0.07,
        size: 10 + Math.floor(Math.random() * 8),
        drift: (Math.random() - 0.5) * 0.09,
      };
    }

    function initTokens() {
      tokens.length = 0;
      const count = Math.max(8, Math.floor((w * h) / 30000));
      for (let i = 0; i < count; i++) {
        const t = spawnToken();
        t.y = Math.random() * h; // distribute initially
        tokens.push(t);
      }
    }

    /* ── Scan lines ── */
    const scans: ScanLine[] = [
      { y: 0, speed: 0.38, opacity: 0.028, blur: 70 },
      { y: 0, speed: 0.55, opacity: 0.018, blur: 50 },
    ];

    function initScans() {
      scans[0].y = Math.random() * h * 0.4;
      scans[1].y = Math.random() * h * 0.7;
    }

    /* ── Network nodes ── */
    const nodes: Node[] = [];

    function initNodes() {
      nodes.length = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: 1.5 + Math.random() * 1.5,
        });
      }
    }

    /* ── Resize ── */
    function resize() {
      w = canvas!.width = canvas!.offsetWidth;
      h = canvas!.height = canvas!.offsetHeight;
      initTokens();
      initScans();
      initNodes();
    }

    /* ── Draw: blueprint grid ── */
    function drawGrid() {
      const CELL = 44;
      const ANGLE = Math.PI / 6;
      const offset = gridOffset % CELL; // period = CELL, seamless dalam grid-space

      ctx!.save();
      ctx!.strokeStyle = "rgba(37,99,235,0.20)";
      ctx!.lineWidth = 1;

      // Rotate dulu ke grid-space, BARU translate — period tepat CELL, no blink
      ctx!.translate(w / 2, h / 2);
      ctx!.rotate(ANGLE);
      ctx!.translate(offset, offset);

      const diag = Math.sqrt(w * w + h * h) + CELL * 4;
      const n = Math.ceil(diag / CELL) + 2;

      for (let c = -n; c < n; c++) {
        ctx!.beginPath();
        ctx!.moveTo(c * CELL, -diag);
        ctx!.lineTo(c * CELL, diag);
        ctx!.stroke();
      }
      for (let r = -n; r < n; r++) {
        ctx!.beginPath();
        ctx!.moveTo(-diag, r * CELL);
        ctx!.lineTo(diag, r * CELL);
        ctx!.stroke();
      }
      ctx!.restore();
    }


    /* ── Draw: scan lines ── */
    function drawScans() {
      scans.forEach((sl) => {
        const g = ctx!.createLinearGradient(0, sl.y - sl.blur / 2, 0, sl.y + sl.blur / 2);
        g.addColorStop(0, "rgba(37,99,235,0)");
        g.addColorStop(0.5, `rgba(37,99,235,${sl.opacity})`);
        g.addColorStop(1, "rgba(37,99,235,0)");
        ctx!.fillStyle = g;
        ctx!.fillRect(0, sl.y - sl.blur / 2, w, sl.blur);
        sl.y += sl.speed;
        if (sl.y - sl.blur / 2 > h) sl.y = -sl.blur;
      });
    }

    /* ── Draw: floating code tokens ── */
    function drawTokens() {
      tokens.forEach((tk) => {
        ctx!.font = `400 ${tk.size}px monospace`;
        ctx!.fillStyle = `rgba(37,99,235,${tk.opacity})`;
        ctx!.fillText(tk.text, tk.x, tk.y);
        tk.y -= tk.speed;
        tk.x += tk.drift;
        if (tk.y + tk.size < 0) {
          Object.assign(tk, spawnToken());
        }
        if (tk.x < -60) tk.x = w + 20;
        if (tk.x > w + 60) tk.x = -20;
      });
    }

    /* ── Draw: network nodes + edges ── */
    function drawNetwork() {
      /* update positions */
      nodes.forEach((nd) => {
        nd.x += nd.vx; nd.y += nd.vy;
        if (nd.x < 0 || nd.x > w) nd.vx *= -1;
        if (nd.y < 0 || nd.y > h) nd.vy *= -1;
      });

      /* edges */
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.12;
            ctx!.strokeStyle = `rgba(37,99,235,${alpha.toFixed(3)})`;
            ctx!.lineWidth = 0.8;
            ctx!.beginPath();
            ctx!.moveTo(nodes[i].x, nodes[i].y);
            ctx!.lineTo(nodes[j].x, nodes[j].y);
            ctx!.stroke();
          }
        }
      }

      /* dots */
      nodes.forEach((nd) => {
        ctx!.beginPath();
        ctx!.arc(nd.x, nd.y, nd.r, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(37,99,235,0.18)";
        ctx!.fill();
      });
    }

    /* ── Main loop ── */
    function loop() {
      ctx!.clearRect(0, 0, w, h);

      drawGrid();
      gridOffset += 0.22;

      drawNetwork();
      drawScans();
      drawTokens();

      animId = requestAnimationFrame(loop);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    loop();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
