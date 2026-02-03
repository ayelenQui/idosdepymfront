import React from "react";
import { Card, CardBody, Button, Divider } from "@heroui/react";

function pillClass(severity) {
  if (severity === "CRITICA") return "osd-pill osd-pill-critical";
  if (severity === "ABIERTA") return "osd-pill osd-pill-open";
  return "osd-pill osd-pill-ok";
}

function leftBarColor(severity) {
  if (severity === "CRITICA") return "var(--osd-secondary)";
  if (severity === "ABIERTA") return "var(--osd-caramel)";
  return "var(--osd-primary)";
}

function iconBg(severity) {
  if (severity === "CRITICA") return "rgba(138, 75, 64, 0.16)";
  if (severity === "ABIERTA") return "rgba(177, 127, 95, 0.18)";
  return "rgba(18, 91, 88, 0.12)";
}

export default function AlertaCard({ alert, onVerDetalle, onMarcarResuelta }) {
  return (
    <Card className="border-none shadow-md hover:shadow-lg transition">
      <CardBody className="p-0">
        <div className="relative p-4">
          {/* barra lateral */}
          <span
            className="absolute left-0 top-3 bottom-3 w-[5px] rounded-full"
            style={{ background: leftBarColor(alert.severidad) }}
          />

          <div className="flex items-start gap-4">
            <div
              className="grid place-items-center rounded-2xl font-black"
              style={{
                width: 46,
                height: 46,
                background: iconBg(alert.severidad),
                color:
                  alert.severidad === "CRITICA"
                    ? "var(--osd-secondary)"
                    : "var(--osd-primary)",
              }}
              aria-hidden
            >
              {alert.icon}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <div className="font-black text-[15px]" style={{ color: "#0f1b1b" }}>
                  {alert.titulo}
                </div>

                <span className={pillClass(alert.severidad)}>{alert.severidad}</span>

                {alert.etiqueta && (
                  <span
                    className="osd-pill"
                    style={{
                      background: "rgba(130,158,161,0.16)",
                      border: "1px solid rgba(130,158,161,0.35)",
                      color: "var(--osd-slate)",
                    }}
                  >
                    {alert.etiqueta}
                  </span>
                )}
              </div>

              <div className="text-sm mt-1" style={{ color: "#223535" }}>
                {alert.descripcion}
              </div>

              <div className="text-xs mt-2 flex flex-wrap gap-x-4 gap-y-1" style={{ color: "var(--osd-slate)" }}>
                <span className="font-bold">Afiliado:</span> {alert.afiliado}
                <span className="font-bold">N°:</span> {alert.nroAfiliado}
                <span className="font-bold">Fecha:</span> {alert.fecha}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <Button
                size="sm"
                className="osd-btn-primary"
                onPress={() => onVerDetalle?.(alert)}
              >
                Ver
              </Button>

              <Button
                size="sm"
                variant="flat"
                style={{
                  background: "rgba(15,23,42,0.06)",
                  color: "#0f1b1b",
                  borderRadius: 9999,
                  fontWeight: 800,
                }}
                onPress={() => onMarcarResuelta?.(alert)}
              >
                Resuelta
              </Button>
            </div>
          </div>
        </div>

        <Divider />

        {/* footer mini */}
        <div className="px-4 py-3 flex items-center justify-between text-xs" style={{ color: "var(--osd-slate)" }}>
          <span>
            Origen: <span className="font-bold">{alert.origen}</span>
          </span>
          <span>
            Responsable: <span className="font-bold">{alert.responsable}</span>
          </span>
        </div>
      </CardBody>
    </Card>
  );
}
