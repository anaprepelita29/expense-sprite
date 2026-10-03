import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cheltuielile mele — whimsical expense tracker" },
      { name: "description", content: "A playful, colorful way to track your daily expenses, budgets and goals." },
      { property: "og:title", content: "Cheltuielile mele" },
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
      title="Cheltuielile mele"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: 0 }}
    />
  );
}
