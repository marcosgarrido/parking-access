import {
  Button,
  FieldError,
  Form,
  Input,
  InputGroup,
  Label,
  ListBox,
  Select,
  Surface,
  Switch,
  TextField,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import type {
  AppRole,
  AppUserCreateBody,
  AppUserResponse,
  AppUserUpdateBody,
} from "@parking-access/schemas";
import {
  AppUserCreateBodySchema,
  AppUserUpdateBodySchema,
} from "@parking-access/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { createAppUser, updateAppUser } from "@/api/app-users";
import { ROLE_LABELS } from "@/constants/roles";
import { useUnsavedChangesBlocker } from "@/hooks/use-unsaved-changes-blocker";
import ConfirmExitModal from "@/modals/confirm-exit-modal";

const ROLES: AppRole[] = ["ADMIN", "MANAGER", "SUPERVISOR"];

type FormValues = {
  name: string;
  surname: string;
  username: string;
  password: string;
  role: AppRole | undefined;
  isActive: boolean;
};

function valuesFromUser(user?: AppUserResponse): FormValues {
  return {
    name: user?.name ?? "",
    surname: user?.surname ?? "",
    username: user?.username ?? "",
    password: "",
    role: user?.role,
    isActive: user?.isActive ?? true,
  };
}

type AppUserFormProps = {
  initialUser?: AppUserResponse;
  mode?: "create" | "edit";
};

export default function AppUserForm({
  initialUser,
  mode = "create",
}: AppUserFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const initialValues = valuesFromUser(initialUser);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);
  const { blocker, allowNextNavigation } = useUnsavedChangesBlocker(isDirty);
  const toggleVisibility = () => setIsVisible((v) => !v);

  const goBack = () =>
    navigate(`/app-users${location.search}`, { replace: true });

  const mutation = useMutation({
    mutationFn: (payload: AppUserCreateBody | AppUserUpdateBody) => {
      if (mode === "edit" && initialUser) {
        return updateAppUser(initialUser.id, payload as AppUserUpdateBody);
      }

      return createAppUser(payload as AppUserCreateBody);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app-users"] });
      if (mode === "edit" && initialUser) {
        queryClient.invalidateQueries({
          queryKey: ["app-user", initialUser.id],
        });
      }
      allowNextNavigation();
      goBack();
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: Record<string, unknown> = {
      name: values.name,
      surname: values.surname,
      role: values.role,
      isActive: values.isActive,
    };

    if (mode === "create") {
      payload.username = values.username;
      payload.password = values.password;
    } else if (values.password.trim()) {
      payload.password = values.password.trim();
    }

    const schema =
      mode === "create" ? AppUserCreateBodySchema : AppUserUpdateBodySchema;
    const result = schema.safeParse(payload);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;

        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);

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

  return (
    <div className="flex w-full items-center justify-center">
      <Surface className="flex w-full max-w-md min-h-100 flex-col gap-6 p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">
            {mode === "edit" ? "Editar usuario" : "Crear usuario"}
          </h1>
          <Switch
            isSelected={values.isActive}
            size="md"
            onChange={setField("isActive")}
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
          className="flex flex-col gap-4 pt-4"
          validationBehavior="aria"
          onSubmit={handleSubmit}
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
            isDisabled={mode === "edit"}
            isInvalid={!!errors["username"]}
            value={values.username}
            onChange={setField("username")}
          >
            <Label>Nombre de usuario</Label>
            <Input
              placeholder="Introduzca el nombre de usuario"
              type="text"
              variant="secondary"
            />
            <FieldError>{errors["username"]}</FieldError>
          </TextField>

          <TextField
            isRequired={mode === "create"}
            isInvalid={!!errors["password"]}
            value={values.password}
            onChange={setField("password")}
          >
            <Label>Contraseña</Label>
            <InputGroup fullWidth variant="secondary">
              <InputGroup.Input
                placeholder={
                  mode === "edit"
                    ? "Introduzca una nueva contraseña (opcional)"
                    : "Introduzca la contraseña"
                }
                type={isVisible ? "text" : "password"}
              />
              <InputGroup.Suffix className="pr-0">
                <Button
                  isIconOnly
                  aria-label={
                    isVisible ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  size="sm"
                  variant="ghost"
                  onPress={toggleVisibility}
                >
                  <Icon
                    className="text-muted text-xl"
                    icon={
                      isVisible ? "solar:eye-closed-linear" : "solar:eye-bold"
                    }
                  />
                </Button>
              </InputGroup.Suffix>
            </InputGroup>
            <FieldError>{errors["password"]}</FieldError>
          </TextField>

          <Select
            isRequired
            placeholder="Seleccione un rol"
            value={values.role}
            variant="secondary"
            onChange={(value) => setField("role")(value as AppRole)}
          >
            <Label>Rol</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {ROLES.map((r) => (
                  <ListBox.Item key={r} id={r} textValue={ROLE_LABELS[r]}>
                    {ROLE_LABELS[r]}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          {errors["role"] && (
            <span className="text-danger text-xs pl-2">{errors["role"]}</span>
          )}

          {mutation.isError && (
            <span className="text-danger text-xs pl-2">
              {mutation.error.message}
            </span>
          )}

          <div className="mt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onPress={goBack}>
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
        isOpen={blocker.state === "blocked"}
        onCancel={() => blocker.state === "blocked" && blocker.reset()}
        onConfirm={() => blocker.state === "blocked" && blocker.proceed()}
      />
    </div>
  );
}
