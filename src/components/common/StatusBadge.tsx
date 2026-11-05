/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GESTIÓN SSOMA A&D - Badge de Estado Industrial
 */

import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  let style = 'bg-slate-800 text-slate-300 border-slate-700';
  let label = status;

  switch (status) {
    case 'EJECUTADO':
    case 'CONFORME':
    case 'VIGENTE':
    case 'IMPLEMENTADO':
    case 'CUMPLIDO':
    case 'VERIFICADA_EFICAZ':
    case 'APTO':
      style = 'bg-emerald-950/60 text-emerald-300 border-emerald-800/70';
      label = status === 'VERIFICADA_EFICAZ' ? 'VERIFICADA' : status;
      break;

    case 'PROGRAMADO':
      style = 'bg-sky-950/60 text-sky-300 border-sky-800/70';
      break;

    case 'EN_PROCESO':
    case 'POR_VENCER':
    case 'PROXIMO_A_VENCER':
    case 'EN_INVESTIGACION':
    case 'PLAN_ACCION_ABIERTO':
    case 'APTO_CON_RESTRICCIONES':
      style = 'bg-amber-950/60 text-amber-300 border-amber-800/70';
      label = status === 'APTO_CON_RESTRICCIONES' ? 'CON RESTRICCIONES' : status.replace('_', ' ');
      break;

    case 'PENDIENTE':
    case 'ABIERTA':
      style = 'bg-orange-950/60 text-orange-300 border-orange-800/70';
      break;

    case 'VENCIDO':
    case 'VENCIDA':
    case 'NO_CONFORME':
    case 'NO_EJECUTADO':
    case 'CRITICO':
    case 'ALTO':
    case 'NO_APTO_TEMPORAL':
      style = 'bg-rose-950/60 text-rose-300 border-rose-800/70';
      label = status.replace('_', ' ');
      break;

    case 'BAJO':
      style = 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50';
      break;
    case 'MEDIO':
      style = 'bg-amber-950/40 text-amber-400 border-amber-800/50';
      break;

    case 'NO_APLICA':
      style = 'bg-slate-800 text-slate-400 border-slate-700';
      label = 'N/A';
      break;

    default:
      label = status.replace(/_/g, ' ');
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-mono font-medium tracking-tight border rounded ${padding} ${style} tabular-nums`}
    >
      {label}
    </span>
  );
};
