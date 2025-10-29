import { Search, Star, Gift, Mail, Tag } from "lucide-react";

const navItems = [
  { name: "Pesquisar", icon: Search },
  { name: "Os Meus Jogos", icon: Star },
  { name: "Recompensas", icon: Gift },
  { name: "Caixa de Entrada", icon: Mail },
  { name: "Promoções", icon: Tag },
];

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item, index) => (
          <button
            key={item.name}
            className={`flex flex-col items-center justify-center gap-1 min-w-[60px] h-full transition-colors ${
              index === 2 ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className={index === 2 ? "bg-primary rounded-lg p-2" : ""}>
              <item.icon className={`h-5 w-5 ${index === 2 ? "text-primary-foreground" : ""}`} />
            </div>
            <span className="text-[10px] text-center leading-tight">{item.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
