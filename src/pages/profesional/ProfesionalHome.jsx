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

  // Modales
  const [openEmergencia, setOpenEmergencia] = React.useState(false);
  const [openVisita, setOpenVisita] = React.useState(false);
  const [openInsumos, setOpenInsumos] = React.useState(false);
  const [openInforme, setOpenInforme] = React.useState(false);
  const [openReq, setOpenReq] = React.useState(false);
  const [openNoVisita, setOpenNoVisita] = React.useState(false);

  // Estado de feedback OK
  const [visitaOK, setVisitaOK] = React.useState(false);

  // Estado visita (firmas con dedo: dataURL PNG)
  const [visita, setVisita] = React.useState({
    fechaHoraISO: "",
    ubicacionTexto: "",
    gmapsLink: "",
    notas: "",

    firmaMedicoDataUrl: "", // obligatorio
    firmaAfiliadoDataUrl: "", // obligatorio
  });

  // Estado geolocalización
  const [geo, setGeo] = React.useState({
    status: "idle", // idle | loading | ok | denied | error
    lat: null,
    lng: null,
    accuracy: null,
    error: "",
  });


const [geoNoVisita, setGeoNoVisita] = React.useState({
  status: "idle", // idle | loading | ok | denied | error
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
    {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 0,
    }
  );
}, []);

const stopGeoWatchNoVisita = React.useCallback(() => {
  if (geoWatchNoVisitaRef.current != null) {
    navigator.geolocation.clearWatch(geoWatchNoVisitaRef.current);
    geoWatchNoVisitaRef.current = null;
  }
}, []);


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

    // limpiar watch previo si existe
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
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  }, []);

  const stopGeoWatch = React.useCallback(() => {
    if (geoWatchIdRef.current != null) {
      navigator.geolocation.clearWatch(geoWatchIdRef.current);
      geoWatchIdRef.current = null;
    }
  }, []);

  // Si se cierra el modal, frenar GPS
  React.useEffect(() => {
    if (!openVisita) stopGeoWatch();
  }, [openVisita, stopGeoWatch]);

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

  ubicacionTexto: "",
  gmapsLink: "",
  firmaAfiliadoDataUrl: "", // firma con el dedo (obligatoria)
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
    <div className="h-[100svh] px-3 py-3">
      <div className="h-full max-w-md mx-auto flex flex-col gap-3">
        {/* Header */}
        <div className="osd-surface px-4 py-3">
          <div
            className="text-xs text-[var(--osd-slate)]"
            style={{ fontWeight: 500 }}
          >
            Sesión por QR • Afiliado validado
          </div>

          <div className="mt-1 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div
                className="text-base text-slate-900 truncate"
                style={{ fontWeight: 600 }}
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
          className="rounded-[22px] p-4 border"
          style={{
            background: "rgba(181,139,133,0.22)",
            borderColor: "rgba(181,139,133,0.45)",
            boxShadow: "0 14px 34px rgba(138,75,64,0.12)",
          }}
        >
          <div
            className="text-xs"
            style={{ fontWeight: 600, color: "var(--osd-secondary)" }}
          >
            Emergencia (prioridad)
          </div>

          <div
            className="mt-1 text-sm text-slate-900"
            style={{ fontWeight: 600 }}
          >
            Sin oxígeno / saturación crítica / deterioro agudo
          </div>

          <Button
            className="osd-btn-secondary w-full mt-3 py-6"
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

        {/* Acciones */}
        <div className="osd-surface p-3">
          <div
            className="text-xs text-[var(--osd-slate)] px-1"
            style={{ fontWeight: 600 }}
          >
            Acciones rápidas
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
            <ActionBtn
              title="Registrar visita"
              onPress={() => {
                setVisitaOK(false);
                setGeo({
                  status: "idle",
                  lat: null,
                  lng: null,
                  accuracy: null,
                  error: "",
                });

                setVisita((s) => ({
                  ...s,
                  fechaHoraISO: new Date().toISOString(),
                  ubicacionTexto: "",
                  gmapsLink: "",
                  notas: "",
                  firmaMedicoDataUrl: "",
                  firmaAfiliadoDataUrl: "",
                }));

                setOpenVisita(true);

                // Pedir ubicación al abrir
                startGeoWatch();
              }}
            />

            <ActionBtn title="Registrar insumos" onPress={() => setOpenInsumos(true)} />
            <ActionBtn title="Informe médico" onPress={() => setOpenInforme(true)} />
            <ActionBtn title="Nuevo requerimiento" onPress={() => setOpenReq(true)} />
            <ActionBtn
  title="No pude registrar"
  onPress={() => {
    setGeoNoVisita({
      status: "idle",
      lat: null,
      lng: null,
      accuracy: null,
      error: "",
    });

    setNoVisita((s) => ({
      ...s,
      motivo: "No estaba el paciente",
      detalle: "",
      ubicacionTexto: "",
      gmapsLink: "",
      firmaAfiliadoDataUrl: "",
    }));

    setOpenNoVisita(true);
    startGeoWatchNoVisita();
  }}
/>

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

        {/* Datos afiliado */}
        <details id="datos-afiliado" className="osd-surface p-4">
          <summary
            className="cursor-pointer select-none text-sm text-slate-900"
            style={{ fontWeight: 600 }}
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
              style={{ fontWeight: 600 }}
            >
              Diagnóstico
            </div>
            <div className="text-sm text-slate-900" style={{ fontWeight: 600 }}>
              {afiliado.diagnostico}
            </div>

            <Divider />

            <div
              className="text-xs text-[var(--osd-slate)]"
              style={{ fontWeight: 600 }}
            >
              Contacto familiar
            </div>
            <div className="text-sm text-slate-900" style={{ fontWeight: 600 }}>
              {afiliado.contacto.nombre} ({afiliado.contacto.vinculo})
            </div>
            <div className="text-sm text-slate-900" style={{ fontWeight: 600 }}>
              Tel: {afiliado.contacto.tel}
            </div>

            <Button
              className="osd-btn-primary w-full"
              onPress={() => submit("Llamada al familiar (mock)")}
            >
              Llamar contacto
            </Button>

            <Divider />

            <div
              className="text-xs text-[var(--osd-slate)]"
              style={{ fontWeight: 600 }}
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

      {/* MODAL Emergencia */}
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

      {/* MODAL Registrar visita */}
      <Modal isOpen={openVisita} onOpenChange={setOpenVisita} placement="center" size="lg">
        <ModalContent>
          {(onClose) => {
            const fecha = visita.fechaHoraISO ? new Date(visita.fechaHoraISO) : new Date();

            const fechaStr = fecha.toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });

            const horaStr = fecha.toLocaleTimeString("es-AR", {
              hour: "2-digit",
              minute: "2-digit",
            });

            const canSubmit =
              geo.status === "ok" &&
              (visita.notas || "").trim().length >= 3 &&
              !!visita.firmaMedicoDataUrl &&
              !!visita.firmaAfiliadoDataUrl;

            return (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Registrar visita
                  <span className="text-xs opacity-70">
                    Fecha y hora automáticas • Ubicación obligatoria • Firmas con el dedo obligatorias
                  </span>
                </ModalHeader>

                <ModalBody className="space-y-4">
                  {/* OK */}
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
                          fontWeight: 800,
                        }}
                      >
                        ✓
                      </div>
                      <div>
                        <div className="text-sm text-slate-900" style={{ fontWeight: 600 }}>
                          Usted registró la visita correctamente
                        </div>
                        <div className="text-xs text-[var(--osd-slate)]" style={{ fontWeight: 500 }}>
                          Quedó asociada al afiliado del QR.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fecha / Hora */}
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Fecha" value={fechaStr} isReadOnly />
                    <Input label="Hora" value={horaStr} isReadOnly />
                  </div>

                  {/* Ubicación */}
                  <div
                    className="rounded-2xl p-4 border"
                    style={{
                      background: "rgba(255,255,255,0.60)",
                      borderColor: "rgba(169,198,198,0.60)",
                    }}
                  >
                    <div className="text-sm text-slate-900" style={{ fontWeight: 600 }}>
                      Ubicación en tiempo real (obligatorio)
                    </div>

                    {geo.status === "loading" && (
                      <div className="text-xs text-[var(--osd-slate)] mt-1" style={{ fontWeight: 500 }}>
                        Obteniendo ubicación...
                      </div>
                    )}

                    {geo.status === "ok" && (
                      <div className="text-xs text-[var(--osd-slate)] mt-1" style={{ fontWeight: 500 }}>
                        ✅ Ubicación capturada (±{Math.round(geo.accuracy)}m)
                      </div>
                    )}

                    {(geo.status === "denied" || geo.status === "error") && (
                      <div className="text-xs mt-1" style={{ fontWeight: 800, color: "var(--osd-secondary)" }}>
                        {geo.error}
                      </div>
                    )}

                    <div className="mt-3 flex gap-2">
                      <Button variant="light" onPress={startGeoWatch}>
                        Reintentar
                      </Button>

                      <Button
                        className="osd-btn-primary"
                        isDisabled={!visita.gmapsLink}
                        onPress={() => window.open(visita.gmapsLink, "_blank")}
                      >
                        Abrir Maps
                      </Button>
                    </div>
                  </div>

                  <Input
                    label="Ubicación (texto)"
                    placeholder="Se completa con la ubicación del dispositivo"
                    value={visita.ubicacionTexto}
                    isReadOnly
                  />

                  <Input
                    label="Link Google Maps"
                    placeholder="Se completa automáticamente"
                    value={visita.gmapsLink}
                    isReadOnly
                  />

                  {/* Observación */}
                  <Textarea
                    label="Observación (obligatorio)"
                    placeholder='Ej: "Se controló saturación" / "Sin novedades"'
                    minRows={4}
                    value={visita.notas}
                    onValueChange={(v) => setVisita((s) => ({ ...s, notas: v }))}
                    isRequired
                  />

                  {/* Firmas con el dedo */}
                  <SignaturePad
                    label="Firma del médico (obligatorio)"
                    value={visita.firmaMedicoDataUrl}
                    onChange={(dataUrl) => setVisita((s) => ({ ...s, firmaMedicoDataUrl: dataUrl }))}
                  />

                  <SignaturePad
                    label="Firma afiliado / familiar (obligatorio)"
                    value={visita.firmaAfiliadoDataUrl}
                    onChange={(dataUrl) => setVisita((s) => ({ ...s, firmaAfiliadoDataUrl: dataUrl }))}
                  />

                  {!canSubmit && (
                    <div className="text-xs" style={{ color: "var(--osd-secondary)", fontWeight: 800 }}>
                      Para registrar: activá ubicación, completá observación y firmá (médico + afiliado).
                    </div>
                  )}
                </ModalBody>

                <ModalFooter>
                  <Button
                    variant="light"
                    onPress={() => {
                      setVisitaOK(false);
                      stopGeoWatch();
                      onClose();
                    }}
                  >
                    Cerrar
                  </Button>

                  <Button
                    className="osd-btn-primary"
                    isDisabled={!canSubmit}
                    onPress={() => {
                      setVisitaOK(true);

                      // Listo para backend:
                      // const payload = {
                      //   fechaHoraISO: visita.fechaHoraISO,
                      //   ubicacionTexto: visita.ubicacionTexto,
                      //   gmapsLink: visita.gmapsLink,
                      //   notas: visita.notas,
                      //   firmaMedicoDataUrl: visita.firmaMedicoDataUrl,
                      //   firmaAfiliadoDataUrl: visita.firmaAfiliadoDataUrl,
                      // };

                      // Si querés que cierre solo:
                      // setTimeout(() => { setVisitaOK(false); stopGeoWatch(); onClose(); }, 1200);
                    }}
                  >
                    Aceptar y registrar
                  </Button>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>

      {/* MODAL Insumos */}
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

      {/* MODAL Informe */}
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

      {/* MODAL Requerimiento */}
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

      {/* MODAL No pude registrar */}
      <Modal isOpen={openNoVisita} onOpenChange={setOpenNoVisita} placement="center" size="lg">
  <ModalContent>
    {(onClose) => {
      const canSubmit =
        geoNoVisita.status === "ok" &&
        (noVisita.detalle || "").trim().length >= 5 &&
        !!noVisita.firmaAfiliadoDataUrl;

      return (
        <>
          <ModalHeader className="flex flex-col gap-1">
            No pude registrar la visita
            <span className="text-xs opacity-70">
              Ubicación obligatoria • Detalle obligatorio • Firma obligatoria (afiliado/familiar)
            </span>
          </ModalHeader>

          <ModalBody className="space-y-4">
            {/* GPS obligatorio */}
            <div
              className="rounded-2xl p-4 border"
              style={{
                background: "rgba(255,255,255,0.60)",
                borderColor: "rgba(169,198,198,0.60)",
              }}
            >
              <div className="text-sm text-slate-900" style={{ fontWeight: 600 }}>
                Ubicación en tiempo real (obligatorio)
              </div>

              {geoNoVisita.status === "loading" && (
                <div className="text-xs text-[var(--osd-slate)] mt-1" style={{ fontWeight: 500 }}>
                  Obteniendo ubicación...
                </div>
              )}

              {geoNoVisita.status === "ok" && (
                <div className="text-xs text-[var(--osd-slate)] mt-1" style={{ fontWeight: 500 }}>
                  ✅ Ubicación capturada (±{Math.round(geoNoVisita.accuracy)}m)
                </div>
              )}

              {(geoNoVisita.status === "denied" || geoNoVisita.status === "error") && (
                <div className="text-xs mt-1" style={{ fontWeight: 800, color: "var(--osd-secondary)" }}>
                  {geoNoVisita.error}
                </div>
              )}

              <div className="mt-3 flex gap-2">
                <Button variant="light" onPress={startGeoWatchNoVisita}>
                  Reintentar
                </Button>

                <Button
                  className="osd-btn-primary"
                  isDisabled={!noVisita.gmapsLink}
                  onPress={() => window.open(noVisita.gmapsLink, "_blank")}
                >
                  Abrir Maps
                </Button>
              </div>
            </div>

            <Input label="Ubicación (texto)" value={noVisita.ubicacionTexto} isReadOnly />
            <Input label="Link Google Maps" value={noVisita.gmapsLink} isReadOnly />

            {/* Motivo */}
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

            {/* Detalle obligatorio */}
            <Textarea
              label="Detalle (obligatorio)"
              placeholder="Qué pasó, con quién hablaste, a qué hora, etc."
              minRows={6}
              value={noVisita.detalle}
              onValueChange={(v) => setNoVisita((s) => ({ ...s, detalle: v }))}
              isRequired
            />

            {/* Firma con el dedo obligatoria */}
            <SignaturePad
              label="Firma afiliado / familiar (obligatorio)"
              value={noVisita.firmaAfiliadoDataUrl}
              onChange={(dataUrl) => setNoVisita((s) => ({ ...s, firmaAfiliadoDataUrl: dataUrl }))}
            />

            {!canSubmit && (
              <div className="text-xs" style={{ color: "var(--osd-secondary)", fontWeight: 800 }}>
                Para guardar: activá ubicación, completá el detalle y firmá (afiliado/familiar).
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              variant="light"
              onPress={() => {
                stopGeoWatchNoVisita();
                onClose();
              }}
            >
              Cancelar
            </Button>

            <Button
              className="osd-btn-primary"
              isDisabled={!canSubmit}
              onPress={() => {
                // submit("Incidente registrado");

                // payload listo para backend:
                // const payload = {
                //   motivo: noVisita.motivo,
                //   detalle: noVisita.detalle,
                //   ubicacionTexto: noVisita.ubicacionTexto,
                //   gmapsLink: noVisita.gmapsLink,
                //   firmaAfiliadoDataUrl: noVisita.firmaAfiliadoDataUrl,
                // };

                stopGeoWatchNoVisita();
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
        <div className="text-sm text-slate-900" style={{ fontWeight: 700 }}>
          {label}
        </div>
        <Button variant="light" onPress={clear}>
          Limpiar
        </Button>
      </div>

      <div
        className="mt-2 rounded-xl overflow-hidden border"
        style={{ borderColor: "rgba(15, 23, 42, 0.12)" }}
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={220}
          style={{
            width: "100%",
            height: 140,
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
        Firmá con el dedo (o mouse). Al soltar, se guarda automáticamente.
      </div>

      {value && (
        <div className="mt-2 text-[11px]" style={{ color: "var(--osd-primary)", fontWeight: 900 }}>
          ✓ Firma capturada
        </div>
      )}
    </div>
  );
}
