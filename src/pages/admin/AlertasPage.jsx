import React from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Select,
  SelectItem,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";

/** ====== helpers ====== */
const TIPOS = [
  { key: "internacion", label: "Solicitud de Internación" },
  { key: "medicacion", label: "Nueva Medicación" },
  { key: "estudio", label: "Nuevo Estudio" },
  { key: "sin_visitas", label: "Sin Visitas Registradas" },
  { key: "oxigeno", label: "Sin Oxígeno / Crítico" },
  { key: "admin", label: "Administrativo / Documentación" },
];

const SEVERIDADES = ["CRITICA", "ABIERTA", "INFO"];

function tipoLabel(key) {
  return TIPOS.find((t) => t.key === key)?.label ?? key;
}

function pillClass(sev) {
  if (sev === "CRITICA") return "osd-pill osd-pill-critical";
  if (sev === "ABIERTA") return "osd-pill osd-pill-open";
  return "osd-pill osd-pill-ok";
}

function leftBarColor(sev) {
  if (sev === "CRITICA") return "var(--osd-secondary)";
  if (sev === "ABIERTA") return "var(--osd-caramel)";
  return "var(--osd-primary)";
}

export default function AdminAlertas() {
  const [q, setQ] = React.useState("");
  const [tipo, setTipo] = React.useState("all");
  const [sev, setSev] = React.useState("all");

  const [open, setOpen] = React.useState(false);
  const [detalle, setDetalle] = React.useState(null);

  // ✅ MOCK DATA (ejemplos que pediste)
  const [alertas, setAlertas] = React.useState([
    {
      id: "ALT-9001",
      tipo: "internacion",
      severidad: "CRITICA",
      titulo: "Se solicitó internación domiciliaria",
      descripcion:
        "Ingreso a ID solicitado. Falta confirmar empresa prestadora y cronograma inicial de visitas.",
      afiliado: "Gómez, Blas Shadi",
      nroAfiliado: "27945233473/01",
      fecha: "2026-02-03",
      origen: "Auditoría Médica",
      responsable: "Coordinación ID",
      extra: {
        motivo: "Post alta hospitalaria",
        requiere: ["Enfermería 12hs", "Oxígeno", "Kinesiología"],
        nota: "Coordinar inicio en < 24hs.",
      },
    },
    {
      id: "ALT-9002",
      tipo: "oxigeno",
      severidad: "CRITICA",
      titulo: "Sin oxígeno / requerimiento crítico",
      descripcion:
        "Se indicó O2. No hay confirmación de entrega en domicilio ni proveedor asignado.",
      afiliado: "Pérez, Juan",
      nroAfiliado: "12-45879-01",
      fecha: "2026-02-03",
      origen: "Empresa ID",
      responsable: "Logística / Proveedor",
      extra: {
        motivo: "SatO2 baja en control",
        requiere: ["Concentrador", "Tubo backup", "Cánulas"],
        nota: "Escalar a guardia de insumos.",
      },
    },
    {
      id: "ALT-9003",
      tipo: "sin_visitas",
      severidad: "ABIERTA",
      titulo: "No hay registro de visitas",
      descripcion:
        "No se registraron visitas en los últimos 3 días para este afiliado.",
      afiliado: "Sánchez, Marta",
      nroAfiliado: "22-11001-09",
      fecha: "2026-02-02",
      origen: "Sistema (regla 72hs)",
      responsable: "Empresa ID",
      extra: {
        regla: "Sin carga de visitas 72hs",
        accion: "Confirmar asistencia y cargar visitas pendientes",
      },
    },
    {
      id: "ALT-9004",
      tipo: "medicacion",
      severidad: "INFO",
      titulo: "Nueva medicación cargada",
      descripcion:
        "Se registró cambio en esquema. Validar descartables y coordinación de horarios.",
      afiliado: "Rossi, Diego",
      nroAfiliado: "15-33002-02",
      fecha: "2026-02-01",
      origen: "Profesional",
      responsable: "Auditoría",
      extra: {
        medicacion: "Antibiótico EV",
        pauta: "Cada 12hs por 7 días",
      },
    },
    {
      id: "ALT-9005",
      tipo: "estudio",
      severidad: "INFO",
      titulo: "Nuevo estudio disponible",
      descripcion:
        "Se cargó laboratorio. Revisar resultados y posible ajuste terapéutico.",
      afiliado: "Díaz, Carla",
      nroAfiliado: "19-88210-07",
      fecha: "2026-02-01",
      origen: "Empresa ID",
      responsable: "Médico Auditor",
      extra: {
        estudio: "Hemograma + Ionograma",
        estado: "Pendiente interpretación",
      },
    },
    {
      id: "ALT-9006",
      tipo: "admin",
      severidad: "ABIERTA",
      titulo: "Falta documentación (orden / remito)",
      descripcion:
        "No se adjuntó orden médica completa o remito de entrega de insumos.",
      afiliado: "López, Ana",
      nroAfiliado: "10-45001-03",
      fecha: "2026-01-31",
      origen: "Sistema (checklist)",
      responsable: "Mesa de Entradas",
      extra: {
        faltante: ["Orden médica firmada", "Remito proveedor"],
      },
    },
  ]);

  const filtered = React.useMemo(() => {
    const qq = q.trim().toLowerCase();
    return alertas.filter((a) => {
      const hitText =
        !qq ||
        a.titulo.toLowerCase().includes(qq) ||
        a.descripcion.toLowerCase().includes(qq) ||
        a.afiliado.toLowerCase().includes(qq) ||
        a.nroAfiliado.toLowerCase().includes(qq);

      const hitTipo = tipo === "all" || a.tipo === tipo;
      const hitSev = sev === "all" || a.severidad === sev;

      return hitText && hitTipo && hitSev;
    });
  }, [alertas, q, tipo, sev]);

  const counters = React.useMemo(() => {
    const crit = alertas.filter((x) => x.severidad === "CRITICA").length;
    const abiertas = alertas.filter((x) => x.severidad === "ABIERTA").length;
    const info = alertas.filter((x) => x.severidad === "INFO").length;
    return { crit, abiertas, info };
  }, [alertas]);

  const ver = (a) => {
    setDetalle(a);
    setOpen(true);
  };

  const marcarResuelta = (a) => {
    setAlertas((prev) => prev.filter((x) => x.id !== a.id));
    if (detalle?.id === a.id) {
      setOpen(false);
      setDetalle(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div
            className="text-xs font-extrabold uppercase tracking-wider"
            style={{ color: "var(--osd-slate)" }}
          >
            Admin • Monitor
          </div>
          <div
            className="text-2xl md:text-3xl font-black"
            style={{ color: "#0f1b1b" }}
          >
            Alertas de Internación Domiciliaria
          </div>
          <div className="text-sm mt-1" style={{ color: "#223535" }}>
            Eventos críticos, cambios clínicos y control operativo (mock).
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="osd-pill osd-pill-critical">Críticas: {counters.crit}</span>
          <span className="osd-pill osd-pill-open">Abiertas: {counters.abiertas}</span>
          <span className="osd-pill osd-pill-ok">Info: {counters.info}</span>

          <Button className="osd-btn-primary" onPress={() => alert("Mock: crear alerta")}>
            + Crear alerta
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="osd-surface border-none">
        <CardBody className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              label="Buscar"
              placeholder="Afiliado, N° afiliado, título..."
              value={q}
              onValueChange={setQ}
            />

            <Select
              label="Tipo"
              selectedKeys={[tipo]}
              onSelectionChange={(keys) => setTipo(Array.from(keys)[0])}
            >
              <SelectItem key="all">Todos</SelectItem>
              {TIPOS.map((t) => (
                <SelectItem key={t.key}>{t.label}</SelectItem>
              ))}
            </Select>

            <Select
              label="Severidad"
              selectedKeys={[sev]}
              onSelectionChange={(keys) => setSev(Array.from(keys)[0])}
            >
              <SelectItem key="all">Todas</SelectItem>
              {SEVERIDADES.map((s) => (
                <SelectItem key={s}>{s}</SelectItem>
              ))}
            </Select>
          </div>

          <Divider className="my-4" />

          <div
            className="flex flex-wrap items-center justify-between gap-2 text-xs"
            style={{ color: "var(--osd-slate)" }}
          >
            <span>
              Mostrando <span className="font-black">{filtered.length}</span> alerta/s
            </span>
            <span>
              Regla mock: <span className="font-black">sin visitas 72hs</span> ⇒ ABIERTA
            </span>
          </div>
        </CardBody>
      </Card>

      {/* Listado */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filtered.map((a) => (
          <Card key={a.id} className="border-none shadow-md hover:shadow-lg transition">
            <CardBody className="p-0">
              <div className="relative p-4">
                {/* barra lateral por severidad */}
                <span
                  className="absolute left-0 top-3 bottom-3 w-[5px] rounded-full"
                  style={{ background: leftBarColor(a.severidad) }}
                />

                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-black text-[15px]" style={{ color: "#0f1b1b" }}>
                        {a.titulo}
                      </div>

                      <span className={pillClass(a.severidad)}>{a.severidad}</span>

                      <span
                        className="osd-pill"
                        style={{
                          background: "rgba(130,158,161,0.16)",
                          border: "1px solid rgba(130,158,161,0.35)",
                          color: "var(--osd-slate)",
                        }}
                      >
                        {tipoLabel(a.tipo)}
                      </span>
                    </div>

                    <div className="text-sm mt-1" style={{ color: "#223535" }}>
                      {a.descripcion}
                    </div>

                    <div className="text-xs mt-2 flex flex-wrap gap-x-4 gap-y-1" style={{ color: "var(--osd-slate)" }}>
                      <span className="font-bold">Afiliado:</span> {a.afiliado}
                      <span className="font-bold">N°:</span> {a.nroAfiliado}
                      <span className="font-bold">Fecha:</span> {a.fecha}
                    </div>

                    <div className="text-xs mt-1" style={{ color: "var(--osd-slate)" }}>
                      Origen: <span className="font-black">{a.origen}</span> • Responsable:{" "}
                      <span className="font-black">{a.responsable}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Button className="osd-btn-primary" size="sm" onPress={() => ver(a)}>
                      Ver
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      style={{
                        background: "rgba(15,23,42,0.06)",
                        color: "#0f1b1b",
                        borderRadius: 9999,
                        fontWeight: 800,
                      }}
                      onPress={() => marcarResuelta(a)}
                    >
                      Resuelta
                    </Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Modal detalle */}
      <Modal isOpen={open} onOpenChange={setOpen} size="lg" placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {detalle?.titulo ?? "Detalle"}
                <span className="text-xs opacity-70">
                  {detalle?.id} • {detalle ? tipoLabel(detalle.tipo) : ""}
                </span>
              </ModalHeader>

              <ModalBody className="space-y-4">
                {detalle && (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={pillClass(detalle.severidad)}>{detalle.severidad}</span>
                      <span
                        className="osd-pill"
                        style={{
                          background: "rgba(130,158,161,0.16)",
                          border: "1px solid rgba(130,158,161,0.35)",
                          color: "var(--osd-slate)",
                        }}
                      >
                        {detalle.origen}
                      </span>
                      <span
                        className="osd-pill"
                        style={{
                          background: "rgba(18, 91, 88, 0.12)",
                          border: "1px solid rgba(18, 91, 88, 0.25)",
                          color: "var(--osd-primary)",
                        }}
                      >
                        Responsable: {detalle.responsable}
                      </span>
                    </div>

                    <div className="text-sm" style={{ color: "#223535" }}>
                      {detalle.descripcion}
                    </div>

                    <div className="rounded-2xl p-4" style={{ background: "rgba(0,0,0,0.06)" }}>
                      <div className="text-xs font-extrabold uppercase tracking-wider" style={{ color: "var(--osd-slate)" }}>
                        Afiliado
                      </div>
                      <div className="text-sm mt-2" style={{ color: "#0f1b1b" }}>
                        <span className="font-black">{detalle.afiliado}</span> • N° {detalle.nroAfiliado}
                      </div>
                      <div className="text-xs mt-1" style={{ color: "var(--osd-slate)" }}>
                        Fecha evento: {detalle.fecha}
                      </div>
                    </div>

                    <div className="rounded-2xl p-4" style={{ background: "rgba(18, 91, 88, 0.08)" }}>
                      <div className="text-xs font-extrabold uppercase tracking-wider" style={{ color: "var(--osd-primary)" }}>
                        Información adicional (mock)
                      </div>
                      <pre className="mt-2 text-xs whitespace-pre-wrap overflow-auto" style={{ color: "#0f1b1b" }}>
{JSON.stringify(detalle.extra ?? {}, null, 2)}
                      </pre>
                    </div>
                  </>
                )}
              </ModalBody>

              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button className="osd-btn-secondary" onPress={() => alert("Mock: escalar / asignar")}>
                  Escalar
                </Button>
                <Button
                  className="osd-btn-primary"
                  onPress={() => {
                    if (!detalle) return;
                    marcarResuelta(detalle);
                    onClose();
                  }}
                >
                  Marcar resuelta
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
