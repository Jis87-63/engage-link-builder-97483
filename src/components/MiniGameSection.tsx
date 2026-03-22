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
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Gamepad2 className="w-6 h-6 text-primary" />
        Mini Jogos - Colete Recompensas
      </h2>
      <p className="text-muted-foreground text-sm mb-4">
        Voe e colete recompensas! Cada jogo pode ser jogado uma vez a cada 24 horas.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {miniGames.map((game) => {
          const cd = cooldowns[game.id] || 0;
          const isLocked = cd > 0;

          return (
            <Link
              key={game.id}
              to={`/mini-jogo/${game.id}`}
              className="group relative overflow-hidden rounded-xl bg-card border border-border transition-all hover:scale-105 hover:shadow-glow"
            >
              <div className="relative aspect-square">
                <img
                  src={game.image}
                  alt={game.title}
                  className={`w-full h-full object-cover ${isLocked ? "opacity-50 grayscale" : ""}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                
                {isLocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
                    <Clock className="w-5 h-5 text-primary mb-1" />
                    <span className="text-xs font-mono text-primary font-bold">
                      {formatCooldown(cd)}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-foreground text-xs font-bold text-center truncate">
                    {game.title}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
