import { AlertDialog, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

import { deleteRecords } from "@/api/records";

export default function DeleteRecordsModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const recordIds: number[] = location.state?.recordIds ?? [];

  const goBack = () =>
    navigate(`/records${location.search}`, { replace: true });

  const mutation = useMutation({
    mutationFn: () => deleteRecords(recordIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records"] });
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
              <AlertDialog.Heading>Eliminar registros</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              ¿Está seguro de eliminar {recordIds.length}{" "}
              {recordIds.length === 1 ? "registro" : "registros"}?
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
                Eliminar
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
