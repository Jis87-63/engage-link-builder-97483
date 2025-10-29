import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import promo1 from "@/assets/promo-1.webp";
import promo2 from "@/assets/promo-2.webp";
import promo3 from "@/assets/promo-3.webp";
import promo4 from "@/assets/promo-4.webp";
import promo5 from "@/assets/promo-5.webp";
import promo6 from "@/assets/promo-6.webp";
import promo7 from "@/assets/promo-7.webp";
import promo8 from "@/assets/promo-8.webp";

const promoImages = [
  { id: 1, src: promo1, alt: "Oferta de Boas-Vindas - Ganhe 20 Apostas Grátis" },
  { id: 2, src: promo2, alt: "PrideBet Roda da Sorte - Gira Grátis" },
  { id: 3, src: promo3, alt: "Recompensas - 100 Giros Grátis Mensais" },
  { id: 4, src: promo4, alt: "Maza Jackpot Soccer 13" },
  { id: 5, src: promo5, alt: "Promoção da Rede - 75,000.00 MT" },
  { id: 6, src: promo6, alt: "Números da Sorte em Dinheiro" },
  { id: 7, src: promo7, alt: "Desafio do Aviator - 50,000 MT" },
  { id: 8, src: promo8, alt: "Spins Splash - Freebets Diárias" },
];

export const HeroBanner = () => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 10000,
            stopOnInteraction: true,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {promoImages.map((promo) => (
            <CarouselItem key={promo.id}>
              <div className="relative overflow-hidden rounded-2xl shadow-xl aspect-[16/6]">
                <img
                  src={promo.src}
                  alt={promo.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
      
      <div className="flex justify-center gap-2 mt-4">
        {promoImages.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-2 rounded-full transition-all ${
              index === current
                ? "w-8 bg-primary"
                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
