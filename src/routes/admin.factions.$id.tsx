import { createFileRoute } from "@tanstack/react-router";
import { AdminLoreEditor } from "@/components/admin-lore";
export const Route = createFileRoute("/admin/factions/$id")({ component: Page });
function Page() {
  const { id } = Route.useParams();
  return <AdminLoreEditor kind="faction" id={id} />;
}
