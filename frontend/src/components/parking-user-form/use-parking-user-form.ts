import type {
  ParkingUserCreateBody,
  ParkingUserResponse,
  ParkingUserUpdateBody,
  TimeshiftBase,
} from "@parking-access/schemas";
import {
  ParkingUserCreateBodySchema,
  ParkingUserUpdateBodySchema,
} from "@parking-access/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { createParkingUser, updateParkingUser } from "@/api/parking-users";
import { useUnsavedChangesBlocker } from "@/hooks/use-unsaved-changes-blocker";

type FormValues = {
  name: string;
  surname: string;
  telephone: string;
  accessAllowed: boolean;
  vehicles: string[];
  timeshifts: TimeshiftBase[];
};

function valuesFromUser(user?: ParkingUserResponse): FormValues {
  return {
    name: user?.name ?? "",
    surname: user?.surname ?? "",
    telephone: user?.telephone ?? "",
    accessAllowed: user?.accessAllowed ?? true,
    vehicles: user?.vehicles.map((vehicle) => vehicle.plate) ?? [],
    timeshifts: user?.timeshifts ?? [],
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
  const [personalDataErrors, setPersonalDataErrors] = useState<
    Record<string, string>
  >({});
  const [activeTab, setActiveTab] = useState("personal-data");

  const tabWidth =
    activeTab === "schedule" ? "max-w-[1024px]" : "max-w-[480px]";

  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  const { blocker, allowNextNavigation } = useUnsavedChangesBlocker(isDirty);

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
      allowNextNavigation();
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
      timeshifts: values.timeshifts,
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
      setPersonalDataErrors(fieldErrors);
      setActiveTab("personal-data");

      return;
    }

    mutation.mutate(result.data);
  };

  const setField =
    <K extends keyof FormValues>(key: K) =>
    (value: FormValues[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
      setPersonalDataErrors((prev) =>
        prev[key] ? { ...prev, [key]: "" } : prev,
      );
      if (mutation.isError) mutation.reset();
    };

  const handleAddPlate = (plate: string) => {
    setValues((prev) => ({ ...prev, vehicles: [...prev.vehicles, plate] }));
  };

  const handleRemovePlate = (plateToRemove: string) => {
    setValues((prev) => ({
      ...prev,
      vehicles: prev.vehicles.filter((plate) => plate !== plateToRemove),
    }));
  };

  const handleAddTimeshift = (timeshifts: TimeshiftBase[]) => {
    setValues((prev) => ({ ...prev, timeshifts }));
  };

  const handleRemoveTimeshift = (timeshiftToRemove: TimeshiftBase) => {
    setValues((prev) => ({
      ...prev,
      timeshifts: prev.timeshifts.filter((timeshift) => {
        if (timeshiftToRemove.allDay) {
          return !(
            timeshift.dayOfWeek === timeshiftToRemove.dayOfWeek &&
            timeshift.allDay
          );
        }

        return !(
          timeshift.dayOfWeek === timeshiftToRemove.dayOfWeek &&
          timeshift.startTime === timeshiftToRemove.startTime &&
          timeshift.endTime === timeshiftToRemove.endTime &&
          !timeshift.allDay
        );
      }),
    }));
  };

  const handleTabChange = (key: React.Key) => {
    setActiveTab(String(key));
    setPersonalDataErrors({});
  };

  return {
    values,
    personalDataErrors,
    blocker,
    activeTab,
    tabWidth,
    mutation,
    setField,
    handleSubmit,
    handleAddPlate,
    handleRemovePlate,
    handleCancel: goBack,
    handleTabChange,
    handleAddTimeshift,
    handleRemoveTimeshift,
  };
}
