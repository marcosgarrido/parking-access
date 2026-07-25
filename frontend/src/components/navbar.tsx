import { Button, Chip, toast, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import type { AppRole } from "@parking-access/schemas";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

import { logout } from "@/api/auth";
import { LogoIcon } from "@/components/logo-icon";
import { ThemeSwitch } from "@/components/theme-switch";
import { ROLE_LABELS } from "@/constants/roles";
import { useAuth } from "@/hooks/use-auth";

const NAV = [
  {
    to: "/access",
    label: "Acceso",
    icon: <Icon className="size-5" icon="lucide:key-round" />,
    allow: ["ADMIN", "MANAGER", "SUPERVISOR"] as AppRole[],
  },
  {
    to: "/records",
    label: "Historial",
    icon: <Icon className="size-5" icon="lucide:notepad-text" />,
    allow: ["ADMIN", "MANAGER", "SUPERVISOR"] as AppRole[],
  },
  {
    to: "/parking-users",
    label: "Usuarios del Parking",
    icon: <Icon className="size-5" icon="lucide:user-round" />,
    allow: ["ADMIN", "MANAGER"] as AppRole[],
  },
  {
    to: "/app-users",
    label: "Usuarios del Sistema",
    icon: <Icon className="size-5" icon="lucide:cog" />,
    allow: ["ADMIN"] as AppRole[],
  },
];

export function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      toast.danger("Error al cerrar sesión", {
        description: "No se pudo cerrar sesión en el servidor.",
      });
    } finally {
      setUser(null);
      navigate("/login", { replace: true });
    }
  };

  const role = user?.role;
  const name = user?.name;

  const items = NAV.filter((it) => (role ? it.allow.includes(role) : false));
  const isActive = (to: string) =>
    pathname === to || pathname.startsWith(to + "/");

  return (
    <nav className="h-20 border-b border-border">
      <div className="mx-auto max-w-7xl h-full flex items-center justify-between px-6">
        <div className="flex items-center">
          <RouterLink to="/">
            <LogoIcon compact />
          </RouterLink>
        </div>

        <div className="flex items-center gap-2 pt-3">
          {items.map(({ to, label, icon }) => (
            <Button
              className="font-normal"
              size="md"
              key={to}
              render={(props) => (
                <RouterLink
                  {...(props as React.ComponentProps<typeof RouterLink>)}
                  to={to}
                />
              )}
              variant={isActive(to) ? "primary" : "ghost"}
            >
              {icon}
              {label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-3">
          {user && (
            <Chip size="md" color="accent" variant="soft">
              <Chip.Label>
                {name}
                <span className="text-muted text-xs ml-1">
                  ({ROLE_LABELS[user.role]})
                </span>
              </Chip.Label>

              <Tooltip delay={500}>
                <Button
                  isIconOnly
                  aria-label="Cerrar sesión"
                  size="sm"
                  variant="ghost"
                  onPress={handleLogout}
                >
                  <Icon className="size-4" icon="lucide:log-out" />
                </Button>
                <Tooltip.Content>
                  <p>Cerrar sesión</p>
                </Tooltip.Content>
              </Tooltip>
            </Chip>
          )}

          <ThemeSwitch />
        </div>
      </div>
    </nav>
  );
}
