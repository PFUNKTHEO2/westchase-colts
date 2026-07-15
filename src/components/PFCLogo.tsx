interface PFCLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PFCLogo({ className = "", size = "md" }: PFCLogoProps) {
  const dims = size === "sm" ? "h-10 w-10" : size === "md" ? "h-14 w-14" : "h-20 w-20";
  const textSize = size === "sm" ? "text-[5px]" : size === "md" ? "text-[7px]" : "text-[10px]";
  const mainText = size === "sm" ? "text-[8px]" : size === "md" ? "text-[11px]" : "text-[16px]";

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
        {/* Soccer ball icon */}
        <circle cx="40" cy="32" r="8" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" />
        <path
          d="M40 24L42 28H38L40 24Z M40 40L38 36H42L40 40Z M32 32L36 30V34L32 32Z M48 32L44 34V30L48 32Z"
          fill="hsl(var(--primary))"
          fillOpacity="0.8"
        />
        {/* PFLUGERVILLE text */}
        <text x="40" y="52" textAnchor="middle" fill="hsl(var(--primary))" fontFamily="'Bebas Neue', sans-serif" fontSize="7" fontWeight="bold" letterSpacing="1.5">
          PFLUGERVILLE
        </text>
        {/* FC text */}
        <text x="40" y="62" textAnchor="middle" fill="hsl(var(--accent))" fontFamily="'Bebas Neue', sans-serif" fontSize="12" fontWeight="bold" letterSpacing="2">
          FC
        </text>
        {/* Year */}
        <text x="22" y="72" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontFamily="'Bebas Neue', sans-serif" fontSize="6">
          19
        </text>
        <text x="58" y="72" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontFamily="'Bebas Neue', sans-serif" fontSize="6">
          82
        </text>
        {/* Divider line */}
        <line x1="28" y1="70" x2="52" y2="70" stroke="hsl(var(--primary))" strokeWidth="0.5" strokeOpacity="0.5" />
      </svg>
    </div>
  );
}

export function PAYSLLogo({ className = "", size = "md" }: PFCLogoProps) {
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
        {/* Soccer ball */}
        <circle cx="40" cy="32" r="8" fill="none" stroke="hsl(var(--accent))" strokeWidth="1.5" />
        <path
          d="M40 24L42 28H38L40 24Z M40 40L38 36H42L40 40Z M32 32L36 30V34L32 32Z M48 32L44 34V30L48 32Z"
          fill="hsl(var(--accent))"
          fillOpacity="0.8"
        />
        {/* PAYSL text */}
        <text x="40" y="54" textAnchor="middle" fill="hsl(var(--accent))" fontFamily="'Bebas Neue', sans-serif" fontSize="11" fontWeight="bold" letterSpacing="2">
          PAYSL
        </text>
        {/* Year */}
        <text x="22" y="68" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontFamily="'Bebas Neue', sans-serif" fontSize="6">
          19
        </text>
        <text x="58" y="68" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontFamily="'Bebas Neue', sans-serif" fontSize="6">
          82
        </text>
        <line x1="28" y1="66" x2="52" y2="66" stroke="hsl(var(--accent))" strokeWidth="0.5" strokeOpacity="0.5" />
      </svg>
    </div>
  );
}
