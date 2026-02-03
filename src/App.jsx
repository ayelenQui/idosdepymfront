import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ReclamosPage from "./pages/admin/ReclamosPage";

import LandingIndex from "./pages/LandingIndex";
import AfiliadoHome from "./pages/afiliado/AfiliadoHome";
import EmpresaHome from "./pages/empresa/EmpresaHome";
import ProfesionalHome from "./pages/profesional/ProfesionalHome";
import AfiliadoDashboard from "./pages/afiliado/AfiliadoDashboard";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Landing */}
        <Route path="/" element={<LandingIndex />} />

        {/* ✅ Roles */}
        <Route path="/afiliado" element={<AfiliadoHome />} />
       
        <Route path="/empresa" element={<EmpresaHome />} />
        <Route path="/profesional" element={<ProfesionalHome />} />

        {/* ✅ Admin */}
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

        {/* ✅ 404 (mejor UX) */}
        <Route
          path="*"
          element={
            <div className="p-6">
              <div className="mb-3 font-bold">Página no encontrada</div>
              <div className="flex gap-2">
                <Link
                  className="text-[#137fec] font-bold bg-[#137fec]/10 px-2 py-1 rounded-lg"
                  to="/"
                >
                  Ir al inicio
                </Link>
                <Link
                  className="text-[#137fec] font-bold bg-[#137fec]/10 px-2 py-1 rounded-lg"
                  to="/admin"
                >
                  Ir a /admin
                </Link>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
