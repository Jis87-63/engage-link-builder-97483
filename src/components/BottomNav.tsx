import { Star, Gift, Tag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { RewardsDialog } from "./RewardsDialog";

const navItems = [
  { name: "Os Meus Jogos", icon: Star, path: "/", isLink: true },
  { name: "Recompensas", icon: Gift, path: "/", isLink: false },
  { name: "Promoções", icon: Tag, path: "/promocoes", isLink: true },
];

export const BottomNav = () => {
  const location = useLocation();
  const [rewardsOpen, setRewardsOpen] = useState(false);
  
  return (
    <>
      <RewardsDialog open={rewardsOpen} onOpenChange={setRewardsOpen} />
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path && item.path !== "/" || 
                            (index === 1 && location.pathname === "/");
            
            if (item.isLink) {
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex flex-col items-center justify-center gap-1 min-w-[60px] h-full transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className={isActive ? "bg-primary rounded-lg p-2" : ""}>
                    <item.icon className={`h-5 w-5 ${isActive ? "text-primary-foreground" : ""}`} />
                  </div>
                  <span className="text-[10px] text-center leading-tight">{item.name}</span>
                </Link>
              );
            } else {
              return (
                <button
                  key={item.name}
                  onClick={() => setRewardsOpen(true)}
                  className={`flex flex-col items-center justify-center gap-1 min-w-[60px] h-full transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className={isActive ? "bg-primary rounded-lg p-2" : ""}>
                    <item.icon className={`h-5 w-5 ${isActive ? "text-primary-foreground" : ""}`} />
                  </div>
                  <span className="text-[10px] text-center leading-tight">{item.name}</span>
                </button>
              );
            }
          })}
        </div>
      </nav>
    </>
  );
};
