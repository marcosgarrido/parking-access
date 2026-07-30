import { DoorHoldBodySchema } from "@parking-access/schemas";

import { apiFetch } from "@/api/client";

export async function openDoor() {
  await apiFetch("/api/door/open", { method: "POST" });
}

export async function holdDoor(hold: boolean) {
  const safe = DoorHoldBodySchema.safeParse({ hold });

  if (!safe.success) throw new Error("Datos no válidos");

  await apiFetch("/api/door/hold", {
    method: "POST",
    body: JSON.stringify(safe.data),
  });
}
