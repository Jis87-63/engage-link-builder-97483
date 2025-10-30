import { Link } from "react-router-dom";

interface GameCardProps {
  title: string;
  image: string;
  color: string;
}

export const GameCard = ({ title, image, color }: GameCardProps) => {
  const gameUrl = `/jogo/${title.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <Link
      to={gameUrl}
      className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-card transition-all hover:scale-105 hover:shadow-glow"
    >
      <div className="relative h-full w-full">
        <img 
          src={image} 
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
      </div>
    </Link>
  );
};
