import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import react from "react";

export function Root() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-white font-['Inter']">
          <Navbar />
          <main>
            <Outlet />
          </main>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
