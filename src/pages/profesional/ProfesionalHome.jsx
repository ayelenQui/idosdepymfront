import React from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";


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
    nombre: "Quiroga Ayelen",
    edad: 34,
    domicilio: "Presidente Perón 456",
    localidad: "CABA",
    empresa: "Medincare",
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
  {
    key: "observaciones",
    label: "Observaciones",
    placeholder: "Ej: faltante de descartables",
  },
];

export default function ProfesionalHome() {
  const [params] = useSearchParams();
  const afKey = params.get("af") || "27945233473-01"; // fallback demo
  const afiliado = MOCK_AFILIADOS[afKey];

  // Responsive: mobile detection
  const isMobile = useIsMobile();

  // Modales
  const [openEmergencia, setOpenEmergencia] = React.useState(false);
  const [openVisita, setOpenVisita] = React.useState(false);
  const [openInsumos, setOpenInsumos] = React.useState(false);
  const [openInforme, setOpenInforme] = React.useState(false);
  const [openReq, setOpenReq] = React.useState(false);
  const [openNoVisita, setOpenNoVisita] = React.useState(false);

  // Estado OK
  const [visitaOK, setVisitaOK] = React.useState(false);

  // Visita con firmas con dedo
  const [visita, setVisita] = React.useState({
    fechaHoraISO: "",
    ubicacionTexto: "",
    gmapsLink: "",
    notas: "",
    firmaMedicoDataUrl: "",
    firmaAfiliadoDataUrl: "",
  });

  // GPS visita
  const [geo, setGeo] = React.useState({
    status: "idle", // idle | loading | ok | denied | error
    lat: null,
    lng: null,
    accuracy: null,
    error: "",
  });
  const geoWatchIdRef = React.useRef(null);

  const startGeoWatch = React.useCallback(() => {
    if (!("geolocation" in navigator)) {
      setGeo({
        status: "error",
        lat: null,
        lng: null,
        accuracy: null,
        error: "Este dispositivo no soporta geolocalización.",
      });
      return;
    }

    if (geoWatchIdRef.current != null) {
      navigator.geolocation.clearWatch(geoWatchIdRef.current);
      geoWatchIdRef.current = null;
    }

    setGeo((s) => ({ ...s, status: "loading", error: "" }));

    geoWatchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const gmaps = `https://www.google.com/maps?q=${latitude},${longitude}`;

        setGeo({
          status: "ok",
          lat: latitude,
          lng: longitude,
          accuracy,
          error: "",
        });

        setVisita((s) => ({
          ...s,
          ubicacionTexto: `Lat ${latitude.toFixed(6)}, Lng ${longitude.toFixed(
            6
          )} (±${Math.round(accuracy)}m)`,
          gmapsLink: gmaps,
        }));
      },
      (err) => {
        const msg =
          err.code === 1
            ? "Permiso de ubicación denegado. Activá ubicación para registrar la visita."
            : "No se pudo obtener la ubicación. Probá de nuevo.";

        setGeo({
          status: err.code === 1 ? "denied" : "error",
          lat: null,
          lng: null,
          accuracy: null,
          error: msg,
        });
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  }, []);

  const stopGeoWatch = React.useCallback(() => {
    if (geoWatchIdRef.current != null) {
      navigator.geolocation.clearWatch(geoWatchIdRef.current);
      geoWatchIdRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    if (!openVisita) stopGeoWatch();
  }, [openVisita, stopGeoWatch]);

  // Insumos
  const [insumos, setInsumos] = React.useState({
    mes: "2026-02",
    guias: "",
    frascos: "",
    bomba: "",
    pie_suero: "",
    observaciones: "",
  });

  // Informe
  const [informe, setInforme] = React.useState({
    tipo: "Evolución",
    diagnostico: "",
    resumen: "",
    indicaciones: "",
  });

  // Requerimiento
  const [req, setReq] = React.useState({
    tipo: "Nuevo estudio",
    detalle: "",
    urgencia: "media",
  });

  // No visita (incidente) + GPS + firma afiliado/familiar
  const [noVisita, setNoVisita] = React.useState({
    motivo: "No estaba el paciente",
    detalle: "",
    ubicacionTexto: "",
    gmapsLink: "",
    firmaAfiliadoDataUrl: "",
  });

  const [geoNoVisita, setGeoNoVisita] = React.useState({
    status: "idle",
    lat: null,
    lng: null,
    accuracy: null,
    error: "",
  });
  const geoWatchNoVisitaRef = React.useRef(null);

  const startGeoWatchNoVisita = React.useCallback(() => {
    if (!("geolocation" in navigator)) {
      setGeoNoVisita({
        status: "error",
        lat: null,
        lng: null,
        accuracy: null,
        error: "Este dispositivo no soporta geolocalización.",
      });
      return;
    }

    if (geoWatchNoVisitaRef.current != null) {
      navigator.geolocation.clearWatch(geoWatchNoVisitaRef.current);
      geoWatchNoVisitaRef.current = null;
    }

    setGeoNoVisita((s) => ({ ...s, status: "loading", error: "" }));

    geoWatchNoVisitaRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const gmaps = `https://www.google.com/maps?q=${latitude},${longitude}`;

        setGeoNoVisita({
          status: "ok",
          lat: latitude,
          lng: longitude,
          accuracy,
          error: "",
        });

        setNoVisita((s) => ({
          ...s,
          ubicacionTexto: `Lat ${latitude.toFixed(6)}, Lng ${longitude.toFixed(
            6
          )} (±${Math.round(accuracy)}m)`,
          gmapsLink: gmaps,
        }));
      },
      (err) => {
        const msg =
          err.code === 1
            ? "Permiso de ubicación denegado. Activá ubicación para registrar el incidente."
            : "No se pudo obtener la ubicación. Probá de nuevo.";

        setGeoNoVisita({
          status: err.code === 1 ? "denied" : "error",
          lat: null,
          lng: null,
          accuracy: null,
          error: msg,
        });
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  }, []);

  const stopGeoWatchNoVisita = React.useCallback(() => {
    if (geoWatchNoVisitaRef.current != null) {
      navigator.geolocation.clearWatch(geoWatchNoVisitaRef.current);
      geoWatchNoVisitaRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    if (!openNoVisita) stopGeoWatchNoVisita();
  }, [openNoVisita, stopGeoWatchNoVisita]);

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

  const submit = (msg) =>
  toast.success(msg, {
    description: "Se guardó correctamente.",
    duration: 2200,
  });


  // Config común de modales (responsive + bottom sheet en móvil)
  const modalPlacement = isMobile ? "bottom-center" : "center";
  const modalSize = "full";
  const modalContentClass =
    "mx-auto w-full md:max-w-md " +
    (isMobile
      ? "rounded-t-[28px] rounded-b-none animate-sheetUp"
      : "rounded-[28px]");
  const modalBodyClass = "space-y-4 overflow-y-auto";
  const modalBodyStyle = { maxHeight: isMobile ? "72svh" : "70vh" };
  const modalFooterClass =
    "sticky bottom-0 bg-white/90 backdrop-blur border-t flex gap-2";

  return (
    <div className="min-h-[100svh] px-3 py-3">
      {/* Micro-animaciones / sheet */}
      <style>{`
        @keyframes sheetUp {
          from { transform: translateY(18px); opacity: 0.98; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-sheetUp { animation: sheetUp 220ms ease-out; }
        .tap { transition: transform 160ms ease, filter 160ms ease; }
        .tap:active { transform: scale(0.98); }
        .lift { transition: transform 180ms ease, box-shadow 180ms ease; }
        .lift:hover { transform: translateY(-1px); box-shadow: 0 14px 34px rgba(0,0,0,0.08); }
      `}</style>

      <div className="h-full max-w-md mx-auto flex flex-col gap-3">
        {/* Header con logo */}
        <div className="osd-surface px-4 py-3 lift rounded-[22px]">
          <div className="flex items-center gap-3 mb-2">
            <img
              src="/img/osdepymlogo.jpg"
              alt="OSDEPYM"
              style={{ height: 40, width: "auto", borderRadius: 10 }}
            />
            <div className="min-w-0">
              <div
                className="text-xs text-[var(--osd-slate)]"
                style={{ fontWeight: 800 }}
              >
                Internación Domiciliaria • OSDEPYM
              </div>
              <div
                className="text-[11px] text-[var(--osd-slate)]"
                style={{ fontWeight: 500 }}
              >
                Sesión profesional por QR
              </div>
            </div>
          </div>

          <div className="mt-1 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div
                className="text-base text-slate-900 truncate"
                style={{ fontWeight: 700 }}
              >
                {afiliado.nombre}
              </div>
              <div
                className="text-xs text-[var(--osd-slate)]"
                style={{ fontWeight: 500 }}
              >
                {afiliado.id} • {afiliado.edad} años • {afiliado.localidad}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <Chip className="osd-pill osd-pill-open">{afiliado.empresa}</Chip>
              <Chip className="osd-pill osd-pill-ok">Activo</Chip>
            </div>
          </div>
        </div>

        {/* Emergencia */}
        <div
          className="rounded-[22px] p-4 border lift"
          style={{
            background: "rgba(181,139,133,0.22)",
            borderColor: "rgba(181,139,133,0.45)",
            boxShadow: "0 14px 34px rgba(138,75,64,0.12)",
          }}
        >
          <div
            className="text-xs"
            style={{ fontWeight: 800, color: "var(--osd-secondary)" }}
          >
            Emergencia (prioridad)
          </div>

          <div
            className="mt-1 text-sm text-slate-900"
            style={{ fontWeight: 700 }}
          >
            Sin oxígeno / saturación crítica / deterioro agudo
          </div>

          <Button
            className="osd-btn-secondary w-full mt-3 py-6 tap"
            onPress={() => setOpenEmergencia(true)}
          >
            PEDIR AMBULANCIA / INTERNACIÓN
          </Button>

          <div
            className="mt-2 text-[11px] text-[var(--osd-slate)]"
            style={{ fontWeight: 500 }}
          >
            Esto genera alerta inmediata a OSDEPYM (auditoría).
          </div>
        </div>

      <div className="grid grid-cols-2 gap-4">
  <ActionImageButton
    title="Visita"
    img="/img/actions/visita.png"
    onPress={() => setOpenVisita(true)}
  />

  <ActionImageButton
    title="Insumos"
    img="/img/actions/insumos.png"
    onPress={() => setOpenInsumos(true)}
  />

  <ActionImageButton
    title="Informe"
    img="/img/actions/informe.png"
    onPress={() => setOpenInforme(true)}
  />

  <ActionImageButton
    title="Agregar"
    img="/img/actions/agregar.png"
    onPress={() => setOpenReq(true)}
  />
</div>


        {/* Datos afiliado */}
        <details id="datos-afiliado" className="osd-surface p-4 lift rounded-[22px]">
          <summary
            className="cursor-pointer select-none text-sm text-slate-900"
            style={{ fontWeight: 800 }}
          >
            Datos del afiliado
            <div
              className="text-[11px] text-[var(--osd-slate)]"
              style={{ fontWeight: 500 }}
            >
              diagnóstico • contacto • prestaciones
            </div>
          </summary>

          <div className="mt-3 space-y-3">
            <div
              className="text-xs text-[var(--osd-slate)]"
              style={{ fontWeight: 800 }}
            >
              Diagnóstico
            </div>
            <div className="text-sm text-slate-900" style={{ fontWeight: 700 }}>
              {afiliado.diagnostico}
            </div>

            <Divider />

            <div
              className="text-xs text-[var(--osd-slate)]"
              style={{ fontWeight: 800 }}
            >
              Contacto familiar
            </div>
            <div className="text-sm text-slate-900" style={{ fontWeight: 700 }}>
              {afiliado.contacto.nombre} ({afiliado.contacto.vinculo})
            </div>
            <div className="text-sm text-slate-900" style={{ fontWeight: 700 }}>
              Tel: {afiliado.contacto.tel}
            </div>

            <Button className="osd-btn-primary w-full tap" onPress={() => submit("Llamada al familiar (mock)")}>
              Llamar contacto
            </Button>

            <Divider />

            <div
              className="text-xs text-[var(--osd-slate)]"
              style={{ fontWeight: 800 }}
            >
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
                  <div className="text-sm text-slate-900" style={{ fontWeight: 700 }}>
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

      {/* ===================== MODALES ===================== */}

      {/* MODAL: Emergencia */}
      <Modal
        isOpen={openEmergencia}
        onOpenChange={setOpenEmergencia}
        placement={modalPlacement}
        size={modalSize}
      >
        <ModalContent className={modalContentClass}>
          {(onClose) => (
            <>
              <BrandModalHeader
                title="Solicitar ambulancia / internación"
                subtitle="Alerta prioritaria para OSDEPYM"
              />

              <ModalBody className={modalBodyClass} style={modalBodyStyle}>
                <div className="rounded-2xl p-4 border osd-pill-critical">
                  Completá la causa y confirmá. Esto genera una alerta inmediata.
                </div>

                <Input label="Motivo" placeholder="Ej: Sin oxígeno / saturación crítica" />
                <Textarea
                  label="Detalle clínico"
                  placeholder="Signos vitales, evolución, intervención realizada, etc."
                  minRows={5}
                />

                 
                <Textarea
                  label="Clinica de preferencia"
                  placeholder="Ejm: Climedica."
                  minRows={5}
                />
              </ModalBody>

              <ModalFooter className={modalFooterClass}>
                <Button variant="light" className="tap flex-1" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  className="osd-btn-secondary tap flex-1"
                  onPress={() => {
                    submit("Emergencia enviada");
                    onClose();
                  }}
                >
                  Enviar alerta
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
<Button
  className="w-full mt-2 py-6 tap"
  style={{
    background: "rgba(239,68,68,0.14)",
    border: "1px solid rgba(239,68,68,0.30)",
    color: "#7f1d1d",
    fontWeight: 900,
    borderRadius: 20,
  }}
  onPress={() => {
    setOpenNoVisita(true);
    startGeoWatchNoVisita(); // si querés ubicación también
  }}
>
  ❌ VISITA DENEGADA / NO ME PERMITEN INGRESAR
</Button>

      {/* MODAL: Registrar visita */}
      <Modal
        isOpen={openVisita}
        onOpenChange={setOpenVisita}
        placement={modalPlacement}
        size={modalSize}
      >
        <ModalContent className={modalContentClass}>
          {(onClose) => {
            const fecha = visita.fechaHoraISO ? new Date(visita.fechaHoraISO) : new Date();

            const fechaStr = fecha.toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
            const horaStr = fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

            const canSubmit =
              geo.status === "ok" &&
              (visita.notas || "").trim().length >= 3 &&
              !!visita.firmaMedicoDataUrl &&
              !!visita.firmaAfiliadoDataUrl;

            return (
              <>
                <BrandModalHeader
                  title="Registrar visita"
                  subtitle="Fecha/hora automáticas • Ubicación obligatoria • Firmas con el dedo"
                />

                <ModalBody className={modalBodyClass} style={modalBodyStyle}>
                  {visitaOK && (
                    <div
                      className="rounded-2xl p-4 border flex items-center gap-3"
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
                          color: "var(--osd-primary)",
                          fontWeight: 900,
                        }}
                      >
                        ✓
                      </div>
                      <div>
                        <div className="text-sm text-slate-900" style={{ fontWeight: 800 }}>
                          Visita registrada correctamente
                        </div>
                        <div className="text-xs text-[var(--osd-slate)]" style={{ fontWeight: 500 }}>
                          Quedó asociada al afiliado del QR.
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Fecha" value={fechaStr} isReadOnly />
                    <Input label="Hora" value={horaStr} isReadOnly />
                  </div>

                  <GeoBox
                    title="Ubicación en tiempo real (obligatorio)"
                    geo={geo}
                    onRetry={startGeoWatch}
                    gmapsLink={visita.gmapsLink}
                    setOpenMapsLink={() => window.open(visita.gmapsLink, "_blank")}
                  />

                  <Input label="Ubicación (texto)" value={visita.ubicacionTexto} isReadOnly />
                  <Input label="Link Google Maps" value={visita.gmapsLink} isReadOnly />

                  <Textarea
                    label="Observación (obligatorio)"
                    placeholder='Ej: "Se controló saturación" / "Sin novedades"'
                    minRows={4}
                    value={visita.notas}
                    onValueChange={(v) => setVisita((s) => ({ ...s, notas: v }))}
                    isRequired
                  />

                  <SignaturePad
                    label="Firma del médico (obligatorio)"
                    value={visita.firmaMedicoDataUrl}
                    onChange={(dataUrl) =>
                      setVisita((s) => ({ ...s, firmaMedicoDataUrl: dataUrl }))
                    }
                  />

                  <SignaturePad
                    label="Firma afiliado / familiar (obligatorio)"
                    value={visita.firmaAfiliadoDataUrl}
                    onChange={(dataUrl) =>
                      setVisita((s) => ({ ...s, firmaAfiliadoDataUrl: dataUrl }))
                    }
                  />

                  {!canSubmit && (
                    <div className="text-xs" style={{ color: "var(--osd-secondary)", fontWeight: 900 }}>
                      Para registrar: activá ubicación, completá observación y firmá (médico + afiliado).
                    </div>
                  )}
                </ModalBody>

                <ModalFooter className={modalFooterClass}>
                  <Button
                    variant="light"
                    className="tap flex-1"
                    onPress={() => {
                      setVisitaOK(false);
                      stopGeoWatch();
                      onClose();
                    }}
                  >
                    Cerrar
                  </Button>

                  <Button
                    className="osd-btn-primary tap flex-1"
                    isDisabled={!canSubmit}
                    onPress={() => {
                      setVisitaOK(true);
                      // payload listo para backend:
                      // const payload = { ...visita };
                    }}
                  >
                    Registrar
                  </Button>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>

      {/* MODAL: Insumos */}
      <Modal
        isOpen={openInsumos}
        onOpenChange={setOpenInsumos}
        placement={modalPlacement}
        size={modalSize}
      >
        <ModalContent className={modalContentClass}>
          {(onClose) => (
            <>
              <BrandModalHeader
                title="Registrar insumos mensuales"
                subtitle="Carga mensual (luego pasa a Asarfarma)"
              />

              <ModalBody className={modalBodyClass} style={modalBodyStyle}>
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

              <ModalFooter className={modalFooterClass}>
                <Button variant="light" className="tap flex-1" onPress={onClose}>
                  Cancelar
                </Button>
               <Button
  className="osd-btn-primary tap flex-1"
  onPress={() => {
    toast.success("Insumos registrados", {
      description: "✅ Carga guardada correctamente",
      duration: 2200,
    });
    onClose();
  }}
>
  Guardar
</Button>

              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL: Informe */}
      <Modal
        isOpen={openInforme}
        onOpenChange={setOpenInforme}
        placement={modalPlacement}
        size={modalSize}
      >
        <ModalContent className={modalContentClass}>
          {(onClose) => (
            <>
              <BrandModalHeader title="Registrar informe médico" subtitle="Evolución y conductas" />

              <ModalBody className={modalBodyClass} style={modalBodyStyle}>
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

              <ModalFooter className={modalFooterClass}>
                <Button variant="light" className="tap flex-1" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  className="osd-btn-primary tap flex-1"
                  onPress={() => {
                    submit("Informe registrado");
                    onClose();
                  }}
                >
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL: Requerimiento */}
      <Modal
        isOpen={openReq}
        onOpenChange={setOpenReq}
        placement={modalPlacement}
        size={modalSize}
      >
        <ModalContent className={modalContentClass}>
          {(onClose) => (
            <>
              <BrandModalHeader title="Nuevo requerimiento" subtitle="Medicaciones, estudios, interconsulta" />

              <ModalBody className={modalBodyClass} style={modalBodyStyle}>
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

              <ModalFooter className={modalFooterClass}>
                <Button variant="light" className="tap flex-1" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  className="osd-btn-primary tap flex-1"
                  onPress={() => {
                    submit("Requerimiento enviado");
                    onClose();
                  }}
                >
                  Enviar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL: No pude registrar (incidente) */}
      <Modal
        isOpen={openNoVisita}
        onOpenChange={setOpenNoVisita}
        placement={modalPlacement}
        size={modalSize}
      >
        <ModalContent className={modalContentClass}>
          {(onClose) => {
            const canSubmit =
              geoNoVisita.status === "ok" &&
              (noVisita.detalle || "").trim().length >= 5 &&
              !!noVisita.firmaAfiliadoDataUrl;

            return (
              <>
                <BrandModalHeader
                  title="No pude registrar la visita"
                  subtitle="Ubicación obligatoria • Detalle obligatorio • Firma afiliado/familiar"
                />

                <ModalBody className={modalBodyClass} style={modalBodyStyle}>
                  <GeoBox
                    title="Ubicación en tiempo real (obligatorio)"
                    geo={geoNoVisita}
                    onRetry={startGeoWatchNoVisita}
                    gmapsLink={noVisita.gmapsLink}
                    setOpenMapsLink={() => window.open(noVisita.gmapsLink, "_blank")}
                  />

                  <Input label="Ubicación (texto)" value={noVisita.ubicacionTexto} isReadOnly />
                  <Input label="Link Google Maps" value={noVisita.gmapsLink} isReadOnly />

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
                    label="Detalle (obligatorio)"
                    placeholder="Qué pasó, con quién hablaste, a qué hora, etc."
                    minRows={6}
                    value={noVisita.detalle}
                    onValueChange={(v) => setNoVisita((s) => ({ ...s, detalle: v }))}
                    isRequired
                  />

                  <SignaturePad
                    label="Firma afiliado / familiar (obligatorio)"
                    value={noVisita.firmaAfiliadoDataUrl}
                    onChange={(dataUrl) =>
                      setNoVisita((s) => ({ ...s, firmaAfiliadoDataUrl: dataUrl }))
                    }
                  />

                  {!canSubmit && (
                    <div className="text-xs" style={{ color: "var(--osd-secondary)", fontWeight: 900 }}>
                      Para guardar: activá ubicación, completá el detalle y firmá (afiliado/familiar).
                    </div>
                  )}
                </ModalBody>

                <ModalFooter className={modalFooterClass}>
                  <Button
                    variant="light"
                    className="tap flex-1"
                    onPress={() => {
                      stopGeoWatchNoVisita();
                      onClose();
                    }}
                  >
                    Cancelar
                  </Button>

                  <Button
                    className="osd-btn-primary tap flex-1"
                    isDisabled={!canSubmit}
                    onPress={() => {
                      // payload listo para backend:
                      // const payload = { ...noVisita };
                      stopGeoWatchNoVisita();
                      submit("Incidente registrado");
                      onClose();
                    }}
                  >
                    Guardar
                  </Button>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>
      
    </div>
  );
}

/* ===================== COMPONENTES UI ===================== */

function ActionImageButton({ title, img, onPress }) {
  return (
    <button
      onClick={onPress}
      className="w-full tap"
      style={{
        borderRadius: 28,
        overflow: "hidden",
      }}
    >
      <img
        src={img}
        alt={title}
        className="w-full h-auto"
        style={{
          borderRadius: 28,
          display: "block",
        }}
      />
    </button>
  );
}


function BrandModalHeader({ title, subtitle }) {
  return (
    <ModalHeader className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <img
          src="/img/osdepymlogo.jpg"
          alt="OSDEPYM"
          style={{ height: 26, width: "auto", borderRadius: 8 }}
        />
        <span style={{ fontWeight: 900 }}>{title}</span>
      </div>
      {subtitle && <span className="text-xs opacity-70">{subtitle}</span>}
    </ModalHeader>
  );
}

function GeoBox({ title, geo, onRetry, gmapsLink, setOpenMapsLink }) {
  return (
    <div
      className="rounded-2xl p-4 border"
      style={{
        background: "rgba(255,255,255,0.60)",
        borderColor: "rgba(169,198,198,0.60)",
      }}
    >
      <div className="text-sm text-slate-900" style={{ fontWeight: 800 }}>
        {title}
      </div>

      {geo.status === "loading" && (
        <div className="text-xs text-[var(--osd-slate)] mt-1" style={{ fontWeight: 600 }}>
          Obteniendo ubicación...
        </div>
      )}

      {geo.status === "ok" && (
        <div className="text-xs text-[var(--osd-slate)] mt-1" style={{ fontWeight: 600 }}>
          ✅ Ubicación capturada (±{Math.round(geo.accuracy)}m)
        </div>
      )}

      {(geo.status === "denied" || geo.status === "error") && (
        <div className="text-xs mt-1" style={{ fontWeight: 900, color: "var(--osd-secondary)" }}>
          {geo.error}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <Button variant="light" className="tap flex-1" onPress={onRetry}>
          Reintentar
        </Button>

        <Button
          className="osd-btn-primary tap flex-1"
          isDisabled={!gmapsLink}
          onPress={setOpenMapsLink}
        >
          Abrir Maps
        </Button>
      </div>
    </div>
  );
}

/**
 * Firma con el dedo (canvas) - sin librerías
 * - Touch + Mouse
 * - Guarda PNG base64 en value (dataURL)
 */
function SignaturePad({ label, value, onChange }) {
  const canvasRef = React.useRef(null);
  const drawingRef = React.useRef(false);
  const lastPointRef = React.useRef({ x: 0, y: 0 });

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const isTouch = e.touches && e.touches[0];
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const start = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#0f172a";

    drawingRef.current = true;
    const p = getPos(e);
    lastPointRef.current = p;

    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + 0.1, p.y + 0.1);
    ctx.stroke();
  };

  const move = (e) => {
    if (!drawingRef.current) return;
    e.preventDefault();

    const ctx = canvasRef.current.getContext("2d");
    const p = getPos(e);
    const lp = lastPointRef.current;

    ctx.beginPath();
    ctx.moveTo(lp.x, lp.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();

    lastPointRef.current = p;
  };

  const end = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;

    const dataUrl = canvasRef.current.toDataURL("image/png");
    onChange(dataUrl);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange("");
  };

  React.useEffect(() => {
    if (!value) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = value;
  }, [value]);

  return (
    <div
      className="rounded-2xl p-4 border"
      style={{
        background: "rgba(255,255,255,0.60)",
        borderColor: "rgba(169,198,198,0.60)",
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm text-slate-900" style={{ fontWeight: 900 }}>
          {label}
        </div>
        <Button variant="light" className="tap" onPress={clear}>
          Limpiar
        </Button>
      </div>

      <div className="mt-2 rounded-xl overflow-hidden border" style={{ borderColor: "rgba(15, 23, 42, 0.12)" }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={220}
          style={{
            width: "100%",
            height: 110, // mobile friendly
            background: "rgba(255,255,255,0.75)",
            touchAction: "none",
            display: "block",
          }}
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={end}
        />
      </div>

      <div className="mt-2 text-[11px] text-[var(--osd-slate)]" style={{ fontWeight: 600 }}>
        Firmá con el dedo. Al soltar, se guarda automáticamente.
      </div>

      {value && (
        <div className="mt-2 text-[11px]" style={{ color: "var(--osd-primary)", fontWeight: 900 }}>
          ✓ Firma capturada
        </div>
      )}
    </div>
  );
}

/* ===================== HOOKS ===================== */

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < breakpoint;
  });

  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isMobile;
}
