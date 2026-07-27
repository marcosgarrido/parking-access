import { FieldError, Input, Label, TextField } from "@heroui/react";

type PersonalDataTabProps = {
  name: string;
  surname: string;
  telephone: string;
  errors: Record<string, string>;
  isReadOnly?: boolean;
  onNameChange: (value: string) => void;
  onSurnameChange: (value: string) => void;
  onTelephoneChange: (value: string) => void;
};

export default function PersonalDataTab({
  name,
  surname,
  telephone,
  errors,
  isReadOnly = false,
  onNameChange,
  onSurnameChange,
  onTelephoneChange,
}: PersonalDataTabProps) {
  return (
    <>
      <TextField
        isDisabled={isReadOnly}
        isRequired
        isInvalid={!!errors["name"]}
        value={name}
        onChange={onNameChange}
      >
        <Label>Nombre</Label>
        <Input
          placeholder="Introduzca el nombre"
          type="text"
          variant="secondary"
        />
        <FieldError>{errors["name"]}</FieldError>
      </TextField>

      <TextField
        isDisabled={isReadOnly}
        isRequired
        isInvalid={!!errors["surname"]}
        value={surname}
        onChange={onSurnameChange}
      >
        <Label>Apellidos</Label>
        <Input
          placeholder="Introduzca los apellidos"
          type="text"
          variant="secondary"
        />
        <FieldError>{errors["surname"]}</FieldError>
      </TextField>

      <TextField
        isDisabled={isReadOnly}
        isRequired
        isInvalid={!!errors["telephone"]}
        value={telephone}
        onChange={onTelephoneChange}
      >
        <Label>Teléfono</Label>
        <Input
          placeholder="Introduzca el número de teléfono"
          type="text"
          variant="secondary"
        />
        <FieldError>{errors["telephone"]}</FieldError>
      </TextField>
    </>
  );
}
