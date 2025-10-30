import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroBanner } from "@/components/HeroBanner";
import { CategoryNav } from "@/components/CategoryNav";
import { GameCard } from "@/components/GameCard";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
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

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredGames = games.filter((game) => {
    if (selectedCategory === "all") return game.category === "crash";
    if (selectedCategory === "crash") return game.category === "crash";
    if (selectedCategory === "lottery") return game.category === "lottery";
    return true;
  });

  const getCategoryTitle = () => {
    switch (selectedCategory) {
      case "lottery":
        return "Jogos de Loteria";
      case "crash":
        return "Jogos de Crash";
      default:
        return "Jogos Populares";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="container px-4 py-6 space-y-8">
        <HeroBanner />
        
        <section>
          <CategoryNav 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">{getCategoryTitle()}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredGames.map((game) => (
              <GameCard
                key={game.title}
                title={game.title}
                image={game.image}
                color={game.color}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default Index;
