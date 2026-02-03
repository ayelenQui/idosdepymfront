import React from "react";
import { Checkbox, CheckboxGroup, User, Chip, cn } from "@heroui/react";

export function CustomCheckbox({ afiliado, statusColor, value }) {
  return (
    <Checkbox
      aria-label={afiliado.nombre}
      classNames={{
        base: cn(
          "inline-flex w-full m-0 bg-white/80",
          "hover:bg-white items-center justify-start",
          "cursor-pointer rounded-2xl gap-2 p-4 border-2 border-transparent",
          "data-[selected=true]:border-[var(--osd-primary)]",
        ),
        label: "w-full",
      }}
      value={value}
    >
      <div className="w-full flex justify-between gap-3">
        <User
          avatarProps={{ size: "md", src: afiliado.foto }}
          name={afiliado.nombre}
          description={
            <span className="text-xs text-[var(--osd-slate)] font-bold">
              {afiliado.nroAfiliado} • {afiliado.empresa}
            </span>
          }
        />
        <div className="flex flex-col items-end gap-1">
          <span className="text-tiny text-default-500">{afiliado.localidad}</span>
          <Chip color={statusColor} size="sm" variant="flat">
            {afiliado.estado}
          </Chip>
        </div>
      </div>
    </Checkbox>
  );
}

function colorByEstado(estado) {
  if (estado === "ALERTA") return "danger";
  if (estado === "ESTABLE") return "success";
  return "warning";
}

export default function AfiliadoPicker({ afiliados = [], selectedId, onChange }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="text-xs font-extrabold tracking-wider uppercase text-[var(--osd-slate)]">
        Afiliados
      </div>

      <CheckboxGroup
        classNames={{ base: "w-full" }}
        value={selectedId ? [selectedId] : []}
        onChange={(arr) => {
          const id = Array.isArray(arr) ? arr[0] : undefined;
          onChange?.(id);
        }}
      >
        {afiliados.map((a) => (
          <CustomCheckbox key={a.id} afiliado={a} statusColor={colorByEstado(a.estado)} value={a.id} />
        ))}
      </CheckboxGroup>
    </div>
  );
}
