"use client";

import Sidebar from "./Sidebar";

export default function WorkspaceShell({
  children,
  propertyId,
  propertyName,
}: {
  children: React.ReactNode;
  propertyId: string;
  propertyName: string;
}) {
  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <Sidebar
        propertyId={propertyId}
        propertyName={propertyName}
      />

      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}