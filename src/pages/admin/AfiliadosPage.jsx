import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Divider,
  Input,
  Select,
  SelectItem,
  Tabs,
  Tab,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
} from "@heroui/react";

const ESTADOS = ["Todos", "Activo", "Inactivo"];

const MOCK_AFILIADOS = [
  {
    id: "AFI-1001",
    nombre: "Juan Pérez",
    dni: "22.345.678",
    nroAfiliado: "12-45879-01",
    empresa: "Best Care",
    estado: "Activo",
    desde: "2025-11-15",
    diagnostico: "EPOC + dependencia parcial",
    domicilio: "Presidente Perón 456, CABA",
    familiar: { nombre: "Laura Pérez", parentesco: "Hija", tel: "11 5555-1212", email: "laura@mail.com" },
    prestaciones: [
      { tipo: "Enfermería", detalle: "12 hs", dias: "Lun a Vie", horario: "08:00–20:00", profesional: "Lic. María Rodríguez", matricula: "MN 55441" },
      { tipo: "Médico", detalle: "Control quincenal", dias: "A coordinar", horario: "-", profesional: "Dr. Carlos Gómez", matricula: "MN 22110" },
      { tipo: "Kinesiología", detalle: "3/sem", dias: "Lun/Mié/Vie", horario: "16:00–17:00", profesional: "Lic. Facundo Ríos", matricula: "MP 112233" },
    ],
    alquileres: [
      { item: "Bomba de alimentación", desde: "2025-12-01", prov: "Rehab SRL", estado: "Vigente" },
      { item: "Pie de suero", desde: "2025-12-01", prov: "Rehab SRL", estado: "Vigente" },
    ],
    insumos: [
      { item: "Gasa estéril", cant: 30, freq: "mensual", costo: 12500 },
      { item: "Jeringas", cant: 60, freq: "mensual", costo: 9800 },
      { item: "Descartables", cant: 1, freq: "pack", costo: 15300 },
    ],
    reclamos: [
      { id: "REC-1024", tipo: "Visitas", estado: "En revisión", fecha: "2026-02-03", detalle: "No vino enfermería (turno mañana)." },
      { id: "REC-1019", tipo: "Insumos", estado: "Coordinación", fecha: "2026-02-01", detalle: "Insumo con empaque abierto." },
    ],
    sugerencias: [
      { id: "SUG-31", fecha: "2026-01-28", detalle: "Sería bueno confirmar visitas por WhatsApp con antelación." },
    ],
  },
  {
    id: "AFI-1002",
    nombre: "María López",
    dni: "30.112.990",
    nroAfiliado: "20-11002-04",
    empresa: "Medincare",
    estado: "Activo",
    desde: "2026-01-05",
    diagnostico: "ACV – rehabilitación motora",
    domicilio: "Av. Rivadavia 1200, CABA",
    familiar: { nombre: "Carlos López", parentesco: "Esposo", tel: "11 4444-9898", email: "carlos@mail.com" },
    prestaciones: [
      { tipo: "Kinesiología", detalle: "5/sem", dias: "Lun a Vie", horario: "10:00–11:00", profesional: "Lic. Diego Rossi", matricula: "MP 90877" },
    ],
    alquileres: [{ item: "Silla de ruedas", desde: "2026-01-06", prov: "Ortopedia Central", estado: "Vigente" }],
    insumos: [{ item: "Guantes descartables", cant: 100, freq: "mensual", costo: 7200 }],
    reclamos: [],
    sugerencias: [{ id: "SUG-40", fecha: "2026-02-02", detalle: "Excelente atención del kinesiólogo." }],
  },
  {
    id: "AFI-1003",
    nombre: "Ricardo Medina",
    dni: "18.909.111",
    nroAfiliado: "10-00333-09",
    empresa: "ID Salud",
    estado: "Inactivo",
    desde: "2025-07-20",
    diagnostico: "Alta de internación domiciliaria",
    domicilio: "Isidro Casanova, La Matanza",
    familiar: { nombre: "Marta Medina", parentesco: "Esposa", tel: "11 3333-2222", email: "marta@mail.com" },
    prestaciones: [],
    alquileres: [],
    insumos: [],
    reclamos: [{ id: "REC-0999", tipo: "Admin", estado: "Resuelto", fecha: "2025-12-10", detalle: "Consulta por facturación." }],
    sugerencias: [],
  },
];

const FRECUENCIAS = [
  { key: "dia", label: "Por día" },
  { key: "semana", label: "Por semana" },
  { key: "mes", label: "Por mes" },
];

const TIPOS_PRESTACION = [
  "Enfermería",
  "Médico",
  "Kinesiología",
  "Nutrición",
  "Fonoaudiología",
  "Cuidador",
  "Otro",
];

function emptyPrestacion() {
  return {
    tipo: "Enfermería",
    detalle: "",
    profesional: "",
    matricula: "",
    frecuenciaTipo: "dia", // dia | semana | mes
    frecuenciaCantidad: 1, // ej: 1 vez por día / 3 por semana / 1 por mes
    horasPorVisita: 1, // ej: 1 hora
    dias: "Lun a Vie", // opcional
    horario: "08:00–09:00", // opcional
  };
}

function emptyAlquiler() {
  return {
    item: "",
    prov: "",
    desde: "",
    hasta: "",
    estado: "Vigente",
  };
}


function money(n) {
  try {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n ?? 0);
  } catch {
    return `$ ${n ?? 0}`;
  }
}

function pillEstado(estado) {
  if (estado === "Activo") return <span className="osd-pill osd-pill-ok">Activo</span>;
  return <span className="osd-pill osd-pill-open">Inactivo</span>;
}

function pillReclamo(estado) {
  const low = (estado || "").toLowerCase();
  if (low.includes("revisión") || low.includes("coordin")) return <span className="osd-pill osd-pill-open">{estado}</span>;
  if (low.includes("resuelto")) return <span className="osd-pill osd-pill-ok">{estado}</span>;
  return <span className="osd-pill osd-pill-critical">{estado}</span>;
}

export default function AfiliadosPage() {
  const navigate = useNavigate();

  const [q, setQ] = React.useState("");
  const [empresa, setEmpresa] = React.useState("Todas");
  const [estado, setEstado] = React.useState("Todos");

    // MODALES
  const [openNuevoAfiliado, setOpenNuevoAfiliado] = React.useState(false);
  const [openAgregarPrest, setOpenAgregarPrest] = React.useState(false);

  // FORM NUEVO AFILIADO
  const [nuevoAf, setNuevoAf] = React.useState({
    nombre: "",
    dni: "",
    nroAfiliado: "",
    empresa: "Best Care",
    estado: "Activo",
    desde: new Date().toISOString().slice(0, 10),
    domicilio: "",
    diagnostico: "",
    auditorAutorizado: "",

    familiarNombre: "",
    familiarParentesco: "",
    familiarTel: "",
    familiarEmail: "",

    prestaciones: [emptyPrestacion()],
    alquileres: [],
    insumos: [],
    reclamos: [],
    sugerencias: [],
  });

  // FORM AGREGAR PRESTACIÓN (al afiliado seleccionado)
  const [prestNueva, setPrestNueva] = React.useState(emptyPrestacion());


  const [selectedId, setSelectedId] = React.useState(MOCK_AFILIADOS[0]?.id);
  const selected = React.useMemo(
    () => MOCK_AFILIADOS.find((a) => a.id === selectedId) ?? MOCK_AFILIADOS[0],
    [selectedId]
  );

  const empresas = React.useMemo(() => {
    const uniques = Array.from(new Set(MOCK_AFILIADOS.map((a) => a.empresa))).sort();
    return ["Todas", ...uniques];
  }, []);

  const filtered = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    return MOCK_AFILIADOS.filter((a) => {
      const matchQ =
        !term ||
        a.nombre.toLowerCase().includes(term) ||
        a.dni.toLowerCase().includes(term) ||
        a.nroAfiliado.toLowerCase().includes(term) ||
        a.id.toLowerCase().includes(term);

      const matchEmpresa = empresa === "Todas" ? true : a.empresa === empresa;
      const matchEstado = estado === "Todos" ? true : a.estado === estado;

      return matchQ && matchEmpresa && matchEstado;
    });
  }, [q, empresa, estado]);

  // KPIs
  const kpis = React.useMemo(() => {
    const total = MOCK_AFILIADOS.length;
    const activos = MOCK_AFILIADOS.filter((a) => a.estado === "Activo").length;
    const empresasUnicas = new Set(MOCK_AFILIADOS.map((a) => a.empresa)).size;
    const reclamosAbiertos = MOCK_AFILIADOS.reduce((acc, a) => {
      const abiertos = (a.reclamos || []).filter((r) => !String(r.estado).toLowerCase().includes("resuelto")).length;
      return acc + abiertos;
    }, 0);
    return { total, activos, empresasUnicas, reclamosAbiertos };
  }, []);

  // modal grilla
  const [openGrilla, setOpenGrilla] = React.useState(false);

  const costoInsumos = React.useMemo(() => {
    const sum = (selected?.insumos || []).reduce((acc, i) => acc + (i.costo || 0), 0);
    return sum;
  }, [selected]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-5">
        <div className="text-2xl font-black" style={{ color: "var(--osd-primary)" }}>
          Afiliados
        </div>
        <div className="text-sm" style={{ color: "var(--osd-slate)" }}>
          Vista administrativa: búsqueda, estado, empresa ID y detalle completo.
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Total afiliados" value={kpis.total} />
        <KpiCard label="Activos" value={kpis.activos} accent="ok" />
        <KpiCard label="Empresas ID" value={kpis.empresasUnicas} />
        <KpiCard label="Reclamos abiertos" value={kpis.reclamosAbiertos} accent="open" />
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lista + filtros */}
        <div className="lg:col-span-5">
          <div className="osd-surface p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
  <div className="font-black text-lg" style={{ color: "var(--osd-primary)" }}>
    Listado general
  </div>

  <Button className="osd-btn-primary" onPress={() => setOpenNuevoAfiliado(true)}>
    Nuevo afiliado
  </Button>
</div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="Buscar afiliado"
                  placeholder="Nombre • DNI • N° afiliado • AFI-..."
                  value={q}
                  onValueChange={setQ}
                />

                <Select
                  label="Empresa ID"
                  selectedKeys={[empresa]}
                  onSelectionChange={(keys) => setEmpresa(Array.from(keys)[0])}
                >
                  {empresas.map((e) => (
                    <SelectItem key={e}>{e}</SelectItem>
                  ))}
                </Select>

                <Select
                  label="Estado"
                  className="md:col-span-2"
                  selectedKeys={[estado]}
                  onSelectionChange={(keys) => setEstado(Array.from(keys)[0])}
                >
                  {ESTADOS.map((e) => (
                    <SelectItem key={e}>{e}</SelectItem>
                  ))}
                </Select>
              </div>

              <Divider />

              <div className="text-xs font-bold" style={{ color: "var(--osd-slate)" }}>
                Resultados: {filtered.length}
              </div>

              <div className="flex flex-col gap-3 mt-2">
                {filtered.map((a) => {
                  const isSelected = a.id === selectedId;
                  return (
                    <button
                      key={a.id}
                      onClick={() => setSelectedId(a.id)}
                      className={`text-left w-full rounded-2xl border p-4 transition ${
                        isSelected ? "border-[var(--osd-primary)]" : "border-black/5 hover:border-black/10"
                      }`}
                      style={{
                        background: isSelected ? "rgba(18,91,88,0.06)" : "rgba(255,255,255,0.70)",
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-black" style={{ color: "#0f1b1b" }}>
                            {a.nombre}
                          </div>
                          <div className="text-xs mt-1" style={{ color: "var(--osd-slate)" }}>
                            {a.id} • DNI {a.dni} • Afiliado {a.nroAfiliado}
                          </div>
                          <div className="text-sm mt-2" style={{ color: "#223535" }}>
                            Empresa: <b>{a.empresa}</b>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {pillEstado(a.estado)}
                          <span className="text-xs" style={{ color: "var(--osd-slate)" }}>
                            Desde {a.desde}
                          </span>
                        </div>
                      </div>

                      {!!a.reclamos?.length && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Chip variant="flat" className="font-bold">
                            Reclamos: {a.reclamos.length}
                          </Chip>
                          <Chip variant="flat" className="font-bold">
                            Prestaciones: {a.prestaciones.length}
                          </Chip>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Detalle */}
        <div className="lg:col-span-7">
          <div className="osd-surface p-5">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--osd-slate)" }}>
                  Detalle del afiliado
                </div>
                <div className="text-2xl font-black" style={{ color: "#0f1b1b" }}>
                  {selected?.nombre}
                </div>
                <div className="text-sm mt-1" style={{ color: "#223535" }}>
                  {selected?.id} • DNI {selected?.dni} • Afiliado {selected?.nroAfiliado}
                </div>
                <div className="text-sm mt-1" style={{ color: "#223535" }}>
                  Empresa: <b>{selected?.empresa}</b> • {pillEstado(selected?.estado)} • Desde <b>{selected?.desde}</b>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  className="osd-btn-primary"
                  onPress={() => navigate(`/admin/visitas?afiliado=${encodeURIComponent(selected?.id)}`)}
                >
                  Ver visitas
                </Button>

                <Button
                  className="osd-btn-secondary"
                  onPress={() => setOpenGrilla(true)}
                >
                    
                  Ver grilla
                </Button>
<Button
  variant="flat"
  style={{
    background: "rgba(18,91,88,0.12)",
    color: "var(--osd-primary)",
    borderRadius: 9999,
    fontWeight: 900,
  }}
  onPress={() => setOpenAgregarPrest(true)}
>
  Agregar prestación
</Button>

                <Button
                  variant="flat"
                  style={{ background: "rgba(0,0,0,0.06)", color: "#0f1b1b", borderRadius: 9999 }}
                  onPress={() => alert("Mock: descargar PDF")}
                >
                  Descargar PDF
                </Button>
              </div>
            </div>

            <Divider className="my-4" />

            <Tabs aria-label="Detalle Afiliado" variant="solid" radius="lg">
              <Tab key="resumen" title="Resumen">
                <ResumenTab afiliado={selected} costoInsumos={costoInsumos} />
              </Tab>

              <Tab key="insumos" title="Insumos">
                <InsumosTab afiliado={selected} costoInsumos={costoInsumos} />
              </Tab>

              <Tab key="reclamos" title={`Reclamos (${selected?.reclamos?.length ?? 0})`}>
                <ReclamosTab afiliado={selected} />
              </Tab>

              <Tab key="sugerencias" title={`Sugerencias (${selected?.sugerencias?.length ?? 0})`}>
                <SugerenciasTab afiliado={selected} />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Modal Grilla */}
      <Modal isOpen={openGrilla} onOpenChange={setOpenGrilla} size="3xl" placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Grilla de prestaciones (mock)
                <span className="text-xs opacity-70">
                  Vista tipo “hoja” para auditoría: datos personales + empresa + diagnóstico + agenda/prestaciones.
                </span>
              </ModalHeader>

              <ModalBody className="space-y-4">
                <div className="rounded-2xl p-4" style={{ background: "rgba(0,0,0,0.05)" }}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white overflow-hidden border border-black/10 flex items-center justify-center">
                        <img src="/img/osdepymlogo.jpg" alt="OSDEPYM" className="h-8 w-8 object-contain" />
                      </div>
                      <div>
                        <div className="font-black" style={{ color: "#0f1b1b" }}>
                          OSDEPYM ID • Grilla de Prestaciones
                        </div>
                        <div className="text-xs" style={{ color: "var(--osd-slate)" }}>
                          Afiliado: {selected?.nombre} • {selected?.nroAfiliado} • Empresa: {selected?.empresa}
                        </div>
                      </div>
                    </div>

                    <Button className="osd-btn-primary" onPress={() => alert("Mock: descargar PDF con logo")}>
                      Descargar PDF
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-none shadow-sm">
                    <CardBody className="space-y-2">
                      <div className="font-black" style={{ color: "var(--osd-primary)" }}>
                        Datos personales
                      </div>
                      <Field label="Nombre" value={selected?.nombre} />
                      <Field label="DNI" value={selected?.dni} />
                      <Field label="N° Afiliado" value={selected?.nroAfiliado} />
                      <Field label="Domicilio" value={selected?.domicilio} />
                      <Field label="Diagnóstico" value={selected?.diagnostico} />
                    </CardBody>
                  </Card>

                  <Card className="border-none shadow-sm">
                    <CardBody className="space-y-2">
                      <div className="font-black" style={{ color: "var(--osd-primary)" }}>
                        Contacto familiar
                      </div>
                      <Field label="Nombre" value={selected?.familiar?.nombre} />
                      <Field label="Parentesco" value={selected?.familiar?.parentesco} />
                      <Field label="Tel" value={selected?.familiar?.tel} />
                      <Field label="Email" value={selected?.familiar?.email} />
                    </CardBody>
                  </Card>
                </div>

                <Card className="border-none shadow-sm">
                  <CardBody className="space-y-3">
                    <div className="font-black" style={{ color: "var(--osd-primary)" }}>
                      Prestaciones y agenda
                    </div>

                    {(selected?.prestaciones || []).length === 0 ? (
                      <div className="text-sm" style={{ color: "var(--osd-slate)" }}>
                        No hay prestaciones registradas.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selected.prestaciones.map((p, idx) => (
                          <div
                            key={idx}
                            className="rounded-2xl p-4 border border-black/5"
                            style={{ background: "rgba(255,255,255,0.75)" }}
                          >
                            <div className="font-black" style={{ color: "#0f1b1b" }}>
                              {p.tipo} • {p.detalle}
                            </div>
                            <div className="text-sm mt-1" style={{ color: "#223535" }}>
                              Profesional: <b>{p.profesional}</b> (Mat. {p.matricula})
                            </div>
                            <div className="text-sm" style={{ color: "#223535" }}>
                              Días: <b>{p.dias}</b> • Horario: <b>{p.horario}</b>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardBody>
                </Card>
              </ModalBody>

              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

/* ============ Subcomponentes simples ============ */

function KpiCard({ label, value, accent }) {
  const pill =
    accent === "ok" ? "osd-pill osd-pill-ok" : accent === "open" ? "osd-pill osd-pill-open" : "osd-pill osd-pill-open";

  return (
    <div className="osd-surface p-4">
      <div className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--osd-slate)" }}>
        {label}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-3xl font-black" style={{ color: "#0f1b1b" }}>
          {value}
        </div>
        <span className={pill}>OSDEPYM</span>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="text-sm">
      <span className="font-bold" style={{ color: "var(--osd-slate)" }}>
        {label}:
      </span>{" "}
      <span style={{ color: "#223535" }}>{value ?? "-"}</span>
    </div>
  );
}

function ResumenTab({ afiliado, costoInsumos }) {
  return (
    <div className="space-y-4">
      <Card className="border-none shadow-sm">
        <CardBody className="space-y-2">
          <div className="font-black" style={{ color: "var(--osd-primary)" }}>
            Diagnóstico y estado
          </div>
          <div className="text-sm" style={{ color: "#223535" }}>
            <b>Diagnóstico:</b> {afiliado?.diagnostico || "-"}
          </div>
          <div className="text-sm" style={{ color: "#223535" }}>
            <b>Domicilio:</b> {afiliado?.domicilio || "-"}
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-none shadow-sm">
          <CardBody className="space-y-2">
            <div className="font-black" style={{ color: "var(--osd-primary)" }}>
              Prestaciones
            </div>
            {(afiliado?.prestaciones || []).length === 0 ? (
              <div className="text-sm" style={{ color: "var(--osd-slate)" }}>
                Sin prestaciones registradas.
              </div>
            ) : (
              <div className="space-y-2">
                {afiliado.prestaciones.map((p, idx) => (
                  <div key={idx} className="rounded-2xl p-3 border border-black/5 bg-white/70">
                    <div className="font-black" style={{ color: "#0f1b1b" }}>
                      {p.tipo} • {p.detalle}
                    </div>
                    <div className="text-sm" style={{ color: "#223535" }}>
                      {p.profesional} (Mat. {p.matricula})
                    </div>
                    <div className="text-xs" style={{ color: "var(--osd-slate)" }}>
                      {p.dias} • {p.horario}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="border-none shadow-sm">
          <CardBody className="space-y-2">
            <div className="font-black" style={{ color: "var(--osd-primary)" }}>
              Alquileres / Equipamiento
            </div>
            {(afiliado?.alquileres || []).length === 0 ? (
              <div className="text-sm" style={{ color: "var(--osd-slate)" }}>
                Sin alquileres registrados.
              </div>
            ) : (
              <div className="space-y-2">
                {afiliado.alquileres.map((a, idx) => (
                  <div key={idx} className="rounded-2xl p-3 border border-black/5 bg-white/70">
                    <div className="font-black" style={{ color: "#0f1b1b" }}>
                      {a.item}
                    </div>
                    <div className="text-xs" style={{ color: "var(--osd-slate)" }}>
                      Desde {a.desde} • Prov: {a.prov} • {a.estado}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardBody className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="font-black" style={{ color: "var(--osd-primary)" }}>
              Insumos (estimación)
            </div>
            <div className="text-sm" style={{ color: "#223535" }}>
              Total mensual mock: <b>{money(costoInsumos)}</b>
            </div>
            <div className="text-xs" style={{ color: "var(--osd-slate)" }}>
              Luego lo conectás con tu Excel / Asarfarma.
            </div>
          </div>
          <Button variant="flat" style={{ background: "rgba(0,0,0,0.06)", color: "#0f1b1b", borderRadius: 9999 }}>
            Ver Excel
          </Button>
        </CardBody>
      </Card>

      <Card className="border-none shadow-sm">
        <CardBody className="space-y-2">
          <div className="font-black" style={{ color: "var(--osd-primary)" }}>
            Familiar responsable
          </div>
          <Field label="Nombre" value={afiliado?.familiar?.nombre} />
          <Field label="Parentesco" value={afiliado?.familiar?.parentesco} />
          <Field label="Tel" value={afiliado?.familiar?.tel} />
          <Field label="Email" value={afiliado?.familiar?.email} />
        </CardBody>
      </Card>
    </div>
  );
}

function InsumosTab({ afiliado, costoInsumos }) {
  return (
    <div className="space-y-4">
      <Card className="border-none shadow-sm">
        <CardBody className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="font-black" style={{ color: "var(--osd-primary)" }}>
              Insumos asignados (mensual)
            </div>
            <div className="text-sm" style={{ color: "#223535" }}>
              Total mock: <b>{money(costoInsumos)}</b>
            </div>
          </div>
          <Button className="osd-btn-primary" onPress={() => alert("Mock: ver excel insumos y gasto")}>
            Ver Excel (insumos y gasto)
          </Button>
        </CardBody>
      </Card>

      {(afiliado?.insumos || []).length === 0 ? (
        <div className="text-sm" style={{ color: "var(--osd-slate)" }}>
          No hay insumos cargados.
        </div>
      ) : (
        <Card className="border-none shadow-sm">
          <CardBody className="space-y-3">
            {(afiliado.insumos || []).map((i, idx) => (
              <div key={idx} className="rounded-2xl p-4 border border-black/5 bg-white/70 flex items-start justify-between gap-3">
                <div>
                  <div className="font-black" style={{ color: "#0f1b1b" }}>
                    {i.item}
                  </div>
                  <div className="text-xs" style={{ color: "var(--osd-slate)" }}>
                    Cant: {i.cant} • Frecuencia: {i.freq}
                  </div>
                </div>
                <div className="font-black" style={{ color: "var(--osd-secondary)" }}>
                  {money(i.costo)}
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );
}

function ReclamosTab({ afiliado }) {
  const [nota, setNota] = React.useState("");

  return (
    <div className="space-y-4">
      {(afiliado?.reclamos || []).length === 0 ? (
        <div className="text-sm" style={{ color: "var(--osd-slate)" }}>
          No hay reclamos registrados para este afiliado.
        </div>
      ) : (
        <Card className="border-none shadow-sm">
          <CardBody className="space-y-3">
            {(afiliado.reclamos || []).map((r) => (
              <div key={r.id} className="rounded-2xl p-4 border border-black/5 bg-white/70">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold" style={{ color: "var(--osd-slate)" }}>
                      {r.id} • {r.tipo} • {r.fecha}
                    </div>
                    <div className="font-black" style={{ color: "#0f1b1b" }}>
                      {r.detalle}
                    </div>
                  </div>
                  {pillReclamo(r.estado)}
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      <Card className="border-none shadow-sm">
        <CardBody className="space-y-2">
          <div className="font-black" style={{ color: "var(--osd-primary)" }}>
            Nota interna (mock)
          </div>
          <Textarea
            placeholder="Ej: Se contactó a empresa, reprogramación pendiente..."
            value={nota}
            onValueChange={setNota}
            minRows={3}
          />
          <div className="flex justify-end">
            <Button className="osd-btn-primary" onPress={() => alert("Mock: nota guardada")}>
              Guardar nota
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function SugerenciasTab({ afiliado }) {
  return (
    <div className="space-y-4">
      {(afiliado?.sugerencias || []).length === 0 ? (
        <div className="text-sm" style={{ color: "var(--osd-slate)" }}>
          No hay sugerencias registradas.
        </div>
      ) : (
        <Card className="border-none shadow-sm">
          <CardBody className="space-y-3">
            {(afiliado.sugerencias || []).map((s) => (
              <div key={s.id} className="rounded-2xl p-4 border border-black/5 bg-white/70">
                <div className="text-xs font-bold" style={{ color: "var(--osd-slate)" }}>
                  {s.id} • {s.fecha}
                </div>
                <div className="font-black" style={{ color: "#0f1b1b" }}>
                  {s.detalle}
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );

    function resetNuevoAfiliado() {
    setNuevoAf({
      nombre: "",
      dni: "",
      nroAfiliado: "",
      empresa: "Best Care",
      estado: "Activo",
      desde: new Date().toISOString().slice(0, 10),
      domicilio: "",
      diagnostico: "",
      auditorAutorizado: "",
      familiarNombre: "",
      familiarParentesco: "",
      familiarTel: "",
      familiarEmail: "",
      prestaciones: [emptyPrestacion()],
      alquileres: [],
      insumos: [],
      reclamos: [],
      sugerencias: [],
    });
  }

  function submitNuevoAfiliado() {
    // validación mínima
    if (!nuevoAf.nombre || !nuevoAf.dni || !nuevoAf.nroAfiliado || !nuevoAf.empresa) return;

    const id = `AFI-${Math.floor(1000 + Math.random() * 9000)}`;

    const afiliadoNuevo = {
      id,
      nombre: nuevoAf.nombre,
      dni: nuevoAf.dni,
      nroAfiliado: nuevoAf.nroAfiliado,
      empresa: nuevoAf.empresa,
      estado: nuevoAf.estado,
      desde: nuevoAf.desde,
      domicilio: nuevoAf.domicilio,
      diagnostico: nuevoAf.diagnostico || "-",
      auditorAutorizado: nuevoAf.auditorAutorizado || "-",
      familiar: {
        nombre: nuevoAf.familiarNombre || "-",
        parentesco: nuevoAf.familiarParentesco || "-",
        tel: nuevoAf.familiarTel || "-",
        email: nuevoAf.familiarEmail || "-",
      },
      prestaciones: nuevoAf.prestaciones,
      alquileres: nuevoAf.alquileres,
      insumos: [],
      reclamos: [],
      sugerencias: [],
    };

    setAfiliados((prev) => [afiliadoNuevo, ...prev]);
    setSelectedId(id);
    setOpenNuevoAfiliado(false);
    resetNuevoAfiliado();
  }

  function submitAgregarPrestacion() {
    if (!selected) return;
    if (!prestNueva.tipo) return;

    setAfiliados((prev) =>
      prev.map((a) =>
        a.id !== selected.id
          ? a
          : { ...a, prestaciones: [prestNueva, ...(a.prestaciones || [])] }
      )
    );

    setPrestNueva(emptyPrestacion());
    setOpenAgregarPrest(false);
  }

}
