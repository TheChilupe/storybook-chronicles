import { createFileRoute } from "@tanstack/react-router";
import { AdminLoreList } from "@/components/admin-lore";
export const Route = createFileRoute("/admin/locations/")({
  component: () => <AdminLoreList kind="location" />,
});
