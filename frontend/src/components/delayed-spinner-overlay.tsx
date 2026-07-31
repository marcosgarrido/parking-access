import { Spinner, type SpinnerRootProps } from "@heroui/react";
import { useEffect, useState } from "react";

type DelayedSpinnerOverlayProps = {
  show: boolean;
  delay?: number;
  className?: string;
  fullScreen?: boolean;
} & SpinnerRootProps;

export function DelayedSpinnerOverlay({
  show,
  delay = 250,
  className = "",
  fullScreen = true,
  ...spinnerProps
}: DelayedSpinnerOverlayProps) {
  const [visible, setVisible] = useState(false);
  const [prevShow, setPrevShow] = useState(show);

  if (show !== prevShow) {
    setPrevShow(show);
    if (!show) setVisible(false);
  }

  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => setVisible(true), delay);

    return () => clearTimeout(timer);
  }, [show, delay]);

  if (!visible) return null;

  return (
    <div
      className={`${fullScreen ? "fixed backdrop-grayscale backdrop-brightness-50" : "absolute"} inset-0 z-50 flex items-center justify-center ${className}`}
    >
      <Spinner {...spinnerProps} className="-translate-y-10" />
    </div>
  );
}
