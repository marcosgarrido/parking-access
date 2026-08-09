import type { TimeshiftBase } from "@parking-access/schemas";

function toMinutes(time?: string | null): number {
  if (!time) return 0;
  const [hours, minutes] = time.split(":").map(Number);

  return (hours ?? 0) * 60 + (minutes ?? 0);
}

function coversFullDay(normalShifts: TimeshiftBase[]): boolean {
  const sorted = normalShifts
    .map((shift) => ({
      start: toMinutes(shift.startTime),
      end: shift.endTime === "00:00" ? 1440 : toMinutes(shift.endTime),
    }))
    .sort((a, b) => a.start - b.start);

  let covered = 0;
  let blockStart = sorted[0].start;
  let blockEnd = sorted[0].end;

  for (let i = 1; i < sorted.length; i++) {
    const curr = sorted[i];

    if (curr.start > blockEnd) {
      covered += blockEnd - blockStart;
      blockStart = curr.start;
      blockEnd = curr.end;
    } else {
      blockEnd = Math.max(blockEnd, curr.end);
    }
  }
  covered += blockEnd - blockStart;

  return covered >= 1440;
}

/**
 * Normaliza una lista de franjas horarias por día, para que:
 * - Si hay una franja "todo el día" para un día, solo se guarda esa.
 * - Si varias franjas normales cubren el día completo entre todas, se fusionan en una "todo el día".
 * - Si no, se dejan las franjas normales tal cual.
 */
export function normalizeTimeshifts(
  timeshifts: TimeshiftBase[],
): TimeshiftBase[] {
  const grouped: Record<number, TimeshiftBase[]> = {};

  for (const timeshift of timeshifts) {
    (grouped[timeshift.dayOfWeek] ??= []).push(timeshift);
  }

  const result: TimeshiftBase[] = [];

  for (const [day, shifts] of Object.entries(grouped)) {
    const dayOfWeek = Number(day);
    const allDayShifts = shifts.filter((shift) => shift.allDay);

    if (allDayShifts.length > 0) {
      result.push({ dayOfWeek, allDay: true });
      continue;
    }

    const normalShifts = shifts.filter((shift) => !shift.allDay);

    if (normalShifts.length === 0) continue;

    if (coversFullDay(normalShifts)) {
      result.push({ dayOfWeek, allDay: true });
    } else {
      result.push(
        ...normalShifts.map((shift) => ({ ...shift, allDay: false })),
      );
    }
  }

  return result;
}
