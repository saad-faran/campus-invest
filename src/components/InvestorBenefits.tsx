import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp, Shield, Users, Award, BarChart3 } from "lucide-react";

const benefits = [
  {
    icon: DollarSign,
    title: "Start Small, Scale Big",
    description: "Invest from just PKR 100. No large capital required—build your portfolio gradually across multiple startups.",
  },
  {
    icon: TrendingUp,
    title: "Early Access to Innovation",
    description: "Get first access to groundbreaking student innovations before they hit the market. Be part of the next big thing.",
  },
  {
    icon: Shield,
    title: "Verified & Safe",
    description: "All startups are university-verified. We ensure authenticity and monitor progress to protect your investment.",
  },
  {
    icon: Users,
    title: "Build Your Network",
    description: "Connect with founders, other investors, and mentors. Grow your professional network within the university ecosystem.",
  },
  {
    icon: Award,
    title: "Recognition & Rewards",
    description: "Earn early supporter badges, leaderboard rankings, and exclusive perks from startups you support.",
  },
  {
    icon: BarChart3,
    title: "Track Your Impact",
    description: "Monitor real-time progress, milestones, and growth metrics. See exactly how your investment is making a difference.",
  },
];

const InvestorBenefits = () => {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Why Invest on Campus Invest?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join a community of forward-thinking investors supporting Pakistan's innovation ecosystem
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="p-6 hover-lift border-2 hover:border-primary/50 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Ready to start your investment journey?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/pages/pages/investor-registration/investor-registration.html"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary-light transition-colors"
            >
              Register as Investor
            </a>
            <a
              href="/pages/pages/investment-guide/investment-guide.html"
              className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-semibold hover:bg-secondary-glow transition-colors"
            >
              Read Investment Guide
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestorBenefits;

