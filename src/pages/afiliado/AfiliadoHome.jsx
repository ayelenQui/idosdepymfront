import React from "react";
import { useNavigate } from "react-router-dom";
import AccionesRapidasGrid from "./AccionesRapidasGrid";


import {
  Card,
  CardHeader,
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

const CATEGORIAS = [
  { key: "insumos", label: "Insumos" },
  { key: "visitas", label: "Enfermería / Visitas" },
  { key: "empresa", label: "Empresa ID" },
  { key: "admin", label: "Administrativo" },
  { key: "sugerencia", label: "Sugerencia" },
  { key: "otro", label: "Otro" },
];

const PRIORIDADES = [
  { key: "baja", label: "Baja" },
  { key: "media", label: "Media" },
  { key: "alta", label: "Alta" },
  { key: "urgente", label: "Urgente" },
];

const ESTADOS = {
  NUEVO: "Nuevo",
  REVISION: "En revisión",
  COORDINACION: "Coordinación",
  RESUELTO: "Resuelto",
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

function Icon({ children }) {
  return (
    <span
      style={{
        width: 44,
        height: 44,
        borderRadius: 14,
        display: "grid",
        placeItems: "center",
        background: "rgba(18,91,88,0.12)",
        color: brand.teal,
        fontSize: 20,
        fontWeight: 800,
      }}
    >
      {children}
    </span>
  );
}

export default function AfiliadoHome() {
  const navigate = useNavigate();

  // mock: datos del afiliado (para demo)
  const afiliado = {
    nombre: "Juan Pérez",
    plan: "Cobertura Integral Plus",
    nro: "12-45879-01",
    estado: "Internación Domiciliaria Activa",
    Domicilio: "Presidente Peron 456" ,
    Localidad: "Capital Federal",
  };

   const [tickets, setTickets] = React.useState([
    {
      id: "REC-1024",
      categoria: "visitas",
      titulo: "No vino la enfermera (turno mañana)",
      detalle: "La visita estaba pactada para 09:00 y no se presentó nadie.",
      prioridad: "alta",
      estado: "En revisión",
      fecha: "2026-02-03",
    },
    {
      id: "REC-1019",
      categoria: "insumos",
      titulo: "Insumo defectuoso",
      detalle: "Llegó un insumo con empaque abierto y sin rótulo legible.",
      prioridad: "media",
      estado: "Coordinación",
      fecha: "2026-02-01",
    },
  ]);
  // modales
  const [openNuevo, setOpenNuevo] = React.useState(false);
  const [openCalif, setOpenCalif] = React.useState(false);

  // tabs dentro del modal "Nuevo"
  const [nuevoTab, setNuevoTab] = React.useState("reclamo");

  const [nuevo, setNuevo] = React.useState({
    categoria: "insumos",
    prioridad: "media",
    titulo: "",
    detalle: "",
    fechaIncidente: "",
  });

  const [rate, setRate] = React.useState({
    target: "profesional",
    nombre: "",
    estrellas: 5,
    comentario: "",
  });

  const submitNuevo = () => {
    if (!nuevo.titulo || !nuevo.detalle) return;

    const id = `REC-${Math.floor(1000 + Math.random() * 9000)}`;
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

    setNuevo((s) => ({ ...s, titulo: "", detalle: "" }));
    setOpenNuevo(false);
  };

  const submitCalif = () => {
    if (!rate.nombre) return;
    alert("Mock: calificación registrada ⭐");
    setRate({ target: "profesional", nombre: "", estrellas: 5, comentario: "" });
    setOpenCalif(false);
  };

  const openNuevoReclamo = (categoriaKey) => {
    setNuevoTab("reclamo");
    setNuevo((s) => ({ ...s, categoria: categoriaKey ?? "insumos" }));
    setOpenNuevo(true);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${brand.ice} 0%, #ffffff 55%)`,
      }}
    >
      {/* Topbar simple (podés integrarlo a tu layout) */}
      <div className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center overflow-hidden">
              <img
                src="/img/osdepymlogo.jpg"
                alt="OSDEPYM"
                className="h-8 w-8 object-contain"
              />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wider uppercase" style={{ color: brand.steel }}>
                Portal del Afiliado
              </div>
              <div className="text-base font-black" style={{ color: "#0f1b1b" }}>
                OSDEPYM ID
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Chip variant="flat" style={{ background: `${brand.teal}14`, color: brand.teal }}>
              Atención 24hs
            </Chip>
            <Button
              size="sm"
              variant="flat"
              style={{ background: "rgba(0,0,0,0.06)", color: "#0f1b1b" }}
              onPress={() => alert("Mock: notificaciones")}
            >
              🔔
            </Button>
            <Button
              size="sm"
              variant="flat"
              style={{ background: "rgba(0,0,0,0.06)", color: "#0f1b1b" }}
              onPress={() => alert("Mock: perfil")}
            >
              👤
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-6">
        {/* Header afiliado */}
        <Card className="border-none shadow-md">
          <CardBody className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="h-14 w-14 rounded-full"
                style={{
                  background: "linear-gradient(135deg, rgba(48,140,232,0.25), rgba(18,91,88,0.15))",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 900,
                  color: "#0f1b1b",
                }}
              >
                JP
              </div>
              <div>
                <div className="text-2xl font-black" style={{ color: "#0f1b1b" }}>
                  Hola, {afiliado.nombre}
                </div>
                <div className="text-sm" style={{ color: "#223535" }}>
                  <span className="font-bold" style={{ color: brand.teal }}>
                    {afiliado.estado}
                  </span>{" "}
                  • Plan: <span className="font-semibold">{afiliado.plan}</span> • Afiliado N°:{" "}
                  <span className="font-semibold">{afiliado.nro}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                className="font-black"
                style={{ backgroundColor: brand.teal, color: "white" }}
                onPress={() => openNuevoReclamo("visitas")}
              >
                Crear reclamo
              </Button>
              <Button
                variant="flat"
                className="font-bold"
                style={{ background: `${brand.teal}14`, color: brand.teal }}
                onPress={() => setOpenCalif(true)}
              >
                Calificar atención
              </Button>
              <Button
                variant="flat"
                className="font-bold"
                style={{ background: "rgba(0,0,0,0.06)", color: "#0f1b1b" }}
                onPress={() => alert("Mock: contactar 24hs")}
              >
                Contacto 24hs
              </Button>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Columna izquierda (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Accesos rápidos */}
            
            {/* Acciones rápidas (HeroUI cards con imagen) */}
<section>
  <AccionesRapidasGrid
    onReclamo={() => openNuevoReclamo("visitas")}
    onInsumos={() => openNuevoReclamo("insumos")}
    onSugerencia={() => {
      setNuevoTab("sugerencia");
      setOpenNuevo(true);
    }}
    onCalificarProfesional={() => {
      setRate((s) => ({ ...s, target: "profesional" }));
      setOpenCalif(true);
    }}
    onCalificarEmpresa={() => {
      setRate((s) => ({ ...s, target: "empresa" }));
      setOpenCalif(true);
    }}
    onMisReclamos={() => {
      const el = document.getElementById("mis-reclamos");
      el?.scrollIntoView({ behavior: "smooth" });
    }}
  />
</section>


            {/* Mis reclamos */}
            <section id="mis-reclamos">
              <div className="flex items-end justify-between px-1 mb-3">
                <h2 className="text-xl font-black" style={{ color: "#0f1b1b" }}>
                  Mis reclamos
                </h2>

                <Badge content={tickets.length} color="primary">
                  <Chip variant="flat">Casos</Chip>
                </Badge>
              </div>

              <Card className="border-none shadow-md">
                <CardBody className="p-0">
                  {tickets.map((t, idx) => (
                    <div key={t.id}>
                      <div className="p-4 flex items-start justify-between gap-4">
                        <div>
                          <div className="text-xs font-bold" style={{ color: brand.steel }}>
                            {t.id} • {catLabel(t.categoria)} • {t.fecha}
                          </div>
                          <div className="font-black" style={{ color: "#0f1b1b" }}>
                            {t.titulo}
                          </div>
                          <div className="text-sm mt-1" style={{ color: "#223535" }}>
                            {t.detalle}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <Chip color={statusColor(t.estado)} variant="flat" className="font-bold">
                            {t.estado}
                          </Chip>
                          <Chip variant="flat">Prioridad: {t.prioridad}</Chip>

                          <Button
                            size="sm"
                            variant="flat"
                            style={{ background: `${brand.teal}14`, color: brand.teal }}
                            onPress={() => alert("Mock: ver detalle / timeline")}
                          >
                            Ver detalle →
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

          {/* Columna derecha (1/3): próximas visitas + tips */}
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-black px-1" style={{ color: "#0f1b1b" }}>
                Próximas visitas
              </h2>

              <div className="space-y-4 mt-3">
                <VisitCard
                  when="HOY"
                  time="14:30"
                  name="Lic. María Rodríguez"
                  role="Enfermería"
                  onConfirm={() => alert("Mock: confirmar visita")}
                />
                <VisitCard when="MAÑANA" time="10:00" name="Dr. Carlos Gómez" role="Médico" />
                <VisitCard when="12 Oct" time="16:00" name="Lic. Facundo Ríos" role="Kinesiología" />

                <Button variant="flat" className="w-full" onPress={() => alert("Mock: historial")}>
                  Ver historial de visitas
                </Button>
              </div>
            </section>

            <Card className="border-none shadow-md">
              <CardBody className="space-y-2">
                <div className="font-black" style={{ color: "#0f1b1b" }}>
                  Atención espectacular = transparencia
                </div>
                <div className="text-sm" style={{ color: "#223535" }}>
                  Reclamos con estado visible, seguimiento y posibilidad de calificar para mejorar la calidad.
                </div>
                <Divider />
                <div className="text-xs" style={{ color: brand.steel }}>
                  SLA demo: primera respuesta &lt; 24hs • Escalamiento cuando es urgente
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>

      {/* MODAL: Nuevo caso / Sugerencia */}
      <Modal isOpen={openNuevo} onOpenChange={setOpenNuevo} placement="center" size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Crear solicitud
                <span className="text-xs opacity-70">Reclamo • Consulta • Sugerencia</span>
              </ModalHeader>

              <ModalBody className="space-y-4">
                <Tabs selectedKey={nuevoTab} onSelectionChange={(k) => setNuevoTab(k)} variant="solid" radius="lg">
                  <Tab key="reclamo" title="Reclamo / Consulta" />
                  <Tab key="sugerencia" title="Sugerencia" />
                </Tabs>

                {nuevoTab === "reclamo" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Select
                        label="Categoría"
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
                        label="Prioridad"
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
                      label="Título"
                      placeholder="Ej: Insumo defectuoso / No vino la enfermera"
                      value={nuevo.titulo}
                      onValueChange={(v) => setNuevo((s) => ({ ...s, titulo: v }))}
                      isRequired
                    />

                    <Textarea
                      label="Detalle"
                      placeholder="Contanos qué pasó (fecha/hora, qué insumo, quién debía ir, etc.)."
                      value={nuevo.detalle}
                      onValueChange={(v) => setNuevo((s) => ({ ...s, detalle: v }))}
                      minRows={5}
                      isRequired
                    />

                    <Input
                      label="Fecha del incidente (opcional)"
                      type="date"
                      value={nuevo.fechaIncidente}
                      onValueChange={(v) => setNuevo((s) => ({ ...s, fechaIncidente: v }))}
                    />

                    <div className="rounded-2xl p-4" style={{ background: "rgba(0,0,0,0.06)" }}>
                      <div className="text-xs font-bold" style={{ color: brand.steel }}>
                        Adjuntos (mock)
                      </div>
                      <div className="text-sm mt-1" style={{ color: "#223535" }}>
                        Podés adjuntar foto del insumo, remito o captura de chat.
                      </div>
                      <Button
                        className="mt-3 font-bold"
                        variant="flat"
                        style={{ background: `${brand.teal}14`, color: brand.teal }}
                        onPress={() => alert("Mock: adjuntar archivo")}
                      >
                        Adjuntar archivo
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
                      label="Detalle"
                      placeholder="Contanos tu idea o sugerencia."
                      value={nuevo.detalle}
                      onValueChange={(v) => setNuevo((s) => ({ ...s, detalle: v }))}
                      minRows={6}
                      isRequired
                    />
                  </>
                )}
              </ModalBody>

              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  style={{ backgroundColor: brand.teal, color: "white" }}
                  onPress={() => {
                    if (nuevoTab === "sugerencia") {
                      if (!nuevo.titulo || !nuevo.detalle) return;
                      alert("Mock: sugerencia enviada ✅");
                      setNuevo((s) => ({ ...s, titulo: "", detalle: "" }));
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

      {/* MODAL: Calificar */}
      <Modal isOpen={openCalif} onOpenChange={setOpenCalif} placement="center" size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Calificar atención
                <span className="text-xs opacity-70">Profesional o Empresa ID</span>
              </ModalHeader>

              <ModalBody className="space-y-4">
                <Select
                  label="¿A quién querés calificar?"
                  selectedKeys={[rate.target]}
                  onSelectionChange={(keys) => {
                    const v = Array.from(keys)[0];
                    setRate((s) => ({ ...s, target: v }));
                  }}
                >
                  <SelectItem key="profesional">Profesional</SelectItem>
                  <SelectItem key="empresa">Empresa ID</SelectItem>
                </Select>

                <Input
                  label={rate.target === "profesional" ? "Nombre del profesional" : "Nombre de la empresa"}
                  placeholder={rate.target === "profesional" ? "Ej: Lic. Rodríguez" : "Ej: Best Care"}
                  value={rate.nombre}
                  onValueChange={(v) => setRate((s) => ({ ...s, nombre: v }))}
                  isRequired
                />

                <Stars value={rate.estrellas} onChange={(v) => setRate((s) => ({ ...s, estrellas: v }))} />

                <Textarea
                  label="Comentario (opcional)"
                  placeholder="¿Qué estuvo bien? ¿Qué mejorarías?"
                  value={rate.comentario}
                  onValueChange={(v) => setRate((s) => ({ ...s, comentario: v }))}
                  minRows={4}
                />
              </ModalBody>

              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button style={{ backgroundColor: brand.teal, color: "white" }} onPress={submitCalif}>
                  Enviar calificación
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

function QuickCard({ title, subtitle, icon, onPress }) {
  return (
    <button onClick={onPress} className="w-full text-left">
      <Card className="border-none shadow-md hover:shadow-lg transition">
        <CardBody className="p-5 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-black" style={{ color: "#0f1b1b" }}>
                {title}
              </div>
              <div className="text-sm" style={{ color: "#223535" }}>
                {subtitle}
              </div>
            </div>
            <Icon>{icon}</Icon>
          </div>

          <div className="text-xs font-bold" style={{ color: "#125b58" }}>
            Abrir →
          </div>
        </CardBody>
      </Card>
    </button>
  );
}

function VisitCard({ when, time, name, role, onConfirm }) {
  return (
    <Card className="border-none shadow-md">
      <CardBody className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-black" style={{ color: "#0f1b1b" }}>
              {name}
            </div>
            <div className="text-xs" style={{ color: "#223535" }}>
              {role}
            </div>
          </div>
          <Chip variant="flat" color="primary" className="font-bold">
            {when}
          </Chip>
        </div>

        <Divider />

        <div className="flex items-center justify-between">
          <div className="text-sm" style={{ color: "#223535" }}>
            ⏰ {time} hs
          </div>
          {onConfirm ? (
            <Button size="sm" variant="flat" onPress={onConfirm} style={{ background: "rgba(18,91,88,0.12)", color: "#125b58" }}>
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
      <div className="text-sm font-black">Puntuación</div>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className="text-2xl"
            style={{ opacity: n <= value ? 1 : 0.35 }}
            aria-label={`${n} estrellas`}
          >
            ⭐
          </button>
        ))}
        <span className="text-sm opacity-70">{value}/5</span>
      </div>
    </div>
  );
}
