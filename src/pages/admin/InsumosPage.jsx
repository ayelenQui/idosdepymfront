import React from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider,
  Chip,
  Select,
  SelectItem,
  Checkbox,
  CheckboxGroup,
  User,
  cn,
} from "@heroui/react";

/* ---------------- helpers ---------------- */
const money = (n) =>
  n.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

function totalAfiliado(a) {
  return a.items.reduce((acc, it) => acc + it.cantidad * it.unitario, 0);
}

function countItems(a) {
  return a.items.reduce((acc, it) => acc + it.cantidad, 0);
}

/* ---------------- UI: checkbox afiliado (estilo HeroUI ejemplo) ---------------- */
function CustomCheckbox({ user, statusColor, value }) {
  return (
    <Checkbox
      aria-label={user.name}
      classNames={{
        base: cn(
          "inline-flex w-full bg-content1 m-0",
          "hover:bg-content2 items-center justify-start",
          "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary",
        ),
        label: "w-full",
      }}
      value={value}
    >
      <div className="w-full flex justify-between gap-2">
        <User
          avatarProps={{ size: "md", src: user.avatar }}
          description={<span className="text-tiny text-default-500">{user.sub}</span>}
          name={user.name}
        />
        <div className="flex flex-col items-end gap-1">
          <span className="text-tiny text-default-500">{user.role}</span>
          <Chip color={statusColor} size="sm" variant="flat">
            {user.status}
          </Chip>
        </div>
      </div>
    </Checkbox>
  );
}

/* ---------------- data mock ---------------- */
const EMPRESAS = ["Best Care", "Medincare", "ID Salud", "Cuidar SRL"];

const MOCK = [
  {
    id: "AF-27945233473/01",
    nombre: "Blas Gómez Shadi",
    empresa: "Best Care",
    domicilio: "Av. Rivadavia 1234",
    localidad: "CABA",
    estado: "Activo",
    mes: "2026-02",
    items: [
      {
        tipo: "Alimentación",
        descripcion: "Fortini Compact 30",
        cantidad: 30,
        unidad: "frasco",
        unitario: 12509,
        medico: { nombre: "Dra. Valdez", matricula: "MN 12345" },
        empresaCarga: "Best Care",
        fechaCarga: "2026-02-02",
      },
      {
        tipo: "Descartables",
        descripcion: "Guías de alimentación",
        cantidad: 30,
        unidad: "u",
        unitario: 8779.22,
        medico: { nombre: "Dra. Valdez", matricula: "MN 12345" },
        empresaCarga: "Best Care",
        fechaCarga: "2026-02-02",
      },
      {
        tipo: "Insumos",
        descripcion: "Jeringas 60ml",
        cantidad: 10,
        unidad: "u",
        unitario: 850,
        medico: { nombre: "Dr. Varela", matricula: "MN 88991" },
        empresaCarga: "Best Care",
        fechaCarga: "2026-02-01",
      },
    ],
  },
  {
    id: "AF-11223344556/02",
    nombre: "Rosa Martínez",
    empresa: "Medincare",
    domicilio: "San Martín 455",
    localidad: "La Matanza",
    estado: "Crítico",
    mes: "2026-02",
    items: [
      {
        tipo: "Oxígeno",
        descripcion: "Oxígeno medicinal",
        cantidad: 1,
        unidad: "mes",
        unitario: 98000,
        medico: { nombre: "Dr. Carlos Gómez", matricula: "MN 55667" },
        empresaCarga: "Medincare",
        fechaCarga: "2026-02-03",
      },
      {
        tipo: "Insumos",
        descripcion: "Mascarillas nebulización",
        cantidad: 6,
        unidad: "u",
        unitario: 2100,
        medico: { nombre: "Dr. Carlos Gómez", matricula: "MN 55667" },
        empresaCarga: "Medincare",
        fechaCarga: "2026-02-03",
      },
    ],
  },
  {
    id: "AF-99887766554/01",
    nombre: "Carlos Pérez",
    empresa: "ID Salud",
    domicilio: "Mitre 890",
    localidad: "San Justo",
    estado: "Activo",
    mes: "2026-02",
    items: [
      {
        tipo: "Insumos",
        descripcion: "Sondas",
        cantidad: 15,
        unidad: "u",
        unitario: 1200,
        medico: { nombre: "Dra. Marta Sánchez", matricula: "MN 44321" },
        empresaCarga: "ID Salud",
        fechaCarga: "2026-02-01",
      },
      {
        tipo: "Descartables",
        descripcion: "Gasas",
        cantidad: 20,
        unidad: "paq",
        unitario: 900,
        medico: { nombre: "Dra. Marta Sánchez", matricula: "MN 44321" },
        empresaCarga: "ID Salud",
        fechaCarga: "2026-02-01",
      },
    ],
  },
];

/* ---------------- main ---------------- */
export default function InsumosPage() {
  const [q, setQ] = React.useState("");
  const [empresa, setEmpresa] = React.useState("todas");
  const [mes, setMes] = React.useState("2026-02");

  const [openExcel, setOpenExcel] = React.useState(false);
  const [openDetalle, setOpenDetalle] = React.useState(false);

  // 👇 selección desde la lista derecha (CheckboxGroup)
  const [selectedId, setSelectedId] = React.useState([]);
  const selectedOne = selectedId?.[0] ?? null;

  const data = React.useMemo(() => {
    return MOCK.filter((a) => {
      const matchQ =
        (a.nombre + " " + a.id + " " + a.localidad + " " + a.domicilio)
          .toLowerCase()
          .includes(q.toLowerCase());

      const matchEmpresa = empresa === "todas" ? true : a.empresa === empresa;
      const matchMes = a.mes === mes;

      return matchQ && matchEmpresa && matchMes;
    });
  }, [q, empresa, mes]);

  const selected = React.useMemo(() => {
    return data.find((x) => x.id === selectedOne) ?? null;
  }, [data, selectedOne]);

  const totalMes = data.reduce((acc, a) => acc + totalAfiliado(a), 0);

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="osd-surface p-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div
                className="text-xs font-extrabold tracking-wider uppercase"
                style={{ color: "var(--osd-slate)" }}
              >
                Admin • Insumos
              </div>
              <div className="text-2xl md:text-3xl font-black" style={{ color: "#0f1b1b" }}>
                Insumos por afiliado (carga mensual)
              </div>
              <div className="text-sm mt-1" style={{ color: "#223535" }}>
                Incluye médico solicitante y empresa que cargó. Luego se exporta a Excel y se pasa a AsarFarma (mock).
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="osd-pill osd-pill-open">Afiliados: {data.length}</span>
              <span className="osd-pill osd-pill-ok">Total mes: {money(totalMes)}</span>
              <Button className="osd-btn-primary" onPress={() => setOpenExcel(true)}>
                Ver Excel (consolidado)
              </Button>
            </div>
          </div>

          <Divider className="my-5" />

          {/* filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              label="Buscar afiliado"
              placeholder="Nombre, N° afiliado, domicilio..."
              value={q}
              onValueChange={setQ}
            />

            <Select
              label="Empresa ID"
              selectedKeys={[empresa]}
              onSelectionChange={(keys) => setEmpresa(Array.from(keys)[0])}
            >
              <SelectItem key="todas">Todas</SelectItem>
              {EMPRESAS.map((e) => (
                <SelectItem key={e}>{e}</SelectItem>
              ))}
            </Select>

            <Input label="Mes" type="month" value={mes} onValueChange={setMes} />
          </div>
        </div>

        {/* Body: 2 columnas -> izquierda detalle / derecha lista afiliados */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Izquierda: detalle seleccionado */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-none osd-surface">
              <CardBody className="p-5">
                {!selected ? (
                  <>
                    <div className="text-lg font-black" style={{ color: "#0f1b1b" }}>
                      Seleccioná un afiliado
                    </div>
                    <div className="text-sm mt-1" style={{ color: "var(--osd-slate)" }}>
                      Elegilo desde el panel derecho para ver insumos, médico solicitante y gasto.
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="space-y-1">
                        <div className="text-xs font-extrabold" style={{ color: "var(--osd-slate)" }}>
                          {selected.id} • {selected.empresa} • {selected.localidad}
                        </div>
                        <div className="text-xl font-black" style={{ color: "#0f1b1b" }}>
                          {selected.nombre}
                        </div>
                        <div className="text-sm" style={{ color: "#223535" }}>
                          Domicilio: <span className="font-semibold">{selected.domicilio}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                          <Chip
                            variant="flat"
                            className="font-bold"
                            style={{
                              background: "rgba(18,91,88,0.12)",
                              color: "var(--osd-primary)",
                            }}
                          >
                            Ítems: {selected.items.length}
                          </Chip>

                          <Chip
                            variant="flat"
                            className="font-bold"
                            style={{
                              background: "rgba(201,182,156,0.28)",
                              color: "var(--osd-secondary)",
                            }}
                          >
                            Cantidad total: {countItems(selected)}
                          </Chip>

                          <Chip
                            variant="flat"
                            className="font-bold"
                            style={{
                              background: "rgba(169,198,198,0.35)",
                              color: "var(--osd-primary)",
                            }}
                          >
                            Gasto estimado: {money(totalAfiliado(selected))}
                          </Chip>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 justify-end">
                        <Button
                          variant="flat"
                          className="font-extrabold"
                          style={{
                            background: "rgba(0,0,0,0.06)",
                            color: "#0f1b1b",
                            borderRadius: 9999,
                          }}
                          onPress={() => setOpenDetalle(true)}
                        >
                          Ver detalle
                        </Button>

                        <Button
                          className="osd-btn-secondary"
                          onPress={() => setOpenExcel(true)}
                        >
                          Ver Excel (afiliado)
                        </Button>
                      </div>
                    </div>

                    <Divider className="my-4" />

                    {/* resumen rápido: últimos ítems */}
                    <div className="space-y-3">
                      {selected.items.slice(0, 4).map((it, idx) => (
                        <div key={idx} className="osd-surface p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-xs font-extrabold" style={{ color: "var(--osd-slate)" }}>
                                {it.tipo} • Empresa carga: {it.empresaCarga} • {it.fechaCarga}
                              </div>
                              <div className="font-black truncate" style={{ color: "#0f1b1b" }}>
                                {it.descripcion}
                              </div>
                              <div className="text-sm" style={{ color: "#223535" }}>
                                {it.cantidad} {it.unidad} • Unitario: {money(it.unitario)}
                              </div>
                              <div className="text-xs mt-1" style={{ color: "var(--osd-slate)" }}>
                                Médico: <span className="font-bold">{it.medico.nombre}</span> • Matrícula:{" "}
                                <span className="font-bold">{it.medico.matricula}</span>
                              </div>
                            </div>

                            <span className="osd-pill osd-pill-ok shrink-0">
                              {money(it.cantidad * it.unitario)}
                            </span>
                          </div>
                        </div>
                      ))}

                      {selected.items.length > 4 && (
                        <div className="text-xs font-bold" style={{ color: "var(--osd-slate)" }}>
                          + {selected.items.length - 4} ítems más… (abrí “Ver detalle”)
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Derecha: lista afiliados (estilo HeroUI ejemplo) */}
          <div className="space-y-4">
            <div className="osd-surface p-5">
              <div className="text-lg font-black" style={{ color: "#0f1b1b" }}>
                Afiliados ({data.length})
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--osd-slate)" }}>
                Seleccioná 1 para ver el detalle a la izquierda.
              </div>

              <Divider className="my-4" />

              <CheckboxGroup
                classNames={{ base: "w-full" }}
                value={selectedId}
                // dejamos single-select: solo 1 valor
                onChange={(vals) => setSelectedId(vals.slice(-1))}
              >
                {data.map((a) => (
                  <CustomCheckbox
                    key={a.id}
                    value={a.id}
                    statusColor={a.estado === "Crítico" ? "danger" : "secondary"}
                    user={{
                      name: a.nombre,
                      avatar: "https://i.pravatar.cc/300?u=" + encodeURIComponent(a.id),
                      sub: `${a.id} • ${a.localidad}`,
                      role: a.empresa,
                      status: a.estado === "Crítico" ? "Crítico" : "Activo",
                    }}
                  />
                ))}
              </CheckboxGroup>

              <Divider className="my-4" />

              <div className="flex gap-2">
                <Button
                  variant="flat"
                  className="w-full font-extrabold"
                  style={{ background: "rgba(0,0,0,0.06)", color: "#0f1b1b", borderRadius: 9999 }}
                  onPress={() => setSelectedId([])}
                >
                  Limpiar
                </Button>

                <Button
                  className="w-full osd-btn-primary"
                  onPress={() => setOpenExcel(true)}
                  isDisabled={!selected}
                >
                  Excel afiliado
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Detalle completo */}
      <Modal isOpen={openDetalle} onOpenChange={setOpenDetalle} size="lg" placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Detalle de insumos
                <span className="text-xs opacity-70">
                  {selected ? `${selected.nombre} • ${selected.id} • ${selected.mes}` : ""}
                </span>
              </ModalHeader>

              <ModalBody className="space-y-3">
                {!selected ? (
                  <div className="text-sm" style={{ color: "var(--osd-slate)" }}>
                    Seleccioná un afiliado.
                  </div>
                ) : (
                  <>
                    {selected.items.map((it, idx) => (
                      <div key={idx} className="osd-surface p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-xs font-extrabold" style={{ color: "var(--osd-slate)" }}>
                              {it.tipo} • Empresa carga: {it.empresaCarga} • {it.fechaCarga}
                            </div>
                            <div className="font-black truncate" style={{ color: "#0f1b1b" }}>
                              {it.descripcion}
                            </div>
                            <div className="text-sm" style={{ color: "#223535" }}>
                              {it.cantidad} {it.unidad} • Unitario: {money(it.unitario)}
                            </div>
                            <div className="text-xs mt-1" style={{ color: "var(--osd-slate)" }}>
                              Médico: <span className="font-bold">{it.medico.nombre}</span> • Matrícula:{" "}
                              <span className="font-bold">{it.medico.matricula}</span>
                            </div>
                          </div>

                          <span className="osd-pill osd-pill-ok shrink-0">
                            {money(it.cantidad * it.unitario)}
                          </span>
                        </div>
                      </div>
                    ))}

                    <Divider />

                    <div className="flex items-center justify-between">
                      <div className="text-sm font-black" style={{ color: "#0f1b1b" }}>
                        Total estimado
                      </div>
                      <div className="text-lg font-black" style={{ color: "var(--osd-primary)" }}>
                        {money(totalAfiliado(selected))}
                      </div>
                    </div>
                  </>
                )}
              </ModalBody>

              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button
                  className="osd-btn-primary"
                  onPress={() => alert("Mock: exportar detalle a Excel")}
                  isDisabled={!selected}
                >
                  Exportar a Excel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal: Excel (mock) */}
      <Modal isOpen={openExcel} onOpenChange={setOpenExcel} size="xl" placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Vista “Excel” (mock)
                <span className="text-xs opacity-70">
                  {selected ? `Afiliado: ${selected.nombre} • ${selected.mes}` : `Consolidado • ${mes}`}
                </span>
              </ModalHeader>

              <ModalBody>
                <div className="osd-surface p-4">
                  <div className="text-sm" style={{ color: "#223535" }}>
                    Simula una exportación para pasar a AsarFarma.
                  </div>
                  <Divider className="my-3" />
                  <div className="text-xs font-mono whitespace-pre-wrap" style={{ color: "#0f1b1b" }}>
                    {buildCsvPreview(selected ? [selected] : data)}
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  variant="light"
                  onPress={() => {
                    onClose();
                  }}
                >
                  Cerrar
                </Button>
                <Button className="osd-btn-primary" onPress={() => alert("Mock: descargar .xlsx")}>
                  Descargar Excel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

function buildCsvPreview(list) {
  const header = [
    "mes",
    "afiliado_id",
    "afiliado_nombre",
    "empresa_afiliado",
    "empresa_carga",
    "medico",
    "matricula",
    "tipo",
    "descripcion",
    "cantidad",
    "unidad",
    "unitario",
    "subtotal",
    "fecha_carga",
  ];

  const rows = [];

  list.forEach((a) => {
    a.items.forEach((it) => {
      const subtotal = it.cantidad * it.unitario;
      rows.push([
        a.mes,
        a.id,
        a.nombre,
        a.empresa,
        it.empresaCarga,
        it.medico.nombre,
        it.medico.matricula,
        it.tipo,
        it.descripcion,
        it.cantidad,
        it.unidad,
        it.unitario,
        subtotal,
        it.fechaCarga,
      ]);
    });
  });

  const lines = [header.join(" | "), ...rows.slice(0, 50).map((r) => r.join(" | "))];
  if (rows.length > 50) lines.push(`... (${rows.length - 50} filas más)`);

  return lines.join("\n");
}
