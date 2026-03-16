import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import RestaurantMenu from "./pages/RestaurantMenu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";
import OrderHistory from "./pages/OrderHistory";
import Dashboard from "./pages/Dashboard";
import BookTable from "./pages/BookTable";
import Delivery from "./pages/Delivery";

function App() {

  // 🌙 Dark mode state
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // apply theme
  useEffect(() => {

  if (darkMode) {
    document.body.style.background = "hsla(0, 2%, 20%, 0.45)";
    localStorage.setItem("theme", "dark");
  } else {
    document.body.style.background = "#f8fafc";
    localStorage.setItem("theme", "light");
  }

}, [darkMode]);

  return (
    <BrowserRouter>

      {/* DARK MODE BUTTON */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          padding: "8px 16px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          background: "#111",
          color: "white",
          zIndex: 9999
        }}
      >
        {darkMode ? "☀ Light" : "🌙 Dark"}
      </button>

      <Routes>

        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* RESTAURANT LIST */}
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          }
        />

        <Route path="/delivery" element={<Delivery />} />

        {/* RESTAURANT MENU */}
        <Route
          path="/restaurant/:id"
          element={
            <ProtectedRoute>
              <RestaurantMenu />
            </ProtectedRoute>
          }
        />

        {/* CART */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* CHECKOUT */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        {/* PAYMENT */}
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        {/* SUCCESS */}
        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />

        {/* ORDERS */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />

        {/* BOOK TABLE */}
        <Route
          path="/book-table"
          element={
            <ProtectedRoute>
              <BookTable />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;