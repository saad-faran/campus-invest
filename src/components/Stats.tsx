import { TrendingUp, Users, Building2, Rocket } from "lucide-react";

const stats = [
  {
    icon: Rocket,
    value: "50+",
    label: "Active Startups",
    description: "Student ventures seeking funding",
  },
  {
    icon: Users,
    value: "500+",
    label: "Verified Investors",
    description: "Students, faculty & alumni",
  },
  {
    icon: TrendingUp,
    value: "PKR 2M+",
    label: "Total Invested",
    description: "Funding student innovation",
  },
  {
    icon: Building2,
    value: "15+",
    label: "Partner Universities",
    description: "Across Pakistan",
  },
];

const Stats = () => {
  return (
    <section className="py-24 px-4 gradient-hero relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(255,255,255,0.08),transparent_50%)]" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Building Pakistan's Startup Ecosystem
          </h2>
          <p className="text-lg text-primary-foreground/90">
            Empowering the next generation of entrepreneurs through micro-investments and mentorship
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center space-y-4 p-6 rounded-2xl bg-background/10 backdrop-blur-sm border-2 border-primary-foreground/20 hover:bg-background/20 transition-all duration-300 hover-lift"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 rounded-xl bg-background/20 flex items-center justify-center mx-auto">
                <stat.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="text-5xl font-bold text-primary-foreground">
                {stat.value}
              </div>
              <div>
                <div className="text-lg font-semibold text-primary-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-primary-foreground/80">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
