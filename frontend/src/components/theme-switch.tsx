import { Button, useTheme } from "@heroui/react";
import { Icon } from "@iconify/react";

export function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme("system");
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      isIconOnly
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      size="md"
      variant="outline"
      onPress={() => setTheme(isDark ? "light" : "dark")}
    >
      <Icon className="size-4" icon={isDark ? "lucide:moon" : "lucide:sun"} />
    </Button>
  );
}
