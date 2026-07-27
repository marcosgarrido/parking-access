import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { parkingUserQuery } from "@/api/parking-users";
import IconMessage from "@/components/icon-message";
import ParkingUserForm from "@/components/parking-user-form/parking-user-form";

export default function ViewParkingUserPage() {
  const { id } = useParams();
  const {
    data: user,
    isLoading,
    error,
  } = useQuery(parkingUserQuery(Number(id)));

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

  return <ParkingUserForm initialUser={user} mode="view" />;
}
