import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Card, CardBody, Button, Chip } from "@heroui/react";
import MapPanel from "../../components/admin/MapPanel.jsx";

export default function AdminDashboard() {
  const kpis = [
    { label: "Afiliados activos", value: "98", trend: "+2.5%", href: "/admin/afiliados" },
    { label: "Empresas", value: "8", trend: "-1.2%", href: "/admin/empresas" },
    { label: "Visitas semanales", value: "1.204", trend: "+5.4%", href: "/admin/visitas" },
    { label: "Alertas activas", value: "12", trend: "+20%", href: "/admin/alertas", tone: "danger" },
    { label: "Insumos pendientes", value: "10", trend: "-3%", href: "/admin/insumos" },
  ];

  const reclamos = [
    { when: "Hace 2 días", title: "Demora en entrega de insumos descartables", status: "Resuelto" },
    { when: "Hace 6 horas", title: "Reprogramación de visita de enfermería", status: "Abierto" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <div className="osd-subtitle text-sm text-[var(--osd-slate)]">
            Panel administrativo • Internación domiciliaria
          </div>
          <h1 className="osd-title text-2xl text-[var(--osd-primary)]">
            Dashboard
          </h1>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button as={RouterLink} to="/admin/afiliados" className="osd-btn-primary">
            Ver afiliados
          </Button>
          <Button as={RouterLink} to="/admin/visitas" className="osd-btn-secondary">
            Ver visitas
          </Button>
          <Button
            variant="flat"
            style={{ background: "rgba(18,91,88,0.12)", color: "var(--osd-primary)", fontWeight: 600 }}
            as={RouterLink}
            to="/admin/alertas"
          >
            Alertas
          </Button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((k) => {
          const positive = String(k.trend).trim().startsWith("+");
          return (
            <RouterLink key={k.label} to={k.href} className="block">
              <Card className="osd-surface hover:shadow-[0_18px_42px_rgba(18,91,88,0.16)] transition">
                <CardBody className="p-5 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm text-[var(--osd-slate)] osd-subtitle">
                      {k.label}
                    </div>

                    <span
                      className={[
                        "text-[11px] px-2 py-1 rounded-full border",
                        positive
                          ? "bg-[rgba(169,198,198,0.35)] text-[var(--osd-primary)] border-[rgba(169,198,198,0.75)]"
                          : "bg-[rgba(181,139,133,0.28)] text-[var(--osd-secondary)] border-[rgba(181,139,133,0.45)]",
                      ].join(" ")}
                      style={{ fontWeight: 600 }}
                    >
                      {k.trend}
                    </span>
                  </div>

                  <div
                    className={[
                      "osd-number text-3xl",
                      k.tone === "danger" ? "text-[var(--osd-secondary)]" : "text-slate-900",
                    ].join(" ")}
                  >
                    {k.value}
                  </div>

                  <div className="text-xs text-[var(--osd-slate)]">
                    Ver detalle →
                  </div>
                </CardBody>
              </Card>
            </RouterLink>
          );
        })}
      </div>

      {/* 2 columnas: Mapa + Acciones / Reclamos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mapa */}
        <Card className="osd-surface lg:col-span-2 overflow-hidden">
          <CardBody className="p-0">
            <div className="p-5 border-b border-black/5 flex items-center justify-between">
              <div>
                <h4 className="osd-title text-lg text-slate-900">
                  Mapa de monitoreo
                </h4>
                <p className="text-sm text-[var(--osd-slate)] osd-subtitle">
                  Seguimiento general de afiliados (mock con Leaflet).
                </p>
              </div>

              <Button
                as={RouterLink}
                to="/admin/visitas"
                variant="flat"
                style={{
                  background: "rgba(18,91,88,0.12)",
                  color: "var(--osd-primary)",
                  fontWeight: 600,
                  borderRadius: 9999,
                }}
              >
                Abrir visitas →
              </Button>
            </div>

            <div className="p-4">
              <MapPanel />
            </div>
          </CardBody>
        </Card>

        {/* Acciones + Reclamos */}
        <div className="space-y-6">
          {/* Acciones */}
          <Card className="osd-surface">
            <CardBody className="p-5">
              <h4 className="osd-title text-lg text-slate-900 mb-4">
                Acciones rápidas
              </h4>

              <div className="space-y-3">
                <QuickBtn
                  title="Nuevo afiliado"
                  desc="Alta + diagnóstico + prestaciones"
                  to="/admin/afiliados"
                />
                <QuickBtn
                  title="Pedido de insumos"
                  desc="Ver insumos mensuales / exportar Excel"
                  to="/admin/insumos"
                />
                <QuickBtn
                  title="Exportar reporte"
                  desc="PDF / Excel por período"
                  to="/admin/reportes"
                  rightLabel="Descargar"
                />
              </div>
            </CardBody>
          </Card>

          {/* Reclamos */}
          <Card className="osd-surface">
            <CardBody className="p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <h4 className="osd-title text-lg text-slate-900">
                    Reclamos e incidencias
                  </h4>
                  <p className="text-sm text-[var(--osd-slate)] osd-subtitle">
                    Últimos movimientos (mock)
                  </p>
                </div>

                <Chip className="osd-pill osd-pill-open">Abiertos</Chip>
              </div>

              <div className="space-y-3">
                {reclamos.map((r, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl p-3 border"
                    style={{
                      background: "rgba(255,255,255,0.65)",
                      borderColor: "rgba(169,198,198,0.55)",
                    }}
                  >
                    <div className="text-[11px] text-[var(--osd-slate)]" style={{ fontWeight: 600 }}>
                      {r.when}
                    </div>

                    <div className="text-sm text-slate-900" style={{ fontWeight: 600 }}>
                      {r.title}
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[11px] text-[var(--osd-slate)]">
                        Estado: <b>{r.status}</b>
                      </span>

                      <Button
                        as={RouterLink}
                        to="/admin/reclamos"
                        variant="flat"
                        style={{
                          background: "rgba(18,91,88,0.12)",
                          color: "var(--osd-primary)",
                          fontWeight: 600,
                          borderRadius: 9999,
                        }}
                        size="sm"
                      >
                        Ver →
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  as={RouterLink}
                  to="/admin/reclamos"
                  variant="bordered"
                  className="w-full"
                  style={{ borderStyle: "dashed", borderRadius: 9999, fontWeight: 600 }}
                >
                  + Registrar reclamo
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function QuickBtn({ title, desc, to, rightLabel = "Abrir" }) {
  return (
    <RouterLink
      to={to}
      className="block w-full rounded-2xl border transition hover:shadow-[0_12px_32px_rgba(18,91,88,0.14)]"
      style={{
        background: "rgba(255,255,255,0.60)",
        borderColor: "rgba(169,198,198,0.60)",
      }}
    >
      <div className="p-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm text-slate-900" style={{ fontWeight: 600 }}>
            {title}
          </div>
          <div className="text-[12px] text-[var(--osd-slate)] osd-subtitle">
            {desc}
          </div>
        </div>

        <span
          className="text-[11px] rounded-full px-3 py-1 border"
          style={{
            fontWeight: 600,
            color: "var(--osd-primary)",
            background: "rgba(18,91,88,0.10)",
            borderColor: "rgba(18,91,88,0.18)",
          }}
        >
          {rightLabel} →
        </span>
      </div>
    </RouterLink>
  );
}
