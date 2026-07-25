export function LogoIcon() {
  return (
    <div className="flex items-center gap-3 no-underline min-w-max mx-auto">
      <img
        alt="Logo oscuro"
        className="block dark:hidden w-auto h-10"
        src="/logos/logo-dark.png"
      />
      <img
        alt="Logo claro"
        className="hidden dark:block w-auto h-10"
        src="/logos/logo-light.png"
      />
      <span className="font-orbitron pt-4 font-semibold text-2xl leading-none">
        Parking Access
      </span>
    </div>
  );
}
