import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider>
      <QueryClientProvider client={client}>
        <App />
      </QueryClientProvider>
    </MantineProvider>
  </StrictMode>
);
