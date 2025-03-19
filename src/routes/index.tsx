import { createFileRoute } from "@tanstack/react-router";

import { StockingEventForm } from "../pages/StockingEventForm";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <StockingEventForm />;
}
