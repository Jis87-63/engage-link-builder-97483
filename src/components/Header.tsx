import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import lionLogo from "@/assets/lion-logo.png";
import vodacomImg from "@/assets/vodacom.png";
import mpesaEmolaImg from "@/assets/mpesa-emola.png";

export const Header = () => {
  const registerUrl = "https://sshortly.net/18839e8";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <img src={lionLogo} alt="Logo" className="h-10 w-10 rounded-full" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent">
                FllopsBet
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="hidden md:flex bg-black border text-white hover:bg-black/90 hover:border-white/50 transition-all"
              style={{ borderWidth: '1px' }}
              asChild
            >
              <a href={registerUrl} target="_blank" rel="noopener noreferrer">
                ENTRAR
              </a>
            </Button>
            <Button 
              className="bg-black border text-white hover:bg-black/90 hover:border-white/50 text-xs font-semibold px-4 py-2 h-8 transition-all"
              style={{ borderWidth: '1px' }}
              asChild
            >
              <a href={registerUrl} target="_blank" rel="noopener noreferrer">
                REGISTRAR
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden text-foreground">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>
      
      {/* Payment Methods Section */}
      <div className="w-full bg-background border-b border-border py-3">
        <div className="container px-4">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="text-sm text-muted-foreground font-medium">Aceitar pagamentos via</span>
            <div className="flex items-center gap-3">
              <img src={mpesaEmolaImg} alt="M-Pesa e e-Mola" className="h-8 md:h-10" />
              <img src={vodacomImg} alt="Vodacom" className="h-8 md:h-10" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
