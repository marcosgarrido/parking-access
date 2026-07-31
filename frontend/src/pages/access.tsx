import { Button, Chip, Surface, Switch, Toast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

import { holdDoor, openDoor } from "@/api/door";
import WebRTCPlayer from "@/components/webrtc-player";
import { WS_EVENTS } from "@/constants/ws-events";
import { useSocketSubscribe } from "@/hooks/use-socket-subscribe";
import { getSocket } from "@/services/ws/ws-client";

export default function AccessPage() {
  const [doorHoldEnabled, setDoorHoldEnabled] = useState(false);
  const [doorOpenerOnline, setDoorOpenerOnline] = useState<boolean | null>(
    null,
  );
  const [callReceiverOnline, setCallReceiverOnline] = useState<boolean | null>(
    null,
  );
  const [waitingDoorHoldAck, setWaitingDoorHoldAck] = useState(false);

  useSocketSubscribe(WS_EVENTS.DOOR_AVAILABILITY, (message) => {
    const online = message.trim().toUpperCase() === "ONLINE";

    setDoorOpenerOnline(online);
    if (!online) {
      setDoorHoldEnabled(false);
      setWaitingDoorHoldAck(false);
    }
  });

  useSocketSubscribe(WS_EVENTS.GSM_AVAILABILITY, (message) => {
    setCallReceiverOnline(message.trim().toUpperCase() === "ONLINE");
  });

  useSocketSubscribe(WS_EVENTS.DOOR_STATE, (message) => {
    setDoorHoldEnabled(message.trim().toUpperCase() === "ON");
    setWaitingDoorHoldAck(false);
  });

  useSocketSubscribe(WS_EVENTS.DOOR_EVENT, (message) => {
    if (message.trim().toUpperCase() === "PULSE_DONE") {
      Toast.toast.success("Abriendo puerta", { timeout: 1500 });
    }
  });

  useEffect(() => {
    const socket = getSocket();

    const onDisconnect = () => {
      setDoorOpenerOnline(false);
      setCallReceiverOnline(false);
      setWaitingDoorHoldAck(false);
    };

    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDoorOpenerOnline((prev) => (prev === null ? false : prev));
      setCallReceiverOnline((prev) => (prev === null ? false : prev));
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  const handleOpen = async () => {
    if (doorOpenerOnline !== true) return;

    try {
      await openDoor();
    } catch (err) {
      if ((err as { status?: number }).status !== 401) {
        Toast.toast.danger("No se pudo abrir la puerta");
      }
    }
  };

  const handleSwitchChange = async (isSelected: boolean) => {
    if (doorOpenerOnline !== true) return;

    setWaitingDoorHoldAck(true);
    try {
      await holdDoor(isSelected);
    } catch {
      setWaitingDoorHoldAck(false);
    }
  };

  return (
    <section className="flex justify-center w-full">
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="flex w-full gap-4 items-center">
          <Button
            variant="primary"
            isDisabled={doorOpenerOnline !== true || doorHoldEnabled}
            onPress={handleOpen}
          >
            Abrir Puerta
          </Button>

          <Switch
            isDisabled={doorOpenerOnline !== true || waitingDoorHoldAck}
            isSelected={doorHoldEnabled}
            onChange={handleSwitchChange}
          >
            <Switch.Content>
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              Mantener abierta
            </Switch.Content>
          </Switch>

          <div className="flex gap-3 ml-auto text-sm">
            {doorOpenerOnline === false && (
              <Chip color="danger" variant="soft">
                <Icon className="size-4 ml-1" icon="lucide:triangle-alert" />
                <Chip.Label>Dispositivo de apertura desconectado</Chip.Label>
              </Chip>
            )}
            {callReceiverOnline === false && (
              <Chip color="danger" variant="soft">
                <Icon className="size-4 ml-1" icon="lucide:triangle-alert" />
                <Chip.Label>Receptor de llamadas desconectado</Chip.Label>
              </Chip>
            )}
          </div>
        </div>

        <Surface className="w-full aspect-video p-4">
          <WebRTCPlayer src="/camera/whep" />
        </Surface>
      </div>
    </section>
  );
}
