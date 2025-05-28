import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, UNSAFE_createClientRoutesWithHMRRevalidationOptOut } from "react-router";
import App from './App.jsx';
import ShopAll from './pages/ShopAll.jsx';
import Previewpage from './pages/Previewpage.jsx';
import Home from './pages/Home.jsx';
import Filter from '../src/js/Pages/components/Filter.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DashboardUser from './pages/DashboardUser.jsx';
import ManageOrders from './pages/ManageOrders.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} >
          <Route index element={<Home />} />
          <Route path='/shop-all' element={<ShopAll />} />
          <Route path='/preview-page' element={<Previewpage />} />
          <Route path='/filter' element={<Filter />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/dashboarduser' element={<DashboardUser />} />
          <Route path='/manageorders' element={<ManageOrders />} />
        </Route >
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
