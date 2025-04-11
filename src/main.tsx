import "./index.css";
import App from "./App.tsx";

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

async function enableMocking() {
  if (process.env.NODE_ENV !== "development") {
    return;
  }
  const { worker } = await import("./mocks/browser");
  return worker.start();
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  enableMocking().then(() => {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  });

  //root.render(
  //  <StrictMode>
  //    <App />
  //  </StrictMode>,
  //);
}

//createRoot(document.getElementById('root')!).render(
//  <StrictMode>
//    <App />
//  </StrictMode>,
//)
//
