import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My Expenses — whimsical expense tracker" },
      { name: "description", content: "A playful, colorful way to track your daily expenses, budgets and goals." },
      { property: "og:title", content: "My Expenses" },
      { property: "og:description", content: "A playful, colorful way to track your expenses." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <iframe
      src="/app/index.html"
      title="My Expenses"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: 0 }}
    />
  );
}
