import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Root } from './app/Root'
import { Home } from './app/pages/Home'
import { ProductDetail } from './app/pages/ProductDetail'
import { Cart } from './app/pages/Cart'
import { Login } from './app/pages/Login'
import { Register } from './app/pages/Register'
import { Checkout } from './app/pages/Checkout'
import { MyOrders } from './app/pages/MyOrders'
import { NotFound } from './app/pages/NotFound'
import { ProductListScreen } from './app/pages/ProductListScreen'
import { ProductCreateScreen } from './app/pages/ProductCreateScreen'
import { ProductEditScreen } from './app/pages/ProductEditScreen'
import { AdminRoot } from './app/AdminRoot'
import { OrderListScreen } from './app/pages/admin/OrderListScreen'
import { OrderDetailScreen } from './app/pages/OrderDetailScreen'
import { AuthProvider } from './app/context/AuthContext'
import './index.css'
import { AdminDashboardScreen } from './app/pages/admin/AdminDashboardScreen'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* LAYOUT USER */}
        <Route element={<Root />}>
          <Route index element={<Home />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="order/:id" element={<OrderDetailScreen />} />
        </Route>

        {/* LAYOUT ADMIN */}
// Di dalam Routes
<Route element={<AdminRoot />}>
  {/* Dashboard kita arahkan sementara ke OrderListScreen agar tidak kosong */}
  <Route path="admin/dashboard" element={<AdminDashboardScreen />} />
  
  <Route path="admin/productsList" element={<ProductListScreen />} />
  <Route path="admin/ordersList" element={<OrderListScreen />} />
  
  <Route path="admin/Product/create" element={<ProductCreateScreen />} />
  <Route path="admin/product/:id/edit" element={<ProductEditScreen />} />
  <Route path="admin/order/:id" element={<OrderDetailScreen />} />
</Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)