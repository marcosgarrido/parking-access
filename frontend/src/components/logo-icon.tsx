const SIZES = {
  default: { img: "h-10", text: "text-2xl pt-4" },
  compact: { img: "h-8", text: "text-xl pt-3" },
} as const;

export function LogoIcon({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const size = SIZES[compact ? "compact" : "default"];

  return (
    <div
      className={`flex items-center gap-2 no-underline min-w-max ${className ?? ""}`}
    >
      <img
        alt="Logo oscuro"
        className={`block dark:hidden w-auto ${size.img}`}
        src="/logos/logo-dark.png"
      />
      <img
        alt="Logo claro"
        className={`hidden dark:block w-auto ${size.img}`}
        src="/logos/logo-light.png"
      />
      <span className={`font-orbitron font-semibold ${size.text} leading-none`}>
        Parking Access
      </span>
    </div>
  );
}
