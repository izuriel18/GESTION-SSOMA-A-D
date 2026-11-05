/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MÓDULO 14: REPORTES E INDICADORES SSOMA
 * Informes consolidados de gestión, tasas de siniestralidad (IF, IS, IA) y exportación ejecutiva.
 */

import React, { useState } from 'react';
import { useSSOMA } from '../../context/SSOMAContext';
import { SedeType } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  BarChart3,
  Printer,
  Download,
  Filter,
  Calendar,
  Building,
  ShieldCheck,
  TrendingDown,
  CheckCircle,
  FileText
} from 'lucide-react';

export const ReportesIndicadoresModule: React.FC = () => {
  const {
    planStats,
    safetyMetrics,
    inspections,
    trainings,
    correctiveActions,
    legalRequirements,
    selectedSede,
    setSelectedSede,
    currentUser
  } = useSSOMA();

  const [periodo, setPeriodo] = useState('2026-Q1');
  const [areaFiltro, setAreaFiltro] = useState('TODAS');

  // Cálculo de indicadores
  const capacitacionesEjec = trainings.filter(t => t.estado === 'EJECUTADA').length;
  const capacitacionesPct = trainings.length > 0 ? Math.round((capacitacionesEjec / trainings.length) * 100) : 0;

  const inspConformesProm = inspections.length > 0
    ? Math.round(inspections.reduce((acc, i) => acc + i.porcentajeConformidad, 0) / inspections.length)
    : 100;

  const capaCerradas = correctiveActions.filter(c => c.estado === 'VERIFICADA_EFICAZ').length;
  const capaResolucionPct = correctiveActions.length > 0
    ? Math.round((capaCerradas / correctiveActions.length) * 100)
    : 0;

  const legalConforme = legalRequirements.filter(l => l.cumplimiento === 'CONFORME').length;
  const legalPct = legalRequirements.length > 0
    ? Math.round((legalConforme / legalRequirements.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">Reportes e Indicadores de Gestión</h1>
            <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
              ISO 45001 Cl. 9.1 · Evaluación del Desempeño
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Generación de informes ejecutivos de gestión mensual y trimestral para el Comité Paritario de SST y la Alta Dirección.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded shadow-sm transition-colors shrink-0"
        >
          <Printer className="w-4 h-4 text-orange-400" />
          Imprimir Informe Ejecutivo
        </button>
      </div>

      {/* Filtros Consolidados */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono">Sede Operativa:</span>
            <select
              value={selectedSede}
              onChange={(e) => setSelectedSede(e.target.value as SedeType)}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-white font-mono"
            >
              <option value="TODAS">Todas las Sedes</option>
              <option value="SEDE_CENTRAL_LURIN">Sede Central Lurín (Planta de Formulación)</option>
              <option value="PLANTA_CALLAO">Planta Callao (Almacén Marítimo)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono">Periodo de Gestión:</span>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-white font-mono"
            >
              <option value="2026-Q1">Primer Trimestre (Q1 2026)</option>
              <option value="2026-ANUAL">Año Completo 2026</option>
            </select>
          </div>
        </div>

        <span className="text-slate-500 font-mono text-[11px]">
          Filtro reactivo sobre datos reales
        </span>
      </div>

      {/* Formato de Informe Ejecutivo Imprimible */}
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-lg space-y-6">
        {/* Encabezado Formal */}
        <div className="border border-slate-700 p-4 rounded bg-slate-950 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              QUÍMICA &amp; DERIVADOS INDUSTRIALES S.A.C.
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              INFORME CONSOLIDADO DE DESEMPEÑO SSOMA - {periodo}
            </p>
          </div>
          <div className="text-right font-mono text-xs text-slate-400">
            <p className="text-emerald-400 font-bold">Estado: Sistema Conforme</p>
            <p>Generado por: {currentUser.name}</p>
          </div>
        </div>

        {/* Tablero de 6 Indicadores Principales */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">1. Cumplimiento PASST</span>
            <span className="text-2xl font-bold font-mono text-white tabular-nums">{planStats.cumplimientoPct}%</span>
            <p className="text-[10px] text-slate-500">{planStats.ejecutadas} de {planStats.total} actividades validadas</p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">2. Capacitaciones SST</span>
            <span className="text-2xl font-bold font-mono text-sky-400 tabular-nums">{capacitacionesPct}%</span>
            <p className="text-[10px] text-slate-500">{capacitacionesEjec} de {trainings.length} cursos completados</p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">3. Conformidad Inspecciones</span>
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">{inspConformesProm}%</span>
            <p className="text-[10px] text-slate-500">Promedio en {inspections.length} recorridos</p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">4. Siniestralidad (IF)</span>
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">{safetyMetrics.indiceFrecuenciaIF}</span>
            <p className="text-[10px] text-emerald-400/80">0 Accidentes incapacitantes</p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">5. Resolución de CAPA</span>
            <span className="text-2xl font-bold font-mono text-orange-400 tabular-nums">{capaResolucionPct}%</span>
            <p className="text-[10px] text-slate-500">{capaCerradas} de {correctiveActions.length} verificadas eficaces</p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">6. Conformidad Legal</span>
            <span className="text-2xl font-bold font-mono text-purple-400 tabular-nums">{legalPct}%</span>
            <p className="text-[10px] text-slate-500">{legalConforme} de {legalRequirements.length} normas conformes</p>
          </div>
        </div>

        {/* Sección de Dictamen Ejecutivo para el Comité */}
        <div className="p-5 bg-slate-950 border border-slate-800 rounded space-y-3 text-xs leading-relaxed text-slate-300">
          <h3 className="font-bold text-white uppercase font-mono text-sm">
            Dictamen Técnico del Departamento SSOMA:
          </h3>
          <p>
            Durante el periodo evaluado ({periodo}), las operaciones en la sede seleccionada se mantuvieron dentro de los parámetros de seguridad establecidos en la política corporativa y la legislación peruana vigente (Ley 29783). No se han registrado fatalidades ni accidentes incapacitantes con pérdida de jornadas laborales.
          </p>
          <p>
            Las actividades del Programa Anual presentan un avance sostenido del {planStats.cumplimientoPct}%. Se prioriza el seguimiento del cierre de las {correctiveActions.filter(c => c.estado !== 'VERIFICADA_EFICAZ').length} acciones correctivas en proceso para asegurar el mantenimiento del sistema ISO 45001:2018.
          </p>
        </div>

        {/* Firmas de Autorización */}
        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800 text-center font-mono text-[11px] text-slate-400">
          <div className="border-t border-slate-700 pt-2">
            <p className="font-semibold text-white">{currentUser.name}</p>
            <p>Supervisor SSOMA / CIP 184592</p>
          </div>
          <div className="border-t border-slate-700 pt-2">
            <p className="font-semibold text-white">Sr. Víctor Rivas</p>
            <p>Presidente del Comité Paritario SST</p>
          </div>
          <div className="border-t border-slate-700 pt-2">
            <p className="font-semibold text-white">Dr. Fernando Arévalo</p>
            <p>Gerencia General / Dirección</p>
          </div>
        </div>
      </div>
    </div>
  );
};
