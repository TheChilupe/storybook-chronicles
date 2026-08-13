import { createFileRoute } from "@tanstack/react-router";
import { AdminLoreList } from "@/components/admin-lore";
export const Route = createFileRoute("/admin/factions/")({
  component: () => <AdminLoreList kind="faction" />,
});
