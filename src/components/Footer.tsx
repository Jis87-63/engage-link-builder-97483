import vodacomImg from "@/assets/vodacom.png";
import mpesaEmolaImg from "@/assets/mpesa-emola.png";

export const Footer = () => {
  return (
    <footer className="w-full bg-background border-t border-border py-8 mt-12">
      <div className="container px-4 space-y-6">
        {/* Payment Methods */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span className="text-sm text-muted-foreground font-medium">Aceitar pagamentos via</span>
          <div className="flex items-center gap-3">
            <img src={mpesaEmolaImg} alt="M-Pesa e e-Mola" className="h-8 md:h-10" />
            <img src={vodacomImg} alt="Vodacom" className="h-8 md:h-10" />
          </div>
        </div>

        {/* Age Restriction */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Não é permitido a menores de 18 anos jogar. Jogue com responsabilidade.
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            © Todos os direitos reservados 2023 & 2025 FllopsBet
          </p>
        </div>
      </div>
    </footer>
  );
};
