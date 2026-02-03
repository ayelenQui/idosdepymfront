import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix icon default (Vite + Leaflet)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function MapPanel() {
  // Centro CABA (podés cambiar)
  const center = useMemo(() => [-34.6037, -58.3816], []);

  // MARKERS MOCK (CABA + GBA)
  const points = useMemo(
    () => [
      {
        id: "A-01",
        name: "Juan Pérez",
        zona: "CABA",
        status: "ALERTA",
        coords: [-34.609, -58.392],
        detail: "Saturación baja • Empresa: ID Rehabilitación Norte",
      },
      {
        id: "A-02",
        name: "María López",
        zona: "CABA",
        status: "ESTABLE",
        coords: [-34.596, -58.372],
        detail: "Visitas al día • Enfermería 12hs",
      },
      {
        id: "A-03",
        name: "Ricardo Medina",
        zona: "GBA",
        status: "ESTABLE",
        coords: [-34.643, -58.576], // aprox La Matanza
        detail: "Insumos ok • Próxima visita: mañana",
      },
      {
        id: "A-04",
        name: "Alicia Pereyra",
        zona: "GBA",
        status: "ALERTA",
        coords: [-34.55, -58.72],
        detail: "Visita incumplida • Requiere reprogramación",
      },
    ],
    []
  );

  return (
    <div className="h-[360px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Mapa base OSM */}
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Markers */}
        {points.map((p) => (
          <Marker key={p.id} position={p.coords}>
            <Popup>
              <div style={{ minWidth: 220 }}>
                <div style={{ fontWeight: 800 }}>{p.name}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  {p.id} • {p.zona}
                </div>
                <div style={{ marginTop: 6, fontSize: 12 }}>
                  <b>Estado:</b>{" "}
                  <span style={{ color: p.status === "ALERTA" ? "#e11d48" : "#059669" }}>
                    {p.status}
                  </span>
                </div>
                <div style={{ marginTop: 6, fontSize: 12 }}>{p.detail}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
