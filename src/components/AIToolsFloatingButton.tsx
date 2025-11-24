import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Calculator, X } from "lucide-react";

const AIToolsFloatingButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show after 3 seconds
    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem('ai-tools-banner-dismissed');
      // Check if dismissed more than 24 hours ago (reset after 24h)
      if (dismissed) {
        const dismissedTime = parseInt(dismissed);
        const now = Date.now();
        const hoursSinceDismissed = (now - dismissedTime) / (1000 * 60 * 60);
        
        // Show again if dismissed more than 24 hours ago
        if (hoursSinceDismissed > 24) {
          localStorage.removeItem('ai-tools-banner-dismissed');
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    const aiSection = document.getElementById('ai-tools-section');
    if (aiSection) {
      aiSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    handleDismiss();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    // Store timestamp instead of just 'true' to allow reset after 24h
    localStorage.setItem('ai-tools-banner-dismissed', Date.now().toString());
  };

  if (isDismissed || !isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-slide-up">
      <div className="relative bg-card border-2 border-primary rounded-xl shadow-2xl p-4 max-w-sm">
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-start gap-3 pr-6">
          <div className="flex items-center gap-1 bg-primary/10 p-2 rounded-lg">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <Calculator className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-sm text-foreground mb-1">
              Try AI-Powered Tools
            </div>
            <div className="text-xs text-muted-foreground mb-3">
              Transform your FYP & calculate funding
            </div>
            <Button
              onClick={handleClick}
              size="sm"
              variant="default"
              className="w-full text-xs"
            >
              Explore AI Tools
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIToolsFloatingButton;

