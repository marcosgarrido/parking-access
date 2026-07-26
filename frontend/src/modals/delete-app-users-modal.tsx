import { AlertDialog, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

import { deleteAppUsers } from "@/api/app-users";

export default function DeleteAppUsersModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const userIds: number[] = location.state?.userIds ?? [];

  const goBack = () => navigate("/app-users", { replace: true });

  const mutation = useMutation({
    mutationFn: () => deleteAppUsers(userIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app-users"] });
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
              <AlertDialog.Heading>Eliminar usuarios</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              ¿Está seguro de eliminar {userIds.length}{" "}
              {userIds.length === 1 ? "usuario" : "usuarios"}?
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
