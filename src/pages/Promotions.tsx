import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import promo1 from "@/assets/promo-1.webp";
import promo2 from "@/assets/promo-2.webp";
import promo7 from "@/assets/promo-7.webp";
import promo8 from "@/assets/promo-8.webp";

const promotions = [
  {
    id: 1,
    title: "1ª Oferta de Depósito",
    image: promo1,
    description: "Oferta De Boas Vindas! Ganhe 20 APOSTAS GRÁTIS no seu 1º depósito de 15 MT e mais!",
  },
  {
    id: 2,
    title: "2ª Oferta de Depósito",
    image: promo2,
    description: "Deposite 20 MT e ganhe 20 APOSTAS GRÁTIS no Aviator!",
  },
  {
    id: 3,
    title: "Desafio do Aviator",
    image: promo7,
    description: "O teu céu, o teu dinheiro! 200 vencedores vão partilhar 50,000 MT em Apostas Grátis. A Corrida do Aviator decorre de quinta a sábado. Serás um dos Jogadores do Topo?",
  },
  {
    id: 4,
    title: "Spin$ Splash",
    image: promo8,
    description: "A melhor recompensa, onde o jogo sempre te dá mais! Gire e Ganhe Freebets Diárias. Mais diversão, mais prémios, mais emoção todos os dias!",
  },
];

const Promotions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="container px-4 py-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-card hover:bg-accent transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold text-foreground">Promoções</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {promotions.map((promo) => (
            <div 
              key={promo.id}
              className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-[16/7] overflow-hidden">
                <img 
                  src={promo.image} 
                  alt={promo.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 space-y-2">
                <h2 className="text-base font-bold text-foreground">{promo.title}</h2>
                <p className="text-muted-foreground text-xs leading-snug">
                  {promo.description}
                </p>
                <button className="w-full bg-primary text-primary-foreground font-semibold text-xs py-2 rounded-lg hover:opacity-90 transition-opacity">
                  MAIS INFORMAÇÕES
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Promotions;
