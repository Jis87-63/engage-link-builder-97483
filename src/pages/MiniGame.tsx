import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plane, Star, Trophy } from "lucide-react";
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
  { id: "aviator-fly", title: "Aviator Fly", image: aviatorImg, color: "#dc2626", maxTime: 12 },
  { id: "aero-collect", title: "Aero Collect", image: aeroImg, color: "#3b82f6", maxTime: 10 },
  { id: "space-voyage", title: "Space Voyage", image: spacemanImg, color: "#7c3aed", maxTime: 14 },
  { id: "airboss-rush", title: "AirBoss Rush", image: airbossImg, color: "#06b6d4", maxTime: 11 },
  { id: "avia-blitz", title: "Avia Blitz", image: aviaRushImg, color: "#6366f1", maxTime: 9 },
];

export { miniGames };

interface Reward {
  id: number;
  x: number;
  y: number;
  value: number;
  collected: boolean;
  opacity: number;
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
  const [planeY, setPlaneY] = useState(80);
  const [showResults, setShowResults] = useState(false);
  const totalRef = useRef(0);

  const crashTimeRef = useRef(0);
  const gameLoopRef = useRef<number>();
  const rewardIdRef = useRef(0);
  const flyingSoundRef = useRef<{ stop: () => void } | null>(null);
  const startTimeRef = useRef(0);

  // Cooldown timer
  useEffect(() => {
    if (!game) return;
    const update = () => {
      const remaining = getCooldownRemaining(game.id);
      setCooldown(remaining);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [game]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      flyingSoundRef.current?.stop();
    };
  }, []);

  const collectReward = useCallback((rewardId: number, value: number) => {
    setRewards((prev) =>
      prev.map((r) => (r.id === rewardId ? { ...r, collected: true } : r))
    );
    setCollectedRewards((prev) => [...prev, value]);
    setTotalCollected((prev) => prev + value);
    playCollectSound();
  }, []);

  const startGame = useCallback(() => {
    if (!game || cooldown > 0) return;

    setGameState("flying");
    setMultiplier(1.0);
    setRewards([]);
    setCollectedRewards([]);
    setTotalCollected(0);
    setPlaneY(80);
    setShowResults(false);

    // Random crash time between 3 and maxTime seconds
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

      // Move plane up
      const newY = Math.max(10, 80 - elapsed * 5);
      setPlaneY(newY);

      // Spawn rewards randomly
      if (Math.random() < 0.02) {
        const id = ++rewardIdRef.current;
        const value = Math.random() < 0.3 ? 0 : Math.random() < 0.5 ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 15) + 5;
        if (value > 0) {
          setRewards((prev) => [
            ...prev,
            {
              id,
              x: 10 + Math.random() * 80,
              y: 10 + Math.random() * 60,
              value,
              collected: false,
              opacity: 1,
            },
          ]);
          // Auto-remove after 3 seconds
          setTimeout(() => {
            setRewards((prev) => prev.filter((r) => r.id !== id));
          }, 3000);
        }
      }

      if (elapsed >= crashTimeRef.current) {
        // Game over
        flyingSoundRef.current?.stop();
        flyingSoundRef.current = null;
        playCrashSound();
        setGameState("crashed");
        setPlayed(game.id);

        setTimeout(() => {
          if (collectedRewards.length > 0 || totalCollected > 0) {
            playWinSound();
          }
          setGameState("results");
          setShowResults(true);
        }, 1500);
        return;
      }

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
  }, [game, cooldown]);

  if (!game) {
    navigate("/");
    return null;
  }

  const registerUrl = "https://sshortly.net/18839e8";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container px-4 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 flex items-center justify-center bg-primary rounded-lg hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5 text-primary-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">{game.title}</h1>
      </div>

      {/* Game Area */}
      <div className="container px-4 max-w-lg mx-auto">
        <div
          className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-border"
          style={{
            background: gameState === "crashed"
              ? "linear-gradient(to top, hsl(0 70% 20%), hsl(0 50% 10%))"
              : "linear-gradient(to top, hsl(220 60% 15%), hsl(220 80% 8%), hsl(260 50% 5%))",
          }}
        >
          {/* Stars background */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 23) % 70}%`,
                animationDelay: `${i * 0.2}s`,
                opacity: 0.4 + Math.random() * 0.4,
              }}
            />
          ))}

          {/* Multiplier display */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
            <div
              className={`text-4xl font-black tabular-nums ${
                gameState === "crashed" ? "text-destructive" : "text-primary"
              }`}
            >
              {multiplier.toFixed(2)}x
            </div>
          </div>

          {/* Collected counter */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-card/80 px-3 py-1 rounded-full">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-foreground font-bold text-sm">{totalCollected}</span>
          </div>

          {/* Plane */}
          {(gameState === "flying" || gameState === "crashed") && (
            <div
              className={`absolute left-1/2 -translate-x-1/2 transition-all duration-300 ${
                gameState === "crashed" ? "animate-bounce text-destructive" : "text-primary"
              }`}
              style={{ top: `${planeY}%` }}
            >
              <Plane
                className={`w-10 h-10 ${gameState === "crashed" ? "rotate-90" : "-rotate-45"}`}
                fill="currentColor"
              />
            </div>
          )}

          {/* Collectible rewards */}
          {gameState === "flying" &&
            rewards
              .filter((r) => !r.collected)
              .map((r) => (
                <button
                  key={r.id}
                  onClick={() => collectReward(r.id, r.value)}
                  className="absolute z-20 animate-pulse cursor-pointer hover:scale-125 transition-transform"
                  style={{ left: `${r.x}%`, top: `${r.y}%` }}
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-primary/20 rounded-full border-2 border-primary">
                    <span className="text-primary font-bold text-xs">+{r.value}</span>
                  </div>
                </button>
              ))}

          {/* Idle state */}
          {gameState === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <img
                src={game.image}
                alt={game.title}
                className="w-20 h-20 rounded-xl object-cover shadow-lg"
              />
              {cooldown > 0 ? (
                <div className="text-center">
                  <p className="text-muted-foreground text-sm mb-1">Próximo vôo em</p>
                  <p className="text-2xl font-mono font-bold text-primary">
                    {formatCooldown(cooldown)}
                  </p>
                </div>
              ) : (
                <Button
                  onClick={startGame}
                  className="bg-primary text-primary-foreground font-bold px-8 py-3 text-lg rounded-xl hover:bg-primary/90"
                >
                  🛫 DECOLAR
                </Button>
              )}
            </div>
          )}

          {/* Crashed overlay */}
          {gameState === "crashed" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <p className="text-3xl font-black text-destructive animate-pulse">CRASH!</p>
            </div>
          )}
        </div>

        {/* Game info */}
        <div className="mt-4 bg-card rounded-xl p-4 border border-border">
          <h3 className="text-foreground font-bold mb-2 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            Relatório de Ganhos
          </h3>
          {collectedRewards.length > 0 ? (
            <div className="space-y-1">
              {collectedRewards.map((val, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Recompensa #{i + 1}</span>
                  <span className="text-primary font-bold">+{val} Vôos Grátis</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 mt-2 flex justify-between font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-primary">{totalCollected} Vôos Grátis</span>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              {gameState === "idle"
                ? "Decole para começar a coletar recompensas!"
                : "Nenhuma recompensa coletada neste vôo."}
            </p>
          )}
        </div>
      </div>

      {/* Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent">
              {totalCollected > 0 ? "🎉 Parabéns! 🎉" : "✈️ Vôo Encerrado"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden shadow-lg">
              <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
            </div>
            {totalCollected > 0 ? (
              <>
                <p className="text-center text-lg font-semibold text-foreground">
                  Você coletou {totalCollected} Vôos Grátis!
                </p>
                <p className="text-center text-sm text-muted-foreground">
                  Multiplicador final: {multiplier.toFixed(2)}x
                </p>
                <a href={registerUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                  <Button className="w-full bg-gradient-to-r from-primary to-yellow-500 hover:from-primary/90 hover:to-yellow-500/90 text-white font-bold py-3 text-base">
                    Reivindicar Recompensas
                  </Button>
                </a>
              </>
            ) : (
              <>
                <p className="text-center text-foreground">
                  Você não coletou nenhuma recompensa neste vôo. Tente novamente em 24h!
                </p>
                <Button onClick={() => setShowResults(false)} variant="outline" className="w-full">
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
