import { AlertDialog, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import { deleteParkingUser, parkingUserQuery } from "@/api/parking-users";

export default function DeleteParkingUserModal() {
  const { id } = useParams();
  const userId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useQuery(parkingUserQuery(userId));

  const goBack = () => navigate("/parking-users", { replace: true });

  const mutation = useMutation({
    mutationFn: () => deleteParkingUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parking-users"] });
      goBack();
    },
  });

  return (
    <AlertDialog isOpen onOpenChange={goBack}>
      <AlertDialog.Backdrop>
        <AlertDialog.Container size="sm">
          <AlertDialog.Dialog>
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger">
                <Icon icon="lucide:trash-2" />
              </AlertDialog.Icon>
              <AlertDialog.Heading>Eliminar usuario</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              ¿Está seguro de eliminar el usuario{" "}
              {user ? (
                <b>
                  {user.name} {user.surname}
                </b>
              ) : (
                "seleccionado"
              )}
              ?
              {mutation.isError && (
                <div className="text-danger text-sm mt-2">
                  {mutation.error.message}
                </div>
              )}
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button
                isDisabled={mutation.isPending}
                variant="ghost"
                onPress={goBack}
              >
                Cancelar
              </Button>
              <Button
                isDisabled={mutation.isPending}
                variant="danger"
                onPress={() => mutation.mutate()}
              >
                <Icon icon="lucide:trash-2" />
                Eliminar
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
