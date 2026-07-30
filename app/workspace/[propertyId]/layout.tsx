import WorkspaceShell from "@/components/workspace/WorkspaceShell";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;

  const { data: property } = await supabase
    .from("properties")
    .select("property_name")
    .eq("property_id", propertyId)
    .single();

  return (
    <WorkspaceShell
      propertyId={propertyId}
      propertyName={property?.property_name || "Demo Property"}
    >
      {children}
    </WorkspaceShell>
  );
}