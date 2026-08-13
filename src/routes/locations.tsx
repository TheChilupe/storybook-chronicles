import { createFileRoute } from "@tanstack/react-router";
import { LocationsPage } from "./worlds";
export const Route = createFileRoute("/locations")({
  head: () => ({ meta: [{ title: "Locations — Storybook Codex" }] }),
  component: LocationsPage,
});
