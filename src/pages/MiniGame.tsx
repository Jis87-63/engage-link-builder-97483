import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { playTakeoffSound, playCollectSound, playCrashSound, playWinSound, playFlyingLoop } from "@/lib/gameAudio";
import { getCooldownRemaining, setPlayed, formatCooldown } from "@/lib/gameCooldown";
import aviatorImg from "@/assets/aviator.webp";
import aeroImg from "@/assets/aero.webp";
import spacemanImg from "@/assets/spaceman.webp";
import airbossImg from "@/assets/airboss.webp";
import aviaRushImg from "@/assets/avia-rush.webp";

const miniGames = [
  { id: "aviator-fly", title: "Aviator Fly", image: aviatorImg, accent: "220, 38, 38", maxTime: 12 },
  { id: "aero-collect", title: "Aero Collect", image: aeroImg, accent: "59, 130, 246", maxTime: 10 },
  { id: "space-voyage", title: "Space Voyage", image: spacemanImg, accent: "124, 58, 237", maxTime: 14 },
  { id: "airboss-rush", title: "AirBoss Rush", image: airbossImg, accent: "6, 182, 212", maxTime: 11 },
  { id: "avia-blitz", title: "Avia Blitz", image: aviaRushImg, accent: "99, 102, 241", maxTime: 9 },
];

export { miniGames };

interface Reward {
  id: number;
  x: number;
  y: number;
  value: number;
  collected: boolean;
}

type GameState = "idle" | "flying" | "crashed" | "results";

const MiniGame = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = miniGames.find((g) => g.id === gameId);

  const [gameState, setGameState] = useState<GameState>("idle");
  const [multiplier, setMultiplier] = useState(1.0);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [collectedRewards, setCollectedRewards] = useState<number[]>([]);
  const [totalCollected, setTotalCollected] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const totalRef = useRef(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const crashTimeRef = useRef(0);
  const gameLoopRef = useRef<number>();
  const rewardIdRef = useRef(0);
  const flyingSoundRef = useRef<{ stop: () => void } | null>(null);
  const startTimeRef = useRef(0);
  const pointsRef = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    if (!game) return;
    const update = () => setCooldown(getCooldownRemaining(game.id));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [game]);

  useEffect(() => {
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      flyingSoundRef.current?.stop();
    };
  }, []);

  // Draw the game canvas
  const drawCanvas = useCallback((elapsed: number, crashed: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas || !game) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width;
    const H = rect.height;

    // Background
    ctx.fillStyle = "#0e1117";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < W; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Axes
    const margin = { left: 40, bottom: 30, top: 20, right: 20 };
    const plotW = W - margin.left - margin.right;
    const plotH = H - margin.top - margin.bottom;

    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, H - margin.bottom);
    ctx.lineTo(W - margin.right, H - margin.bottom);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "10px monospace";
    ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
      const val = (1 + i * 2).toFixed(0) + "x";
      const y = H - margin.bottom - (i / 4) * plotH;
      ctx.fillText(val, margin.left - 5, y + 3);
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(W - margin.right, y);
      ctx.stroke();
    }

    if (elapsed <= 0) return;

    // Build curve points
    const maxDisplayTime = Math.max(elapsed + 2, 8);
    const accentRgb = game.accent;

    // Draw curve
    const pts = pointsRef.current;
    if (pts.length > 1) {
      // Glow effect
      ctx.shadowColor = `rgba(${accentRgb}, 0.6)`;
      ctx.shadowBlur = 15;
      ctx.strokeStyle = `rgb(${accentRgb})`;
      ctx.lineWidth = 3;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();

      pts.forEach((pt, i) => {
        const px = margin.left + (pt.x / maxDisplayTime) * plotW;
        const multVal = 1 + pt.x * 0.5 + Math.pow(pt.x, 1.5) * 0.1;
        const py = H - margin.bottom - ((multVal - 1) / 8) * plotH;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Fill under curve
      ctx.shadowBlur = 0;
      const lastPt = pts[pts.length - 1];
      const lastPx = margin.left + (lastPt.x / maxDisplayTime) * plotW;
      const lastMultVal = 1 + lastPt.x * 0.5 + Math.pow(lastPt.x, 1.5) * 0.1;
      const lastPy = H - margin.bottom - ((lastMultVal - 1) / 8) * plotH;

      const gradient = ctx.createLinearGradient(0, lastPy, 0, H - margin.bottom);
      gradient.addColorStop(0, `rgba(${accentRgb}, 0.15)`);
      gradient.addColorStop(1, `rgba(${accentRgb}, 0.02)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      pts.forEach((pt, i) => {
        const px = margin.left + (pt.x / maxDisplayTime) * plotW;
        const multVal = 1 + pt.x * 0.5 + Math.pow(pt.x, 1.5) * 0.1;
        const py = H - margin.bottom - ((multVal - 1) / 8) * plotH;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.lineTo(lastPx, H - margin.bottom);
      ctx.lineTo(margin.left, H - margin.bottom);
      ctx.closePath();
      ctx.fill();

      // Airplane at the tip
      const planeSize = 24;
      ctx.save();
      ctx.translate(lastPx, lastPy);

      if (crashed) {
        // Explosion effect
        ctx.shadowColor = `rgba(255, 80, 50, 0.8)`;
        ctx.shadowBlur = 30;
        ctx.fillStyle = "rgba(255, 80, 50, 0.6)";
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255, 200, 50, 0.8)";
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Draw airplane shape
        const angle = pts.length > 2
          ? Math.atan2(
              (H - margin.bottom - ((1 + pts[pts.length - 1].x * 0.5 + Math.pow(pts[pts.length - 1].x, 1.5) * 0.1 - 1) / 8) * plotH) -
              (H - margin.bottom - ((1 + pts[pts.length - 3].x * 0.5 + Math.pow(pts[pts.length - 3].x, 1.5) * 0.1 - 1) / 8) * plotH),
              (pts[pts.length - 1].x - pts[pts.length - 3].x) / maxDisplayTime * plotW
            )
          : -Math.PI / 4;

        ctx.rotate(angle);
        ctx.shadowColor = `rgba(${accentRgb}, 0.8)`;
        ctx.shadowBlur = 10;

        // Body
        ctx.fillStyle = `rgb(${accentRgb})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, planeSize / 2, planeSize / 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Wings
        ctx.beginPath();
        ctx.moveTo(-2, 0);
        ctx.lineTo(-8, -planeSize / 2.5);
        ctx.lineTo(4, 0);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-2, 0);
        ctx.lineTo(-8, planeSize / 2.5);
        ctx.lineTo(4, 0);
        ctx.closePath();
        ctx.fill();

        // Trail particles
        ctx.shadowBlur = 0;
        for (let t = 1; t <= 5; t++) {
          ctx.fillStyle = `rgba(${accentRgb}, ${0.3 - t * 0.05})`;
          ctx.beginPath();
          ctx.arc(-planeSize / 2 - t * 6, (Math.random() - 0.5) * 4, 2 + Math.random() * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    // Multiplier text
    const multText = (1 + elapsed * 0.5 + Math.pow(elapsed, 1.5) * 0.1).toFixed(2) + "x";
    ctx.shadowColor = crashed ? "rgba(255,50,50,0.5)" : `rgba(${accentRgb}, 0.5)`;
    ctx.shadowBlur = 20;
    ctx.fillStyle = crashed ? "#ff3232" : `rgb(${accentRgb})`;
    ctx.font = "bold 36px monospace";
    ctx.textAlign = "center";
    ctx.fillText(multText, W / 2, H / 2 - 10);

    if (crashed) {
      ctx.fillStyle = "#ff3232";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("FLEW AWAY!", W / 2, H / 2 + 20);
    }

    ctx.shadowBlur = 0;
  }, [game]);

  const collectReward = useCallback((rewardId: number, value: number) => {
    setRewards((prev) => prev.map((r) => (r.id === rewardId ? { ...r, collected: true } : r)));
    setCollectedRewards((prev) => [...prev, value]);
    setTotalCollected((prev) => prev + value);
    totalRef.current += value;
    playCollectSound();
  }, []);

  const startGame = useCallback(() => {
    if (!game || cooldown > 0) return;

    setGameState("flying");
    setMultiplier(1.0);
    setRewards([]);
    setCollectedRewards([]);
    setTotalCollected(0);
    totalRef.current = 0;
    setShowResults(false);
    pointsRef.current = [];

    crashTimeRef.current = 3 + Math.random() * (game.maxTime - 3);
    startTimeRef.current = Date.now();

    playTakeoffSound();
    setTimeout(() => {
      flyingSoundRef.current = playFlyingLoop();
    }, 800);

    const loop = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const newMultiplier = 1 + elapsed * 0.5 + Math.pow(elapsed, 1.5) * 0.1;
      setMultiplier(parseFloat(newMultiplier.toFixed(2)));

      // Record curve point
      pointsRef.current.push({ x: elapsed, y: newMultiplier });
      if (pointsRef.current.length > 500) pointsRef.current = pointsRef.current.slice(-400);

      drawCanvas(elapsed, false);

      // Spawn rewards
      if (Math.random() < 0.025) {
        const id = ++rewardIdRef.current;
        const value = Math.random() < 0.25 ? 0 : Math.random() < 0.5 ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 15) + 5;
        if (value > 0) {
          setRewards((prev) => [
            ...prev,
            { id, x: 15 + Math.random() * 70, y: 15 + Math.random() * 50, value, collected: false },
          ]);
          setTimeout(() => {
            setRewards((prev) => prev.filter((r) => r.id !== id));
          }, 2500);
        }
      }

      if (elapsed >= crashTimeRef.current) {
        flyingSoundRef.current?.stop();
        flyingSoundRef.current = null;
        playCrashSound();
        setGameState("crashed");
        setPlayed(game.id);
        drawCanvas(elapsed, true);

        setTimeout(() => {
          if (totalRef.current > 0) playWinSound();
          setGameState("results");
          setShowResults(true);
        }, 2000);
        return;
      }

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
  }, [game, cooldown, drawCanvas]);

  if (!game) {
    navigate("/");
    return null;
  }

  const registerUrl = "https://sshortly.net/18839e8";
  const accentRgb = game.accent;

  return (
    <div className="min-h-screen" style={{ background: "#0e1117" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#161b22", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={() => navigate("/")}
          className="w-9 h-9 flex items-center justify-center rounded-lg transition-opacity hover:opacity-80"
          style={{ background: `rgb(${accentRgb})` }}
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <img src={game.image} alt={game.title} className="w-8 h-8 rounded-lg object-cover" />
        <h1 className="text-base font-bold text-white flex-1">{game.title}</h1>
        <div className="flex items-center gap-1 px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
          <Star className="w-3.5 h-3.5" style={{ color: `rgb(${accentRgb})`, fill: `rgb(${accentRgb})` }} />
          <span className="text-white font-bold text-xs">{totalCollected}</span>
        </div>
      </div>

      {/* Game Canvas Area */}
      <div className="px-3 pt-3">
        <div className="relative w-full rounded-xl overflow-hidden" style={{ background: "#0e1117", border: "1px solid rgba(255,255,255,0.06)" }}>
          <canvas
            ref={canvasRef}
            className="w-full"
            style={{ aspectRatio: "16/10", display: "block" }}
          />

          {/* Collectible reward overlays */}
          {gameState === "flying" &&
            rewards
              .filter((r) => !r.collected)
              .map((r) => (
                <button
                  key={r.id}
                  onClick={() => collectReward(r.id, r.value)}
                  className="absolute z-20 cursor-pointer transition-all duration-200 hover:scale-150"
                  style={{
                    left: `${r.x}%`,
                    top: `${r.y}%`,
                    animation: "pulse 1s infinite",
                  }}
                >
                  <div
                    className="flex items-center justify-center w-9 h-9 rounded-full backdrop-blur-sm"
                    style={{
                      background: `rgba(${accentRgb}, 0.2)`,
                      border: `2px solid rgb(${accentRgb})`,
                      boxShadow: `0 0 12px rgba(${accentRgb}, 0.4)`,
                    }}
                  >
                    <span className="font-black text-[10px] text-white">+{r.value}</span>
                  </div>
                </button>
              ))}

          {/* Idle overlay */}
          {gameState === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ background: "rgba(14,17,23,0.85)" }}>
              <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl" style={{ border: `2px solid rgb(${accentRgb})`, boxShadow: `0 0 30px rgba(${accentRgb}, 0.3)` }}>
                <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
              </div>
              {cooldown > 0 ? (
                <div className="text-center">
                  <p className="text-gray-400 text-xs mb-1">Próximo vôo disponível em</p>
                  <p className="text-xl font-mono font-bold" style={{ color: `rgb(${accentRgb})` }}>
                    {formatCooldown(cooldown)}
                  </p>
                </div>
              ) : (
                <button
                  onClick={startGame}
                  className="px-8 py-3 rounded-xl font-bold text-white text-base transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, rgb(${accentRgb}), rgba(${accentRgb}, 0.7))`,
                    boxShadow: `0 4px 20px rgba(${accentRgb}, 0.4)`,
                  }}
                >
                  🛫 DECOLAR
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Rewards Report */}
      <div className="px-3 pt-3 pb-6">
        <div className="rounded-xl p-4" style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4" style={{ color: `rgb(${accentRgb})` }} />
            Relatório de Ganhos
          </h3>
          {collectedRewards.length > 0 ? (
            <div className="space-y-1.5">
              {collectedRewards.map((val, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-gray-400">Recompensa #{i + 1}</span>
                  <span className="font-bold" style={{ color: `rgb(${accentRgb})` }}>+{val} Vôos Grátis</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 flex justify-between font-bold text-sm" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <span className="text-white">Total</span>
                <span style={{ color: `rgb(${accentRgb})` }}>{totalCollected} Vôos Grátis</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-xs">
              {gameState === "idle" ? "Decole para começar a coletar recompensas!" : "Nenhuma recompensa coletada neste vôo."}
            </p>
          )}
        </div>
      </div>

      {/* Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="sm:max-w-md border-border" style={{ background: "#161b22" }}>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold" style={{ color: `rgb(${accentRgb})` }}>
              {totalCollected > 0 ? "🎉 Parabéns! 🎉" : "✈️ Vôo Encerrado"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden" style={{ border: `2px solid rgb(${accentRgb})`, boxShadow: `0 0 20px rgba(${accentRgb}, 0.3)` }}>
              <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
            </div>
            {totalCollected > 0 ? (
              <>
                <p className="text-center text-lg font-semibold text-white">
                  Você coletou {totalCollected} Vôos Grátis!
                </p>
                <p className="text-center text-sm text-gray-400">
                  Multiplicador final: {multiplier.toFixed(2)}x
                </p>
                <a href={registerUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                  <Button
                    className="w-full font-bold py-3 text-base text-white border-0"
                    style={{
                      background: `linear-gradient(135deg, rgb(${accentRgb}), rgba(${accentRgb}, 0.7))`,
                    }}
                  >
                    Reivindicar Recompensas
                  </Button>
                </a>
              </>
            ) : (
              <>
                <p className="text-center text-gray-300">
                  Você não coletou nenhuma recompensa neste vôo. Tente novamente em 24h!
                </p>
                <Button onClick={() => setShowResults(false)} variant="outline" className="w-full text-white border-gray-700">
                  Fechar
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MiniGame;
