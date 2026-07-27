import type { TimeshiftBase } from "@parking-access/schemas";
import { ParkingUserTimeshiftListSchema } from "@parking-access/schemas";
import { useState } from "react";

import { DAYS_OF_WEEK } from "@/constants/days-of-week";
import AddTimeshiftModal from "@/modals/add-timeshift-modal";
import { normalizeTimeshifts } from "@/utils/normalize-timeshifts";

import ScheduleDay from "./schedule-day";

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

type ScheduleTabProps = {
  timeshifts: TimeshiftBase[];
  isReadOnly?: boolean;
  onAddTimeshift: (timeshifts: TimeshiftBase[]) => void;
  onRemoveTimeshift: (timeshift: TimeshiftBase) => void;
};

export default function ScheduleTab({
  timeshifts,
  isReadOnly = false,
  onAddTimeshift,
  onRemoveTimeshift,
}: ScheduleTabProps) {
  const [modalDay, setModalDay] = useState<number | null>(null);
  const [timeshiftError, setTimeshiftError] = useState<string | undefined>(
    undefined,
  );

  const closeModal = () => {
    setModalDay(null);
    setTimeshiftError(undefined);
  };

  const handleAddTimeshift = ({
    startTime,
    endTime,
    allDay,
  }: {
    startTime: string;
    endTime: string;
    allDay: boolean;
  }) => {
    if (modalDay === null) return;

    const newTimeshift: TimeshiftBase = allDay
      ? { dayOfWeek: modalDay, allDay: true }
      : { dayOfWeek: modalDay, startTime, endTime, allDay: false };

    const normalized = normalizeTimeshifts([...timeshifts, newTimeshift]);
    const result = ParkingUserTimeshiftListSchema.safeParse(normalized);

    if (!result.success) {
      setTimeshiftError(result.error.issues[0]?.message);

      return;
    }

    onAddTimeshift(result.data);
    closeModal();
  };

  return (
    <>
      <div className="grid grid-cols-7 items-start gap-2">
        {DAY_ORDER.map((dayOfWeek) => (
          <ScheduleDay
            key={dayOfWeek}
            dayName={DAYS_OF_WEEK[dayOfWeek]!}
            isReadOnly={isReadOnly}
            timeshifts={timeshifts.filter(
              (timeshift) => timeshift.dayOfWeek === dayOfWeek,
            )}
            onAdd={() => {
              setModalDay(dayOfWeek);
              setTimeshiftError(undefined);
            }}
            onRemove={onRemoveTimeshift}
          />
        ))}
      </div>

      {!isReadOnly && (
        <AddTimeshiftModal
          dayName={modalDay !== null ? DAYS_OF_WEEK[modalDay]! : ""}
          error={timeshiftError}
          isOpen={modalDay !== null}
          onAdd={handleAddTimeshift}
          onDismissError={() => setTimeshiftError(undefined)}
          onOpenChange={(open) => {
            if (!open) closeModal();
          }}
        />
      )}
    </>
  );
}
