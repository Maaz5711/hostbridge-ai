"use client";

import WorkspaceShell from "@/components/workspace/WorkspaceShell";

export default function WorkspaceClient({
  children,
  propertyId,
  propertyName,
}: {
  children: React.ReactNode;
  propertyId: string;
  propertyName: string;
}) {
  return (
    <WorkspaceShell
      propertyId={propertyId}
      propertyName={propertyName}
    >
      {children}
    </WorkspaceShell>
  );
}