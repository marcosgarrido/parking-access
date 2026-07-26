import { AlertDialog, Button } from "@heroui/react";

type ConfirmExitModalProps = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmExitModal({
  isOpen,
  onCancel,
  onConfirm,
}: ConfirmExitModalProps) {
  return (
    <AlertDialog isOpen={isOpen} onOpenChange={onCancel}>
      <AlertDialog.Backdrop>
        <AlertDialog.Container size="sm">
          <AlertDialog.Dialog>
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>Salir sin guardar</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              ¿Está seguro de que desea salir descartando los cambios?
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button variant="ghost" onPress={onCancel}>
                Cancelar
              </Button>
              <Button variant="danger" onPress={onConfirm}>
                Descartar cambios
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
