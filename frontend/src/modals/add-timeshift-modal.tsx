import { Button, Input, Label, Modal, Switch, TextField } from "@heroui/react";
import { useState } from "react";

type AddTimeshiftModalProps = {
  isOpen: boolean;
  dayName: string;
  error: string | undefined;
  onOpenChange: (open: boolean) => void;
  onDismissError: () => void;
  onAdd: (values: {
    startTime: string;
    endTime: string;
    allDay: boolean;
  }) => void;
};

export default function AddTimeshiftModal({
  isOpen,
  dayName,
  error,
  onOpenChange,
  onDismissError,
  onAdd,
}: AddTimeshiftModalProps) {
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("15:00");
  const [allDay, setAllDay] = useState(false);
  const [wasOpen, setWasOpen] = useState(isOpen);

  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setStartTime("08:00");
      setEndTime("15:00");
      setAllDay(false);
    }
  }

  const handleStartTimeChange = (value: string) => {
    setStartTime(value);
    onDismissError();
  };

  const handleEndTimeChange = (value: string) => {
    setEndTime(value);
    onDismissError();
  };

  const handleToggleAllDay = (value: boolean) => {
    setAllDay(value);
    setStartTime(value ? "00:00" : "08:00");
    setEndTime(value ? "00:00" : "15:00");
    onDismissError();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop>
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Añadir franja para el {dayName}</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="flex flex-col gap-4">
              <div className="flex gap-2">
                <TextField
                  className="flex-1"
                  isDisabled={allDay}
                  isInvalid={!!error}
                  isRequired={!allDay}
                  value={startTime}
                  onChange={handleStartTimeChange}
                >
                  <Label>Hora de inicio</Label>
                  <Input type="time" variant="secondary" />
                </TextField>
                <TextField
                  className="flex-1"
                  isDisabled={allDay}
                  isInvalid={!!error}
                  isRequired={!allDay}
                  value={endTime}
                  onChange={handleEndTimeChange}
                >
                  <Label>Hora de fin</Label>
                  <Input type="time" variant="secondary" />
                </TextField>
              </div>
              {error && (
                <span className="text-danger text-xs pl-2">{error}</span>
              )}
            </Modal.Body>
            <Modal.Footer className="flex items-center justify-between">
              <Switch isSelected={allDay} onChange={handleToggleAllDay}>
                <Switch.Content>
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                  Todo el día
                </Switch.Content>
              </Switch>
              <div className="flex gap-2">
                <Button variant="ghost" onPress={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onPress={() => onAdd({ startTime, endTime, allDay })}
                >
                  Añadir
                </Button>
              </div>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
