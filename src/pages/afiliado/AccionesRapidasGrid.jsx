import React from "react";
import { Card, CardHeader, CardFooter, Image, Button, Chip } from "@heroui/react";

const ui = {
  primary: "#137fec",
};

function OverlayTitle({ kicker, title }) {
  return (
    <div className="absolute z-10 top-3 left-3 right-3 flex flex-col gap-1">
      <p className="text-tiny text-white/70 uppercase font-bold tracking-wide">{kicker}</p>
      <h4 className="text-white font-extrabold text-xl leading-tight drop-shadow-sm">{title}</h4>
    </div>
  );
}

function FooterCTA({ label, onPress, tone = "light" }) {
  const styles =
    tone === "primary"
      ? { background: "rgba(19,127,236,0.92)", color: "white" }
      : { background: "rgba(255,255,255,0.22)", color: "white" };

  return (
    <CardFooter className="absolute bottom-0 left-0 right-0 z-10 justify-between border-t-1 border-white/20 bg-black/35 backdrop-blur-md">
      <div className="flex flex-col">
        <p className="text-tiny text-white/80">Atención OSDEPYM</p>
        <p className="text-tiny text-white/70">Te respondemos con seguimiento.</p>
      </div>
      <Button
        radius="full"
        size="sm"
        className="text-tiny font-bold"
        style={styles}
        onPress={onPress}
      >
        {label}
      </Button>
    </CardFooter>
  );
}

/**
 * Props:
 * - onReclamo()
 * - onInsumos()
 * - onSugerencia()
 * - onCalificarProfesional()
 * - onCalificarEmpresa()
 * - onMisReclamos()
 */
export default function AccionesRapidasGrid({
  onReclamo,
  onInsumos,
  onSugerencia,
  onCalificarProfesional,
  onCalificarEmpresa,
  onMisReclamos,
}) {
  return (
    <div className="max-w-[1200px] w-full">
      <div className="flex items-end justify-between mb-4 px-1">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-[#0d141b]">Acciones rápidas</h2>
          <p className="text-sm text-[#4c739a]">
            Hacé un reclamo, sugerencia o calificación en segundos.
          </p>
        </div>

        <Chip
          variant="flat"
          className="font-bold"
          style={{ background: "rgba(19,127,236,0.12)", color: ui.primary }}
        >
          Demo • HeroUI
        </Chip>
      </div>

      <div className="gap-3 grid grid-cols-12 grid-rows-2">
        {/* 1) Reclamo general */}
        <Card isFooterBlurred className="col-span-12 sm:col-span-6 lg:col-span-4 h-[260px]">
          <CardHeader className="absolute z-10 top-0">
            <OverlayTitle kicker="Reclamo" title="Informar un inconveniente" />
          </CardHeader>
          <Image
            removeWrapper
            alt="Reclamo"
            className="z-0 w-full h-full object-cover"
            src="/img/osdepymsucursal.jpg"
          />
          <FooterCTA label="Crear reclamo" onPress={onReclamo} tone="primary" />
        </Card>

        {/* 2) Insumos */}
        <Card isFooterBlurred className="col-span-12 sm:col-span-6 lg:col-span-4 h-[260px]">
          <CardHeader className="absolute z-10 top-0">
            <OverlayTitle kicker="Insumos" title="Defectuosos • faltantes • vencidos" />
          </CardHeader>
          <Image
            removeWrapper
            alt="Insumos"
            className="z-0 w-full h-full object-cover"
            // si tenés una imagen propia mejor: /img/insumos.jpg
            src="https://images.unsplash.com/photo-1587854680352-936b22b91030?auto=format&fit=crop&w=1200&q=60"
          />
          <FooterCTA label="Reclamar insumos" onPress={onInsumos} />
        </Card>

        {/* 3) Sugerencias */}
        <Card isFooterBlurred className="col-span-12 lg:col-span-4 h-[260px]">
          <CardHeader className="absolute z-10 top-0">
            <OverlayTitle kicker="Sugerencias" title="Ayudanos a mejorar la atención" />
          </CardHeader>
          <Image
            removeWrapper
            alt="Sugerencias"
            className="z-0 w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=60"
          />
          <FooterCTA label="Enviar sugerencia" onPress={onSugerencia} />
        </Card>

        {/* 4) Calificar profesional (ancha) */}
        <Card isFooterBlurred className="col-span-12 sm:col-span-7 h-[260px]">
          <CardHeader className="absolute z-10 top-0 left-0 right-0 flex-col items-start">
            <p className="text-tiny text-white/70 uppercase font-bold">Calificaciones</p>
            <h4 className="text-white font-extrabold text-2xl leading-tight">
              Calificar al profesional
            </h4>
          </CardHeader>
          <Image
            removeWrapper
            alt="Profesional"
            className="z-0 w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=60"
          />
          <CardFooter className="absolute bottom-0 left-0 right-0 z-10 border-t-1 border-white/20 bg-black/40 backdrop-blur-md justify-between">
            <div className="flex flex-col">
              <p className="text-tiny text-white/75">Puntualidad • trato • higiene</p>
              <p className="text-tiny text-white/60">Tu opinión mejora el servicio.</p>
            </div>
            <Button radius="full" size="sm" className="font-bold" onPress={onCalificarProfesional}>
              Calificar ⭐
            </Button>
          </CardFooter>
        </Card>

        {/* 5) Calificar empresa */}
        <Card isFooterBlurred className="col-span-12 sm:col-span-5 h-[260px]">
          <CardHeader className="absolute z-10 top-0">
            <OverlayTitle kicker="Empresa ID" title="Calificar coordinación" />
          </CardHeader>
          <Image
            removeWrapper
            alt="Empresa"
            className="z-0 w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=60"
          />
          <FooterCTA label="Calificar" onPress={onCalificarEmpresa} />
        </Card>

        {/* 6) Mis reclamos (chico pero útil) */}
        <Card isFooterBlurred className="col-span-12 h-[220px]">
          <CardHeader className="absolute z-10 top-0">
            <OverlayTitle kicker="Seguimiento" title="Ver mis reclamos y estados" />
          </CardHeader>
          <Image
            removeWrapper
            alt="Mis reclamos"
            className="z-0 w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=60"
          />
          <CardFooter className="absolute bottom-0 left-0 right-0 z-10 border-t-1 border-white/20 bg-white/20 backdrop-blur-md justify-between">
            <div className="flex flex-col">
              <p className="text-tiny text-white/80">Transparencia</p>
              <p className="text-tiny text-white/70">Estado: Nuevo • En revisión • Resuelto</p>
            </div>
            <Button
              radius="full"
              size="sm"
              className="font-bold"
              style={{ background: "rgba(255,255,255,0.92)", color: "#0d141b" }}
              onPress={onMisReclamos}
            >
              Ir →
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
