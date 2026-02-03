import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Divider, Chip } from "@heroui/react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function pillByEstado(estado) {
  if (estado === "ALERTA") return "osd-pill osd-pill-critical";
  if (estado === "ESTABLE") return "osd-pill osd-pill-ok";
  return "osd-pill osd-pill-open";
}

export default function PrestacionesGridModal({ isOpen, onClose, afiliado }) {
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  const agendaByDia = React.useMemo(() => {
    const map = {};
    days.forEach((d) => (map[d] = []));
    (afiliado?.prestaciones || []).forEach((p) => {
      (p.agenda || []).forEach((a) => {
        map[a.dia]?.push({
          tipo: p.tipo,
          desde: a.desde,
          hasta: a.hasta,
          profesional: p.profesional?.nombre || "-",
          matricula: p.profesional?.matricula || "-",
        });
      });
    });
    return map;
  }, [afiliado]);

  const downloadPDF = () => {
    if (!afiliado) return;

    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("OSDEPYM ID - Grilla de Prestaciones", 14, 16);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    const y0 = 26;
    doc.text(`Afiliado: ${afiliado.nombre} (${afiliado.id})`, 14, y0);
    doc.text(`N° Afiliado: ${afiliado.nroAfiliado}  • DNI: ${afiliado.dni}`, 14, y0 + 6);
    doc.text(`Empresa ID: ${afiliado.empresa}`, 14, y0 + 12);
    doc.text(`Activo desde: ${afiliado.activoDesde || "-"}`, 14, y0 + 18);
    doc.text(`Diagnóstico: ${afiliado.diagnostico || "-"}`, 14, y0 + 24);
    doc.text(`Domicilio: ${afiliado.domicilio} • ${afiliado.localidad}`, 14, y0 + 30);

    const rowsPrest = (afiliado.prestaciones || []).map((p) => [
      p.tipo,
      p.frecuencia || "-",
      p.profesional?.nombre || "-",
      p.profesional?.matricula || "-",
      p.profesional?.empresa || afiliado.empresa || "-",
      (p.agenda || []).map((a) => `${a.dia} ${a.desde}-${a.hasta}`).join(" | ") || "-",
    ]);

    autoTable(doc, {
      startY: y0 + 38,
      head: [["Prestación", "Frecuencia", "Profesional", "Matrícula", "Empresa", "Agenda"]],
      body: rowsPrest,
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [18, 91, 88] }, // osd-primary
    });

    const rowsAgenda = days.map((d) => {
      const items = (agendaByDia[d] || [])
        .map((x) => `${x.tipo}: ${x.desde}-${x.hasta} (${x.profesional})`)
        .join("\n");
      return [d, items || "-"];
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 8,
      head: [["Día", "Agenda"]],
      body: rowsAgenda,
      styles: { fontSize: 9, cellPadding: 2, valign: "top" },
      headStyles: { fillColor: [138, 75, 64] }, // osd-secondary
    });

    doc.save(`grilla_${afiliado.id}_${afiliado.nombre.replaceAll(" ", "_")}.pdf`);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="center" size="5xl" scrollBehavior="inside">
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-extrabold tracking-wider uppercase text-[var(--osd-slate)]">
                  Grilla de Prestaciones
                </div>
                <div className="text-2xl font-black text-slate-900">{afiliado?.nombre}</div>
              </div>

              <div className="flex gap-2">
                <Button className="osd-btn-secondary" onPress={downloadPDF}>
                  Descargar PDF
                </Button>
                <Button variant="flat" onPress={close}>
                  Cerrar
                </Button>
              </div>
            </ModalHeader>

            <ModalBody>
              {/* FICHA */}
              <div className="osd-surface p-5">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl overflow-hidden border border-black/10 bg-white">
                      <img
                        src={afiliado?.foto || "/img/afiliado-placeholder.jpg"}
                        alt="Foto afiliado"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm text-[var(--osd-slate)] font-bold">
                        {afiliado?.id} • N° {afiliado?.nroAfiliado}
                      </div>
                      <div className="font-black text-slate-900">DNI {afiliado?.dni}</div>
                      <div className="text-sm text-slate-700">
                        <b>Empresa ID:</b> {afiliado?.empresa} • <b>Activo desde:</b> {afiliado?.activoDesde || "-"}
                      </div>
                    </div>
                  </div>

                  <div className="md:ml-auto space-y-2">
                    <div className="text-sm text-slate-700">
                      <b>Domicilio:</b> {afiliado?.domicilio} • {afiliado?.localidad}
                    </div>
                    <div className="text-sm text-slate-700">
                      <b>Diagnóstico:</b> {afiliado?.diagnostico || "-"}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className={pillByEstado(afiliado?.estado)}>{afiliado?.estado}</span>
                      <Chip variant="flat" className="font-bold" style={{ background: "rgba(201,182,156,0.28)", color: "var(--osd-secondary)" }}>
                        {afiliado?.motivo}
                      </Chip>
                    </div>
                  </div>
                </div>
              </div>

              {/* PRESTACIONES */}
              <div className="osd-surface p-5">
                <div className="font-black text-slate-900">Prestaciones autorizadas</div>
                <Divider className="my-3" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {(afiliado?.prestaciones || []).map((p, idx) => (
                    <div key={idx} className="osd-surface p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-black text-slate-900">{p.tipo}</div>
                          <div className="text-xs text-[var(--osd-slate)] font-extrabold">{p.frecuencia || "-"}</div>
                        </div>

                        <span className="osd-pill osd-pill-ok">Agenda</span>
                      </div>

                      <Divider className="my-3" />

                      <div className="space-y-1 text-sm">
                        <div className="text-slate-700">
                          <b>Profesional:</b> {p.profesional?.nombre || "-"}
                        </div>
                        <div className="text-slate-700">
                          <b>Matrícula:</b> {p.profesional?.matricula || "-"}
                        </div>
                        <div className="text-slate-700">
                          <b>Empresa:</b> {p.profesional?.empresa || afiliado?.empresa || "-"}
                        </div>

                        <Divider className="my-3" />

                        <div className="text-xs font-extrabold tracking-wider uppercase text-[var(--osd-slate)]">
                          Días y horarios
                        </div>

                        <div className="space-y-2">
                          {(p.agenda || []).length === 0 ? (
                            <div className="text-sm text-slate-600">— Sin agenda cargada —</div>
                          ) : (
                            p.agenda.map((a, i) => (
                              <div key={i} className="flex items-center justify-between text-sm">
                                <div className="font-bold text-slate-900">{a.dia}</div>
                                <div className="text-slate-700">
                                  {a.desde} – {a.hasta}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AGENDA SEMANAL */}
              <div className="osd-surface p-5">
                <div className="flex items-center justify-between">
                  <div className="font-black text-slate-900">Agenda semanal (resumen)</div>
                  <div className="text-xs font-bold text-[var(--osd-slate)]">Vista rápida</div>
                </div>
                <Divider className="my-3" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {days.map((d) => (
                    <div key={d} className="osd-surface p-4">
                      <div className="font-black text-slate-900">{d}</div>
                      <Divider className="my-2" />
                      <div className="text-sm text-slate-700 whitespace-pre-line">
                        {(agendaByDia[d] || []).length === 0
                          ? "— Sin visitas programadas —"
                          : agendaByDia[d]
                              .map((x) => `${x.tipo}: ${x.desde}-${x.hasta} • ${x.profesional} (${x.matricula})`)
                              .join("\n")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button variant="flat" onPress={close}>
                Cerrar
              </Button>
              <Button className="osd-btn-secondary" onPress={downloadPDF}>
                Descargar PDF
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
