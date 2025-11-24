import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Users } from "lucide-react";
import ecochargeImage from "@/assets/images/startups/ecocharge.jpg";
import skillbridgeImage from "@/assets/images/startups/skillbridge.jpg";
import agrisenseImage from "@/assets/images/startups/agrisense.jpg";

const startups = [
  {
    name: "EcoCharge",
    category: "Clean Energy",
    university: "NUST",
    description: "Solar-powered charging stations for campus devices with IoT monitoring",
    target: 50000,
    raised: 38500,
    investors: 47,
    daysLeft: 12,
    image: ecochargeImage,
  },
  {
    name: "SkillBridge",
    category: "EdTech",
    university: "LUMS",
    description: "Peer-to-peer skill exchange platform connecting students across universities",
    target: 40000,
    raised: 31200,
    investors: 38,
    daysLeft: 18,
    image: skillbridgeImage,
  },
  {
    name: "AgriSense",
    category: "AgriTech",
    university: "UET",
    description: "AI-based crop monitoring system for small-scale farmers",
    target: 60000,
    raised: 22800,
    investors: 29,
    daysLeft: 25,
    image: agrisenseImage,
  },
];

const FeaturedStartups = () => {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Featured Startups
          </h2>
          <p className="text-lg text-muted-foreground">
            Support innovative student-led ventures making real impact
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {startups.map((startup, index) => {
            const percentage = Math.round((startup.raised / startup.target) * 100);
            
            return (
              <Card 
                key={index}
                className="overflow-hidden hover-lift border-2 hover:border-primary/50 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Startup Image */}
                <div className="aspect-video bg-gradient-to-br from-primary/5 to-primary/20 border-b overflow-hidden">
                  {startup.image ? (
                    <img 
                      src={startup.image} 
                      alt={`${startup.name} - ${startup.description}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-muted-foreground/50 text-xs">
                        {startup.name} thumbnail<br/>600x400px<br/>
                        Place at: src/assets/images/startups/{startup.name.toLowerCase()}.jpg
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-card-foreground mb-1">
                        {startup.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{startup.university}</p>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {startup.category}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {startup.description}
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-foreground">
                        PKR {startup.raised.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">
                        of PKR {startup.target.toLocaleString()}
                      </span>
                    </div>
                    
                    <Progress value={percentage} className="h-2" />
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {startup.investors} investors
                      </span>
                      <span className="font-medium text-primary">
                        {startup.daysLeft} days left
                      </span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full group"
                    onClick={() => window.location.href = '/pages/pages/startup-listings/startup-listings.html'}
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12 flex flex-wrap justify-center gap-4">
          <Button 
            size="lg" 
            variant="secondary"
            className="group"
            onClick={() => window.location.href = '/pages/pages/startup-listings/startup-listings.html'}
          >
            Explore All Startups
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="bg-background/10 backdrop-blur-sm text-foreground border-foreground/30 hover:bg-foreground hover:text-background group"
            onClick={() => window.location.href = '/pages/pages/founder-registration/founder-registration.html'}
          >
            Register Your Startup
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedStartups;
