import { AlertCircle, TrendingDown, Lock, Eye } from "lucide-react";

const problems = [
  {
    icon: Lock,
    title: "Students lack early-stage funding",
    description: "Most students can't access micro-funding for prototypes and MVPs, limiting their ability to validate ideas.",
  },
  {
    icon: TrendingDown,
    title: "FYPs end with graduation",
    description: "Thousands of innovative final-year projects are abandoned because there's no clear path to market.",
  },
  {
    icon: AlertCircle,
    title: "No formal investment channel for alumni",
    description: "Faculty and alumni want to support campus innovation but lack a structured, transparent platform.",
  },
  {
    icon: Eye,
    title: "Limited visibility for campus startups",
    description: "Pakistan has no national system to showcase university-level startup activity and foster healthy competition.",
  },
];

const WhyItMatters = () => {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Why It Matters
          </h2>
          <p className="text-lg text-muted-foreground">
            The challenges facing student entrepreneurs today
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className="flex gap-4 p-6 rounded-xl bg-card border-2 border-border hover:border-destructive/30 transition-all duration-300 shadow-soft hover:shadow-medium"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <problem.icon className="w-6 h-6 text-destructive" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-card-foreground">
                  {problem.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyItMatters;
