import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardBody,
  Button,
  Chip,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Select,
  SelectItem,
  Tabs,
  Tab,
  Badge,
} from "@heroui/react";

const brand = {
  teal: "#125b58",
  steel: "#829ea1",
  ice: "#dfe7e4",
};

/** Categorías más “humanas” */
const CATEGORIAS = [
  { key: "insumos", label: "Insumos y materiales" },
  { key: "visitas", label: "Visitas / Enfermería" },
  { key: "empresa", label: "Empresa que atiende" },
  { key: "admin", label: "Administración" },
  { key: "sugerencia", label: "Sugerencia" },
  { key: "otro", label: "Otro" },
];

/** Prioridades más amables */
const PRIORIDADES = [
  { key: "baja", label: "Puede esperar" },
  { key: "media", label: "Normal" },
  { key: "alta", label: "Necesito respuesta pronto" },
  { key: "urgente", label: "Es importante" },
];

/** Estados más humanos */
const ESTADOS = {
  NUEVO: "Recibido",
  REVISION: "Lo estamos viendo",
  COORDINACION: "Estamos coordinando",
  RESUELTO: "Listo",
};

function statusColor(estado) {
  switch (estado) {
    case ESTADOS.NUEVO:
      return "primary";
    case ESTADOS.REVISION:
      return "warning";
    case ESTADOS.COORDINACION:
      return "secondary";
    case ESTADOS.RESUELTO:
      return "success";
    default:
      return "default";
  }
}

function catLabel(key) {
  return CATEGORIAS.find((c) => c.key === key)?.label ?? key;
}

/** ✅ Toast simple y lindo */
function useToast() {
  const [toast, setToast] = React.useState(null);

  const show = (msg, type = "success") => {
    setToast({ msg, type });
    window.clearTimeout(show._t);
    show._t = window.setTimeout(() => setToast(null), 2600);
  };

  return { toast, show, clear: () => setToast(null) };
}

function Toast({ toast }) {
  if (!toast) return null;
  const isOk = toast.type === "success";

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed left-1/2 -translate-x-1/2 bottom-4 z-[9999] w-[92%] max-w-md"
    >
      <div
        className="rounded-2xl px-4 py-3 shadow-lg border flex items-center gap-3"
        style={{
          background: "rgba(255,255,255,0.92)",
          borderColor: isOk ? "rgba(18,91,88,0.25)" : "rgba(181,139,133,0.35)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          className="h-10 w-10 rounded-full grid place-items-center"
          style={{
            background: isOk ? "rgba(18,91,88,0.12)" : "rgba(181,139,133,0.18)",
            border: `1px solid ${
              isOk ? "rgba(18,91,88,0.22)" : "rgba(181,139,133,0.35)"
            }`,
            color: isOk ? "#125b58" : "#8a4b40",
            fontWeight: 900,
            fontSize: 18,
          }}
        >
          {isOk ? "✓" : "!"}
        </div>

        <div className="min-w-0">
          <div className="text-sm font-extrabold" style={{ color: "#0f1b1b" }}>
            {isOk ? "Listo" : "Atención"}
          </div>
          <div className="text-sm" style={{ color: "#223535", lineHeight: 1.25 }}>
            {toast.msg}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AfiliadoHome() {
  const navigate = useNavigate();

  /** MOCK afiliado */
  const afiliado = {
    nombre: "Ayelen Quiroga",
    plan: "Cobertura Plan Personal",
    nro: "23-35979243-00",
    estado: "Internación Domiciliaria Activa",
    domicilio: "Presidente Perón 456",
    localidad: "Capital Federal",
  };

  /** Toast */
  const { toast, show: showToast } = useToast();

  /** Tickets mock */
  const [tickets, setTickets] = React.useState([
    {
      id: "SOL-1024",
      categoria: "visitas",
      titulo: "No vino la enfermera (mañana)",
      detalle: "La visita estaba pactada para 09:00 y no se presentó nadie.",
      prioridad: "alta",
      estado: ESTADOS.REVISION,
      fecha: "2026-02-03",
    },
    {
      id: "SOL-1019",
      categoria: "insumos",
      titulo: "Un insumo vino en mal estado",
      detalle: "Llegó un insumo con empaque abierto y sin rótulo legible.",
      prioridad: "media",
      estado: ESTADOS.COORDINACION,
      fecha: "2026-02-01",
    },
  ]);

  /** Modales */
  const [openNuevo, setOpenNuevo] = React.useState(false);
  const [openCalif, setOpenCalif] = React.useState(false);

  /** Check-in quincenal */
  const [openCheckin, setOpenCheckin] = React.useState(false);
  const [checkinOk, setCheckinOk] = React.useState(false);
  const [checkin, setCheckin] = React.useState({
    visitas: "",
    coordinacion: "",
    claridad: "",
    simple: "",
    adaptacion: "",
    sugerencia: "",
  });

  /** Tabs modal Nuevo */
  const [nuevoTab, setNuevoTab] = React.useState("ayuda");

  /** Form “nuevo” */
  const [nuevo, setNuevo] = React.useState({
    categoria: "visitas",
    prioridad: "media",
    titulo: "",
    detalle: "",
    fechaIncidente: "",
  });

  /** Form calificación */
  const [rate, setRate] = React.useState({
    target: "profesional",
    nombre: "",
    estrellas: 5,
    comentario: "",
  });

  const openNuevoAyuda = (categoriaKey) => {
    setNuevoTab("ayuda");
    setNuevo((s) => ({ ...s, categoria: categoriaKey ?? "visitas" }));
    setOpenNuevo(true);
  };

  const submitNuevo = () => {
    const tituloOk = (nuevo.titulo || "").trim().length >= 3;
    const detalleOk = (nuevo.detalle || "").trim().length >= 8;

    if (!tituloOk || !detalleOk) {
      showToast("Por favor, completá el título y el detalle 💚", "warn");
      return;
    }

    const id = `SOL-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().slice(0, 10);

    setTickets((prev) => [
      {
        id,
        categoria: nuevo.categoria,
        titulo: nuevo.titulo,
        detalle: nuevo.detalle,
        prioridad: nuevo.prioridad,
        estado: ESTADOS.NUEVO,
        fecha: today,
      },
      ...prev,
    ]);

    setNuevo((s) => ({ ...s, titulo: "", detalle: "", fechaIncidente: "" }));
    setOpenNuevo(false);
    showToast("Listo 💚 Ya recibimos tu solicitud.", "success");
  };

  const submitCalif = () => {
    if (!(rate.nombre || "").trim()) {
      showToast("Decinos a quién querés valorar 💚", "warn");
      return;
    }

    setRate({ target: "profesional", nombre: "", estrellas: 5, comentario: "" });
    setOpenCalif(false);
    showToast("¡Gracias! Tu comentario nos ayuda a mejorar 💚", "success");
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${brand.ice} 0%, #ffffff 55%)`,
      }}
    >
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-5 md:py-6">
        {/* HEADER AFILIADO */}
        <Card className="border-none shadow-md">
          <CardBody className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src="/img/osdepymlogo.jpg"
                alt="OSDEPYM"
                style={{ height: 52, width: "auto", borderRadius: 14 }}
              />

              <div className="min-w-0">
                <div className="text-3xl md:text-2xl font-black" style={{ color: "#0f1b1b" }}>
                  Hola, {afiliado.nombre}
                </div>

                <div className="text-base md:text-sm" style={{ color: "#223535", lineHeight: 1.35 }}>
                  <span className="font-extrabold" style={{ color: brand.teal }}>
                    {afiliado.estado}
                  </span>{" "}
                  • Plan: <span className="font-semibold">{afiliado.plan}</span> • Afiliado N°:{" "}
                  <span className="font-semibold">{afiliado.nro}</span>
                </div>

                <div className="text-sm md:text-xs mt-1" style={{ color: brand.steel }}>
                  📍 {afiliado.domicilio} • {afiliado.localidad}
                </div>
              </div>
            </div>

            {/* Acciones header */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full md:w-auto">
              <Button
                size="lg"
                className="font-black w-full"
                style={{ backgroundColor: brand.teal, color: "white" }}
                onPress={() => openNuevoAyuda("visitas")}
              >
                Ayuda
              </Button>

              <Button
                size="lg"
                variant="flat"
                className="font-bold w-full flex items-center gap-2 justify-center"
                style={{ background: `${brand.teal}14`, color: brand.teal }}
                onPress={() => setOpenCalif(true)}
              >
                <img
                  src="/img/actions/mensaje.png"
                  alt="Sobre"
                  style={{ height: 22, width: 22 }}
                />
                Valorar
              </Button>

              <Button
                size="lg"
                variant="flat"
                className="font-bold w-full"
                style={{ background: `${brand.teal}10`, color: brand.teal }}
                onPress={() => setOpenCheckin(true)}
              >
                💚OSDEPYM
              </Button>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* IZQUIERDA */}
          <div className="lg:col-span-2 space-y-6">
            {/* ACCIONES RÁPIDAS PNG */}
            <section>
              <h2 className="text-2xl md:text-xl font-black px-1 mb-3" style={{ color: "#0f1b1b" }}>
                Acciones rápidas
              </h2>

              <AccionesRapidasPng
                items={[
                  {
                    title: "Necesito ayuda",
                    img: "/img/actions/ayuda.png",
                    onPress: () => openNuevoAyuda("visitas"),
                  },
                  {
                    title: "Insumos",
                    img: "/img/actions/insumos.png",
                    onPress: () => openNuevoAyuda("insumos"),
                  },
                  {
                    title: "Sugerencia",
                    img: "/img/actions/sugerencia.png",
                    onPress: () => {
                      setNuevoTab("sugerencia");
                      setOpenNuevo(true);
                    },
                  },
                  {
                    title: "Seguimiento",
                    img: "/img/actions/mis-solicitudes.png", // (si no lo tenés, cambiá por otro)
                    onPress: () => setOpenCheckin(true),
                  },
                ]}
              />

              <div className="text-sm mt-3 px-1" style={{ color: brand.steel, lineHeight: 1.35 }}>
                Si algo no salió bien o necesitás asistencia, escribinos acá. Estamos para ayudarte 💚
              </div>
            </section>

            {/* MIS SOLICITUDES */}
            <section id="mis-solicitudes">
              <div className="flex items-end justify-between px-1 mb-3">
                <h2 className="text-2xl md:text-xl font-black" style={{ color: "#0f1b1b" }}>
                  Mis solicitudes
                </h2>

                <Badge content={tickets.length} color="primary">
                  <Chip variant="flat">Mensajes</Chip>
                </Badge>
              </div>

              <Card className="border-none shadow-md">
                <CardBody className="p-0">
                  {tickets.map((t, idx) => (
                    <div key={t.id}>
                      <div className="p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-xs font-bold" style={{ color: brand.steel }}>
                            {t.id} • {catLabel(t.categoria)} • {t.fecha}
                          </div>

                          <div className="text-lg md:text-base font-black" style={{ color: "#0f1b1b" }}>
                            {t.titulo}
                          </div>

                          <div className="text-base md:text-sm mt-1" style={{ color: "#223535", lineHeight: 1.4 }}>
                            {t.detalle}
                          </div>
                        </div>

                        <div className="flex flex-row md:flex-col items-start md:items-end gap-2">
                          <Chip color={statusColor(t.estado)} variant="flat" className="font-bold">
                            {t.estado}
                          </Chip>

                          <Chip variant="flat">
                            Importancia:{" "}
                            {PRIORIDADES.find((p) => p.key === t.prioridad)?.label ?? t.prioridad}
                          </Chip>

                          <Button
                            size="lg"
                            variant="flat"
                            style={{ background: `${brand.teal}14`, color: brand.teal }}
                            onPress={() => showToast("Seguimiento (demo) — próximamente 💚")}
                          >
                            Ver seguimiento →
                          </Button>
                        </div>
                      </div>

                      {idx < tickets.length - 1 && <Divider />}
                    </div>
                  ))}
                </CardBody>
              </Card>
            </section>
          </div>

          {/* DERECHA */}
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl md:text-xl font-black px-1" style={{ color: "#0f1b1b" }}>
                Próximas visitas
              </h2>

              <div className="space-y-4 mt-3">
                <VisitCard
                  when="HOY"
                  time="14:30"
                  name="Lic. María Rodríguez"
                  role="Enfermería"
                  onConfirm={() => showToast("Confirmación (demo) ✅")}
                />
                <VisitCard when="MAÑANA" time="10:00" name="Dr. Carlos Gómez" role="Médico" />
                <VisitCard when="12 Oct" time="16:00" name="Lic. Facundo Ríos" role="Kinesiología" />

                <Button
                  variant="flat"
                  size="lg"
                  className="w-full"
                  onPress={() => showToast("Historial (demo) — próximamente 💚")}
                >
                  Ver historial de visitas
                </Button>
              </div>
            </section>

            <Card className="border-none shadow-md">
              <CardBody className="space-y-2">
                <div className="font-black text-lg" style={{ color: "#0f1b1b" }}>
                  Estamos para ayudarte 💚
                </div>
                <div className="text-base md:text-sm" style={{ color: "#223535", lineHeight: 1.4 }}>
                  Podés avisarnos si algo no salió como esperabas o si necesitás asistencia.
                  Vamos a acompañarte.
                </div>
                <Divider />
                <div className="text-xs" style={{ color: brand.steel }}>
                  Respuesta demo: dentro de las próximas 24 hs • Si es importante, lo priorizamos.
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>

      {/* ✅ MODAL: NUEVA SOLICITUD / SUGERENCIA */}
      <Modal isOpen={openNuevo} onOpenChange={setOpenNuevo} placement="center" size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Contanos qué necesitás
                <span className="text-xs opacity-70">
                  Podés pedir ayuda, hacer una consulta o dejar una sugerencia 💚
                </span>
              </ModalHeader>

              <ModalBody className="space-y-4">
                <Tabs
                  selectedKey={nuevoTab}
                  onSelectionChange={(k) => setNuevoTab(k)}
                  variant="solid"
                  radius="lg"
                >
                  <Tab key="ayuda" title="Necesito ayuda" />
                  <Tab key="sugerencia" title="Sugerencia" />
                </Tabs>

                {nuevoTab === "ayuda" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Select
                        label="¿Sobre qué tema es?"
                        selectedKeys={[nuevo.categoria]}
                        onSelectionChange={(keys) => {
                          const v = Array.from(keys)[0];
                          setNuevo((s) => ({ ...s, categoria: v }));
                        }}
                      >
                        {CATEGORIAS.filter((c) => c.key !== "sugerencia").map((c) => (
                          <SelectItem key={c.key}>{c.label}</SelectItem>
                        ))}
                      </Select>

                      <Select
                        label="¿Qué tan importante es?"
                        selectedKeys={[nuevo.prioridad]}
                        onSelectionChange={(keys) => {
                          const v = Array.from(keys)[0];
                          setNuevo((s) => ({ ...s, prioridad: v }));
                        }}
                      >
                        {PRIORIDADES.map((p) => (
                          <SelectItem key={p.key}>{p.label}</SelectItem>
                        ))}
                      </Select>
                    </div>

                    <Input
                      label="¿Qué pasó? (breve)"
                      placeholder="Ej: No vino la enfermera / Un insumo vino mal"
                      value={nuevo.titulo}
                      onValueChange={(v) => setNuevo((s) => ({ ...s, titulo: v }))}
                      isRequired
                    />

                    <Textarea
                      label="Contanos un poco más"
                      placeholder="Si podés, agregá fecha/hora y lo que necesitás."
                      value={nuevo.detalle}
                      onValueChange={(v) => setNuevo((s) => ({ ...s, detalle: v }))}
                      minRows={6}
                      isRequired
                    />

                    <Input
                      label="¿Cuándo pasó? (opcional)"
                      type="date"
                      value={nuevo.fechaIncidente}
                      onValueChange={(v) => setNuevo((s) => ({ ...s, fechaIncidente: v }))}
                    />

                    <div className="rounded-2xl p-4" style={{ background: "rgba(0,0,0,0.06)" }}>
                      <div className="text-xs font-bold" style={{ color: brand.steel }}>
                        Si querés, podés adjuntar una foto (opcional)
                      </div>
                      <div className="text-base md:text-sm mt-1" style={{ color: "#223535" }}>
                        Por ejemplo: foto del insumo, remito o etiqueta.
                      </div>
                      <Button
                        size="lg"
                        className="mt-3 font-bold w-full md:w-auto"
                        variant="flat"
                        style={{ background: `${brand.teal}14`, color: brand.teal }}
                        onPress={() => showToast("Adjuntar (demo) — próximamente 💚")}
                      >
                        Adjuntar foto
                      </Button>
                    </div>
                  </>
                )}

                {nuevoTab === "sugerencia" && (
                  <>
                    <Input
                      label="Título"
                      placeholder="Ej: Mejorar coordinación de horarios"
                      value={nuevo.titulo}
                      onValueChange={(v) => setNuevo((s) => ({ ...s, titulo: v }))}
                      isRequired
                    />
                    <Textarea
                      label="Contanos tu sugerencia"
                      placeholder="Tu idea nos ayuda a mejorar."
                      value={nuevo.detalle}
                      onValueChange={(v) => setNuevo((s) => ({ ...s, detalle: v }))}
                      minRows={7}
                      isRequired
                    />
                  </>
                )}
              </ModalBody>

              <ModalFooter>
                <Button variant="light" size="lg" onPress={onClose}>
                  Volver
                </Button>

                <Button
                  size="lg"
                  style={{ backgroundColor: brand.teal, color: "white" }}
                  onPress={() => {
                    if (nuevoTab === "sugerencia") {
                      const tituloOk = (nuevo.titulo || "").trim().length >= 3;
                      const detalleOk = (nuevo.detalle || "").trim().length >= 8;
                      if (!tituloOk || !detalleOk) {
                        showToast("Completá el título y el detalle 💚", "warn");
                        return;
                      }
                      setNuevo((s) => ({ ...s, titulo: "", detalle: "" }));
                      showToast("¡Gracias! Recibimos tu sugerencia 💚", "success");
                      onClose();
                      return;
                    }
                    submitNuevo();
                  }}
                >
                  Enviar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* ✅ MODAL: SEGUIMIENTO QUINCENAL (UNA SOLA VEZ, BIEN UBICADO) */}
      <Modal isOpen={openCheckin} onOpenChange={setOpenCheckin} placement="center" size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <img
                    src="/img/osdepymlogo.jpg"
                    alt="OSDEPYM"
                    className="h-7 opacity-80"
                    style={{ borderRadius: 10 }}
                  />
                  <div className="leading-tight">
                    <div className="font-black">Seguimiento de bienestar 💚</div>
                    <div className="text-xs opacity-70">
                      Demo: se muestra cada 15 días para acompañarte mejor.
                    </div>
                  </div>
                </div>
              </ModalHeader>

              <ModalBody className="space-y-4">
                {checkinOk && (
                  <div
                    className="rounded-2xl p-4 border flex items-center gap-3"
                    role="status"
                    aria-live="polite"
                    style={{
                      background: "rgba(169, 198, 198, 0.35)",
                      borderColor: "rgba(169, 198, 198, 0.75)",
                    }}
                  >
                    <div
                      className="h-10 w-10 rounded-full grid place-items-center"
                      style={{
                        background: "rgba(18, 91, 88, 0.14)",
                        border: "1px solid rgba(18, 91, 88, 0.22)",
                        color: "#125b58",
                        fontWeight: 900,
                        fontSize: 18,
                      }}
                    >
                      ✓
                    </div>
                    <div>
                      <div className="text-sm font-extrabold" style={{ color: "#0f1b1b" }}>
                        Gracias 💚
                      </div>
                      <div className="text-sm" style={{ color: "#223535" }}>
                        Recibimos tu mensaje. Estamos para ayudarte.
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className="rounded-2xl p-4 text-sm"
                  style={{
                    background: "rgba(18,91,88,0.08)",
                    color: "#223535",
                    lineHeight: 1.4,
                  }}
                >
                  Queremos escucharte. Tus respuestas nos ayudan a mejorar tu atención y hacer todo más simple.
                </div>

                <Select
                  label="¿Cómo te sentiste con las visitas en tu domicilio?"
                  selectedKeys={[checkin.visitas]}
                  onSelectionChange={(keys) => {
                    const v = Array.from(keys)[0];
                    setCheckin((s) => ({ ...s, visitas: v }));
                  }}
                >
                  <SelectItem key="muy_bien">Muy bien</SelectItem>
                  <SelectItem key="bien">Bien</SelectItem>
                  <SelectItem key="regular">Regular</SelectItem>
                  <SelectItem key="mal">No fue como esperaba</SelectItem>
                </Select>

                <Select
                  label="¿Te resultó fácil coordinar horarios y turnos?"
                  selectedKeys={[checkin.coordinacion]}
                  onSelectionChange={(keys) => {
                    const v = Array.from(keys)[0];
                    setCheckin((s) => ({ ...s, coordinacion: v }));
                  }}
                >
                  <SelectItem key="si">Sí, fue fácil</SelectItem>
                  <SelectItem key="mas_o_menos">Más o menos</SelectItem>
                  <SelectItem key="no">No, necesito ayuda</SelectItem>
                </Select>

                <Select
                  label="¿Hubo algo que te resultó difícil o confuso?"
                  selectedKeys={[checkin.claridad]}
                  onSelectionChange={(keys) => {
                    const v = Array.from(keys)[0];
                    setCheckin((s) => ({ ...s, claridad: v }));
                  }}
                >
                  <SelectItem key="no">No, todo fue claro</SelectItem>
                  <SelectItem key="un_poco">Sí, un poco</SelectItem>
                  <SelectItem key="si">Sí, me cuesta bastante</SelectItem>
                </Select>

                <Select
                  label="¿Qué te gustaría que sea más simple o más rápido?"
                  selectedKeys={[checkin.simple]}
                  onSelectionChange={(keys) => {
                    const v = Array.from(keys)[0];
                    setCheckin((s) => ({ ...s, simple: v }));
                  }}
                >
                  <SelectItem key="nada">Está bien así</SelectItem>
                  <SelectItem key="botones">Botones más grandes</SelectItem>
                  <SelectItem key="avisos">Avisos por WhatsApp</SelectItem>
                  <SelectItem key="coord">Mejor coordinación</SelectItem>
                </Select>

                <Select
                  label="¿Necesitás alguna adaptación especial?"
                  selectedKeys={[checkin.adaptacion]}
                  onSelectionChange={(keys) => {
                    const v = Array.from(keys)[0];
                    setCheckin((s) => ({ ...s, adaptacion: v }));
                  }}
                >
                  <SelectItem key="no">No</SelectItem>
                  <SelectItem key="letras">Letras más grandes</SelectItem>
                  <SelectItem key="ayuda">Ayuda para usar la app</SelectItem>
                  <SelectItem key="movilidad">Dificultad motora</SelectItem>
                  <SelectItem key="vision">Dificultad visual</SelectItem>
                </Select>

                <Textarea
                  label="¿Qué podríamos mejorar para cuidarte mejor?"
                  placeholder="Podés contarnos con tranquilidad. Tu mensaje es importante 💚"
                  value={checkin.sugerencia}
                  onValueChange={(v) => setCheckin((s) => ({ ...s, sugerencia: v }))}
                  minRows={5}
                />
              </ModalBody>

              <ModalFooter className="flex gap-2">
                <Button
                  variant="light"
                  size="lg"
                  className="flex-1"
                  onPress={() => {
                    setCheckinOk(false);
                    onClose();
                  }}
                >
                  Ahora no
                </Button>

                <Button
                  size="lg"
                  className="flex-1"
                  style={{ backgroundColor: brand.teal, color: "white" }}
                  onPress={() => {
                    setCheckinOk(true);
                    showToast("Gracias por contarnos. Vamos a seguir cuidándote 💚", "success");

                    setTimeout(() => {
                      setCheckinOk(false);
                      onClose();
                    }, 1200);
                  }}
                >
                  Enviar 💚
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* ✅ MODAL: DEJAR COMENTARIO */}
      <Modal isOpen={openCalif} onOpenChange={setOpenCalif} placement="center" size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Dejar un comentario
                <span className="text-xs opacity-70">Tu opinión nos ayuda a mejorar 💚</span>
              </ModalHeader>

              <ModalBody className="space-y-4">
                <Select
                  label="¿A quién querés dejarle un comentario?"
                  selectedKeys={[rate.target]}
                  onSelectionChange={(keys) => {
                    const v = Array.from(keys)[0];
                    setRate((s) => ({ ...s, target: v }));
                  }}
                >
                  <SelectItem key="profesional">Profesional</SelectItem>
                  <SelectItem key="empresa">Empresa</SelectItem>
                </Select>

                <Input
                  label={rate.target === "profesional" ? "¿Quién te atendió?" : "¿Qué empresa te atendió?"}
                  placeholder={rate.target === "profesional" ? "Ej: Lic. Rodríguez" : "Ej: Best Care"}
                  value={rate.nombre}
                  onValueChange={(v) => setRate((s) => ({ ...s, nombre: v }))}
                  isRequired
                />

                <Stars value={rate.estrellas} onChange={(v) => setRate((s) => ({ ...s, estrellas: v }))} />

                <Textarea
                  label="Comentario (opcional)"
                  placeholder="¿Qué estuvo bien? ¿Qué se puede mejorar?"
                  value={rate.comentario}
                  onValueChange={(v) => setRate((s) => ({ ...s, comentario: v }))}
                  minRows={5}
                />
              </ModalBody>

              <ModalFooter>
                <Button variant="light" size="lg" onPress={onClose}>
                  Volver
                </Button>
                <Button size="lg" style={{ backgroundColor: brand.teal, color: "white" }} onPress={submitCalif}>
                  Enviar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* ✅ Toast siempre al final */}
      <Toast toast={toast} />
    </div>
  );
}

/** ======================= ACCIONES RÁPIDAS PNG ======================= */
function AccionesRapidasPng({ items = [] }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((it) => (
        <button
          key={it.title}
          onClick={it.onPress}
          className="w-full text-left active:scale-[0.99] transition"
          style={{ borderRadius: 28 }}
        >
          <img
            src={it.img}
            alt={it.title}
            className="w-full h-auto"
            style={{
              borderRadius: 28,
              display: "block",
              boxShadow: "0 10px 24px rgba(15, 27, 27, 0.10)",
            }}
          />
        </button>
      ))}
    </div>
  );
}

function VisitCard({ when, time, name, role, onConfirm }) {
  return (
    <Card className="border-none shadow-md">
      <CardBody className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="font-black text-lg" style={{ color: "#0f1b1b" }}>
              {name}
            </div>
            <div className="text-sm" style={{ color: "#223535" }}>
              {role}
            </div>
          </div>
          <Chip variant="flat" color="primary" className="font-bold">
            {when}
          </Chip>
        </div>

        <Divider />

        <div className="flex items-center justify-between">
          <div className="text-base" style={{ color: "#223535" }}>
            ⏰ {time} hs
          </div>
          {onConfirm ? (
            <Button
              size="lg"
              variant="flat"
              onPress={onConfirm}
              style={{ background: "rgba(18,91,88,0.12)", color: "#125b58" }}
            >
              Confirmar
            </Button>
          ) : (
            <span className="text-xs" style={{ color: "#829ea1" }}>
              —
            </span>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

function Stars({ value, onChange }) {
  return (
    <div className="space-y-2">
      <div className="text-base font-black">Puntuación</div>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className="text-3xl"
            style={{ opacity: n <= value ? 1 : 0.35 }}
            aria-label={`${n} estrellas`}
          >
            ⭐
          </button>
        ))}
        <span className="text-base opacity-70">{value}/5</span>
      </div>
    </div>
  );
}
