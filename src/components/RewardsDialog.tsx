import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import aviatorImg from "@/assets/aviator.webp";
import aeroImg from "@/assets/aero.webp";
import aviabetImg from "@/assets/aviabet.webp";
import aviamastersImg from "@/assets/aviamasters.webp";

const rewards = [
  { amount: 10, text: "Você ganhou 10 Vôos Grátis!" },
  { amount: 20, text: "Você ganhou 20 Vôos Grátis!" },
  { amount: 30, text: "Você ganhou 30 Vôos Grátis!" },
  { amount: 50, text: "Você ganhou 50 Vôos Grátis!" },
];

const gameImages = [aviatorImg, aeroImg, aviabetImg, aviamastersImg];

interface RewardsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RewardsDialog = ({ open, onOpenChange }: RewardsDialogProps) => {
  const [reward] = useState(() => {
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
    const randomImage = gameImages[Math.floor(Math.random() * gameImages.length)];
    return { ...randomReward, image: randomImage };
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent">
            🎉 Parabéns! 🎉
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden shadow-lg">
            <img 
              src={reward.image} 
              alt="Jogo" 
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-center text-lg font-semibold text-foreground">
            {reward.text}
          </p>
          <Button 
            onClick={() => onOpenChange(false)}
            className="w-full bg-gradient-to-r from-primary to-yellow-500 hover:from-primary/90 hover:to-yellow-500/90 text-white font-bold py-3 text-base"
          >
            Reivindique Já
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
