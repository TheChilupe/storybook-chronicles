import { createFileRoute } from "@tanstack/react-router";
import { AdminLoreEditor } from "@/components/admin-lore";
export const Route = createFileRoute("/admin/factions/new")({
  component: () => <AdminLoreEditor kind="faction" />,
});
