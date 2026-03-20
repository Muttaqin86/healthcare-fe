import { ReactNode } from "react";

export default function SidebarItem({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded hover:bg-slate-700 cursor-pointer">
      {icon}
      <span>{label}</span>
    </div>
  );
}
