import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu"; // restaurant list page
import RestaurantMenu from "./pages/RestaurantMenu"; // single restaurant menu
import Cart from "./pages/Cart";
import OrderHistory from "./pages/OrderHistory";
import Dashboard from "./pages/Dashboard";
import Payment from "./pages/Payment";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Restaurant List */}
        <Route
          path="/restaurants"
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          }
        />
         <Route
  path="/checkout"
  element={
    <ProtectedRoute>
      <Checkout />
    </ProtectedRoute>
  }
/>
        {/* Single Restaurant Menu */}
        <Route
          path="/restaurant/:id"
          element={
            <ProtectedRoute>
              <RestaurantMenu />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />

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