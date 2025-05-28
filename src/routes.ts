import { createBrowserRouter } from "react-router";
import { StockingEventForm } from "./pages/StockingEventForm";
import { LotCreator } from "./pages/LotCreator";

const router = createBrowserRouter([
  {
    path: "/",
    Component: StockingEventForm,
  },

  {
    path: "/create_lot",
    Component: LotCreator,
  },
]);

export default router;
