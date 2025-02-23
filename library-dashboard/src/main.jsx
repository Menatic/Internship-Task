import React from "react";
import { createRoot } from "react-dom/client"; // Import createRoot from react-dom/client
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";

// Create a root element
const root = createRoot(document.getElementById("root"));

// Render the App component
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);