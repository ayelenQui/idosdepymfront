import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider,
  Textarea,
  Select,
  SelectItem,
  Listbox,
  ListboxItem,
  ScrollShadow,
  Avatar,
} from "@heroui/react";

/** -----------------------------
 *  DATA: Afiliados (sidebar)
 *  ----------------------------- */
const afiliados = [
  {
    id: "AFI-1",
    name: "Ricardo Medina",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
    email: "ricardo.medina@mock.com",
    empresa: "HomeCare Solutions S.A.",
  },
  {
    id: "AFI-2",
    name: "Alicia Pereyra",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/4.png",
    email: "alicia.pereyra@mock.com",
    empresa: "Mediserv Int. Domiciliaria",
  },
  {
    id: "AFI-3",
    name: "Jorge Sosa",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/5.png",
    email: "jorge.sosa@mock.com",
    empresa: "HomeCare Solutions S.A.",
  },
  {
    id: "AFI-4",
    name: "Rosa Benítez",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/8.png",
    email: "rosa.benitez@mock.com",
    empresa: "Cuidados Integrales ID",
  },
];

const STATUS = {
  NUEVO: "NUEVO",
  PENDIENTE: "PENDIENTE_RESPUESTA",
  RESPONDIDO: "RESPONDIDO",
  RESUELTO: "RESUELTO",
};

const statusChip = (s) => {
  switch (s) {
    case STATUS.NUEVO:
      return <Chip color="warning" variant="flat">Nuevo</Chip>;
    case STATUS.PENDIENTE:
      return <Chip color="secondary" variant="flat">Pendiente de respuesta</Chip>;
    case STATUS.RESPONDIDO:
      return <Chip color="primary" variant="flat">Respondido</Chip>;
    case STATUS.RESUELTO:
      return <Chip color="success" variant="flat">Resuelto</Chip>;
    default:
      return <Chip variant="flat">{s}</Chip>;
  }
};

const mockReclamos = [
  {
    id: "REC-10021",
    afiliadoId: "AFI-1",
    afiliado: "Ricardo Medina",
    dni: "24.556.120",
    empresa: "HomeCare Solutions S.A.",
    fecha: "2026-02-02",
    motivo: "No vino la enfermera",
    texto:
      "Hoy debía venir enfermería a las 10:00 y no se presentó nadie. No avisaron reprogramación. Paciente con oxígeno.",
    status: STATUS.NUEVO,
    prioridad: "ALTA",
  },
  {
    id: "REC-10022",
    afiliadoId: "AFI-2",
    afiliado: "Alicia Pereyra",
    dni: "18.990.432",
    empresa: "Mediserv Int. Domiciliaria",
    fecha: "2026-02-02",
    motivo: "Faltan insumos",
    texto:
      "Faltan gasas estériles y cánulas. Entrega prometida hace 48 hs. Necesitamos reposición urgente.",
    status: STATUS.NUEVO,
    prioridad: "MEDIA",
  },
  {
    id: "REC-10023",
    afiliadoId: "AFI-3",
    afiliado: "Jorge Sosa",
    dni: "32.112.554",
    empresa: "HomeCare Solutions S.A.",
    fecha: "2026-02-01",
    motivo: "Kinesiología no cumplida",
    texto:
      "No vino kinesio en las últimas 2 sesiones pactadas. No responden el WhatsApp.",
    status: STATUS.PENDIENTE,
    prioridad: "ALTA",
    seguimiento: {
      derivadoEl: "2026-02-01",
      canal: "Mail",
      responsable: "OSDEPYM • Auditoría",
      nota: "Se derivó a la empresa. Pendiente confirmación de reprogramación.",
    },
  },
  {
    id: "REC-10024",
    afiliadoId: "AFI-4",
    afiliado: "Rosa Benítez",
    dni: "26.551.901",
    empresa: "Cuidados Integrales ID",
    fecha: "2026-01-31",
    motivo: "Visita médica pendiente",
    texto:
      "El médico quedó en venir el viernes, no vino y no confirmaron nuevo día.",
    status: STATUS.PENDIENTE,
    prioridad: "MEDIA",
    seguimiento: {
      derivadoEl: "2026-01-31",
      canal: "Portal",
      responsable: "OSDEPYM • Auditoría",
      nota: "Solicitar nueva fecha/hora y profesional asignado.",
    },
  },
];

function PriorityChip({ prioridad }) {
  const color = prioridad === "ALTA" ? "danger" : prioridad === "MEDIA" ? "warning" : "default";
  return (
    <Chip size="sm" variant="flat" color={color}>
      {prioridad}
    </Chip>
  );
}

/** ---------------------------------------
 *  Right Sidebar: Afiliados (Listbox)
 *  --------------------------------------- */
function AfiliadosSidebar({ selectedKeys, onSelectionChange }) {
  const selectedArray = React.useMemo(() => Array.from(selectedKeys || []), [selectedKeys]);

  const topContent = React.useMemo(() => {
    if (!selectedArray.length) return null;

    return (
      <ScrollShadow hideScrollBar className="w-full flex py-0.5 px-2 gap-1" orientation="horizontal">
        {selectedArray.map((id) => {
          const a = afiliados.find((x) => x.id === id);
          return (
            <Chip key={id} variant="flat">
              {a?.name || id}
            </Chip>
          );
        })}
      </ScrollShadow>
    );
  }, [selectedArray]);

  return (
    <Card className="border border-black/5 shadow-soft">
      <CardHeader className="flex flex-col items-start gap-1">
        <div className="text-sm font-black text-slate-900">Afiliados</div>
        <div className="text-xs text-slate-500">Seleccioná para filtrar reclamos</div>
      </CardHeader>

      <CardBody className="pt-0">
        <Listbox
          aria-label="Lista de afiliados"
          items={afiliados}
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={onSelectionChange}
          topContent={topContent}
          variant="flat"
          classNames={{
            base: "max-w-full",
            list: "max-h-[520px] overflow-auto",
          }}
        >
          {(item) => (
            <ListboxItem key={item.id} textValue={item.name}>
              <div className="flex gap-2 items-center">
                <Avatar alt={item.name} className="shrink-0" size="sm" src={item.avatar} />
                <div className="flex flex-col">
                  <span className="text-small">{item.name}</span>
                  <span className="text-tiny text-default-400">{item.empresa}</span>
                </div>
              </div>
            </ListboxItem>
          )}
        </Listbox>
      </CardBody>

      <CardFooter className="justify-between">
        <span className="text-xs text-slate-500">
          Seleccionados: <span className="font-semibold">{selectedArray.length}</span>
        </span>
        <Button
          size="sm"
          variant="flat"
          onPress={() => onSelectionChange(new Set())}
        >
          Limpiar
        </Button>
      </CardFooter>
    </Card>
  );
}

/** -----------------------------
 *  Page
 *  ----------------------------- */
export default function ReclamosPage() {
  const [reclamos, setReclamos] = React.useState(mockReclamos);

  // Filtro por afiliados seleccionados (sidebar)
  const [selectedAfiliados, setSelectedAfiliados] = React.useState(new Set());

  // Modal
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const [canal, setCanal] = React.useState("Mail");
  const [nota, setNota] = React.useState("");

  const openModal = (r) => {
    setSelected(r);
    setCanal(r?.seguimiento?.canal || "Mail");
    setNota(r?.seguimiento?.nota || "");
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSelected(null);
    setNota("");
  };

  const derivarAEmpresa = () => {
    if (!selected) return;

    const now = new Date().toISOString().slice(0, 10);

    setReclamos((prev) =>
      prev.map((r) => {
        if (r.id !== selected.id) return r;
        return {
          ...r,
          status: STATUS.PENDIENTE,
          seguimiento: {
            derivadoEl: now,
            canal,
            responsable: "OSDEPYM • Auditoría",
            nota: nota?.trim() || "Derivado a empresa para gestión y respuesta.",
          },
        };
      })
    );

    closeModal();
  };

  const marcarRespondido = (id) => {
    setReclamos((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: STATUS.RESPONDIDO,
              seguimiento: {
                ...(r.seguimiento || {}),
                respuestaEmpresa: "Empresa confirmó reprogramación. (mock)",
                respondidoEl: new Date().toISOString().slice(0, 10),
              },
            }
          : r
      )
    );
  };

  const cerrarReclamo = (id) => {
    setReclamos((prev) => prev.map((r) => (r.id === id ? { ...r, status: STATUS.RESUELTO } : r)));
  };

  const matchFilter = (r) => {
    const selected = Array.from(selectedAfiliados);
    if (!selected.length) return true;
    return selected.includes(r.afiliadoId);
  };

  const visibles = reclamos.filter(matchFilter);

  const nuevos = visibles.filter((r) => r.status === STATUS.NUEVO);
  const seguimientos = visibles.filter((r) => r.status === STATUS.PENDIENTE);
  const respondidos = visibles.filter((r) => r.status === STATUS.RESPONDIDO);
  const resueltos = visibles.filter((r) => r.status === STATUS.RESUELTO);

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl font-black text-slate-900">Reclamos</h1>
        <div className="flex flex-wrap gap-2">
          <Chip variant="flat" color="warning">Nuevos: {nuevos.length}</Chip>
          <Chip variant="flat" color="secondary">Seguimientos: {seguimientos.length}</Chip>
          <Chip variant="flat" color="primary">Respondidos: {respondidos.length}</Chip>
          <Chip variant="flat" color="success">Resueltos: {resueltos.length}</Chip>
        </div>
      </div>

      {/* LAYOUT 2 COLUMNAS */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
        {/* MAIN */}
        <main className="space-y-6">
          {/* NUEVOS */}
          <section className="space-y-3">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">Nuevos</h2>
                <p className="text-xs text-slate-500">Acción rápida: derivar a empresa para resolver</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {nuevos.map((r) => (
                <Card key={r.id} className="border border-black/5 shadow-soft">
                  <CardHeader className="justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-black text-slate-900">{r.motivo}</span>
                        {statusChip(r.status)}
                        <PriorityChip prioridad={r.prioridad} />
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        <span className="font-semibold">{r.afiliado}</span> • {r.empresa} • {r.fecha}
                      </div>
                    </div>

                    <Button color="primary" radius="full" size="sm" onPress={() => openModal(r)}>
                      Solucionar
                    </Button>
                  </CardHeader>

                  <CardBody className="text-sm text-slate-600">
                    <p className="line-clamp-3">{r.texto}</p>
                  </CardBody>

                  <CardFooter className="justify-between">
                    <span className="text-xs font-semibold text-slate-500">{r.id}</span>
                    <Button size="sm" variant="light" onPress={() => openModal(r)}>
                      Abrir
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              {!nuevos.length && (
                <div className="text-sm text-slate-500 italic">No hay reclamos nuevos.</div>
              )}
            </div>
          </section>

          <Divider />

          {/* SEGUIMIENTOS */}
          <section className="space-y-3">
            <div>
              <h2 className="text-lg font-black text-slate-900">Seguimientos</h2>
              <p className="text-xs text-slate-500">Pendientes de respuesta por la empresa</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {seguimientos.map((r) => (
                <Card key={r.id} className="border border-black/5 shadow-soft">
                  <CardHeader className="justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-black text-slate-900">{r.motivo}</span>
                        {statusChip(r.status)}
                        <Chip size="sm" variant="flat">Derivado: {r?.seguimiento?.derivadoEl || "-"}</Chip>
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        <span className="font-semibold">{r.afiliado}</span> • {r.empresa}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="flat" color="secondary" onPress={() => openModal(r)}>
                        Ver
                      </Button>
                      <Button size="sm" color="primary" onPress={() => marcarRespondido(r.id)}>
                        Marcar respondido
                      </Button>
                    </div>
                  </CardHeader>

                  <CardBody className="space-y-3">
                    <div className="rounded-xl border border-black/5 p-3 bg-white/60">
                      <div className="text-xs font-black text-slate-900 mb-1">Nota OSDEPYM</div>
                      <div className="text-sm text-slate-600">{r?.seguimiento?.nota || "-"}</div>
                    </div>

                    <div className="text-sm text-slate-600 line-clamp-2">{r.texto}</div>
                  </CardBody>

                  <CardFooter className="justify-between">
                    <span className="text-xs font-semibold text-slate-500">{r.id}</span>
                    <Button size="sm" variant="light" onPress={() => cerrarReclamo(r.id)}>
                      Cerrar (mock)
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              {!seguimientos.length && (
                <div className="text-sm text-slate-500 italic">No hay seguimientos pendientes.</div>
              )}
            </div>
          </section>

          {/* (Opcional) Respondidos / Resueltos para que no “se pierdan” */}
          {(respondidos.length || resueltos.length) ? (
            <>
              <Divider />
              <section className="space-y-3">
                <h2 className="text-lg font-black text-slate-900">Historial</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {respondidos.map((r) => (
                    <Card key={r.id} className="border border-black/5 shadow-soft">
                      <CardHeader className="justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-slate-900">{r.motivo}</span>
                            {statusChip(r.status)}
                          </div>
                          <div className="text-xs text-slate-500">
                            {r.afiliado} • {r.empresa} • Respondido: {r?.seguimiento?.respondidoEl || "-"}
                          </div>
                        </div>
                        <Button size="sm" variant="flat" onPress={() => openModal(r)}>
                          Ver
                        </Button>
                      </CardHeader>
                      <CardBody className="text-sm text-slate-600">
                        <div className="rounded-xl border border-black/5 p-3 bg-white/60">
                          <div className="text-xs font-black text-slate-900 mb-1">Respuesta empresa</div>
                          <div className="text-sm text-slate-600">{r?.seguimiento?.respuestaEmpresa || "-"}</div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}

                  {resueltos.map((r) => (
                    <Card key={r.id} className="border border-black/5 shadow-soft">
                      <CardHeader className="justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-slate-900">{r.motivo}</span>
                            {statusChip(r.status)}
                          </div>
                          <div className="text-xs text-slate-500">
                            {r.afiliado} • {r.empresa} • {r.fecha}
                          </div>
                        </div>
                        <Button size="sm" variant="flat" onPress={() => openModal(r)}>
                          Ver
                        </Button>
                      </CardHeader>
                      <CardBody className="text-sm text-slate-600">
                        <p className="line-clamp-2">{r.texto}</p>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </section>
            </>
          ) : null}
        </main>

        {/* ASIDE RIGHT */}
        <aside className="xl:sticky xl:top-6 space-y-4">
          <AfiliadosSidebar
            selectedKeys={selectedAfiliados}
            onSelectionChange={(keys) => setSelectedAfiliados(keys)}
          />

          <Card className="border border-black/5 shadow-soft">
            <CardHeader className="flex flex-col items-start gap-1">
              <div className="text-sm font-black text-slate-900">Tip</div>
              <div className="text-xs text-slate-500">
                Seleccioná 1 o varios afiliados para filtrar “Nuevos” y “Seguimientos”.
              </div>
            </CardHeader>
          </Card>
        </aside>
      </div>

      {/* MODAL */}
      <Modal isOpen={open} onOpenChange={setOpen} size="2xl" backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-black text-slate-900">{selected?.motivo || "Detalle"}</span>
                  <div className="flex gap-2">
                    {selected?.status ? statusChip(selected.status) : null}
                    {selected?.prioridad ? <PriorityChip prioridad={selected.prioridad} /> : null}
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  {selected?.afiliado} • DNI {selected?.dni} • {selected?.empresa} • {selected?.fecha} • {selected?.id}
                </div>
              </ModalHeader>

              <ModalBody className="space-y-4">
                <div className="bg-white/60 border border-black/5 rounded-xl p-4">
                  <div className="text-xs font-black text-slate-900 mb-2">Texto del reclamo</div>
                  <div className="text-sm text-slate-700 leading-relaxed">{selected?.texto}</div>
                </div>

                <Divider />

                {/* Solo mostrar “Derivar” si está en NUEVO o PENDIENTE */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-black text-slate-900">Derivación / Nota</div>
                    <div className="text-xs text-slate-500">
                      {selected?.status === STATUS.NUEVO
                        ? "Esto lo pasa a Seguimientos (pendiente de respuesta)."
                        : "Podés actualizar la nota del seguimiento."}
                    </div>
                  </div>

                  <Select
                    label="Canal"
                    selectedKeys={[canal]}
                    onSelectionChange={(keys) => setCanal(Array.from(keys)[0] ?? "Mail")}
                  >
                    <SelectItem key="Mail">Mail</SelectItem>
                    <SelectItem key="Portal">Portal</SelectItem>
                    <SelectItem key="WhatsApp">WhatsApp</SelectItem>
                  </Select>

                  <Textarea
                    label="Nota para la empresa"
                    placeholder="Ej: Favor confirmar reprogramación + profesional asignado."
                    value={nota}
                    onValueChange={setNota}
                    minRows={3}
                  />
                </div>
              </ModalBody>

              <ModalFooter>
                <Button variant="light" onPress={onClose}>Cerrar</Button>

                {selected?.status === STATUS.NUEVO ? (
                  <Button color="primary" onPress={derivarAEmpresa}>
                    Derivar a empresa
                  </Button>
                ) : (
                  <Button osd-btn-primary
                    color="primary"
                    variant="flat"
                    onPress={() => {
                      // solo actualiza nota/canal si querés
                      if (!selected) return;
                      setReclamos((prev) =>
                        prev.map((r) =>
                          r.id === selected.id
                            ? {
                                ...r,
                                seguimiento: {
                                  ...(r.seguimiento || {}),
                                  canal,
                                  nota: nota?.trim() || r?.seguimiento?.nota || "",
                                },
                              }
                            : r
                        )
                      );
                      closeModal();
                    }}
                  >
                    Guardar nota
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
