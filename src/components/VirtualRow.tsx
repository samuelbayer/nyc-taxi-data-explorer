import type { VirtualItem } from "@tanstack/react-virtual";

type Props = {
  vItem: VirtualItem;
  children: React.ReactNode;
  className?: string;
  pageStart: number;
};

export function VirtualRow({
  pageStart,
  vItem,
  children,
  className = "",
}: Props) {
  return (
    <div
      role="row"
      aria-rowindex={vItem.index + 2 + pageStart}
      className={`absolute top-0 left-0 w-full xl:border-b border-slate-900 ${className}`}
      style={{
        transform: `translateY(${vItem.start}px)`,
        height: `${vItem.size}px`,
      }}
    >
      {children}
    </div>
  );
}
