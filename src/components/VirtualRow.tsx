import type { VirtualItem } from "@tanstack/react-virtual";

type Props = {
  vItem: VirtualItem;
  children: React.ReactNode;
  className?: string;
};

export function VirtualRow({ vItem, children, className = "" }: Props) {
  return (
    <div
      className={`absolute top-0 left-0 w-full md:border-b border-rule/50 ${className}`}
      style={{
        transform: `translateY(${vItem.start}px)`,
        height: `${vItem.size}px`,
      }}
    >
      {children}
    </div>
  );
}
