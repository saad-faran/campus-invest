import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-24 px-4 bg-foreground relative overflow-hidden">
      {/* Decorative gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(37,99,71,0.3),transparent_50%)]" />
      
      <div className="container mx-auto max-w-4xl text-center relative z-10 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 bg-background/10 backdrop-blur-sm px-4 py-2 rounded-full border border-background/20 mb-8">
          <Sparkles className="w-4 h-4 text-background" />
          <span className="text-sm font-medium text-background">Join the Movement</span>
        </div>

        <h2 className="text-4xl lg:text-5xl font-bold text-background mb-6">
          Ready to Shape Pakistan's Future?
        </h2>
        
        <p className="text-xl text-background/90 leading-relaxed mb-12 max-w-2xl mx-auto">
          Whether you're a founder with a groundbreaking idea or an investor looking to support campus innovation, Campus Invest is your platform.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            size="lg" 
            variant="secondary" 
            className="group"
            onClick={() => window.location.href = '/pages/pages/investor-registration/investor-registration.html'}
          >
            Start Investing Today
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-background/10 backdrop-blur-sm text-background border-background/30 hover:bg-background hover:text-foreground"
            onClick={() => window.location.href = '/pages/pages/founder-registration/founder-registration.html'}
          >
            Register Your Startup
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 pt-8 border-t border-background/20">
          <div className="grid md:grid-cols-3 gap-8 text-background/90">
            <div>
              <div className="text-2xl font-bold text-background mb-1">Verified Safe</div>
              <div className="text-sm">University-backed verification</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-background mb-1">Start Small</div>
              <div className="text-sm">Invest from PKR 100</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-background mb-1">Full Transparency</div>
              <div className="text-sm">Track every rupee</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
