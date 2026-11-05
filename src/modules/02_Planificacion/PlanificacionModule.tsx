/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MÓDULO 02: PLANIFICACIÓN SSOMA
 * Programas Anuales (SST, Capacitaciones, Inspecciones, Auditorías, Objetivos)
 * Ejecución estricta con registro de evidencia y justificación técnica.
 */

import React, { useState } from 'react';
import { useSSOMA } from '../../context/SSOMAContext';
import { PlanActivity, PlanStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EvidenceModal } from '../../components/common/EvidenceModal';
import {
  CalendarCheck2,
  Plus,
  FileCheck2,
  Filter,
  Search,
  CheckCircle,
  Clock,
  Target,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export const PlanificacionModule: React.FC = () => {
  const {
    activities,
    executeActivity,
    saveActivity,
    planStats,
    selectedSede
  } = useSSOMA();

  const [activeTab, setActiveTab] = useState<'SST' | 'CAPACITACION' | 'INSPECCION' | 'AUDITORIA' | 'OBJETIVOS'>('SST');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');
  const [selectedActivityForEvidence, setSelectedActivityForEvidence] = useState<PlanActivity | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Formulario de nueva actividad
  const [newActividad, setNewActividad] = useState('');
  const [newObjetivo, setNewObjetivo] = useState('');
  const [newResponsable, setNewResponsable] = useState('');
  const [newFrecuencia, setNewFrecuencia] = useState<'MENSUAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL'>('MENSUAL');
  const [newMes, setNewMes] = useState(new Date().getMonth() + 1);
  const [newClausulaISO, setNewClausulaISO] = useState('6.1.2');

  // Filtrado de actividades
  const filteredActivities = activities.filter(act => {
    if (activeTab !== 'OBJETIVOS' && act.programaTipo !== activeTab) return false;
    if (selectedSede !== 'TODAS' && act.sede !== 'TODAS' && act.sede !== selectedSede) return false;
    if (statusFilter !== 'TODOS' && act.estado !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        act.actividad.toLowerCase().includes(q) ||
        act.codigo.toLowerCase().includes(q) ||
        act.responsable.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActividad.trim()) return;

    const newPlanItem: PlanActivity = {
      id: `act-${Date.now()}`,
      codigo: `PASST-2026-${String(activities.length + 1).padStart(3, '0')}`,
      programaTipo: activeTab === 'OBJETIVOS' ? 'SST' : activeTab,
      actividad: newActividad.trim(),
      objetivo: newObjetivo.trim() || 'Asegurar cumplimiento operativo y normativo.',
      responsable: newResponsable.trim() || 'Supervisor SSOMA',
      frecuencia: newFrecuencia,
      mesProgramado: Number(newMes),
      anio: 2026,
      fechaProgramada: `2026-${String(newMes).padStart(2, '0')}-15`,
      estado: 'PROGRAMADO',
      clausulaISO: newClausulaISO,
      sede: selectedSede === 'TODAS' ? 'SEDE_CENTRAL_LURIN' : selectedSede
    };

    saveActivity(newPlanItem);
    setShowCreateModal(false);
    setNewActividad('');
    setNewObjetivo('');
    setNewResponsable('');
  };

  const handleEvidenceSubmitted = (evidence: { titulo: string; justificacion: string; fechaEjecucion: string; url?: string }) => {
    if (selectedActivityForEvidence) {
      executeActivity(selectedActivityForEvidence.id, evidence);
      setSelectedActivityForEvidence(null);
    }
  };

  const mesesLabels = [
    '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">Planificación SSOMA</h1>
            <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
              ISO 45001 Cl. 6.1 · Ley 29783 Art. 32
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Administración del Programa Anual de Seguridad y Salud en el Trabajo (PASST 2026), cronogramas de capacitaciones, inspecciones y auditorías con control riguroso de evidencias.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Registrar Nueva Actividad
        </button>
      </div>

      {/* Tabs de Programas */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('SST')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded transition-colors ${
            activeTab === 'SST'
              ? 'bg-slate-800 text-orange-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <CalendarCheck2 className="w-4 h-4" />
          A. Programa Anual SST
        </button>
        <button
          onClick={() => setActiveTab('CAPACITACION')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded transition-colors ${
            activeTab === 'CAPACITACION'
              ? 'bg-slate-800 text-orange-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          B. Programa de Capacitaciones
        </button>
        <button
          onClick={() => setActiveTab('INSPECCION')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded transition-colors ${
            activeTab === 'INSPECCION'
              ? 'bg-slate-800 text-orange-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          C. Programa de Inspecciones
        </button>
        <button
          onClick={() => setActiveTab('AUDITORIA')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded transition-colors ${
            activeTab === 'AUDITORIA'
              ? 'bg-slate-800 text-orange-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          D. Programa de Auditorías
        </button>
        <button
          onClick={() => setActiveTab('OBJETIVOS')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded transition-colors ${
            activeTab === 'OBJETIVOS'
              ? 'bg-slate-800 text-orange-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Target className="w-4 h-4" />
          E. Objetivos y Metas
        </button>
      </div>

      {/* Vista de Objetivos y Metas */}
      {activeTab === 'OBJETIVOS' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-orange-400 font-semibold">OBJETIVO ESTRATÉGICO 01</span>
              <span className="text-xs font-mono text-emerald-400">En Cumplimiento</span>
            </div>
            <h3 className="text-sm font-semibold text-white">Cero Accidentes Incapacitantes en Operaciones Químicas</h3>
            <p className="text-xs text-slate-400">
              Mantener el Índice de Frecuencia (IF) por debajo de 2.5 y el Índice de Severidad (IS) por debajo de 15.0 durante todo el año 2026.
            </p>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Meta: 0 Fatalidades / IF &lt; 2.5</span>
              <span className="text-emerald-400 font-bold">IF Actual: 0.00</span>
            </div>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-orange-400 font-semibold">OBJETIVO ESTRATÉGICO 02</span>
              <span className="text-xs font-mono text-emerald-400">En Cumplimiento</span>
            </div>
            <h3 className="text-sm font-semibold text-white">Cumplimiento del 100% de las 4 Capacitaciones Legales (Ley 29783)</h3>
            <p className="text-xs text-slate-400">
              Asegurar la participación de al menos el 95% de la nómina de trabajadores en las cuatro sesiones de inducción y entrenamiento mandatorio.
            </p>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Meta: 100% Capacitaciones Ley</span>
              <span className="text-emerald-400 font-bold">Avance: 50% (2 de 4)</span>
            </div>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-orange-400 font-semibold">OBJETIVO ESTRATÉGICO 03</span>
              <span className="text-xs font-mono text-emerald-400">En Cumplimiento</span>
            </div>
            <h3 className="text-sm font-semibold text-white">100% de Inspecciones de Seguridad Operativa y Sustancias Peligrosas</h3>
            <p className="text-xs text-slate-400">
              Ejecución mensual de listas de verificación de duchas de emergencia, extintores y compatibilidad química según cronograma.
            </p>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Meta: 100% Inspecciones</span>
              <span className="text-emerald-400 font-bold">Conformidad Promedio: 90%</span>
            </div>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-orange-400 font-semibold">OBJETIVO ESTRATÉGICO 04</span>
              <span className="text-xs font-mono text-amber-400">En Proceso</span>
            </div>
            <h3 className="text-sm font-semibold text-white">Cierre Oportuno de Acciones Correctivas en Menos de 30 Días</h3>
            <p className="text-xs text-slate-400">
              Subsanar el 100% de los hallazgos críticos detectados en inspecciones e incidentes dentro de los plazos comprometidos.
            </p>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Meta: 0 CAPA Vencidas</span>
              <span className="text-amber-400 font-bold">Pendientes: 3 Abiertas</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Controls: Search and Status Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por actividad, código o responsable..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-orange-500 font-mono"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-slate-500" /> Estado:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 focus:outline-hidden focus:border-orange-500 font-mono"
              >
                <option value="TODOS">Todos los Estados</option>
                <option value="PROGRAMADO">Programado</option>
                <option value="EJECUTADO">Ejecutado</option>
                <option value="EN_PROCESO">En Proceso</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="VENCIDO">Vencido</option>
              </select>
            </div>
          </div>

          {/* Activities Table */}
          <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Código</th>
                    <th className="px-4 py-3">Actividad Programada &amp; Objetivo</th>
                    <th className="px-3 py-3">Mes Prog.</th>
                    <th className="px-3 py-3">Responsable</th>
                    <th className="px-3 py-3">Cláusula ISO</th>
                    <th className="px-3 py-3">Estado</th>
                    <th className="px-4 py-3 text-right">Evidencia / Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredActivities.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                        No se encontraron actividades registradas para este filtro en el programa.
                      </td>
                    </tr>
                  ) : (
                    filteredActivities.map((act) => (
                      <tr key={act.id} className="hover:bg-slate-850/60 transition-colors">
                        <td className="px-4 py-3 font-mono text-slate-400 font-semibold whitespace-nowrap">
                          {act.codigo}
                        </td>
                        <td className="px-4 py-3 max-w-md">
                          <p className="font-semibold text-white">{act.actividad}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{act.objetivo}</p>
                          {act.evidenciaTitulo && (
                            <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                              <CheckCircle className="w-3 h-3" />
                              <span className="truncate">Evidencia: {act.evidenciaTitulo}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-3 font-mono text-slate-300 whitespace-nowrap">
                          {mesesLabels[act.mesProgramado]} {act.anio}
                        </td>
                        <td className="px-3 py-3 text-slate-300 whitespace-nowrap">
                          {act.responsable}
                        </td>
                        <td className="px-3 py-3 font-mono text-slate-400 whitespace-nowrap">
                          ISO {act.clausulaISO}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <StatusBadge status={act.estado} />
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          {act.estado === 'EJECUTADO' ? (
                            <button
                              onClick={() => setSelectedActivityForEvidence(act)}
                              className="px-2.5 py-1 text-[11px] font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors inline-flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3 text-emerald-400" />
                              Ver Evidencia
                            </button>
                          ) : (
                            <button
                              onClick={() => setSelectedActivityForEvidence(act)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded shadow-xs transition-colors inline-flex items-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Ejecutar con Evidencia
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal Registrar Nueva Actividad */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
              <h3 className="text-base font-semibold text-white">Registrar Nueva Actividad en el Programa</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleCreateActivity} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">
                  Actividad Programada *
                </label>
                <input
                  type="text"
                  required
                  value={newActividad}
                  onChange={(e) => setNewActividad(e.target.value)}
                  placeholder="Ej: Inspección trimestral de contención secundaria en patio de ácidos"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">
                  Objetivo Específico *
                </label>
                <textarea
                  rows={2}
                  value={newObjetivo}
                  onChange={(e) => setNewObjetivo(e.target.value)}
                  placeholder="Ej: Verificar estanqueidad de geomembrana y operatividad de válvulas"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">
                    Responsable *
                  </label>
                  <input
                    type="text"
                    required
                    value={newResponsable}
                    onChange={(e) => setNewResponsable(e.target.value)}
                    placeholder="Ej: Ing. Químico / Supervisor SSOMA"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">
                    Mes Programado *
                  </label>
                  <select
                    value={newMes}
                    onChange={(e) => setNewMes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white text-xs font-mono"
                  >
                    {mesesLabels.slice(1).map((m, idx) => (
                      <option key={idx + 1} value={idx + 1}>
                        {m} 2026
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">
                    Frecuencia
                  </label>
                  <select
                    value={newFrecuencia}
                    onChange={(e) => setNewFrecuencia(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white text-xs font-mono"
                  >
                    <option value="MENSUAL">Mensual</option>
                    <option value="TRIMESTRAL">Trimestral</option>
                    <option value="SEMESTRAL">Semestral</option>
                    <option value="ANUAL">Anual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">
                    Cláusula ISO 45001
                  </label>
                  <input
                    type="text"
                    value={newClausulaISO}
                    onChange={(e) => setNewClausulaISO(e.target.value)}
                    placeholder="Ej: 6.1.2 / 8.1.1 / 9.2"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded"
                >
                  Guardar Actividad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Evidence Modal for Documented Execution */}
      <EvidenceModal
        activity={selectedActivityForEvidence}
        onClose={() => setSelectedActivityForEvidence(null)}
        onConfirm={handleEvidenceSubmitted}
      />
    </div>
  );
};
