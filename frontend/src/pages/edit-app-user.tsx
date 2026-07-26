import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { appUserQuery } from "@/api/app-users";
import AppUserForm from "@/components/app-user-form";

export default function EditAppUserPage() {
  const { id } = useParams();
  const { data: user, isLoading, error } = useQuery(appUserQuery(Number(id)));

  if (isLoading) return <p>Cargando...</p>;
  if (error || !user) return <p>Error al cargar el usuario</p>;

  return <AppUserForm initialUser={user} mode="edit" />;
}
