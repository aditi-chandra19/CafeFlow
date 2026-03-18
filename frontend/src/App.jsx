import { BrowserRouter, Routes, Route } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Favorites from "./pages/Favorites";
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

  return (
    <BrowserRouter>

      <Routes>

        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* MENU */}
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/delivery" element={<Delivery />} />

        {/* RESTAURANT */}
        <Route
          path="/restaurant/:id"
          element={
            <ProtectedRoute>
              <RestaurantMenu />
            </ProtectedRoute>
          }
        />

        {/* FAVORITES */}
        <Route path="/favorites" element={<Favorites />} />

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