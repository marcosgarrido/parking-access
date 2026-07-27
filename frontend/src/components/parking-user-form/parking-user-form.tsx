import { Button, Form, Surface, Switch, Tabs } from "@heroui/react";
import { Icon } from "@iconify/react";
import type { ParkingUserResponse } from "@parking-access/schemas";

import ConfirmExitModal from "@/modals/confirm-exit-modal";

import PersonalDataTab from "./personal-data-tab";
import ScheduleTab from "./schedule-tab";
import { useParkingUserForm } from "./use-parking-user-form";
import VehiclesTab from "./vehicles-tab";

type ParkingUserFormProps = {
  initialUser?: ParkingUserResponse;
  mode?: "create" | "edit";
};

export default function ParkingUserForm({
  initialUser,
  mode = "create",
}: ParkingUserFormProps) {
  const {
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
    handleCancel,
    handleTabChange,
    handleAddTimeshift,
    handleRemoveTimeshift,
  } = useParkingUserForm({ initialUser, mode });

  return (
    <div className="flex w-full items-center justify-center">
      <Surface
        className={`flex h-125 w-full flex-col gap-6 p-8 transition-all duration-300 ${tabWidth}`}
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
          <Tabs
            className="flex flex-1 flex-col"
            selectedKey={activeTab}
            onSelectionChange={handleTabChange}
          >
            <Tabs.ListContainer className="w-fit mx-auto">
              <Tabs.List>
                <Tabs.Tab
                  className="gap-2 whitespace-nowrap p-3 data-[selected=true]:text-white"
                  id="personal-data"
                >
                  <Icon className="size-5" icon="lucide:user-round" />
                  Datos personales
                  <Tabs.Indicator className="bg-accent" />
                </Tabs.Tab>
                <Tabs.Tab
                  className="gap-2 whitespace-nowrap p-3 data-[selected=true]:text-white"
                  id="vehicles"
                >
                  <Icon className="size-7 pb-0.5" icon="mdi:car" />
                  Vehículos
                  <Tabs.Indicator className="bg-accent" />
                </Tabs.Tab>
                <Tabs.Tab
                  className="gap-2 whitespace-nowrap p-3 data-[selected=true]:text-white"
                  id="schedule"
                >
                  <Icon className="size-5" icon="lucide:clock" />
                  Horarios
                  <Tabs.Indicator className="bg-accent" />
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>

            <Tabs.Panel className="flex flex-col gap-4 pt-4" id="personal-data">
              <PersonalDataTab
                errors={personalDataErrors}
                name={values.name}
                surname={values.surname}
                telephone={values.telephone}
                onNameChange={setField("name")}
                onSurnameChange={setField("surname")}
                onTelephoneChange={setField("telephone")}
              />
            </Tabs.Panel>

            <Tabs.Panel
              className="flex flex-1 flex-col gap-4 pt-4"
              id="vehicles"
            >
              <VehiclesTab
                vehicles={values.vehicles}
                onAddPlate={handleAddPlate}
                onRemovePlate={handleRemovePlate}
              />
            </Tabs.Panel>

            <Tabs.Panel className="pt-4" id="schedule">
              <ScheduleTab
                timeshifts={values.timeshifts}
                onAddTimeshift={handleAddTimeshift}
                onRemoveTimeshift={handleRemoveTimeshift}
              />
            </Tabs.Panel>
          </Tabs>

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
        isOpen={blocker.state === "blocked"}
        onCancel={() => blocker.state === "blocked" && blocker.reset()}
        onConfirm={() => blocker.state === "blocked" && blocker.proceed()}
      />
    </div>
  );
}
