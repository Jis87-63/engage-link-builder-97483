import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Gamepad2 } from "lucide-react";
import { getCooldownRemaining, formatCooldown } from "@/lib/gameCooldown";
import { miniGames } from "@/pages/MiniGame";

export const MiniGameSection = () => {
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  useEffect(() => {
    const update = () => {
      const cd: Record<string, number> = {};
      miniGames.forEach((g) => {
        cd[g.id] = getCooldownRemaining(g.id);
      });
      setCooldowns(cd);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section>
      <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
        <Gamepad2 className="w-6 h-6 text-primary" />
        Mini Jogos
      </h2>
      <p className="text-muted-foreground text-xs mb-4">
        Voe e colete recompensas! Cada jogo pode ser jogado 1x a cada 24h.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {miniGames.map((game) => {
          const cd = cooldowns[game.id] || 0;
          const isLocked = cd > 0;

          return (
            <Link
              key={game.id}
              to={`/mini-jogo/${game.id}`}
              className="group relative overflow-hidden rounded-xl transition-all hover:scale-105"
              style={{
                background: "#161b22",
                border: `1px solid rgba(${game.accent}, 0.2)`,
                boxShadow: isLocked ? "none" : `0 0 15px rgba(${game.accent}, 0.1)`,
              }}
            >
              <div className="relative aspect-square">
                <img
                  src={game.image}
                  alt={game.title}
                  className={`w-full h-full object-cover ${isLocked ? "opacity-40 grayscale" : ""}`}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, rgba(14,17,23,0.95) 0%, rgba(14,17,23,0.3) 50%, transparent 100%)`,
                  }}
                />

                {isLocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: "rgba(14,17,23,0.7)" }}>
                    <Clock className="w-5 h-5 mb-1" style={{ color: `rgb(${game.accent})` }} />
                    <span className="text-[10px] font-mono font-bold" style={{ color: `rgb(${game.accent})` }}>
                      {formatCooldown(cd)}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
                  <p className="text-white text-xs font-bold truncate">{game.title}</p>
                  {!isLocked && (
                    <p className="text-[9px] mt-0.5" style={{ color: `rgb(${game.accent})` }}>
                      JOGAR AGORA
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
