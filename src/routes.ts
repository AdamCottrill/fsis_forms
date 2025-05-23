import { createBrowserRouter } from "react-router";
import { StockingEventForm } from "./pages/StockingEventForm";
import { LotCreator } from "./pages/LotCreator";
import { AppliedTags } from "./pages/AppliedTags";

const router = createBrowserRouter([
  {
    path: "/",
    Component: StockingEventForm,
  },

  {
    path: "/create_lot",
    Component: LotCreator,
  },
  {
    path: "/applied_tags",
    Component: AppliedTags,
  },
]);

export default router;
