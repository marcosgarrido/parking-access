import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { appUserQuery } from "@/api/app-users";
import AppUserForm from "@/components/app-user-form";
import IconMessage from "@/components/icon-message";

export default function EditAppUserPage() {
  const { id } = useParams();
  const { data: user, isLoading, error } = useQuery(appUserQuery(Number(id)));

  if (isLoading) return null;
  if (error || !user) {
    return (
      <div className="flex w-full justify-center pt-12">
        <IconMessage
          icon="lucide:circle-alert"
          message="Error al cargar el usuario"
        />
      </div>
    );
  }

  return <AppUserForm initialUser={user} mode="edit" />;
}
