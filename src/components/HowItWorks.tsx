import { FileCheck, Search, Wallet, TrendingUp } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FileCheck,
    title: "Founders Submit Their Startup",
    description: "Student founders register their startup or final-year project with detailed information. University administration verifies all submissions for authenticity and quality.",
  },
  {
    number: "02",
    icon: Search,
    title: "Investors Discover Opportunities",
    description: "Verified investors browse startups from their own university and beyond. View detailed profiles, business models, and funding goals before investing.",
  },
  {
    number: "03",
    icon: Wallet,
    title: "Invest Small, Impact Big",
    description: "Make micro-investments starting from PKR 100. Diversify across multiple startups or go all-in on your favorite. Track everything from your dashboard.",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Watch Startups Grow",
    description: "Receive real-time updates on milestones, progress reports, and growth metrics. Participate in mentorship and support your portfolio companies.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-4 bg-gradient-subtle">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            From idea to investment in four simple steps
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative flex gap-6 p-8 rounded-2xl bg-card border-2 border-border hover:border-primary/50 transition-all duration-300 shadow-soft hover:shadow-medium group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Step number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center shadow-medium">
                {step.number}
              </div>

              {/* Icon */}
              <div className="flex-shrink-0 mt-2">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3 flex-1">
                <h3 className="text-xl font-bold text-card-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
