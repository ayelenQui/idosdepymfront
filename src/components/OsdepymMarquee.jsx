export default function OsdepymMarquee() {
  return (
    <div
      className="w-full overflow-hidden border-t py-3"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Track infinito */}
      <div className="osd-marquee-track flex items-center gap-10">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <img
              src="/img/osdepymlogo.jpg"
              alt="OSDEPYM"
              className="h-7 opacity-70"
              style={{ width: "auto" }}
            />

            <span className="font-bold text-sm text-gray-500">
              Te estamos cuidando
            </span>
          </div>
        ))}
      </div>

      {/* CSS animación */}
      <style>{`
        .osd-marquee-track {
          width: max-content;
          animation: osd-marquee 22s linear infinite;
        }

        @keyframes osd-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
