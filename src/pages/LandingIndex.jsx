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
  AFILIADO: "AFILIADO",
  PROFESIONAL: "PROFESIONAL",
  EMPRESA: "EMPRESA",
};

// colores (los tuyos)
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

export default function LandingIndex() {
  const navigate = useNavigate();
  const [role, setRole] = React.useState(ROLES.AFILIADO);

  const [form, setForm] = React.useState({
    user: "",
    pass: "",
    extra: "",
  });

  const roleMeta = React.useMemo(() => {
    if (role === ROLES.AFILIADO) {
      return {
        title: "Ingreso Afiliados",
        hint: "DNI / N° Afiliado",
        extraLabel: "N° Afiliado (opcional)",
        cta: "Entrar como Afiliado",
        to: "/afiliado",
        badge: "Portal Afiliados",
      };
    }
    if (role === ROLES.PROFESIONAL) {
      return {
        title: "Ingreso Profesionales",
        hint: "Matrícula / DNI",
        extraLabel: "Especialidad (opcional)",
        cta: "Entrar como Profesional",
        to: "/profesional",
        badge: "Panel Profesional",
      };
    }
    return {
      title: "Ingreso Empresa ID",
      hint: "CUIT / Usuario",
      extraLabel: "Código Empresa (opcional)",
      cta: "Entrar como Empresa",
      to: "/empresa",
      badge: "Panel Empresa",
    };
  }, [role]);

  const submit = (e) => {
    e?.preventDefault();

    // mock: solo valida que haya algo
    if (!form.user || !form.pass) return;

    navigate(roleMeta.to);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${brand.ice} 0%, #ffffff 35%, ${brand.aqua} 100%)`,
      }}
    >
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-2">
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
                <div className="text-2xl md:text-3xl font-black" style={{ color: "#0f1b1b" }}>
                  OSDEPYM • Acceso al Sistema
                </div>
              </div>
            </div>

            <p className="text-sm md:text-base" style={{ color: "#223535" }}>
              Ingresá según tu perfil para ver afiliados, visitas, alertas, reclamos e informes.
            </p>

            <div className="flex flex-wrap gap-2">
              <Chip variant="flat" style={{ background: `${brand.teal}14`, color: brand.teal }}>
                Seguro
              </Chip>
              <Chip variant="flat" style={{ background: `${brand.terracota}14`, color: brand.terracota }}>
                Gestión de prestaciones
              </Chip>
              <Chip variant="flat" style={{ background: `${brand.caramel}1A`, color: brand.terracota }}>
                Reclamos / Alertas
              </Chip>
            </div>
          </div>

          {/* Acceso rápido Admin (por si querés mostrar) */}
          <div className="flex gap-2">
            <Button
              variant="flat"
              className="font-bold"
              style={{ background: `${brand.steel}18`, color: "#0f1b1b" }}
              onPress={() => navigate("/admin")}
            >
              Demo Admin
            </Button>
          </div>
        </div>

        <Divider className="my-8" />

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left: Card login */}
          <Card className="border-none shadow-xl">
            <CardHeader className="flex flex-col items-start gap-2">
              <div className="flex items-center justify-between w-full">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider" style={{ color: brand.steel }}>
                    Seleccioná perfil
                  </div>
                  <div className="text-xl font-black" style={{ color: "#0f1b1b" }}>
                    {roleMeta.title}
                  </div>
                </div>
                <Chip
                  variant="flat"
                  className="font-bold"
                  style={{ background: `${brand.teal}14`, color: brand.teal }}
                >
                  {roleMeta.badge}
                </Chip>
              </div>

              <Tabs
                selectedKey={role}
                onSelectionChange={(k) => setRole(k)}
                variant="solid"
                radius="lg"
                classNames={{
                  tabList: "w-full",
                }}
              >
                <Tab key={ROLES.AFILIADO} title="Afiliado" />
                <Tab key={ROLES.PROFESIONAL} title="Profesional" />
                <Tab key={ROLES.EMPRESA} title="Empresa" />
              </Tabs>
            </CardHeader>

            <CardBody className="space-y-4">
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
                  style={{ backgroundColor: brand.teal, color: "white" }}
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

          {/* Right: Info / tips */}
          <Card className="border-none shadow-xl">
            <CardHeader>
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider" style={{ color: brand.steel }}>
                  Qué vas a ver
                </div>
                <div className="text-xl font-black" style={{ color: "#0f1b1b" }}>
                  Funcionalidades por rol
                </div>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="rounded-2xl p-4" style={{ background: `${brand.teal}12` }}>
                <div className="font-black" style={{ color: brand.teal }}>
                  Afiliado
                </div>
                <div className="text-sm" style={{ color: "#223535" }}>
                  Ver plan de prestaciones, visitas programadas, evolución, reclamos y documentos.
                </div>
              </div>

              <div className="rounded-2xl p-4" style={{ background: `${brand.terracota}12` }}>
                <div className="font-black" style={{ color: brand.terracota }}>
                  Profesional
                </div>
                <div className="text-sm" style={{ color: "#223535" }}>
                  Agenda de visitas, cargar informes, alertas clínicas y seguimiento por afiliado.
                </div>
              </div>

              <div className="rounded-2xl p-4" style={{ background: `${brand.caramel}18` }}>
                <div className="font-black" style={{ color: "#6a3a31" }}>
                  Empresa ID
                </div>
                <div className="text-sm" style={{ color: "#223535" }}>
                  Gestionar afiliados asignados, equipo médico/enfermería, visitas y respuesta a reclamos.
                </div>
              </div>

              <Divider />

              <div className="text-xs" style={{ color: brand.steel }}>
                Tip: después conectamos esto con tu backend (Spring + Rabbit) y guardamos el rol en sesión/JWT.
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
