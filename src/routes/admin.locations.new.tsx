import { createFileRoute } from "@tanstack/react-router";
import { AdminLoreEditor } from "@/components/admin-lore";
export const Route = createFileRoute("/admin/locations/new")({
  component: () => <AdminLoreEditor kind="location" />,
});
