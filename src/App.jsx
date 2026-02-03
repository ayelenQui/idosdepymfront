import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ReclamosPage from "./pages/admin/ReclamosPage";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          {/* rutas placeholder (después armamos pantallas) */}
          <Route path="empresas" element={<div className="p-6">Empresas (pendiente)</div>} />
          <Route path="afiliados" element={<div className="p-6">Afiliados (pendiente)</div>} />
          <Route path="visitas" element={<div className="p-6">Visitas (pendiente)</div>} />
          <Route path="alertas" element={<div className="p-6">Alertas (pendiente)</div>} />
          <Route path="insumos" element={<div className="p-6">Insumos (pendiente)</div>} />
          <Route path="informes" element={<div className="p-6">Informes (pendiente)</div>} />
          <Route path="reportes" element={<div className="p-6">Reportes (pendiente)</div>} />
          <Route path="reclamos" element={<ReclamosPage />} />
        </Route>

        {/* redir simple */}
        <Route path="*" element={<div className="p-6">Ir a <a className="text-[#137fec] font-bold bg-[#137fec]/10 px-2 py-1 rounded-lg" href="/admin">/admin</a></div>} />
      </Routes>
    </BrowserRouter>
  );
}
