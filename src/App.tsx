import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
//import { StockingEventForm } from "./pages/StockingEventForm";

import { LotFinder } from "./pages/LotFinder";

import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <LotFinder />
      </QueryClientProvider>
    </>
  );
}

export default App;
