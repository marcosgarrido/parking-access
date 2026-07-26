import { Avatar, Button, Dropdown, Label, toast } from "@heroui/react";
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
    icon: <Icon className="size-4" icon="lucide:key-round" />,
    allow: ["ADMIN", "MANAGER", "SUPERVISOR"] as AppRole[],
  },
  {
    to: "/records",
    label: "Historial",
    icon: <Icon className="size-4" icon="lucide:notepad-text" />,
    allow: ["ADMIN", "MANAGER", "SUPERVISOR"] as AppRole[],
  },
  {
    to: "/parking-users",
    label: "Usuarios del Parking",
    icon: <Icon className="size-4" icon="lucide:user-round" />,
    allow: ["ADMIN", "MANAGER"] as AppRole[],
  },
  {
    to: "/app-users",
    label: "Usuarios del Sistema",
    icon: <Icon className="size-4" icon="lucide:cog" />,
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
  const initials = user ? (user.name[0] + user.surname[0]).toUpperCase() : "";

  const items = NAV.filter((it) => (role ? it.allow.includes(role) : false));
  const isActive = (to: string) =>
    pathname === to || pathname.startsWith(to + "/");

  return (
    <nav className="h-20 border-b border-border">
      <div className="mx-auto max-w-6xl h-full flex items-center justify-between px-6">
        <div className="flex items-center">
          <RouterLink to="/">
            <LogoIcon compact />
          </RouterLink>
        </div>

        <div className="flex items-center gap-2 pt-3">
          {items.map(({ to, label, icon }) => (
            <Button
              className="font-normal"
              size="sm"
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
            <Dropdown>
              <Button isIconOnly aria-label="Cuenta" variant="ghost">
                <Avatar color="accent" variant="soft" size="sm">
                  <Avatar.Fallback>{initials}</Avatar.Fallback>
                </Avatar>
              </Button>
              <Dropdown.Popover>
                <Dropdown.Menu>
                  <Dropdown.Item isDisabled>
                    <div className="flex flex-col">
                      <Label>{name}</Label>
                      <span className="text-muted text-xs">
                        ({ROLE_LABELS[user.role]})
                      </span>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item variant="default" onAction={handleLogout}>
                    <Icon className="size-4" icon="lucide:log-out" />
                    <Label>Cerrar sesión</Label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          )}

          <ThemeSwitch />
        </div>
      </div>
    </nav>
  );
}
