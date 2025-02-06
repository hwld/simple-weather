import { ReactNode } from "react";

export function KbdGuide({
  keys,
  description,
}: {
  keys: ReactNode;
  description: string;
}) {
  return (
    <div className="items-center gap-1 hidden sm:flex">
      {keys}
      <p className="text-xs">{description}</p>
    </div>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="bg-base-200 rounded-sm text-xs border border-base-300 h-5 px-1 flex items-center leading-none">
      {children}
    </kbd>
  );
}
