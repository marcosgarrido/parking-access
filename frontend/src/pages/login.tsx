import {
  Button,
  FieldError,
  Form,
  Input,
  InputGroup,
  Label,
  Surface,
  TextField,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import type { LoginBody, LoginResponse } from "@parking-access/schemas";
import { LoginBodySchema } from "@parking-access/schemas";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchMe, login } from "@/api/auth";
import { LogoIcon } from "@/components/logo-icon";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleVisibility = () => setIsVisible(!isVisible);

  const mutation = useMutation<LoginResponse, Error, LoginBody>({
    mutationFn: (data) => login(data.username, data.password),

    onSuccess: async () => {
      try {
        const me = await fetchMe();

        setUser(me);
        navigate("/access", { replace: true });
      } catch {
        setUser(null);
      }
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data: LoginBody = {
      username: String(formData.get("username") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const result = LoginBodySchema.safeParse(data);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;

        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);

      return;
    }

    mutation.mutate(data);
  };

  const handleChange = (key: keyof LoginBody) => () => {
    setErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
    if (mutation.isError) mutation.reset();
  };

  return (
    <div className="flex pt-30 w-full items-center justify-center bg-background">
      <Surface className="flex w-full max-w-md flex-col gap-6 p-8">
        <LogoIcon className="mx-auto" />
        <Form
          className="flex flex-col pt-4 gap-4"
          validationBehavior="aria"
          onSubmit={handleSubmit}
        >
          <TextField
            isRequired
            isInvalid={!!errors["username"]}
            name="username"
            onChange={handleChange("username")}
          >
            <Label>Nombre de usuario</Label>
            <Input
              placeholder="Introduce tu nombre de usuario"
              type="text"
              variant="secondary"
            />
            <FieldError>{errors["username"]}</FieldError>
          </TextField>

          <TextField
            isRequired
            isInvalid={!!errors["password"]}
            name="password"
            onChange={handleChange("password")}
          >
            <Label>Contraseña</Label>
            <InputGroup fullWidth variant="secondary">
              <InputGroup.Input
                placeholder="Introduce tu contraseña"
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

          {mutation.isError && (
            <span className="text-danger text-xs pl-2">
              {mutation.error.message}
            </span>
          )}

          <Button
            className="mt-5"
            fullWidth
            isDisabled={mutation.isPending}
            type="submit"
            size="lg"
            variant="primary"
          >
            <Icon icon="lucide:log-in" />
            Iniciar sesión
          </Button>
        </Form>
      </Surface>
    </div>
  );
}
