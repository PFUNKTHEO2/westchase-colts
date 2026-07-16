interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Westchase Colts crest — shield + horseshoe. Export names kept from the
 * PAYSL template (PFCLogo = club crest, PAYSLLogo = league/secondary mark)
 * so existing imports keep working.
 */
export function PFCLogo({ className = "", size = "md" }: LogoProps) {
  const dims = size === "sm" ? "h-10 w-10" : size === "md" ? "h-14 w-14" : "h-20 w-20";

  return (
    <div className={`${dims} ${className} flex-shrink-0`}>
      <svg viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Shield shape */}
        <path
          d="M40 2L6 18V50C6 68 40 88 40 88C40 88 74 68 74 50V18L40 2Z"
          fill="hsl(var(--primary))"
          fillOpacity="0.15"
          stroke="hsl(var(--primary))"
          strokeWidth="2.5"
        />
        {/* Inner shield border */}
        <path
          d="M40 8L12 22V48C12 63 40 82 40 82C40 82 68 63 68 48V22L40 8Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        {/* Horseshoe */}
        <path
          d="M30 38C30 30 34 24 40 24C46 24 50 30 50 38"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M30 38L29 42M50 38L51 42"
          stroke="hsl(var(--primary))"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Horseshoe nail holes */}
        <circle cx="32" cy="31" r="1.1" fill="hsl(var(--accent))" />
        <circle cx="36" cy="27.5" r="1.1" fill="hsl(var(--accent))" />
        <circle cx="40" cy="26.5" r="1.1" fill="hsl(var(--accent))" />
        <circle cx="44" cy="27.5" r="1.1" fill="hsl(var(--accent))" />
        <circle cx="48" cy="31" r="1.1" fill="hsl(var(--accent))" />
        {/* WESTCHASE text */}
        <text x="40" y="54" textAnchor="middle" fill="hsl(var(--primary))" fontFamily="'Bebas Neue', sans-serif" fontSize="8" fontWeight="bold" letterSpacing="1.5">
          WESTCHASE
        </text>
        {/* COLTS text */}
        <text x="40" y="65" textAnchor="middle" fill="hsl(var(--accent))" fontFamily="'Bebas Neue', sans-serif" fontSize="12" fontWeight="bold" letterSpacing="2.5">
          COLTS
        </text>
        {/* Year */}
        <text x="22" y="74" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontFamily="'Bebas Neue', sans-serif" fontSize="6">
          20
        </text>
        <text x="58" y="74" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontFamily="'Bebas Neue', sans-serif" fontSize="6">
          01
        </text>
        {/* Divider line */}
        <line x1="28" y1="72" x2="52" y2="72" stroke="hsl(var(--primary))" strokeWidth="0.5" strokeOpacity="0.5" />
      </svg>
    </div>
  );
}

/** Secondary mark — Pop Warner affiliation badge. */
export function PAYSLLogo({ className = "", size = "md" }: LogoProps) {
  const dims = size === "sm" ? "h-10 w-10" : size === "md" ? "h-14 w-14" : "h-20 w-20";

  return (
    <div className={`${dims} ${className} flex-shrink-0`}>
      <svg viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Shield shape */}
        <path
          d="M40 2L6 18V50C6 68 40 88 40 88C40 88 74 68 74 50V18L40 2Z"
          fill="hsl(var(--accent))"
          fillOpacity="0.1"
          stroke="hsl(var(--accent))"
          strokeWidth="2.5"
        />
        {/* Inner shield */}
        <path
          d="M40 8L12 22V48C12 63 40 82 40 82C40 82 68 63 68 48V22L40 8Z"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1"
          strokeOpacity="0.4"
        />
        {/* Football */}
        <ellipse cx="40" cy="31" rx="11" ry="7" fill="none" stroke="hsl(var(--accent))" strokeWidth="1.5" transform="rotate(-20 40 31)" />
        <path d="M36 33.5L44 28.5M38 34.8L38.7 33M42 27L42.7 25.4M39.4 31.9L40 30.3M40.7 30.6L41.3 29" stroke="hsl(var(--accent))" strokeWidth="1.1" strokeLinecap="round" />
        {/* POP WARNER text */}
        <text x="40" y="54" textAnchor="middle" fill="hsl(var(--accent))" fontFamily="'Bebas Neue', sans-serif" fontSize="9" fontWeight="bold" letterSpacing="1.5">
          POP WARNER
        </text>
        <text x="40" y="64" textAnchor="middle" fill="hsl(var(--accent))" fontFamily="'Bebas Neue', sans-serif" fontSize="7" letterSpacing="1">
          FOOTBALL &amp; CHEER
        </text>
        <line x1="28" y1="70" x2="52" y2="70" stroke="hsl(var(--accent))" strokeWidth="0.5" strokeOpacity="0.5" />
      </svg>
    </div>
  );
}
