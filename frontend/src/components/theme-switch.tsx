import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";

export function ThemeSwitch() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark((prev) => !prev);
  };

  return (
    <Button
      isIconOnly
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      size="md"
      variant="outline"
      onPress={toggleTheme}
    >
      <Icon className="size-4" icon={isDark ? "lucide:moon" : "lucide:sun"} />
    </Button>
  );
}
