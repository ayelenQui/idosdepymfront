import React from "react";
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
} from "@heroui/react";

const ui = {
  primary: "#137fec",
  bgLight: "#f6f7f8",
  darkText: "#0d141b",
  muted: "#4c739a",
};

const CATEGORIAS = [
  { key: "insumos", label: "Insumos" },
  { key: "visitas", label: "Enfermería / Visitas" },
  { key: "empresa", label: "Empresa ID" },
  { key: "admin", label: "Administrativo" },
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

function statusChip(estado) {
  if (estado === ESTADOS.NUEVO) return { color: "primary", text: estado };
  if (estado === ESTADOS.REVISION) return { color: "warning", text: estado };
  if (estado === ESTADOS.COORDINACION) return { color: "secondary", text: estado };
  if (estado === ESTADOS.RESUELTO) return { color: "success", text: estado };
  return { color: "default", text: estado };
}

function MiniIcon({ children, tone = "primary" }) {
  const map = {
    primary: { bg: "rgba(19,127,236,0.12)", fg: ui.primary },
    danger: { bg: "rgba(239,68,68,0.12)", fg: "#ef4444" },
    success: { bg: "rgba(34,197,94,0.14)", fg: "#16a34a" },
    neutral: { bg: "rgba(0,0,0,0.06)", fg: ui.darkText },
  };
  const s = map[tone] ?? map.primary;

  return (
    <span
      style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        display: "grid",
        placeItems: "center",
        background: s.bg,
        color: s.fg,
        fontWeight: 900,
        fontSize: 18,
      }}
    >
      {children}
    </span>
  );
}

export default function AfiliadoDashboard() {
  // mock afiliado
  const afiliado = {
    nombre: "Juan Pérez",
    plan: "PMO Plus",
    estado: "Internación Domiciliaria",
    activo: true,
  };

  // mock plan autorizado
  const planCards = [
    { title: "Enfermería", meta: "Vigente hasta 30/11" },
    { title: "Kinesiología", meta: "3 sesiones semanales" },
    { title: "Médico a Domicilio", meta: "Visita quincenal" },
  ];

  // mock visitas
  const visitas = [
    { name: "Dra. Marta Sánchez", role: "Medicina General", when: "Hoy, 14:30 hs", status: "Confirmada" },
    { name: "Lic. Diego Rossi", role: "Kinesiología Motor", when: "Mañana, 10:00 hs", status: "Confirmada" },
  ];

  // reclamos mock
  const [tickets, setTickets] = React.useState([
    {
      id: "REC-1024",
      categoria: "visitas",
      titulo: "No vino la enfermera (turno mañana)",
      detalle: "La visita estaba pactada para 09:00 y no se presentó nadie.",
      prioridad: "alta",
      estado: ESTADOS.REVISION,
      fecha: "2026-02-03",
    },
    {
      id: "REC-1019",
      categoria: "insumos",
      titulo: "Insumo defectuoso",
      detalle: "Llegó un insumo con empaque abierto y sin rótulo legible.",
      prioridad: "media",
      estado: ESTADOS.COORDINACION,
      fecha: "2026-02-01",
    },
  ]);

  // modales
  const [openNuevo, setOpenNuevo] = React.useState(false);
  const [openCalif, setOpenCalif] = React.useState(false);
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

  const openNuevoReclamo = (catKey) => {
    setNuevoTab("reclamo");
    setNuevo((s) => ({ ...s, categoria: catKey ?? "insumos" }));
    setOpenNuevo(true);
  };

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

  return (
    <div
      className="min-h-screen"
      style={{
        background: ui.bgLight,
        color: ui.darkText,
      }}
    >
      {/* TopNavBar (similar a tu HTML) */}
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center overflow-hidden">
              <img src="/img/osdepymlogo.jpg" alt="OSDEPYM" className="h-8 w-8 object-contain" />
            </div>
            <div className="text-lg font-black" style={{ color: ui.primary }}>
              OSDEPYM ID
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a className="text-sm font-semibold border-b-2" style={{ color: ui.primary, borderColor: ui.primary }} href="#">
              Inicio
            </a>
            <a className="text-sm font-medium hover:underline" style={{ color: ui.muted }} href="#">
              Mi Plan
            </a>
            <a className="text-sm font-medium hover:underline" style={{ color: ui.muted }} href="#">
              Mis Visitas
            </a>
            <a className="text-sm font-medium hover:underline" style={{ color: ui.muted }} href="#">
              Gestiones
            </a>
          </nav>

          <div className="flex gap-2">
            <Button size="sm" variant="flat" style={{ background: "#e7edf3", color: ui.darkText }} onPress={() => alert("Mock: notificaciones")}>
              🔔
            </Button>
            <Button size="sm" variant="flat" style={{ background: "#e7edf3", color: ui.darkText }} onPress={() => alert("Mock: perfil")}>
              👤
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 md:px-10 py-8">
        {/* ProfileHeader */}
        <Card className="border-none shadow-sm mb-8">
          <CardBody className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="h-24 w-24 rounded-full border-4"
                style={{
                  borderColor: "rgba(19,127,236,0.15)",
                  background: "linear-gradient(135deg, rgba(19,127,236,0.22), rgba(0,0,0,0.05))",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 900,
                  fontSize: 22,
                }}
              >
                JP
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-black" style={{ color: ui.darkText }}>
                  ¡Hola, {afiliado.nombre}!
                </h1>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span
                    className="px-2 py-1 rounded uppercase tracking-wider text-xs font-semibold"
                    style={{
                      background: afiliado.activo ? "rgba(34,197,94,0.15)" : "rgba(0,0,0,0.08)",
                      color: afiliado.activo ? "#15803d" : ui.muted,
                    }}
                  >
                    {afiliado.activo ? "Activo" : "Inactivo"}
                  </span>

                  <span
                    className="px-2 py-1 rounded uppercase tracking-wider text-xs font-semibold"
                    style={{
                      background: "rgba(19,127,236,0.12)",
                      color: ui.primary,
                    }}
                  >
                    {afiliado.estado}
                  </span>
                </div>

                <p className="mt-2 text-sm flex items-center gap-2" style={{ color: ui.muted }}>
                  🩺 Plan: <span className="font-semibold">{afiliado.plan}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button style={{ background: ui.primary, color: "white" }} className="font-black" onPress={() => openNuevoReclamo("visitas")}>
                Realizar reclamo
              </Button>
              <Button variant="flat" className="font-bold" style={{ background: "rgba(19,127,236,0.12)", color: ui.primary }} onPress={() => setOpenCalif(true)}>
                Calificar atención
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mi Plan Autorizado */}
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-xl font-black">Mi Plan Autorizado</h2>
                <button className="text-sm font-semibold" style={{ color: ui.primary }} onClick={() => alert("Mock: ver detalles")}>
                  Ver detalles
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {planCards.map((p) => (
                  <Card key={p.title} className="border border-black/5 shadow-sm hover:shadow-md transition">
                    <CardBody className="p-4 space-y-2">
                      <div className="w-full aspect-[4/3] rounded-lg" style={{ background: "rgba(19,127,236,0.08)" }} />
                      <div className="font-black">{p.title}</div>
                      <div className="text-sm" style={{ color: ui.muted }}>
                        {p.meta}
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </section>

            {/* Próximas Visitas */}
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-xl font-black">Próximas Visitas</h2>
                <button className="text-sm font-semibold" style={{ color: ui.primary }} onClick={() => alert("Mock: calendario")}>
                  Ver calendario
                </button>
              </div>

              <div className="space-y-3">
                {visitas.map((v, idx) => (
                  <Card key={idx} className="border border-black/5 shadow-sm">
                    <CardBody className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full" style={{ background: "rgba(0,0,0,0.08)" }} />
                        <div>
                          <div className="font-black">{v.name}</div>
                          <div className="text-sm italic" style={{ color: ui.muted }}>
                            {v.role}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black" style={{ color: ui.primary }}>
                          {v.when}
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(19,127,236,0.12)", color: ui.primary, fontWeight: 600 }}>
                          {v.status}
                        </span>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </section>

            {/* Reclamos recientes (sumado, para tu foco) */}
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-xl font-black">Reclamos recientes</h2>
                <button className="text-sm font-semibold" style={{ color: ui.primary }} onClick={() => setOpenNuevo(true)}>
                  Crear nuevo
                </button>
              </div>

              <Card className="border border-black/5 shadow-sm">
                <CardBody className="p-0">
                  {tickets.map((t, idx) => {
                    const chip = statusChip(t.estado);
                    return (
                      <div key={t.id}>
                        <div className="p-4 flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="text-xs font-bold" style={{ color: ui.muted }}>
                              {t.id} • {catLabel(t.categoria)} • {t.fecha}
                            </div>
                            <div className="font-black">{t.titulo}</div>
                            <div className="text-sm mt-1" style={{ color: ui.muted }}>
                              {t.detalle}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Chip color={chip.color} variant="flat" className="font-bold">
                              {chip.text}
                            </Chip>
                            <Chip variant="flat">Prioridad: {t.prioridad}</Chip>
                            <Button size="sm" variant="flat" style={{ background: "rgba(19,127,236,0.12)", color: ui.primary }} onPress={() => alert("Mock: detalle del caso")}>
                              Ver detalle →
                            </Button>
                          </div>
                        </div>
                        {idx < tickets.length - 1 && <Divider />}
                      </div>
                    );
                  })}
                </CardBody>
              </Card>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Acciones rápidas (igual a tu HTML) */}
            <section>
              <h2 className="text-xl font-black mb-4">Acciones Rápidas</h2>

              <div className="flex flex-col gap-3">
                <ActionRow
                  tone="danger"
                  icon="!"
                  title="Realizar Reclamo"
                  subtitle="Informar inconveniente"
                  onPress={() => openNuevoReclamo("visitas")}
                />
                <ActionRow
                  tone="primary"
                  icon="📦"
                  title="Reclamar Insumos"
                  subtitle="Gasa, sueros, descartables"
                  onPress={() => openNuevoReclamo("insumos")}
                />
                <ActionRow
                  tone="success"
                  icon="✍️"
                  title="Enviar Sugerencia"
                  subtitle="Ayúdenos a mejorar"
                  onPress={() => {
                    setNuevoTab("sugerencia");
                    setOpenNuevo(true);
                  }}
                />
              </div>
            </section>

            {/* Contacto emergencia (igual a tu HTML) */}
            <div
              className="rounded-xl shadow-lg relative overflow-hidden p-6 text-white"
              style={{ background: ui.primary }}
            >
              <div className="relative z-10">
                <div className="font-black text-lg mb-1">¿Necesita Ayuda?</div>
                <div className="text-white/80 text-sm mb-4">
                  Atención prioritaria 24hs para afiliados en internación.
                </div>
                <div className="flex items-center gap-2 text-xl font-black">
                  📞 0800-OSDEPYM
                </div>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-10 border-t border-black/10 text-center" style={{ color: ui.muted }}>
        <p>© 2026 OSDEPYM - Todos los derechos reservados.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a className="hover:underline" style={{ color: ui.primary }} href="#">
            Términos y Condiciones
          </a>
          <a className="hover:underline" style={{ color: ui.primary }} href="#">
            Política de Privacidad
          </a>
        </div>
      </footer>

      {/* MODAL: Nuevo (reclamo / sugerencia) */}
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
                        {CATEGORIAS.map((c) => (
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
                      placeholder="Contanos qué pasó (fecha/hora, qué insumo, quién debía ir, etc.)"
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
                      <div className="text-xs font-bold" style={{ color: ui.muted }}>
                        Adjuntos (mock)
                      </div>
                      <div className="text-sm mt-1" style={{ color: ui.muted }}>
                        Foto del insumo, remito o captura de chat.
                      </div>
                      <Button
                        className="mt-3 font-bold"
                        variant="flat"
                        style={{ background: "rgba(19,127,236,0.12)", color: ui.primary }}
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
  label="Escribí tu mensaje"
  placeholder="Tu opinión es importante. Te leemos con atención 💚"
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
                  style={{ background: ui.primary, color: "white" }}
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
                <Button style={{ background: ui.primary, color: "white" }} onPress={submitCalif}>
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

function ActionRow({ tone, icon, title, subtitle, onPress }) {
  const toneStyle =
    tone === "danger"
      ? { border: "rgba(239,68,68,0.22)", hover: "rgba(239,68,68,0.06)" }
      : tone === "success"
      ? { border: "rgba(34,197,94,0.20)", hover: "rgba(34,197,94,0.06)" }
      : { border: "rgba(0,0,0,0.06)", hover: "rgba(0,0,0,0.03)" };

  return (
    <button
      onClick={onPress}
      className="w-full text-left rounded-xl border shadow-sm transition"
      style={{ background: "white", borderColor: toneStyle.border }}
      onMouseEnter={(e) => (e.currentTarget.style.background = toneStyle.hover)}
      onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
    >
      <div className="p-4 flex items-center gap-3">
        <MiniIcon tone={tone}>{icon}</MiniIcon>
        <div className="flex flex-col">
          <span className="font-black text-sm">{title}</span>
          <span className="text-xs" style={{ color: ui.muted }}>
            {subtitle}
          </span>
        </div>
      </div>
    </button>
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
