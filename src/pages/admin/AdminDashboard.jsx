import React from "react";
import { Card, CardBody, Button, Chip } from "@heroui/react";
import MapPanel from "../../components/MapPanel.jsx";

export default function AdminDashboard() {
  const kpis = [
    { label: "Afiliados activos", value: "98", trend: "+2.5%", icon: "person" },
    { label: "Empresas", value: "8", trend: "-1.2%", icon: "corporate_fare" },
    { label: "Visitas semanales", value: "1.204", trend: "+5.4%", icon: "clinical_notes" },
    { label: "Alertas activas", value: "12", trend: "+20%", icon: "emergency_home", tone: "danger" },
    { label: "Insumos pendientes", value: "10", trend: "-3%", icon: "package_2" },
  ];

  const reclamos = [
    { when: "Hace 2 días", title: "Demora en entrega de insumos descartables", status: "Resuelto" },
    { when: "Hace 6 horas", title: "Reprogramación de visita de enfermería", status: "Abierto" },
  ];

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="bg-white dark:bg-[#1a2632] p-5 rounded-2xl border border-[#cfdbe7] dark:border-white/10 shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="material-symbols-outlined p-2 rounded-xl bg-slate-100 dark:bg-[#101922] text-[#137fec]">
                {k.icon}
              </span>

              <span
                className={[
                  "text-[10px] font-black px-2 py-1 rounded-full uppercase",
                  k.trend.startsWith("+")
                    ? "text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20"
                    : "text-rose-700 bg-rose-50 dark:bg-rose-900/20",
                ].join(" ")}
              >
                {k.trend}
              </span>
            </div>

            <p className="text-xs font-bold text-[#4c739a] dark:text-white/60">
              {k.label}
            </p>
            <h3
              className={[
                "text-2xl font-black mt-1",
                k.tone === "danger" ? "text-rose-600" : "dark:text-white",
              ].join(" ")}
            >
              {k.value}
            </h3>
          </div>
        ))}
      </div>

      {/* 2 columnas: Mapa + Acciones / Reclamos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mapa (placeholder bonito) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a2632] rounded-2xl border border-[#cfdbe7] dark:border-white/10 shadow-sm overflow-hidden">
  <div className="p-5 border-b border-[#cfdbe7] dark:border-white/10 flex items-center justify-between">
    <div>
      <h4 className="text-lg font-black flex items-center gap-2">
        <span className="material-symbols-outlined text-[#137fec]">map</span>
        Mapa de monitoreo (interactivo)
      </h4>
      <p className="text-xs text-[#4c739a] dark:text-white/60">
        Zoom, pan, markers y detalle (mock).
      </p>
    </div>
  </div>

  <div className="p-4">
    <MapPanel />
  </div>
</div>


        {/* Acciones + Reclamos */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1a2632] p-5 rounded-2xl border border-[#cfdbe7] dark:border-white/10 shadow-sm">
            <h4 className="text-lg font-black mb-4">Acciones rápidas</h4>

            <div className="space-y-3">
              <QuickBtn title="Nueva Internación" desc="Registrar alta de afiliado" icon="add_circle" />
              <QuickBtn title="Pedido de Insumos" desc="Solicitar stock crítico" icon="local_shipping" />
              <QuickBtn title="Exportar Reporte" desc="Mensual PDF / Excel" icon="summarize" rightIcon="download" />
            </div>
          </div>

          {/* Reclamos (bloque rojo como tu ejemplo) */}
          <div className="bg-white dark:bg-[#1a2632] p-5 rounded-2xl border border-rose-200 dark:border-rose-900/30 shadow-sm">
            <div className="flex items-center gap-2 text-rose-600 mb-4">
              <span className="material-symbols-outlined">report_problem</span>
              <h4 className="text-lg font-black">Reclamos e incidencias</h4>
            </div>

            <div className="space-y-3">
              {reclamos.map((r, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-rose-50 dark:bg-rose-900/10 border-l-4 border-rose-500 rounded-r-xl"
                >
                  <p className="text-[10px] font-black text-rose-600 uppercase">{r.when}</p>
                  <p className="text-xs font-black dark:text-white">{r.title}</p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Estado: <span className="font-bold">{r.status}</span>
                  </p>
                </div>
              ))}

              <Button
                variant="bordered"
                className="w-full border-dashed font-black text-slate-500 dark:text-white/70"
              >
                + Registrar reclamo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickBtn({ title, desc, icon, rightIcon = "chevron_right" }) {
  return (
    <button className="w-full flex items-center justify-between p-3 rounded-xl border border-[#cfdbe7] dark:border-white/10 hover:border-[#137fec] hover:bg-[#137fec]/5 transition-all text-left">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-[#137fec] bg-[#137fec]/10 p-2 rounded-xl">
          {icon}
        </span>
        <div>
          <p className="text-sm font-black dark:text-white">{title}</p>
          <p className="text-[10px] text-[#4c739a] dark:text-white/60 font-bold">{desc}</p>
        </div>
      </div>
      <span className="material-symbols-outlined text-[#4c739a]">{rightIcon}</span>
    </button>
  );
}
