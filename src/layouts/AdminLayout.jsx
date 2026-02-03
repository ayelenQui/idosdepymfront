import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Button, Input, Chip } from "@heroui/react";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: "dashboard" },
  { to: "/admin/empresas", label: "Empresas", icon: "domain" },
  { to: "/admin/afiliados", label: "Afiliados", icon: "group" },
  { to: "/admin/visitas", label: "Visitas", icon: "stethoscope" },
  { to: "/admin/alertas", label: "Alertas", icon: "notifications" },
  { to: "/admin/insumos", label: "Insumos", icon: "inventory_2" },
  { to: "/admin/informes", label: "Informes", icon: "description" },
  { to: "/admin/reportes", label: "Reportes", icon: "bar_chart" },
  { to: "/admin/reclamos", label: "Reclamos", icon: "report_problem" },
];

export default function AdminLayout() {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [darkMode]);

  const title = useMemo(() => {
    const item = navItems.find(n => n.to === location.pathname);
    return item?.label ?? "Administración";
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#101922] text-[#0d141b] dark:text-white">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 shrink-0 flex-col bg-[#125b58] text-white shadow-xl">
          <div className="p-6 flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
                    <img
        src="/img/osdepymlogo.jpg"
        alt="OSDEPYM Logo"
        className="h-10 w-10 object-contain"
      />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">OSDEPYM</h1>
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">
                Administración
              </p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-3 space-y-1 overflow-y-auto text-white" >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-white/12 text-white"
                      : "text-white/75 hover:bg-white/8 hover:text-white",
                  ].join(" ")
                }
              >
                <div className="relative">
                  <span className="material-symbols-outlined">{item.icon}</span>

                  {/* puntito rojo en alertas */}
                  {item.to === "/admin/alertas" && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#137fec]" />
                  )}
                </div>

                <span className="text-sm font-semibold">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-black/10">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center font-extrabold">
                OP
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate">OSDEPYM Central</p>
                <p className="text-[10px] text-white/60 uppercase font-bold tracking-widest">
                  Admin Nivel 1
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <header className="h-16 shrink-0 bg-white dark:bg-[#1a2632] border-b border-[#cfdbe7] dark:border-white/10 flex items-center justify-between px-4 md:px-8 gap-4">
            <div className="flex-1 max-w-xl">
              <Input
                radius="lg"
                placeholder="Buscar afiliado, empresa o DNI..."
                startContent={<span className="material-symbols-outlined text-[#4c739a]">search</span>}
                classNames={{
                  inputWrapper:
                    "bg-[#f0f4f8] dark:bg-[#101922] border border-transparent data-[hover=true]:bg-[#f0f4f8] dark:data-[hover=true]:bg-[#101922]",
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                variant="flat"
                className="bg-[#f0f4f8] dark:bg-[#101922]"
                onPress={() => setDarkMode(v => !v)}
              >
                <span className="material-symbols-outlined text-[#4c739a]">
                  {darkMode ? "light_mode" : "dark_mode"}
                </span>
              </Button>

              <Button
                isIconOnly
                variant="flat"
                className="bg-[#f0f4f8] dark:bg-[#101922]"
              >
                <span className="material-symbols-outlined text-[#4c739a]">settings</span>
              </Button>

              <Button
                isIconOnly
                variant="flat"
                className="bg-[#f0f4f8] dark:bg-[#101922] relative"
              >
                <span className="material-symbols-outlined text-[#4c739a]">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </Button>

              <div className="hidden sm:flex items-center gap-2 pl-3 ml-2 border-l border-[#cfdbe7] dark:border-white/10">
                <div className="text-right">
                  <p className="text-xs font-extrabold">OSDEPYM Central</p>
                  <div className="flex items-center justify-end gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-[#4c739a]">Online</span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-[#137fec]/10 text-[#137fec] flex items-center justify-center font-extrabold">
                  OP
                </div>
              </div>
            </div>
          </header>

          {/* Page */}
          <div className="flex-1 overflow-y-auto">
            {/* breadcrumb simple */}
            <div className="px-4 md:px-8 pt-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-widest">
                    Administración
                  </p>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                    {title}
                  </h2>
                </div>
                <Chip variant="flat" className="hidden md:flex bg-[#137fec]/10 text-[#137fec] font-bold">
                  Demo • Mock
                </Chip>
              </div>
            </div>

            <div className="px-4 md:px-8 py-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
