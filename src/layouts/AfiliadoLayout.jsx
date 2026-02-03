import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
} from "@heroui/react";

const brand = {
  teal: "#125b58",
  steel: "#829ea1",
  ice: "#dfe7e4",
};

const sidebarItems = [
  { to: "/afiliado", label: "Inicio", icon: "🏠" },
  { to: "/afiliado/plan", label: "Mi Plan", icon: "🧾" },
  { to: "/afiliado/visitas", label: "Mis Visitas", icon: "🩺" },
  { to: "/afiliado/reclamos", label: "Reclamos", icon: "📩" },
  { to: "/afiliado/insumos", label: "Insumos", icon: "📦" },
  { to: "/afiliado/calificaciones", label: "Calificaciones", icon: "⭐" },
];

function SideLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-xl px-3 py-2 transition",
          isActive ? "bg-black/5 font-extrabold" : "hover:bg-black/5 font-bold opacity-90",
        ].join(" ")
      }
      style={({ isActive }) => (isActive ? { color: brand.teal } : { color: "#0f1b1b" })}
    >
      <span
        className="grid place-items-center"
        style={{
          width: 34,
          height: 34,
          borderRadius: 12,
          background: "rgba(18,91,88,0.10)",
        }}
      >
        <span style={{ fontSize: 16 }}>{icon}</span>
      </span>
      <span className="text-sm">{label}</span>
    </NavLink>
  );
}

export default function AfiliadoLayout() {
  const navigate = useNavigate();

  // mobile sidebar
  const [open, setOpen] = React.useState(false);

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${brand.ice} 0%, #ffffff 60%)`,
      }}
    >
      {/* NAVBAR (HeroUI) */}
      <Navbar maxWidth="xl" className="bg-white/85 backdrop-blur border-b border-black/5">
        <NavbarBrand className="gap-3">
          <Button
            className="md:hidden font-black"
            variant="flat"
            style={{ background: "rgba(0,0,0,0.06)", color: "#0f1b1b" }}
            onPress={() => setOpen(true)}
          >
            ☰
          </Button>

          <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center overflow-hidden">
            <img src="/img/osdepymlogo.jpg" alt="OSDEPYM" className="h-8 w-8 object-contain" />
          </div>

          <div className="leading-tight">
            <div className="text-xs font-bold uppercase tracking-wider" style={{ color: brand.steel }}>
              Portal del Afiliado
            </div>
            <p className="font-black text-inherit">OSDEPYM ID</p>
          </div>
        </NavbarBrand>

        {/* NAV CENTER (dropdown como el ejemplo) */}
        <NavbarContent className="hidden md:flex gap-2" justify="center">
          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="p-0 bg-transparent data-[hover=true]:bg-transparent font-bold"
                  radius="sm"
                  variant="light"
                >
                  Gestiones ▾
                </Button>
              </DropdownTrigger>
            </NavbarItem>

            <DropdownMenu
              aria-label="Gestiones Afiliado"
              itemClasses={{ base: "gap-3" }}
              onAction={(key) => {
                // key viene como string
                if (key === "reclamo") navigate("/afiliado/reclamos");
                if (key === "insumos") navigate("/afiliado/insumos");
                if (key === "sugerencia") navigate("/afiliado/reclamos"); // o /sugerencias si la armás
                if (key === "calificar") navigate("/afiliado/calificaciones");
              }}
            >
              <DropdownItem
                key="reclamo"
                description="No vino la enfermera, mala atención, demoras"
                startContent={<span className="text-xl">📩</span>}
              >
                Realizar reclamo
              </DropdownItem>

              <DropdownItem
                key="insumos"
                description="Faltantes, vencidos, defectuosos"
                startContent={<span className="text-xl">📦</span>}
              >
                Reclamar insumos
              </DropdownItem>

              <DropdownItem
                key="sugerencia"
                description="Ayudanos a mejorar la atención"
                startContent={<span className="text-xl">💬</span>}
              >
                Enviar sugerencia
              </DropdownItem>

              <DropdownItem
                key="calificar"
                description="Calificar profesional / empresa ID"
                startContent={<span className="text-xl">⭐</span>}
              >
                Calificaciones
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <NavbarItem>
            <Link color="foreground" className="font-bold" href="/afiliado/plan">
              Mi Plan
            </Link>
          </NavbarItem>

          <NavbarItem>
            <Link color="foreground" className="font-bold" href="/afiliado/visitas">
              Mis Visitas
            </Link>
          </NavbarItem>
        </NavbarContent>

        {/* NAV RIGHT */}
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Chip variant="flat" style={{ background: `${brand.teal}14`, color: brand.teal }}>
              Atención 24hs
            </Chip>
          </NavbarItem>

          <NavbarItem>
            <Button
              size="sm"
              variant="flat"
              style={{ background: "rgba(0,0,0,0.06)", color: "#0f1b1b" }}
              onPress={() => alert("Mock: notificaciones")}
            >
              🔔
            </Button>
          </NavbarItem>

          <NavbarItem>
            <Button
              size="sm"
              variant="flat"
              style={{ background: "rgba(0,0,0,0.06)", color: "#0f1b1b" }}
              onPress={() => alert("Mock: perfil")}
            >
              👤
            </Button>
          </NavbarItem>

          <NavbarItem>
            <Button
              size="sm"
              variant="flat"
              style={{ background: `${brand.teal}14`, color: brand.teal }}
              onPress={() => navigate("/")}
            >
              Salir
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {/* BODY: Sidebar + Outlet */}
      <div className="maxWidth-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
            {/* Sidebar desktop */}
            <aside className="hidden md:block">
              <div className="rounded-2xl bg-white/90 border border-black/5 shadow-sm p-4 sticky top-[92px]">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-black" style={{ color: "#0f1b1b" }}>
                    Menú
                  </div>
                  <Chip size="sm" variant="flat" style={{ background: `${brand.teal}14`, color: brand.teal }}>
                    Demo
                  </Chip>
                </div>

                <nav className="flex flex-col gap-1">
                  {sidebarItems.map((it) => (
                    <SideLink key={it.to} to={it.to} icon={it.icon} label={it.label} />
                  ))}
                </nav>

                <div className="mt-4 rounded-2xl p-4" style={{ background: "rgba(18,91,88,0.08)" }}>
                  <div className="font-black" style={{ color: brand.teal }}>
                    ¿Necesitás ayuda?
                  </div>
                  <div className="text-xs mt-1" style={{ color: "#223535" }}>
                    Atención prioritaria 24hs para afiliados en internación domiciliaria.
                  </div>
                  <div className="mt-3 text-sm font-black" style={{ color: "#0f1b1b" }}>
                    📞 0800-OSDEPYM
                  </div>
                </div>
              </div>
            </aside>

            {/* Content */}
            <main className="min-w-0">
              <Outlet />
            </main>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />

          <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-white shadow-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center overflow-hidden">
                  <img src="/img/osdepymlogo.jpg" alt="OSDEPYM" className="h-8 w-8 object-contain" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase" style={{ color: brand.steel }}>
                    Menú Afiliado
                  </div>
                  <div className="text-base font-black">OSDEPYM ID</div>
                </div>
              </div>

              <Button
                variant="flat"
                style={{ background: "rgba(0,0,0,0.06)", color: "#0f1b1b" }}
                onPress={() => setOpen(false)}
              >
                ✕
              </Button>
            </div>

            <nav className="flex flex-col gap-1">
              {sidebarItems.map((it) => (
                <div key={it.to} onClick={() => setOpen(false)}>
                  <SideLink to={it.to} icon={it.icon} label={it.label} />
                </div>
              ))}
            </nav>

            <div className="mt-4 rounded-2xl p-4" style={{ background: "rgba(18,91,88,0.08)" }}>
              <div className="font-black" style={{ color: brand.teal }}>
                Atención 24hs
              </div>
              <div className="text-xs mt-1" style={{ color: "#223535" }}>
                Línea prioritaria para internación domiciliaria.
              </div>
              <div className="mt-3 text-sm font-black" style={{ color: "#0f1b1b" }}>
                📞 0800-OSDEPYM
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
