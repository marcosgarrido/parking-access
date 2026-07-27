import { Icon } from "@iconify/react";

type IconMessageProps = {
  icon: string;
  message: string;
};

export default function IconMessage({ icon, message }: IconMessageProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
      <Icon className="size-12 text-muted" icon={icon} />
      <span className="text-lg text-muted">{message}</span>
    </div>
  );
}
