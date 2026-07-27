import {
  Button,
  Chip,
  FieldError,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { Icon } from "@iconify/react";

import EmptyStateMessage from "@/components/empty-state-message";

type VehiclesTabProps = {
  vehicles: string[];
  plateInput: string;
  plateError: string | undefined;
  onPlateInputChange: (value: string) => void;
  onAddPlate: () => void;
  onRemovePlate: (plate: string) => void;
};

export default function VehiclesTab({
  vehicles,
  plateInput,
  plateError,
  onPlateInputChange,
  onAddPlate,
  onRemovePlate,
}: VehiclesTabProps) {
  return (
    <>
      <div className="flex items-end gap-2">
        <TextField
          className="flex-1"
          isInvalid={!!plateError}
          value={plateInput}
          onChange={onPlateInputChange}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onAddPlate();
            }
          }}
        >
          <Label>Matrícula</Label>
          <Input
            placeholder="Introduzca la matrícula del vehículo"
            type="text"
            variant="secondary"
          />
          <FieldError>{plateError}</FieldError>
        </TextField>
        <Button
          isIconOnly
          aria-label="Añadir matrícula"
          type="button"
          variant="secondary"
          onPress={onAddPlate}
        >
          <Icon icon="lucide:plus" />
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <EmptyStateMessage
            icon="mdi:car-off"
            message="No se han asignado vehículos"
          />
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-x-4 gap-y-4">
            {vehicles.map((plate) => (
              <Chip
                key={plate}
                className="justify-center p-1.5"
                color="accent"
                size="lg"
                variant="primary"
              >
                <Chip.Label>{plate}</Chip.Label>
                <button
                  aria-label={`Eliminar matrícula ${plate}`}
                  className="cursor-pointer rounded-full p-0.5 bg-white/70 text-accent transition-opacity hover:bg-white"
                  type="button"
                  onClick={() => onRemovePlate(plate)}
                >
                  <Icon icon="lucide:x" />
                </button>
              </Chip>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
