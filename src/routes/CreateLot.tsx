import { createFileRoute } from "@tanstack/react-router";

import { LotCreator } from "../pages/LotCreator";

export const Route = createFileRoute("/CreateLot")({
  component: CreateLot,
});

function CreateLot() {
  return <LotCreator />;
}
