import { Card } from "@/components/ui/card";
import { Rocket, Users, Award, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Rocket,
    title: "Micro-Funding for Student Startups",
    description: "Invest as little as PKR 100 to help student founders turn ideas into reality. No large capital needed—just belief in innovation.",
  },
  {
    icon: Users,
    title: "Verified University Investor Network",
    description: "Join a trusted community of students, faculty, and alumni. Every member is verified through university CMS/student ID.",
  },
  {
    icon: Award,
    title: "Transform Final-Year Projects into Ventures",
    description: "Give FYPs a second life. Support students in scaling their academic projects into sustainable businesses instead of abandoned submissions.",
  },
  {
    icon: TrendingUp,
    title: "Live Progress & Campus Leaderboards",
    description: "Track startup growth in real-time. Compete across universities to build the most innovative campus ecosystem.",
  },
];

const WhatWeDo = () => {
  return (
    <section className="py-24 px-4 bg-gradient-subtle">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            What Campus Invest Does
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
            Campus Invest connects ambitious student founders with supportive campus communities. We make it easy for students, faculty, and alumni to invest small amounts into verified student startups—giving founders the funding and visibility they need to succeed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 hover-lift border-2 hover:border-primary/50 transition-all duration-300 bg-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
