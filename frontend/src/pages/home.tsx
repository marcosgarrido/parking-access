import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";

import { logout } from "@/api/auth";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <p>
        Sesión iniciada como <strong>{user?.username}</strong> ({user?.role})
      </p>
      <Button variant="primary" onPress={handleLogout}>
        Cerrar sesión
      </Button>
    </div>
  );
}
