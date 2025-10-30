import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import aeroImg from "@/assets/aero.webp";
import aero2Img from "@/assets/aero-2.webp";
import airbossImg from "@/assets/airboss.webp";
import aviImg from "@/assets/avi.webp";
import aviaRushImg from "@/assets/avia-rush.webp";
import aviabetImg from "@/assets/aviabet.webp";
import aviamastersImg from "@/assets/aviamasters.webp";
import aviatorImg from "@/assets/aviator.webp";
import chickenRouteImg from "@/assets/chicken-route.webp";
import islottoImg from "@/assets/islotto.webp";
import uk49LunchtimeImg from "@/assets/uk49-lunchtime.webp";
import uk49TeatimeImg from "@/assets/uk49-teatime.webp";
import ukHealthLotteryImg from "@/assets/uk-health-lottery.webp";
import ukLottoImg from "@/assets/uk-lotto.webp";
import ukThunderballImg from "@/assets/uk-thunderball.webp";
import spacemanImg from "@/assets/spaceman.webp";

const games = [
  { title: "Aero", image: aeroImg, color: "#dc2626", category: "crash" },
  { title: "AviaBET", image: aviabetImg, color: "#ff1744", category: "crash" },
  { title: "Avia Masters", image: aviamastersImg, color: "#0ea5e9", category: "crash" },
  { title: "Avi", image: aviImg, color: "#eab308", category: "crash" },
  { title: "Air Boss", image: airbossImg, color: "#06b6d4", category: "crash" },
  { title: "Aviator", image: aviatorImg, color: "#dc2626", category: "crash" },
  { title: "Avia Rush", image: aviaRushImg, color: "#6366f1", category: "crash" },
  { title: "Chicken Route", image: chickenRouteImg, color: "#06b6d4", category: "crash" },
  { title: "Aero 2", image: aero2Img, color: "#8b5cf6", category: "crash" },
  { title: "Spaceman", image: spacemanImg, color: "#7c3aed", category: "crash" },
  { title: "iSLotto", image: islottoImg, color: "#f59e0b", category: "lottery" },
  { title: "UK 49's Lunchtime", image: uk49LunchtimeImg, color: "#3b82f6", category: "lottery" },
  { title: "UK 49's Teatime", image: uk49TeatimeImg, color: "#3b82f6", category: "lottery" },
  { title: "UK Health Lottery", image: ukHealthLotteryImg, color: "#ef4444", category: "lottery" },
  { title: "UK Lotto", image: ukLottoImg, color: "#ec4899", category: "lottery" },
  { title: "UK Thunderball", image: ukThunderballImg, color: "#f97316", category: "lottery" },
];

const GameDetails = () => {
  const { gameTitle } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const game = games.find(g => g.title.toLowerCase().replace(/\s+/g, '-') === gameTitle);
  
  if (!game) {
    navigate('/');
    return null;
  }

  const registerUrl = "https://sshortly.net/18839e8";

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container px-4 py-4">
        <button 
          onClick={() => navigate('/')}
          className="w-12 h-12 flex items-center justify-center bg-primary rounded-lg hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="w-6 h-6 text-primary-foreground" />
        </button>
      </div>

      {/* Game Content */}
      <div className="container px-4 py-6 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-foreground mb-8">
          {game.title}
        </h1>

        {/* Game Image */}
        <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 border-2 border-border">
          <img 
            src={game.image} 
            alt={game.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Add to Favorites */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="w-full flex items-center justify-center gap-2 text-lg text-foreground mb-6 py-2 hover:opacity-80 transition-opacity"
        >
          <span>Adicionar aos meus jogos</span>
          <Heart 
            className={`w-6 h-6 ${isFavorite ? 'fill-primary text-primary' : 'text-primary'}`} 
          />
        </button>

        {/* Action Buttons */}
        <div className="space-y-4">
          <a 
            href={registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button 
              className="w-full h-14 text-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
            >
              JOGAR
            </Button>
          </a>
          
          <a 
            href={registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button 
              variant="outline"
              className="w-full h-14 text-xl font-bold bg-[#8B2E2E] hover:bg-[#8B2E2E]/90 text-primary border-2 border-primary rounded-xl"
            >
              PRATICAR
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
