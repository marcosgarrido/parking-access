import { Button, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import type { TimeshiftBase } from "@parking-access/schemas";

type ScheduleDayProps = {
  dayName: string;
  timeshifts: TimeshiftBase[];
  isReadOnly?: boolean;
  onAdd: () => void;
  onRemove: (timeshift: TimeshiftBase) => void;
};

function toMinutes(time?: string | null): number {
  if (!time) return 0;
  const [hours, minutes] = time.split(":").map(Number);

  return (hours ?? 0) * 60 + (minutes ?? 0);
}

export default function ScheduleDay({
  dayName,
  timeshifts,
  isReadOnly = false,
  onAdd,
  onRemove,
}: ScheduleDayProps) {
  const hasAllDay = timeshifts.some((timeshift) => timeshift.allDay);

  const sortedTimeshifts = [...timeshifts].sort((a, b) => {
    if (a.allDay) return -1;
    if (b.allDay) return 1;

    return toMinutes(a.startTime) - toMinutes(b.startTime);
  });

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1">
        <h3 className="text-sm font-medium">
          {dayName.charAt(0).toUpperCase() + dayName.slice(1)}
        </h3>
        {!isReadOnly && (
          <Button
            isIconOnly
            aria-label={`Añadir franja horaria el ${dayName}`}
            isDisabled={hasAllDay}
            size="sm"
            variant={hasAllDay ? "secondary" : "primary"}
            onPress={onAdd}
          >
            {!hasAllDay && <Icon icon="lucide:plus" />}
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2 pt-2">
        {sortedTimeshifts.length === 0 ? (
          <span className="text-muted text-xs">Sin franjas</span>
        ) : (
          sortedTimeshifts.map((timeshift, index) => (
            <Chip key={index} color="accent" size="sm" variant="primary">
              <Chip.Label>
                {timeshift.allDay
                  ? "Todo el día"
                  : `${timeshift.startTime} - ${timeshift.endTime}`}
              </Chip.Label>
              {!isReadOnly && (
                <button
                  aria-label="Eliminar franja"
                  className="cursor-pointer rounded-full bg-white/70 p-0.5 text-accent transition-opacity hover:bg-white"
                  type="button"
                  onClick={() => onRemove(timeshift)}
                >
                  <Icon icon="lucide:x" />
                </button>
              )}
            </Chip>
          ))
        )}
      </div>
    </div>
  );
}
