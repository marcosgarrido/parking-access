import type {
  ParkingUserCreateBody,
  ParkingUserResponse,
  ParkingUserUpdateBody,
} from "@parking-access/schemas";
import {
  ParkingUserCreateBodySchema,
  ParkingUserUpdateBodySchema,
  PlateSchema,
} from "@parking-access/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { createParkingUser, updateParkingUser } from "@/api/parking-users";

type FormValues = {
  name: string;
  surname: string;
  telephone: string;
  accessAllowed: boolean;
  vehicles: string[];
};

function valuesFromUser(user?: ParkingUserResponse): FormValues {
  return {
    name: user?.name ?? "",
    surname: user?.surname ?? "",
    telephone: user?.telephone ?? "",
    accessAllowed: user?.accessAllowed ?? true,
    vehicles: user?.vehicles.map((vehicle) => vehicle.plate) ?? [],
  };
}

type UseParkingUserFormParams = {
  initialUser?: ParkingUserResponse;
  mode: "create" | "edit";
};

export function useParkingUserForm({
  initialUser,
  mode,
}: UseParkingUserFormParams) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const initialValues = valuesFromUser(initialUser);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmExit, setShowConfirmExit] = useState(false);
  const [activeTab, setActiveTab] = useState("personal-data");
  const [plateInput, setPlateInput] = useState("");
  const [plateError, setPlateError] = useState<string | undefined>(undefined);

  const tabWidth =
    activeTab === "schedule" ? "max-w-[1024px]" : "max-w-[480px]";

  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  const goBack = () =>
    navigate(`/parking-users${location.search}`, { replace: true });

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
      vehicles: values.vehicles.map((plate) => ({ plate })),
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

  const handleAddPlate = () => {
    const result = PlateSchema.safeParse(plateInput);

    if (!result.success) {
      setPlateError(result.error.issues[0]?.message);

      return;
    }

    if (values.vehicles.includes(result.data)) {
      setPlateError("La matrícula ya existe.");

      return;
    }

    setValues((prev) => ({
      ...prev,
      vehicles: [...prev.vehicles, result.data],
    }));
    setPlateInput("");
    setPlateError(undefined);
  };

  const handleRemovePlate = (plateToRemove: string) => {
    setValues((prev) => ({
      ...prev,
      vehicles: prev.vehicles.filter((plate) => plate !== plateToRemove),
    }));
  };

  const handleCancel = () => {
    if (isDirty) setShowConfirmExit(true);
    else goBack();
  };

  const handleTabChange = (key: React.Key) => {
    setActiveTab(String(key));
    setErrors({});
    setPlateError(undefined);
  };

  const handlePlateInputChange = (value: string) => {
    setPlateInput(value);
    setPlateError(undefined);
  };

  return {
    values,
    errors,
    showConfirmExit,
    activeTab,
    plateInput,
    plateError,
    tabWidth,
    mutation,
    setField,
    setShowConfirmExit,
    handleSubmit,
    handleAddPlate,
    handleRemovePlate,
    handleCancel,
    handleTabChange,
    handlePlateInputChange,
    goBack,
  };
}
