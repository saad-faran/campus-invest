import { Facebook, Twitter, Linkedin, Instagram, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t-2 border-border py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Main footer content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground">Campus Invest</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pakistan's first university-centered micro-investment platform. Empowering student entrepreneurs, one investment at a time.
            </p>
          </div>

          {/* For Founders */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">For Founders</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/pages/pages/founder-registration/founder-registration.html" className="hover:text-primary transition-colors">Register Startup</a></li>
              <li><a href="/" onClick={(e) => { e.preventDefault(); const el = document.getElementById('how-it-works'); el?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-primary transition-colors cursor-pointer">How It Works</a></li>
              <li><a href="/pages/pages/leaderboard/leaderboard.html" className="hover:text-primary transition-colors">Success Stories</a></li>
              <li><a href="/pages/pages/stats/stats.html" className="hover:text-primary transition-colors">Stats</a></li>
            </ul>
          </div>

          {/* For Investors */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">For Investors</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/pages/pages/investor-registration/investor-registration.html" className="hover:text-primary transition-colors">Start Investing</a></li>
              <li><a href="/pages/pages/startup-listings/startup-listings.html" className="hover:text-primary transition-colors">Browse Startups</a></li>
              <li><a href="/pages/pages/investment-guide/investment-guide.html" className="hover:text-primary transition-colors">Investment Guide</a></li>
              <li><a href="/pages/pages/leaderboard/leaderboard.html" className="hover:text-primary transition-colors">Leaderboard</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-primary transition-colors cursor-pointer">Home</a></li>
              <li><a href="/" onClick={(e) => { e.preventDefault(); const el = document.getElementById('partner-universities'); el?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-primary transition-colors cursor-pointer">Partner Universities</a></li>
              <li><a href="/pages/pages/stats/stats.html" className="hover:text-primary transition-colors">Statistics</a></li>
              <li><a href="/pages/pages/team/team.html" className="hover:text-primary transition-colors">Team</a></li>
              <li><a href="/" onClick={(e) => { e.preventDefault(); const el = document.getElementById('faqs'); el?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-primary transition-colors cursor-pointer">FAQs</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Campus Invest. All rights reserved.
          </p>

          {/* Social links */}
          <div className="flex gap-4">
            <a 
              href="https://www.facebook.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a 
              href="https://www.twitter.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="https://www.linkedin.com/in/saad-faran/" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="https://www.instagram.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="mailto:hello@campusinvest.pk" 
              className="w-10 h-10 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
