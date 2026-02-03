import React from "react";
import {
  Card,
  CardBody,
  Button,
  Divider,
  Select,
  SelectItem,
  Input,
  Chip,
} from "@heroui/react";

import MapPanel from "../../components/admin/MapPanel";
import AfiliadoPicker from "../../components/admin/AfiliadoPicker";
import PrestacionesGridModal from "../../components/admin/PrestacionesGridModal";

const EMPRESAS = ["Todas", "Best Care", "Medincare", "ID Salud", "Cuidar SRL"];

const AFILIADOS = [
  {
    id: "A-01",
    nombre: "Juan Pérez",
    foto: "/img/afiliado-placeholder.jpg",
    dni: "28.123.456",
    nroAfiliado: "12-45879-01",
    empresa: "Best Care",
    activoDesde: "2025-11-12",
    diagnostico: "EPOC severo • dependencia de oxígeno",
    domicilio: "Presidente Perón 456",
    localidad: "CABA",
    estado: "ALERTA",
    motivo: "Sin oxígeno • saturación baja",
    coords: [-34.609, -58.392],
    zona: "CABA",
    prestaciones: [
      {
        tipo: "Enfermería",
        frecuencia: "Lunes a Viernes",
        profesional: { nombre: "Lic. María Rodríguez", matricula: "MN 12345", empresa: "Best Care" },
        agenda: [
          { dia: "Lunes", desde: "08:00", hasta: "12:00" },
          { dia: "Martes", desde: "08:00", hasta: "12:00" },
          { dia: "Miércoles", desde: "08:00", hasta: "12:00" },
          { dia: "Jueves", desde: "08:00", hasta: "12:00" },
          { dia: "Viernes", desde: "08:00", hasta: "12:00" },
        ],
      },
      {
        tipo: "Médico",
        frecuencia: "Control quincenal",
        profesional: { nombre: "Dr. Carlos Gómez", matricula: "MP 44221", empresa: "Best Care" },
        agenda: [{ dia: "Miércoles", desde: "10:00", hasta: "10:40" }],
      },
      {
        tipo: "Kinesiología",
        frecuencia: "3 veces por semana",
        profesional: { nombre: "Lic. Facundo Ríos", matricula: "MN 77881", empresa: "Best Care" },
        agenda: [
          { dia: "Lunes", desde: "16:00", hasta: "18:00" },
          { dia: "Miércoles", desde: "16:00", hasta: "18:00" },
          { dia: "Viernes", desde: "16:00", hasta: "18:00" },
        ],
      },
    ],
    visitas: [
      { fecha: "2026-02-03", hora: "08:05", tipo: "Enfermería", profesional: "Lic. Rodríguez", estado: "Realizada" },
      { fecha: "2026-02-02", hora: "08:10", tipo: "Enfermería", profesional: "Lic. Rodríguez", estado: "Realizada" },
      { fecha: "2026-02-01", hora: "08:00", tipo: "Enfermería", profesional: "Lic. Rodríguez", estado: "No registrada" },
    ],
  },
  {
    id: "A-02",
    nombre: "María López",
    foto: "/img/afiliado-placeholder.jpg",
    dni: "17.456.111",
    nroAfiliado: "12-22222-02",
    empresa: "Medincare",
    activoDesde: "2025-09-03",
    diagnostico: "ACV • rehabilitación motora",
    domicilio: "Av. Santa Fe 123",
    localidad: "CABA",
    estado: "ESTABLE",
    motivo: "Visitas al día",
    coords: [-34.596, -58.372],
    zona: "CABA",
    prestaciones: [
      {
        tipo: "Kinesiología",
        frecuencia: "3 veces por semana",
        profesional: { nombre: "Lic. Diego Rossi", matricula: "MN 99887", empresa: "Medincare" },
        agenda: [
          { dia: "Martes", desde: "10:00", hasta: "12:00" },
          { dia: "Jueves", desde: "10:00", hasta: "12:00" },
          { dia: "Sábado", desde: "10:00", hasta: "12:00" },
        ],
      },
    ],
    visitas: [{ fecha: "2026-02-03", hora: "10:10", tipo: "Kinesiología", profesional: "Lic. Rossi", estado: "Realizada" }],
  },
  {
    id: "A-03",
    nombre: "Ricardo Medina",
    foto: "/img/afiliado-placeholder.jpg",
    dni: "21.234.900",
    nroAfiliado: "12-33333-03",
    empresa: "ID Salud",
    activoDesde: "2026-01-05",
    diagnostico: "Post operatorio • control",
    domicilio: "Isidro Casanova 999",
    localidad: "GBA",
    estado: "ESTABLE",
    motivo: "Insumos OK",
    coords: [-34.643, -58.576],
    zona: "GBA",
    prestaciones: [],
    visitas: [],
  },
];

function pillByEstado(estado) {
  if (estado === "ALERTA") return "osd-pill osd-pill-critical";
  if (estado === "ESTABLE") return "osd-pill osd-pill-ok";
  return "osd-pill osd-pill-open";
}

export default function VisitasPage() {
  const [empresa, setEmpresa] = React.useState("Todas");
  const [search, setSearch] = React.useState("");
  const [selectedId, setSelectedId] = React.useState("A-01");
  const [openGrid, setOpenGrid] = React.useState(false);

  const afiliadosFiltrados = React.useMemo(() => {
    return AFILIADOS.filter((a) => {
      const okEmpresa = empresa === "Todas" ? true : a.empresa === empresa;
      const okSearch =
        !search ||
        a.nombre.toLowerCase().includes(search.toLowerCase()) ||
        a.nroAfiliado.toLowerCase().includes(search.toLowerCase()) ||
        a.id.toLowerCase().includes(search.toLowerCase());
      return okEmpresa && okSearch;
    });
  }, [empresa, search]);

  React.useEffect(() => {
    // si el seleccionado deja de estar en la lista filtrada, seteo el primero
    if (!afiliadosFiltrados.some((a) => a.id === selectedId)) {
      setSelectedId(afiliadosFiltrados[0]?.id);
    }
  }, [afiliadosFiltrados, selectedId]);

  const selected = React.useMemo(() => AFILIADOS.find((a) => a.id === selectedId), [selectedId]);

  const mapPoints = React.useMemo(() => {
    return afiliadosFiltrados.map((a) => ({
      id: a.id,
      name: a.nombre,
      zona: a.zona,
      empresa: a.empresa,
      status: a.estado,
      coords: a.coords,
      detail: a.motivo,
    }));
  }, [afiliadosFiltrados]);

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="osd-surface p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-xs font-extrabold tracking-wider uppercase text-[var(--osd-slate)]">
            Admin • Visitas en tiempo real
          </div>
          <div className="text-2xl font-black text-slate-900">Monitoreo de Afiliados</div>
          <div className="text-sm text-slate-700">
            Filtrá por empresa y afiliado. Ver detalle + grilla descargable.
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Select
            label="Empresa"
            selectedKeys={[empresa]}
            onSelectionChange={(keys) => setEmpresa(Array.from(keys)[0])}
            className="min-w-[220px]"
          >
            {EMPRESAS.map((e) => (
              <SelectItem key={e}>{e}</SelectItem>
            ))}
          </Select>

          <Input
            label="Buscar"
            placeholder="Nombre / N° afiliado / ID"
            value={search}
            onValueChange={setSearch}
            className="min-w-[240px]"
          />
        </div>
      </div>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* IZQUIERDA 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* MAPA */}
          <div className="osd-surface p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-black text-slate-900">Mapa de afiliados</div>
              <span className="text-xs font-bold text-[var(--osd-slate)]">
                {afiliadosFiltrados.length} activos en vista
              </span>
            </div>
            <MapPanel points={mapPoints} />
          </div>

          {/* VISITAS (DEL SELECCIONADO) */}
          <div className="osd-surface p-5">
            <div className="flex items-center justify-between">
              <div className="font-black text-slate-900">Visitas del afiliado</div>
              <span className="text-xs font-bold text-[var(--osd-slate)]">
                {selected?.visitas?.length || 0} registros
              </span>
            </div>
            <Divider className="my-3" />

            {(selected?.visitas || []).length === 0 ? (
              <div className="text-sm text-slate-700">
                — No hay visitas registradas para este afiliado —
              </div>
            ) : (
              <div className="space-y-3">
                {selected.visitas.map((v, idx) => (
                  <div key={idx} className="osd-surface p-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-extrabold text-[var(--osd-slate)]">
                        {v.fecha} • {v.hora}
                      </div>
                      <div className="font-black text-slate-900">{v.tipo}</div>
                      <div className="text-sm text-slate-700">{v.profesional}</div>
                    </div>

                    <span className={v.estado === "Realizada" ? "osd-pill osd-pill-ok" : "osd-pill osd-pill-open"}>
                      {v.estado}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* DERECHA 1/3 */}
        <div className="space-y-6">
          {/* SELECT desplegable de afiliado */}
          <div className="osd-surface p-5 space-y-3">
            <div className="font-black text-slate-900">Seleccionar afiliado</div>

            <Select
              label="Afiliado"
              selectedKeys={selectedId ? [selectedId] : []}
              onSelectionChange={(keys) => setSelectedId(Array.from(keys)[0])}
            >
              {afiliadosFiltrados.map((a) => (
                <SelectItem key={a.id}>
                  {a.nombre} • {a.empresa}
                </SelectItem>
              ))}
            </Select>

            <Divider />

            {/* Lista estilo checkbox card */}
            <AfiliadoPicker afiliados={afiliadosFiltrados} selectedId={selectedId} onChange={setSelectedId} />
          </div>

          {/* DETALLE afiliado + BOTÓN GRILLA */}
          {selected && (
            <Card className="border-none shadow-none">
              <CardBody className="osd-surface p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-extrabold tracking-wider uppercase text-[var(--osd-slate)]">
                      Detalle del afiliado
                    </div>
                    <div className="text-xl font-black text-slate-900">{selected.nombre}</div>
                    <div className="text-sm text-slate-700">
                      <b>{selected.id}</b> • {selected.nroAfiliado} • DNI {selected.dni}
                    </div>
                    <div className="text-sm text-slate-700">
                      <b>Empresa:</b> {selected.empresa}
                    </div>
                  </div>

                  <span className={pillByEstado(selected.estado)}>{selected.estado}</span>
                </div>

                <Divider />

                <div className="text-sm text-slate-700">
                  <b>Activo desde:</b> {selected.activoDesde || "-"}
                </div>
                <div className="text-sm text-slate-700">
                  <b>Diagnóstico:</b> {selected.diagnostico || "-"}
                </div>
                <div className="text-sm text-slate-700">
                  <b>Domicilio:</b> {selected.domicilio} • {selected.localidad}
                </div>

                <Divider />

                <div className="flex flex-wrap gap-2">
                  <Chip variant="flat" className="font-bold" style={{ background: "rgba(201,182,156,0.28)", color: "var(--osd-secondary)" }}>
                    {selected.motivo}
                  </Chip>

                  <Button className="osd-btn-primary" onPress={() => setOpenGrid(true)}>
                    Ver grilla
                  </Button>

                  <Button
                    variant="flat"
                    className="font-extrabold"
                    style={{ background: "rgba(18,91,88,0.12)", color: "var(--osd-primary)" }}
                    onPress={() => alert("Mock: abrir historial completo / calendario")}
                  >
                    Ver calendario completo
                  </Button>
                </div>

                <Divider />

                <div className="text-xs font-extrabold tracking-wider uppercase text-[var(--osd-slate)]">
                  Prestaciones (resumen)
                </div>

                {(selected.prestaciones || []).length === 0 ? (
                  <div className="text-sm text-slate-700">— Sin prestaciones cargadas —</div>
                ) : (
                  <div className="space-y-2">
                    {selected.prestaciones.map((p, i) => (
                      <div key={i} className="osd-surface p-4">
                        <div className="font-black text-slate-900">{p.tipo}</div>
                        <div className="text-sm text-slate-700">
                          <b>{p.frecuencia}</b> • {p.profesional?.nombre} ({p.profesional?.matricula})
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      {/* MODAL GRILLA */}
      <PrestacionesGridModal isOpen={openGrid} onClose={() => setOpenGrid(false)} afiliado={selected} />
    </div>
  );
}
