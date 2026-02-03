import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Tabs,
  Tab,
  Input,
  Chip,
  Divider,
} from "@heroui/react";

const ROLES = {
  ADMIN: "ADMIN",
  AFILIADO: "AFILIADO",
  EMPRESA: "EMPRESA",
  PROFESIONAL: "PROFESIONAL",
};

// tus colores
const brand = {
  teal: "#125b58",
  terracota: "#8a4b40",
  ice: "#dfe7e4",
  steel: "#829ea1",
  sand: "#c9b69c",
  caramel: "#b17f5f",
  rose: "#b58b85",
  aqua: "#a9c6c6",
};

// ✅ Cambiá esto por tu imagen real (o import local)
const heroImage =
  "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1400&q=80";

function GoogleIcon() {
  return (
    <span
      aria-hidden
      style={{
        width: 16,
        height: 16,
        borderRadius: 999,
        display: "inline-block",
        background:
          "conic-gradient(from 180deg, #ea4335, #fbbc05, #34a853, #4285f4, #ea4335)",
      }}
    />
  );
}

export default function LandingIndex() {
  const navigate = useNavigate();
  const [role, setRole] = React.useState(ROLES.ADMIN);

  const [form, setForm] = React.useState({
    user: "",
    pass: "",
    extra: "",
  });

  const roleMeta = React.useMemo(() => {
    switch (role) {
      case ROLES.ADMIN:
        return {
          title: "Acceso Admin OSDEPYM",
          hint: "Usuario / Email",
          extraLabel: "Área (opcional)",
          cta: "Entrar como Admin",
          to: "/admin",
          badge: "Interno",
          accent: brand.teal,
        };
      case ROLES.AFILIADO:
        return {
          title: "Acceso Afiliados",
          hint: "DNI / N° Afiliado",
          extraLabel: "N° Afiliado (opcional)",
          cta: "Entrar como Afiliado",
          to: "/afiliado",
          badge: "Portal Afiliados",
          accent: brand.teal,
        };
      case ROLES.EMPRESA:
        return {
          title: "Acceso Empresa ID",
          hint: "CUIT / Usuario",
          extraLabel: "Código Empresa (opcional)",
          cta: "Entrar como Empresa",
          to: "/empresa",
          badge: "Panel Empresa",
          accent: brand.caramel,
        };
      case ROLES.PROFESIONAL:
      default:
        return {
          title: "Acceso Profesionales",
          hint: "Matrícula / DNI",
          extraLabel: "Especialidad (opcional)",
          cta: "Entrar como Profesional",
          to: "/profesional",
          badge: "Panel Profesional",
          accent: brand.terracota,
        };
    }
  }, [role]);

  const submit = (e) => {
    e?.preventDefault();
    // mock: validación mínima
    if (!form.user || !form.pass) return;
    navigate(roleMeta.to);
  };

  const googleMock = () => {
    alert(`Mock: Google Sign-In (${roleMeta.title})`);
    navigate(roleMeta.to);
  };

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: `linear-gradient(135deg, ${brand.ice} 0%, #ffffff 35%, ${brand.aqua} 100%)`,
      }}
    >
      {/* ✅ Columna izquierda: imagen + marca */}
      <div className="hidden lg:flex w-1/2 relative">
        {/* Imagen */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Overlay moderno */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(120deg, rgba(18,91,88,0.85) 0%, rgba(18,91,88,0.65) 40%, rgba(255,255,255,0.05) 100%)",
          }}
        />
        {/* Contenido */}
        <div className="relative z-10 p-10 flex flex-col justify-between w-full">
          <div className="flex items-center gap-3">
            <div
              className="h-11 w-11 rounded-2xl grid place-items-center shadow-sm"
              style={{ backgroundColor: "rgba(255,255,255,0.18)", backdropFilter: "blur(10px)" }}
            >
              <span className="text-white font-black text-lg">O</span>
            </div>
            <div>
              <div className="text-white/80 text-xs font-bold tracking-wider uppercase">
                Internación Domiciliaria
              </div>
              <div className="text-white text-3xl font-black leading-tight">OSDEPYM</div>
            </div>
          </div>

          <div className="max-w-md space-y-4">
            <h2 className="text-white text-4xl font-black leading-tight">
              Coordinación y trazabilidad
              <span className="text-white/80"> en un solo sistema</span>
            </h2>

            <p className="text-white/80 text-base leading-relaxed">
              Gestión integral para administración, empresas prestadoras, profesionales y afiliados:
              visitas, alertas, informes, insumos y reclamos.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <Chip variant="flat" className="text-white" style={{ background: "rgba(255,255,255,0.14)" }}>
                Visitas
              </Chip>
              <Chip variant="flat" className="text-white" style={{ background: "rgba(255,255,255,0.14)" }}>
                Alertas
              </Chip>
              <Chip variant="flat" className="text-white" style={{ background: "rgba(255,255,255,0.14)" }}>
                Insumos
              </Chip>
              <Chip variant="flat" className="text-white" style={{ background: "rgba(255,255,255,0.14)" }}>
                Informes
              </Chip>
            </div>
          </div>

          <div className="text-white/70 text-xs">
            Demo UI • sin autenticación real • mock para presentación
          </div>
        </div>
      </div>

      {/* ✅ Columna derecha: login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* mini header mobile */}
          <div className="lg:hidden mb-6">
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-2xl grid place-items-center shadow-sm"
                style={{ backgroundColor: brand.teal }}
              >
                <span className="text-white font-black">O</span>
              </div>
              <div>
                <div className="text-xs font-bold tracking-wider uppercase" style={{ color: brand.steel }}>
                  Internación Domiciliaria
                </div>
                <div className="text-2xl font-black" style={{ color: "#0f1b1b" }}>
                  OSDEPYM
                </div>
              </div>
            </div>
          </div>

          <Card className="border-none shadow-2xl">
            <CardHeader className="flex flex-col items-start gap-3">
              <div className="w-full flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider" style={{ color: brand.steel }}>
                    Inicio de sesión
                  </div>
                  <div className="text-xl font-black" style={{ color: "#0f1b1b" }}>
                    {roleMeta.title}
                  </div>
                </div>

                <Chip
                  variant="flat"
                  className="font-bold"
                  style={{ background: `${roleMeta.accent}14`, color: roleMeta.accent }}
                >
                  {roleMeta.badge}
                </Chip>
              </div>

              {/* Tabs 4 roles */}
              <Tabs
                selectedKey={role}
                onSelectionChange={(k) => setRole(k)}
                variant="solid"
                radius="lg"
                classNames={{ tabList: "w-full" }}
              >
                <Tab key={ROLES.ADMIN} title="Admin" />
                <Tab key={ROLES.AFILIADO} title="Afiliado" />
                <Tab key={ROLES.EMPRESA} title="Empresa" />
                <Tab key={ROLES.PROFESIONAL} title="Profesional" />
              </Tabs>
            </CardHeader>

            <CardBody className="space-y-4">
              {/* Google primero (más moderno) */}
              <Button
                fullWidth
                size="lg"
                variant="bordered"
                className="font-bold"
                onPress={googleMock}
              >
                <span style={{ marginRight: 10, display: "inline-flex" }}>
                  <GoogleIcon />
                </span>
                Iniciar con Google
              </Button>

              <div className="flex items-center gap-3">
                <Divider className="flex-1" />
                <span className="text-xs" style={{ color: brand.steel }}>
                  o con usuario
                </span>
                <Divider className="flex-1" />
              </div>

              <form onSubmit={submit} className="space-y-4">
                <Input
                  label={roleMeta.hint}
                  placeholder="Ingresá tu usuario"
                  value={form.user}
                  onValueChange={(v) => setForm((s) => ({ ...s, user: v }))}
                  isRequired
                />

                <Input
                  label="Contraseña"
                  placeholder="••••••••"
                  type="password"
                  value={form.pass}
                  onValueChange={(v) => setForm((s) => ({ ...s, pass: v }))}
                  isRequired
                />

                <Input
                  label={roleMeta.extraLabel}
                  placeholder="Opcional"
                  value={form.extra}
                  onValueChange={(v) => setForm((s) => ({ ...s, extra: v }))}
                />

                <Button
                  type="submit"
                  className="w-full font-black"
                  style={{ backgroundColor: roleMeta.accent, color: "white" }}
                >
                  {roleMeta.cta}
                </Button>

                <div className="flex items-center justify-between text-xs" style={{ color: brand.steel }}>
                  <button
                    type="button"
                    className="font-bold hover:underline"
                    onClick={() => alert("Recuperación mock")}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                  <span className="font-medium">Versión demo (mock)</span>
                </div>
              </form>
            </CardBody>
          </Card>

          {/* acceso rápido admin (extra, por si querés más directo aún) */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-xs" style={{ color: brand.steel }}>
              Acceso rápido:
            </span>
            <Button
              size="sm"
              variant="flat"
              className="font-bold"
              style={{ background: `${brand.teal}14`, color: brand.teal }}
              onPress={() => navigate("/admin")}
            >
              /admin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
