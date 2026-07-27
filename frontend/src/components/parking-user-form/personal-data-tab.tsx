import { FieldError, Input, Label, TextField } from "@heroui/react";

type PersonalDataTabProps = {
  name: string;
  surname: string;
  telephone: string;
  errors: Record<string, string>;
  onNameChange: (value: string) => void;
  onSurnameChange: (value: string) => void;
  onTelephoneChange: (value: string) => void;
};

export default function PersonalDataTab({
  name,
  surname,
  telephone,
  errors,
  onNameChange,
  onSurnameChange,
  onTelephoneChange,
}: PersonalDataTabProps) {
  return (
    <>
      <TextField
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
