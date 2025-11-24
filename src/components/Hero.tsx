import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Sparkles, Calculator } from "lucide-react";
import heroImage from "@/assets/images/hero/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden gradient-hero pt-24 pb-32 px-4">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.08),transparent_50%)]" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-primary-foreground space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-background/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-foreground/20">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Pakistan's First University Investment Platform</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              Fund the Next Generation of{" "}
              <span className="relative inline-block">
                Innovators
                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C50 2 150 2 198 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
                </svg>
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-primary-foreground/90 leading-relaxed max-w-xl">
              Micro-investments starting from PKR 100. Support student startups from verified universities. Build Pakistan's innovation economy—one campus at a time.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                variant="hero" 
                size="lg" 
                className="group"
                onClick={() => window.location.href = '/pages/pages/startup-listings/startup-listings.html'}
              >
                Explore Startups
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                className="group"
                onClick={() => window.location.href = '/pages/pages/investor-registration/investor-registration.html'}
              >
                Start Investing
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* AI Tools CTA Banner */}
            <div className="mt-8 p-4 bg-background/20 backdrop-blur-md rounded-xl border-2 border-primary-foreground/30 animate-pulse hover:animate-none hover:border-primary-foreground/50 transition-all cursor-pointer group"
                 onClick={() => {
                   const aiSection = document.getElementById('ai-tools-section');
                   if (aiSection) {
                     aiSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                   }
                 }}>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary animate-spin-slow" />
                  <Calculator className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-primary-foreground">Try Our AI-Powered Tools</div>
                  <div className="text-sm text-primary-foreground/80">Transform your FYP into a startup & calculate funding needs</div>
                </div>
                <ArrowRight className="w-5 h-5 text-primary-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-primary-foreground/20">
              <div>
                <div className="text-3xl font-bold">15+</div>
                <div className="text-sm text-primary-foreground/80">Partner Universities</div>
              </div>
              <div>
                <div className="text-3xl font-bold">PKR 2M+</div>
                <div className="text-sm text-primary-foreground/80">Funded</div>
              </div>
              <div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm text-primary-foreground/80">Active Investors</div>
              </div>
            </div>
          </div>

          {/* Right Image - Hero image */}
          <div className="relative animate-fade-in delay-200">
            <div className="aspect-[4/3] rounded-2xl bg-background/10 backdrop-blur-sm border-2 border-primary-foreground/20 overflow-hidden shadow-strong">
              <img 
                src={heroImage} 
                alt="Students collaborating on innovative startup projects" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating decoration */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-secondary rounded-full opacity-20 animate-float" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
