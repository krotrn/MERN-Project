import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider, Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import store from "./redux/store.js";
import App from "./App.jsx";
import "./index.css";

// Pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";

// Create router with route definitions
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} /> {/* Default route */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>
  )
);

// Mount the React app to the DOM
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
