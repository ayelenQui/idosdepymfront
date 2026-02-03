import React from "react";
import { useSearchParams } from "react-router-dom";
import {
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Select,
  SelectItem,
  Divider,
} from "@heroui/react";

/**
 * Mock afiliados (después esto viene por API según QR)
 */
const MOCK_AFILIADOS = {
  "27945233473-01": {
    id: "27945233473-01",
    nombre: "Juan Pérez",
    edad: 72,
    domicilio: "Presidente Perón 456",
    localidad: "CABA",
    empresa: "Best Care",
    desde: "2026-01-10",
    diagnostico: "EPOC severo + dependencia de O2",
    plan: "Internación domiciliaria",
    contacto: { nombre: "Ana Pérez", tel: "11 5555-2222", vinculo: "Hija" },
    prestaciones: [
      {
        tipo: "Enfermería",
        frecuencia: "Diaria",
        franja: "08:00–09:00",
        prof: "Lic. María Rodríguez",
        matricula: "MN 12345",
      },
      {
        tipo: "Médico",
        frecuencia: "Mensual",
        franja: "A coordinar",
        prof: "Dr. Carlos Gómez",
        matricula: "MN 99110",
      },
      {
        tipo: "Kinesiología",
        frecuencia: "3/semana",
        franja: "Tarde",
        prof: "Lic. Facundo Ríos",
        matricula: "MP 77881",
      },
    ],
  },
};

const INSUMOS_MOCK = [
  { key: "guias", label: "Guías", placeholder: "Ej: 30" },
  { key: "frascos", label: "Frascos", placeholder: "Ej: 60" },
  { key: "bomba", label: "Bomba", placeholder: "Ej: Sí / No" },
  { key: "pie_suero", label: "Pie de suero", placeholder: "Ej: Sí / No" },
  { key: "observaciones", label: "Observaciones", placeholder: "Ej: faltante de descartables" },
];

export default function ProfesionalHome() {
  const [params] = useSearchParams();
  const afKey = params.get("af") || "27945233473-01"; // fallback demo
  const afiliado = MOCK_AFILIADOS[afKey];

  // Modales
  const [openEmergencia, setOpenEmergencia] = React.useState(false);
  const [openVisita, setOpenVisita] = React.useState(false);
  const [openInsumos, setOpenInsumos] = React.useState(false);
  const [openInforme, setOpenInforme] = React.useState(false);
  const [openReq, setOpenReq] = React.useState(false);
  const [openNoVisita, setOpenNoVisita] = React.useState(false);

  // Estados formularios
  const [visita, setVisita] = React.useState({
    inicio: "",
    fin: "",
    ubicacionTexto: "",
    gmapsLink: "",
    notas: "",
  });

  const [insumos, setInsumos] = React.useState({
    mes: "2026-02",
    guias: "",
    frascos: "",
    bomba: "",
    pie_suero: "",
    observaciones: "",
  });

  const [informe, setInforme] = React.useState({
    tipo: "Evolución",
    diagnostico: "",
    resumen: "",
    indicaciones: "",
  });

  const [req, setReq] = React.useState({
    tipo: "Nuevo estudio",
    detalle: "",
    urgencia: "media",
  });

  const [noVisita, setNoVisita] = React.useState({
    motivo: "No estaba el paciente",
    detalle: "",
  });

  if (!afiliado) {
    return (
      <div className="min-h-screen p-4">
        <div className="osd-surface p-6">
          <div className="text-lg" style={{ fontWeight: 600 }}>
            Afiliado no encontrado
          </div>
          <div className="text-sm text-[var(--osd-slate)]">
            Revisá el parámetro <b>?af=</b> del QR.
          </div>
        </div>
      </div>
    );
  }

  const submit = (msg) => alert(`Mock ✅ ${msg}`);

  return (
    // IMPORTANTE: usamos h-[100svh] para mobile moderno (mejor que 100vh)
    <div className="h-[100svh] px-3 py-3">
      {/* Contenedor principal SIN scroll obligatorio */}
      <div className="h-full max-w-md mx-auto flex flex-col gap-3">
        {/* Header compacto */}
        <div className="osd-surface px-4 py-3">
          <div className="text-xs text-[var(--osd-slate)]" style={{ fontWeight: 500 }}>
            Sesión por QR • Afiliado validado
          </div>

          <div className="mt-1 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-base text-slate-900 truncate" style={{ fontWeight: 600 }}>
                {afiliado.nombre}
              </div>
              <div className="text-xs text-[var(--osd-slate)]" style={{ fontWeight: 500 }}>
                {afiliado.id} • {afiliado.edad} años • {afiliado.localidad}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <Chip className="osd-pill osd-pill-open">{afiliado.empresa}</Chip>
              <Chip className="osd-pill osd-pill-ok">Activo</Chip>
            </div>
          </div>
        </div>

        {/* EMERGENCIA: lo principal */}
        <div
          className="rounded-[22px] p-4 border"
          style={{
            background: "rgba(181,139,133,0.22)",
            borderColor: "rgba(181,139,133,0.45)",
            boxShadow: "0 14px 34px rgba(138,75,64,0.12)",
          }}
        >
          <div className="text-xs" style={{ fontWeight: 600, color: "var(--osd-secondary)" }}>
            Emergencia (prioridad)
          </div>

          <div className="mt-1 text-sm text-slate-900" style={{ fontWeight: 600 }}>
            Sin oxígeno / saturación crítica / deterioro agudo
          </div>

          <Button
            className="osd-btn-secondary w-full mt-3 py-6"
            onPress={() => setOpenEmergencia(true)}
          >
            PEDIR AMBULANCIA / INTERNACIÓN
          </Button>

          <div className="mt-2 text-[11px] text-[var(--osd-slate)]" style={{ fontWeight: 500 }}>
            Esto genera alerta inmediata a OSDEPYM (auditoría).
          </div>
        </div>

        {/* Acciones rápidas: grid (sin scroll) */}
        <div className="osd-surface p-3">
          <div className="text-xs text-[var(--osd-slate)] px-1" style={{ fontWeight: 600 }}>
            Acciones rápidas
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
            <ActionBtn title="Registrar visita" onPress={() => setOpenVisita(true)} />
            <ActionBtn title="Registrar insumos" onPress={() => setOpenInsumos(true)} />
            <ActionBtn title="Informe médico" onPress={() => setOpenInforme(true)} />
            <ActionBtn title="Nuevo requerimiento" onPress={() => setOpenReq(true)} />
            <ActionBtn title="No pude registrar" onPress={() => setOpenNoVisita(true)} />
            <ActionBtn
              title="Ver datos"
              variant="soft"
              onPress={() => {
                const el = document.getElementById("datos-afiliado");
                el?.toggleAttribute("open");
              }}
            />
          </div>
        </div>

        {/* Datos largos: colapsable (no ocupa pantalla si no querés) */}
        <details id="datos-afiliado" className="osd-surface p-4">
          <summary
            className="cursor-pointer select-none text-sm text-slate-900"
            style={{ fontWeight: 600 }}
          >
            Datos del afiliado
            <div className="text-[11px] text-[var(--osd-slate)]" style={{ fontWeight: 500 }}>
              diagnóstico • contacto • prestaciones
            </div>
          </summary>

          <div className="mt-3 space-y-3">
            <div className="text-xs text-[var(--osd-slate)]" style={{ fontWeight: 600 }}>
              Diagnóstico
            </div>
            <div className="text-sm text-slate-900" style={{ fontWeight: 600 }}>
              {afiliado.diagnostico}
            </div>

            <Divider />

            <div className="text-xs text-[var(--osd-slate)]" style={{ fontWeight: 600 }}>
              Contacto familiar
            </div>
            <div className="text-sm text-slate-900" style={{ fontWeight: 600 }}>
              {afiliado.contacto.nombre} ({afiliado.contacto.vinculo})
            </div>
            <div className="text-sm text-slate-900" style={{ fontWeight: 600 }}>
              Tel: {afiliado.contacto.tel}
            </div>

            <Button className="osd-btn-primary w-full" onPress={() => submit("Llamada al familiar (mock)")}>
              Llamar contacto
            </Button>

            <Divider />

            <div className="text-xs text-[var(--osd-slate)]" style={{ fontWeight: 600 }}>
              Prestaciones autorizadas
            </div>

            <div className="space-y-2">
              {afiliado.prestaciones.map((p, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl p-3 border"
                  style={{
                    background: "rgba(255,255,255,0.60)",
                    borderColor: "rgba(169,198,198,0.60)",
                  }}
                >
                  <div className="text-sm text-slate-900" style={{ fontWeight: 600 }}>
                    {p.tipo}
                  </div>
                  <div className="text-[11px] text-[var(--osd-slate)]" style={{ fontWeight: 500 }}>
                    {p.frecuencia} • {p.franja}
                  </div>
                  <div className="text-[11px] text-[var(--osd-slate)]" style={{ fontWeight: 500 }}>
                    {p.prof} • {p.matricula}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </details>
      </div>

      {/* MODAL: Emergencia */}
      <Modal isOpen={openEmergencia} onOpenChange={setOpenEmergencia} placement="center" size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Solicitar ambulancia / internación
                <span className="text-xs opacity-70">Alerta prioritaria para OSDEPYM</span>
              </ModalHeader>

              <ModalBody className="space-y-4">
                <div className="rounded-2xl p-4 border osd-pill-critical">
                  Completá la causa y confirmá. Esto genera una alerta inmediata.
                </div>

                <Input label="Motivo" placeholder="Ej: Sin oxígeno / saturación crítica" />
                <Textarea
                  label="Detalle clínico"
                  placeholder="Signos vitales, evolución, intervención realizada, etc."
                  minRows={5}
                />
              </ModalBody>

              <ModalFooter>
                <Button variant="light" onPress={onClose}>Cancelar</Button>
                <Button
                  className="osd-btn-secondary"
                  onPress={() => { submit("Emergencia enviada"); onClose(); }}
                >
                  Enviar alerta
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL: Registrar visita */}
      <Modal isOpen={openVisita} onOpenChange={setOpenVisita} placement="center" size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Registrar visita
                <span className="text-xs opacity-70">Ubicación + horario + notas</span>
              </ModalHeader>

              <ModalBody className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Inicio"
                    type="time"
                    value={visita.inicio}
                    onValueChange={(v) => setVisita((s) => ({ ...s, inicio: v }))}
                  />
                  <Input
                    label="Fin"
                    type="time"
                    value={visita.fin}
                    onValueChange={(v) => setVisita((s) => ({ ...s, fin: v }))}
                  />
                </div>

                <Input
                  label="Ubicación (texto)"
                  placeholder="Ej: Presidente Perón 456, CABA"
                  value={visita.ubicacionTexto}
                  onValueChange={(v) => setVisita((s) => ({ ...s, ubicacionTexto: v }))}
                />

                <Input
                  label="Link Google Maps (opcional)"
                  placeholder="Pegá el link"
                  value={visita.gmapsLink}
                  onValueChange={(v) => setVisita((s) => ({ ...s, gmapsLink: v }))}
                />

                <Textarea
                  label="Notas"
                  placeholder="Qué se realizó, observaciones, signos vitales, etc."
                  minRows={4}
                  value={visita.notas}
                  onValueChange={(v) => setVisita((s) => ({ ...s, notas: v }))}
                />
              </ModalBody>

              <ModalFooter>
                <Button variant="light" onPress={onClose}>Cancelar</Button>
                <Button className="osd-btn-primary" onPress={() => { submit("Visita registrada"); onClose(); }}>
                  OK, registrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL: Insumos */}
      <Modal isOpen={openInsumos} onOpenChange={setOpenInsumos} placement="center" size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Registrar insumos mensuales
                <span className="text-xs opacity-70">Carga mensual (luego pasa a Asarfarma)</span>
              </ModalHeader>

              <ModalBody className="space-y-4">
                <Input
                  label="Mes"
                  type="month"
                  value={insumos.mes}
                  onValueChange={(v) => setInsumos((s) => ({ ...s, mes: v }))}
                />

                {INSUMOS_MOCK.map((i) =>
                  i.key === "observaciones" ? (
                    <Textarea
                      key={i.key}
                      label={i.label}
                      placeholder={i.placeholder}
                      minRows={4}
                      value={insumos[i.key]}
                      onValueChange={(v) => setInsumos((s) => ({ ...s, [i.key]: v }))}
                    />
                  ) : (
                    <Input
                      key={i.key}
                      label={i.label}
                      placeholder={i.placeholder}
                      value={insumos[i.key]}
                      onValueChange={(v) => setInsumos((s) => ({ ...s, [i.key]: v }))}
                    />
                  )
                )}
              </ModalBody>

              <ModalFooter>
                <Button variant="light" onPress={onClose}>Cancelar</Button>
                <Button className="osd-btn-primary" onPress={() => { submit("Insumos registrados"); onClose(); }}>
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL: Informe */}
      <Modal isOpen={openInforme} onOpenChange={setOpenInforme} placement="center" size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Registrar informe médico
                <span className="text-xs opacity-70">Evolución y conductas</span>
              </ModalHeader>

              <ModalBody className="space-y-4">
                <Select
                  label="Tipo"
                  selectedKeys={[informe.tipo]}
                  onSelectionChange={(keys) => {
                    const v = Array.from(keys)[0];
                    setInforme((s) => ({ ...s, tipo: v }));
                  }}
                >
                  <SelectItem key="Evolución">Evolución</SelectItem>
                  <SelectItem key="Control">Control</SelectItem>
                  <SelectItem key="Interconsulta">Interconsulta</SelectItem>
                  <SelectItem key="Alta / Baja">Alta / Baja</SelectItem>
                </Select>

                <Input
                  label="Diagnóstico / motivo"
                  value={informe.diagnostico}
                  onValueChange={(v) => setInforme((s) => ({ ...s, diagnostico: v }))}
                />

                <Textarea
                  label="Resumen"
                  minRows={5}
                  value={informe.resumen}
                  onValueChange={(v) => setInforme((s) => ({ ...s, resumen: v }))}
                />

                <Textarea
                  label="Indicaciones"
                  minRows={4}
                  value={informe.indicaciones}
                  onValueChange={(v) => setInforme((s) => ({ ...s, indicaciones: v }))}
                />
              </ModalBody>

              <ModalFooter>
                <Button variant="light" onPress={onClose}>Cancelar</Button>
                <Button className="osd-btn-primary" onPress={() => { submit("Informe registrado"); onClose(); }}>
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL: Requerimiento */}
      <Modal isOpen={openReq} onOpenChange={setOpenReq} placement="center" size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Nuevo requerimiento
                <span className="text-xs opacity-70">Medicaciones, estudios, interconsulta</span>
              </ModalHeader>

              <ModalBody className="space-y-4">
                <Select
                  label="Tipo"
                  selectedKeys={[req.tipo]}
                  onSelectionChange={(keys) => {
                    const v = Array.from(keys)[0];
                    setReq((s) => ({ ...s, tipo: v }));
                  }}
                >
                  <SelectItem key="Nueva medicación">Nueva medicación</SelectItem>
                  <SelectItem key="Nuevo estudio">Nuevo estudio</SelectItem>
                  <SelectItem key="Interconsulta">Interconsulta</SelectItem>
                  <SelectItem key="Cambio de frecuencia">Cambio de frecuencia</SelectItem>
                </Select>

                <Select
                  label="Urgencia"
                  selectedKeys={[req.urgencia]}
                  onSelectionChange={(keys) => {
                    const v = Array.from(keys)[0];
                    setReq((s) => ({ ...s, urgencia: v }));
                  }}
                >
                  <SelectItem key="baja">Baja</SelectItem>
                  <SelectItem key="media">Media</SelectItem>
                  <SelectItem key="alta">Alta</SelectItem>
                  <SelectItem key="urgente">Urgente</SelectItem>
                </Select>

                <Textarea
                  label="Detalle"
                  placeholder="Qué se solicita y por qué."
                  minRows={6}
                  value={req.detalle}
                  onValueChange={(v) => setReq((s) => ({ ...s, detalle: v }))}
                />
              </ModalBody>

              <ModalFooter>
                <Button variant="light" onPress={onClose}>Cancelar</Button>
                <Button className="osd-btn-primary" onPress={() => { submit("Requerimiento enviado"); onClose(); }}>
                  Enviar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL: No pude registrar */}
      <Modal isOpen={openNoVisita} onOpenChange={setOpenNoVisita} placement="center" size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                No pude registrar la visita
                <span className="text-xs opacity-70">Dejá trazabilidad del motivo</span>
              </ModalHeader>

              <ModalBody className="space-y-4">
                <Select
                  label="Motivo"
                  selectedKeys={[noVisita.motivo]}
                  onSelectionChange={(keys) => {
                    const v = Array.from(keys)[0];
                    setNoVisita((s) => ({ ...s, motivo: v }));
                  }}
                >
                  <SelectItem key="No estaba el paciente">No estaba el paciente</SelectItem>
                  <SelectItem key="Domicilio incorrecto">Domicilio incorrecto</SelectItem>
                  <SelectItem key="No responde familiar">No responde familiar</SelectItem>
                  <SelectItem key="No me permiten ingresar">No me permiten ingresar</SelectItem>
                  <SelectItem key="Otro">Otro</SelectItem>
                </Select>

                <Textarea
                  label="Detalle"
                  placeholder="Qué pasó, con quién hablaste, a qué hora, etc."
                  minRows={6}
                  value={noVisita.detalle}
                  onValueChange={(v) => setNoVisita((s) => ({ ...s, detalle: v }))}
                />
              </ModalBody>

              <ModalFooter>
                <Button variant="light" onPress={onClose}>Cancelar</Button>
                <Button className="osd-btn-primary" onPress={() => { submit("Incidente registrado"); onClose(); }}>
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

function ActionBtn({ title, onPress, variant = "normal" }) {
  const isSoft = variant === "soft";

  return (
    <button onClick={onPress} className="w-full text-left">
      <div
        className="rounded-2xl px-3 py-3 border"
        style={{
          background: isSoft ? "rgba(18,91,88,0.10)" : "rgba(255,255,255,0.60)",
          borderColor: isSoft ? "rgba(18,91,88,0.20)" : "rgba(169,198,198,0.60)",
        }}
      >
        <div className="text-sm text-slate-900" style={{ fontWeight: 600 }}>
          {title}
        </div>
        <div className="text-[11px] text-[var(--osd-slate)]" style={{ fontWeight: 500 }}>
          Abrir →
        </div>
      </div>
    </button>
  );
}
