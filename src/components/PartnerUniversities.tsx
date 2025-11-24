import nustLogo from "@/assets/images/universities/nust.png";
import lumsLogo from "@/assets/images/universities/lums.png";
import uetLogo from "@/assets/images/universities/uet.png";
import fastLogo from "@/assets/images/universities/fast.png";
import ibaLogo from "@/assets/images/universities/iba.png";
import gikiLogo from "@/assets/images/universities/giki.png";

const universities = [
  {
    name: "NUST",
    website: "https://nust.edu.pk",
    logo: nustLogo,
  },
  {
    name: "LUMS",
    website: "https://lums.edu.pk",
    logo: lumsLogo,
  },
  {
    name: "UET Lahore",
    website: "https://uet.edu.pk",
    logo: uetLogo,
  },
  {
    name: "FAST-NUCES",
    website: "https://nu.edu.pk",
    logo: fastLogo,
  },
  {
    name: "IBA Karachi",
    website: "https://iba.edu.pk",
    logo: ibaLogo,
  },
  {
    name: "GIKI",
    website: "https://giki.edu.pk",
    logo: gikiLogo,
  },
];

const PartnerUniversities = () => {
  return (
    <section id="partner-universities" className="py-24 px-4 bg-muted/30 border-y-2 border-border">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Trusted by Leading Universities
          </h2>
          <p className="text-lg text-muted-foreground">
            Partner institutions driving Pakistan's innovation ecosystem
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {universities.map((university, index) => (
            <a
              key={index}
              href={university.website}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center p-6 rounded-xl bg-card border-2 border-border hover:border-primary/50 transition-all duration-300 hover-lift"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* University Logo */}
              <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                {university.logo ? (
                  <img 
                    src={university.logo} 
                    alt={`${university.name} logo`}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="text-center text-xs text-muted-foreground/50">
                    {university.name} logo<br/>
                    Place at: src/assets/images/universities/{university.name.toLowerCase().replace(/\s+/g, '-')}.png
                  </div>
                )}
              </div>
              <span className="text-sm font-semibold text-center text-card-foreground group-hover:text-primary transition-colors">
                {university.name}
              </span>
            </a>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Is your university interested in joining?{" "}
            <a href="mailto:hello@campusinvest.pk" className="text-primary font-semibold hover:underline">
              Get in touch
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PartnerUniversities;
