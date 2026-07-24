"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  propertyId: string;
  propertyName?: string;
};

const navigation = [
  {
    name: "Overview",
    path: "",
    icon: "⌂",
  },
  {
  name: "AI Inbox",
  path: "/inbox",
  icon: "✉",
},
  {
    name: "Conversations",
    path: "/conversations",
    icon: "✉",
  },
  {
    name: "AI Simulator",
    path: "/simulator",
    icon: "◉",
  },
  {
    name: "Availability",
    path: "/availability",
    icon: "▣",
  },
  {
    name: "Escalations",
    path: "/escalations",
    icon: "!",
  },
  {
    name: "Automation Activity",
    path: "/activity",
    icon: "↗",
  },
  {
    name: "System Errors",
    path: "/system-errors",
    icon: "×",
  },
  {
    name: "Properties",
    path: "/properties",
    icon: "⌂",
  },
];

export default function Sidebar({
  propertyId,
  propertyName = "Demo Property",
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/10 bg-[#05070a]">
      {/* Logo */}
      <div className="border-b border-white/10 px-6 py-5">
        <Link href="/">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white font-bold text-black">
              A
            </div>

            <div>
              <p className="text-sm font-semibold tracking-tight">
                AIRBOT AI
              </p>

              <p className="text-xs text-gray-500">
                AI Guest Automation
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Property */}
      <div className="border-b border-white/10 px-4 py-4">
        <p className="px-2 text-xs uppercase tracking-widest text-gray-600">
          Property
        </p>

        <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3">
          <p className="truncate text-sm font-medium text-white">
            {propertyName}
          </p>

          <p className="mt-1 text-xs text-green-400">
            ● Automation Online
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navigation.map((item) => {
          const href = `/workspace/${propertyId}${item.path}`;

          const isActive =
            item.path === ""
              ? pathname === `/workspace/${propertyId}`
              : pathname.startsWith(href);

          return (
            <Link
              key={item.name}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              <span className="flex h-6 w-6 items-center justify-center text-xs">
                {item.icon}
              </span>

              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 p-4">
        <Link
          href="/setup"
          className="block rounded-lg px-3 py-2 text-sm text-gray-500 transition hover:bg-white/[0.05] hover:text-white"
        >
          ← Switch Property
        </Link>
      </div>
    </aside>
  );
}