import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { parkingUserQuery } from "@/api/parking-users";
import ParkingUserForm from "@/components/parking-user-form/parking-user-form";

export default function ViewParkingUserPage() {
  const { id } = useParams();
  const {
    data: user,
    isLoading,
    error,
  } = useQuery(parkingUserQuery(Number(id)));

  if (isLoading) return <p>Cargando...</p>;
  if (error || !user) return <p>Error al cargar el usuario</p>;

  return <ParkingUserForm initialUser={user} mode="view" />;
}
