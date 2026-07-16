import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/storybook-chronicles")({
  head: () => ({
    meta: [
      { title: "Storybook Chronicles — Portfolio Project" },
      {
        name: "description",
        content:
          "Featured portfolio project: the Storybook Chronicles saga — worldbuilding, characters, factions, and long-form narrative planning.",
      },
    ],
  }),
  component: () => <Outlet />,
});