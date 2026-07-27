import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  Surface,
  Switch,
  Tabs,
  TextField,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import type {
  ParkingUserCreateBody,
  ParkingUserResponse,
  ParkingUserUpdateBody,
} from "@parking-access/schemas";
import {
  ParkingUserCreateBodySchema,
  ParkingUserUpdateBodySchema,
} from "@parking-access/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { SharedElementTransition } from "react-aria-components";
import { useNavigate } from "react-router-dom";

import { createParkingUser, updateParkingUser } from "@/api/parking-users";
import ConfirmExitModal from "@/modals/confirm-exit-modal";

type FormValues = {
  name: string;
  surname: string;
  telephone: string;
  accessAllowed: boolean;
};

function valuesFromUser(user?: ParkingUserResponse): FormValues {
  return {
    name: user?.name ?? "",
    surname: user?.surname ?? "",
    telephone: user?.telephone ?? "",
    accessAllowed: user?.accessAllowed ?? true,
  };
}

type ParkingUserFormProps = {
  initialUser?: ParkingUserResponse;
  mode?: "create" | "edit";
};

export default function ParkingUserForm({
  initialUser,
  mode = "create",
}: ParkingUserFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const initialValues = valuesFromUser(initialUser);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmExit, setShowConfirmExit] = useState(false);
  const [activeTab, setActiveTab] = useState("personal-data");

  const tabWidth = activeTab === "schedule" ? "max-w-4xl" : "max-w-[540px]";

  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  const goBack = () => navigate("/parking-users", { replace: true });

  const mutation = useMutation({
    mutationFn: (payload: ParkingUserCreateBody | ParkingUserUpdateBody) => {
      if (mode === "edit" && initialUser) {
        return updateParkingUser(initialUser.id, payload);
      }

      return createParkingUser(payload as ParkingUserCreateBody);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parking-users"] });
      if (mode === "edit" && initialUser) {
        queryClient.invalidateQueries({
          queryKey: ["parking-user", initialUser.id],
        });
      }
      goBack();
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      name: values.name,
      surname: values.surname,
      telephone: values.telephone,
      accessAllowed: values.accessAllowed,
      vehicles: initialUser?.vehicles ?? [],
      timeshifts: initialUser?.timeshifts ?? [],
    };

    const schema =
      mode === "create"
        ? ParkingUserCreateBodySchema
        : ParkingUserUpdateBodySchema;
    const result = schema.safeParse(payload);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;

        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      setActiveTab("personal-data");

      return;
    }

    mutation.mutate(result.data);
  };

  const setField =
    <K extends keyof FormValues>(key: K) =>
    (value: FormValues[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
      if (mutation.isError) mutation.reset();
    };

  const handleCancel = () => {
    if (isDirty) setShowConfirmExit(true);
    else goBack();
  };

  return (
    <div className="flex w-full items-center justify-center">
      <Surface
        className={`flex h-[550px] w-full flex-col gap-6 p-10 transition-all duration-300 ${tabWidth}`}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">
            {mode === "edit" ? "Editar usuario" : "Crear usuario"}
          </h1>
          <Switch
            isSelected={values.accessAllowed}
            size="md"
            onChange={setField("accessAllowed")}
          >
            <Switch.Content>
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              Activo
            </Switch.Content>
          </Switch>
        </div>

        <Form
          className="flex flex-1 flex-col gap-4"
          validationBehavior="aria"
          onSubmit={handleSubmit}
        >
          <SharedElementTransition>
            <Tabs
              selectedKey={activeTab}
              onSelectionChange={(key) => setActiveTab(String(key))}
            >
              <Tabs.ListContainer className="w-fit mx-auto">
                <Tabs.List>
                  <Tabs.Tab
                    className="gap-2 whitespace-nowrap"
                    id="personal-data"
                  >
                    <Icon className="size-5" icon="lucide:user-round" />
                    Datos personales
                    <Tabs.Indicator className="bg-accent" />
                  </Tabs.Tab>
                  <Tabs.Tab className="gap-2 whitespace-nowrap" id="vehicles">
                    <Icon className="size-7" icon="mdi:car-side" />
                    Vehículos
                    <Tabs.Indicator className="bg-accent" />
                  </Tabs.Tab>
                  <Tabs.Tab className="gap-2 whitespace-nowrap" id="schedule">
                    <Icon className="size-5" icon="lucide:clock" />
                    Horarios
                    <Tabs.Indicator className="bg-accent" />
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>

              <Tabs.Panel
                className="flex flex-col gap-4 pt-4"
                id="personal-data"
              >
                <TextField
                  isRequired
                  isInvalid={!!errors["name"]}
                  value={values.name}
                  onChange={setField("name")}
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
                  value={values.surname}
                  onChange={setField("surname")}
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
                  value={values.telephone}
                  onChange={setField("telephone")}
                >
                  <Label>Teléfono</Label>
                  <Input
                    placeholder="Introduzca el número de teléfono"
                    type="text"
                    variant="secondary"
                  />
                  <FieldError>{errors["telephone"]}</FieldError>
                </TextField>
              </Tabs.Panel>

              <Tabs.Panel id="vehicles">
                <p className="text-muted pt-6 text-sm">Próximamente.</p>
              </Tabs.Panel>

              <Tabs.Panel id="schedule">
                <p className="text-muted pt-6 text-sm">Próximamente.</p>
              </Tabs.Panel>
            </Tabs>
          </SharedElementTransition>

          {mutation.isError && (
            <span className="text-danger text-xs pl-2">
              {mutation.error.message}
            </span>
          )}

          <div className="mt-auto flex justify-end gap-3 pt-6">
            <Button type="button" variant="ghost" onPress={handleCancel}>
              Cancelar
            </Button>
            <Button
              isDisabled={mutation.isPending}
              type="submit"
              variant="primary"
            >
              {mode === "edit" ? "Guardar" : "Crear"}
            </Button>
          </div>
        </Form>
      </Surface>

      <ConfirmExitModal
        isOpen={showConfirmExit}
        onCancel={() => setShowConfirmExit(false)}
        onConfirm={goBack}
      />
    </div>
  );
}
