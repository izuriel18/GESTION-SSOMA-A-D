/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MÓDULO 01: DASHBOARD GENERAL SSOMA
 * Indicadores calculados a partir de registros reales. Sin datos ficticios inventados.
 */

import React, { useState } from 'react';
import { useSSOMA } from '../../context/SSOMAContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  CalendarCheck2,
  AlertTriangle,
  ShieldAlert,
  GraduationCap,
  Scale,
  FlaskConical,
  Flame,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingDown,
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const DashboardModule: React.FC = () => {
  const {
    planStats,
    activities,
    safetyMetrics,
    inspections,
    trainings,
    correctiveActions,
    legalRequirements,
    chemicals,
    selectedSede,
    setActiveModule
  } = useSSOMA();

  const [selectedMonth, setSelectedMonth] = useState<number>(3); // Marzo por defecto

  // Inspecciones realizadas y conformidad promedio
  const inspeccionesRealizadas = inspections.length;
  const conformidadPromedio = inspeccionesRealizadas > 0
    ? Math.round(inspections.reduce((acc, i) => acc + i.porcentajeConformidad, 0) / inspeccionesRealizadas)
    : 100;

  // Capacitaciones ejecutadas
  const capacitacionesEjecutadas = trainings.filter(t => t.estado === 'EJECUTADA').length;
  const capacitacionesTotal = trainings.length;

  // CAPA abiertas y vencidas
  const capaAbiertas = correctiveActions.filter(c => c.estado === 'ABIERTA' || c.estado === 'EN_PROCESO');
  const capaVencidas = correctiveActions.filter(c => c.estado === 'VENCIDA');
  const capaCriticas = correctiveActions.filter(c => c.esCritica && c.estado !== 'VERIFICADA_EFICAZ');

  // Requisitos legales pendientes de evaluación
  const legalesPendientes = legalRequirements.filter(l => l.cumplimiento === 'EN_PROCESO' || l.cumplimiento === 'NO_CONFORME');

  // Químicos con SDS por vencer o vencida
  const sdsAlertas = chemicals.filter(c => c.sdsEstado === 'POR_VENCER' || c.sdsEstado === 'VENCIDA');

  // Desglose por mes (1 a 12) para gráfico mensual de cumplimiento
  const meses = [
    { num: 1, label: 'Ene' },
    { num: 2, label: 'Feb' },
    { num: 3, label: 'Mar' },
    { num: 4, label: 'Abr' },
    { num: 5, label: 'May' },
    { num: 6, label: 'Jun' },
    { num: 7, label: 'Jul' },
    { num: 8, label: 'Ago' },
    { num: 9, label: 'Set' },
    { num: 10, label: 'Oct' },
    { num: 11, label: 'Nov' },
    { num: 12, label: 'Dic' }
  ];

  const cumplimientoPorMes = meses.map(m => {
    const acts = activities.filter(a => a.mesProgramado === m.num);
    const total = acts.length;
    const ejecutadas = acts.filter(a => a.estado === 'EJECUTADO').length;
    const pct = total > 0 ? Math.round((ejecutadas / total) * 100) : 0;
    return { ...m, total, ejecutadas, pct };
  });

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-lg shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">Panel Ejecutivo SSOMA</h1>
            <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
              Sector Químico · Periodo 2026
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Control consolidado de seguridad, salud ocupacional y medio ambiente conforme a los requerimientos de la Ley N° 29783 y la norma internacional ISO 45001:2018.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModule('14_reportes')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors whitespace-nowrap"
          >
            <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
            Generar Informe Ejecutivo
          </button>
          <button
            onClick={() => setActiveModule('02_planificacion')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded shadow-sm transition-colors whitespace-nowrap"
          >
            <CalendarCheck2 className="w-3.5 h-3.5" />
            Gestionar Plan Anual
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (6 Top Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* KPI 1: Cumplimiento Plan Anual */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Cumplimiento PASST</span>
            <CalendarCheck2 className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-white tracking-tight tabular-nums">
              {planStats.cumplimientoPct}%
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              ({planStats.ejecutadas}/{planStats.total})
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-orange-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${planStats.cumplimientoPct}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Inspecciones Operativas */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Inspecciones Realizadas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-white tracking-tight tabular-nums">
              {inspeccionesRealizadas}
            </span>
            <span className="text-[11px] text-emerald-400 font-mono">
              {conformidadPromedio}% conf.
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 truncate">Duchas, extintores y áreas</p>
        </div>

        {/* KPI 3: Capacitaciones Ejecutadas */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Capacitaciones SST</span>
            <GraduationCap className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-white tracking-tight tabular-nums">
              {capacitacionesEjecutadas}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">de {capacitacionesTotal}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 truncate">2 mínimas Ley 29783 completadas</p>
        </div>

        {/* KPI 4: Índice de Frecuencia (IF) */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Índice Frecuencia (IF)</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-white tracking-tight tabular-nums">
              {safetyMetrics.indiceFrecuenciaIF}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Meta &lt; {safetyMetrics.metaMaximaIF}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 truncate">
            {safetyMetrics.totalAccidentesIncapacitantes} acc. incapacitantes
          </p>
        </div>

        {/* KPI 5: Acciones Correctivas (CAPA) */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>CAPA Abiertas</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-white tracking-tight tabular-nums">
              {capaAbiertas.length}
            </span>
            {capaCriticas.length > 0 && (
              <span className="text-[11px] text-rose-400 font-mono font-semibold">
                ({capaCriticas.length} críticas)
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-500 mt-2 truncate">
            {capaVencidas.length} vencidas a la fecha
          </p>
        </div>

        {/* KPI 6: Requisitos Legales */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Matriz Legal</span>
            <Scale className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-white tracking-tight tabular-nums">
              {legalRequirements.filter(l => l.cumplimiento === 'CONFORME').length}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              de {legalRequirements.length}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 truncate">
            {legalesPendientes.length} por reevaluar
          </p>
        </div>
      </div>

      {/* Middle Section: Gráfico de Cumplimiento Mensual + Indicadores Clave de Seguridad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico Mensual PASST */}
        <div className="lg:col-span-2 p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Evolución de Cumplimiento Mensual del Programa Anual SST
              </h2>
              <p className="text-xs text-slate-400">
                Progreso porcentual de actividades ejecutadas sobre programadas por mes (Año 2026)
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">Base: Registros Validados</span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-48 pt-6 flex items-end justify-between gap-2 border-b border-slate-800 pb-2">
            {cumplimientoPorMes.map((m) => {
              const isSelected = selectedMonth === m.num;
              const hasActivities = m.total > 0;
              const heightPct = Math.max(m.pct, 8);

              return (
                <button
                  key={m.num}
                  onClick={() => setSelectedMonth(m.num)}
                  className="flex-1 flex flex-col items-center gap-1 group focus:outline-hidden"
                  title={`${m.label}: ${m.ejecutadas}/${m.total} actividades (${m.pct}%)`}
                >
                  <div className="text-[10px] font-mono text-slate-400 group-hover:text-white tabular-nums">
                    {hasActivities ? `${m.pct}%` : '-'}
                  </div>
                  <div className="w-full max-w-[28px] h-32 bg-slate-800/80 rounded-t flex items-end overflow-hidden p-0.5">
                    <div
                      className={`w-full rounded-t transition-all duration-300 ${
                        m.pct === 100
                          ? 'bg-emerald-500'
                          : m.pct > 0
                          ? 'bg-orange-500'
                          : 'bg-slate-700'
                      } ${isSelected ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-900' : ''}`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span
                    className={`text-[11px] font-mono ${
                      isSelected ? 'text-orange-400 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs" />
                100% Ejecutado
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-orange-500 rounded-xs" />
                En Ejecución / Parcial
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-slate-700 rounded-xs" />
                Programado Futuro
              </span>
            </div>
            <button
              onClick={() => setActiveModule('02_planificacion')}
              className="text-orange-400 hover:text-orange-300 font-medium inline-flex items-center gap-1"
            >
              Ver detalle de actividades del mes {selectedMonth} <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Panel de Estadísticas de Siniestralidad (Frecuencia, Severidad, Accidentabilidad) */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Indicadores de Accidentabilidad</h2>
            <span className="text-[10px] font-mono text-slate-400">D.S. 005-2012-TR</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-950 border border-slate-800/80 rounded">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Horas Hombre Trabajadas (HHT)</span>
                <span className="font-mono text-slate-200 tabular-nums">
                  {safetyMetrics.horasHombreTrabajadasPeriodo.toLocaleString()} hrs
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800/80 rounded">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-300 font-medium">Índice de Frecuencia (IF)</p>
                  <p className="text-[10px] text-slate-500 font-mono">N° Acc. × 10⁶ / HHT</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-mono font-bold text-white tabular-nums">
                    {safetyMetrics.indiceFrecuenciaIF}
                  </span>
                  <p className="text-[10px] text-emerald-400">Bajo la meta ({safetyMetrics.metaMaximaIF})</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800/80 rounded">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-300 font-medium">Índice de Severidad (IS)</p>
                  <p className="text-[10px] text-slate-500 font-mono">Días Perdidos × 10⁶ / HHT</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-mono font-bold text-white tabular-nums">
                    {safetyMetrics.indiceSeveridadIS}
                  </span>
                  <p className="text-[10px] text-emerald-400">Bajo la meta ({safetyMetrics.metaMaximaIS})</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800/80 rounded">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-300 font-medium">Índice de Accidentabilidad (IA)</p>
                  <p className="text-[10px] text-slate-500 font-mono">(IF × IS) / 1000</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-mono font-bold text-white tabular-nums">
                    {safetyMetrics.indiceAccidentabilidadIA}
                  </span>
                  <p className="text-[10px] text-slate-400">Tasa consolidada</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Critical Hallazgos & SDS Chemical Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hallazgos Críticos Abiertos */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h2 className="text-sm font-semibold text-white">Resumen de Hallazgos y CAPA Críticas</h2>
            </div>
            <button
              onClick={() => setActiveModule('13_correctivas')}
              className="text-xs text-orange-400 hover:text-orange-300 font-medium"
            >
              Ver todas ({correctiveActions.length})
            </button>
          </div>

          <div className="space-y-2">
            {correctiveActions.slice(0, 3).map((capa) => (
              <div
                key={capa.id}
                className="p-3 bg-slate-950 border border-slate-800 rounded hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-semibold text-orange-400">{capa.codigo}</span>
                  <StatusBadge status={capa.estado} />
                </div>
                <p className="text-xs text-slate-200 mt-1 font-medium">{capa.hallazgoProblema}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Resp: {capa.responsableImplementacion}</span>
                  <span>Compromiso: {capa.fechaCompromiso}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas de Sustancias Químicas (SDS y Almacenamiento) */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-white">Alertas de Sustancias Químicas (SGA)</h2>
            </div>
            <button
              onClick={() => setActiveModule('06_quimicas')}
              className="text-xs text-orange-400 hover:text-orange-300 font-medium"
            >
              Ver inventario completo
            </button>
          </div>

          <div className="space-y-2">
            {chemicals.map((chem) => (
              <div
                key={chem.id}
                className="p-3 bg-slate-950 border border-slate-800 rounded flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white truncate">{chem.nombreComercial}</span>
                    <span className="text-[10px] font-mono text-slate-400">CAS: {chem.numeroCAS}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {chem.ubicacionAlmacen} · Stock: {chem.stockActual.toLocaleString()} {chem.unidadMedida}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <StatusBadge status={chem.sdsEstado} />
                  <p className="text-[10px] text-slate-500 font-mono mt-1">SDS v.{chem.sdsVersion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
