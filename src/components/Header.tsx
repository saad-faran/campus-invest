import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a 
            href="/" 
            className="text-2xl font-bold text-primary hover:text-primary-light transition-colors"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Campus Invest
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("partner-universities")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Partner Universities
            </button>
            <a
              href="/pages/pages/startup-listings/startup-listings.html"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Startups
            </a>
            <a
              href="/pages/pages/leaderboard/leaderboard.html"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Leaderboard
            </a>
            <Button
              variant="outline"
              size="sm"
              className="bg-background/10 backdrop-blur-sm text-foreground border-foreground/30 hover:bg-foreground hover:text-background"
              onClick={() => window.location.href = '/pages/pages/investor-registration/investor-registration.html'}
            >
              Start Investing
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => window.location.href = '/pages/pages/founder-registration/founder-registration.html'}
            >
              Register Your Startup
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-4 border-t">
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="block w-full text-left text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("partner-universities")}
              className="block w-full text-left text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
            >
              Partner Universities
            </button>
            <a
              href="/pages/pages/startup-listings/startup-listings.html"
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
            >
              Startups
            </a>
            <a
              href="/pages/pages/leaderboard/leaderboard.html"
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
            >
              Leaderboard
            </a>
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-background/10 backdrop-blur-sm text-foreground border-foreground/30 hover:bg-foreground hover:text-background"
              onClick={() => window.location.href = '/pages/pages/investor-registration/investor-registration.html'}
            >
              Start Investing
            </Button>
            <Button
              variant="default"
              size="sm"
              className="w-full"
              onClick={() => window.location.href = '/pages/pages/founder-registration/founder-registration.html'}
            >
              Register Your Startup
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

