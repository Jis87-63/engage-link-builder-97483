import { Star, Rocket, Ticket, Trophy } from "lucide-react";

const categories = [
  { id: "all", name: "Melhores jogos", icon: Star },
  { id: "crash", name: "Jogos de Crash", icon: Rocket },
  { id: "lottery", name: "Loteria", icon: Ticket },
  { id: "dividends", name: "Dividendos", icon: Trophy },
];

interface CategoryNavProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export const CategoryNav = ({ selectedCategory, onCategoryChange }: CategoryNavProps) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`flex flex-col items-center gap-2 min-w-[100px] p-4 rounded-xl transition-all group ${
            selectedCategory === category.id
              ? "bg-primary text-primary-foreground"
              : "bg-secondary hover:bg-secondary/80"
          }`}
        >
          <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${
            selectedCategory === category.id
              ? "bg-primary-foreground/20"
              : "bg-primary/10 group-hover:bg-primary/20"
          }`}>
            <category.icon className={`h-6 w-6 ${
              selectedCategory === category.id ? "text-primary-foreground" : "text-primary"
            }`} />
          </div>
          <span className={`text-xs text-center whitespace-nowrap ${
            selectedCategory === category.id ? "text-primary-foreground font-semibold" : "text-foreground"
          }`}>
            {category.name}
          </span>
        </button>
      ))}
    </div>
  );
};
