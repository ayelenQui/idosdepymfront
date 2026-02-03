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

export default function MapPanel({ points = [] }) {
  const center = useMemo(() => [-34.6037, -58.3816], []); // CABA

  return (
    <div className="h-[360px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
      <MapContainer center={center} zoom={11} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {points.map((p) => (
          <Marker key={p.id} position={p.coords}>
            <Popup>
              <div style={{ minWidth: 220 }}>
                <div style={{ fontWeight: 800 }}>{p.name}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  {p.id} • {p.zona} • {p.empresa}
                </div>
                <div style={{ marginTop: 6, fontSize: 12 }}>
                  <b>Estado:</b>{" "}
                  <span style={{ color: p.status === "ALERTA" ? "#e11d48" : "#059669" }}>{p.status}</span>
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
