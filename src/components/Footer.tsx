import { Link } from "react-router-dom";
import { teamConfig } from "@/lib/data";
import { PFCLogo, PAYSLLogo } from "@/components/PFCLogo";
import prodigychainLogo from "@/assets/prodigychain-logo.png";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-border/50 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <PFCLogo size="sm" />
              <PAYSLLogo size="sm" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-foreground">{teamConfig.name}</h3>
              <p className="text-sm text-muted-foreground">
                {teamConfig.season} {teamConfig.sport} Season
              </p>
            </div>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/roster" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Roster
            </Link>
            <a href="https://www.westchasecolts.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Programs
            </a>
            <a href="mailto:info@westchasecolts.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </nav>

          {/* Powered By & Copyright */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Powered by</span>
              <img 
                src={prodigychainLogo} 
                alt="Prodigychain" 
                className="h-5 w-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              © {currentYear} {teamConfig.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
