"use client";

import { Users, Stethoscope, FileText } from "lucide-react";
import Link from "next/link";

export default function Sidebar({ open }: { open: boolean }) {
  return (
    <aside
      className={`
        bg-emerald-50
        border-r border-emerald-200
        transition-all duration-300
        ${open ? "w-64" : "w-0"}
        overflow-hidden
      `}
    >
      <div className="h-full flex flex-col">
        {/* BRAND / TITLE */}
        <div className="px-4 py-4 bg-emerald-200">
          <h2 className="text-xl font-bold text-emerald-900 tracking-wide">
            Healthcare
          </h2>
        </div>

        {/* MENU */}
        {/* <nav className="flex-1 p-4 space-y-1 text-emerald-700">
          <MenuItem icon={<Users size={20} />} label="Patients" />
          <MenuItem icon={<Users size={20} />} label="Patients" href="/healthcare/patients" />
          <MenuItem icon={<Stethoscope size={20} />} label="Doctors" />
          <MenuItem icon={<FileText size={20} />} label="Reports" />
        </nav> */}
        <nav className="space-y-2 text-emerald-700">
        <MenuItem icon={<FileText size={20} />} label="Payors" href="/payors" />
        <MenuItem icon={<FileText size={20} />} label="Customers" href="/customers" />
        <MenuItem icon={<FileText size={20} />} label="Providers" href="/providers" />
        <MenuItem icon={<Users size={20} />} label="Members" href="/members" />
        <MenuItem icon={<Stethoscope size={20} />} label="Claims" href="/claims" />
        {/* <MenuItem icon={<FileText size={20} />} label="Reports" href="/reports" /> */}
        </nav>
      </div>
    </aside>
  );
}

/* function MenuItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-emerald-100 transition">
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  );
} */

/* function MenuItem({ icon, label, href }: any) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-2 rounded hover:bg-emerald-200 transition"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
} */

function MenuItem({ icon, label, href }: any) {
  return (
    <Link
      href={href || "#"}  // default ke "#"
      className="flex items-center gap-3 p-2 rounded hover:bg-emerald-200 transition"
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}