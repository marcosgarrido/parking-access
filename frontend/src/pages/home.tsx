import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <p>
      Sesión iniciada como <strong>{user?.username}</strong>
    </p>
  );
}
