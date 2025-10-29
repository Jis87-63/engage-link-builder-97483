import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Spribe" className="h-8 w-auto" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="hidden md:flex border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
          >
            ENTRAR
          </Button>
          <Button 
            className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold shadow-glow transition-all"
          >
            CADASTRE-SE
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden text-foreground">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};
