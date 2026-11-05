/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MÓDULO 13: ACCIONES CORRECTIVAS (CAPA)
 * Módulo centralizado de no conformidades (Inspecciones, Auditorías, Incidentes, Matriz Legal)
 * Conforme a ISO 45001 Cl. 10.2 & D.S. 005-2012-TR.
 */

import React, { useState } from 'react';
import { useSSOMA } from '../../context/SSOMAContext';
import { CorrectiveAction } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ShieldAlert,
  FileCheck,
  Calendar
} from 'lucide-react';

export const AccionesCorrectivasModule: React.FC = () => {
  const { correctiveActions, saveCorrectiveAction, selectedSede, currentUser } = useSSOMA();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterOrigen, setFilterOrigen] = useState<string>('TODOS');
  const [filterEstado, setFilterEstado] = useState<string>('TODOS');
  const [selectedCapaForClose, setSelectedCapaForClose] = useState<CorrectiveAction | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Formulario de Verificación de Eficacia
  const [evidenciaCierre, setEvidenciaCierre] = useState('');
  const [comentariosVerif, setComentariosVerif] = useState('');

  // Formulario Nueva Acción Correctiva
  const [origen, setOrigen] = useState<CorrectiveAction['origen']>('INSPECCION');
  const [hallazgo, setHallazgo] = useState('');
  const [causaRaiz, setCausaRaiz] = useState('');
  const [accionPropuesta, setAccionPropuesta] = useState('');
  const [responsable, setResponsable] = useState('');
  const [fechaCompromiso, setFechaCompromiso] = useState(
    new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
  );
  const [esCritica, setEsCritica] = useState(false);

  const filteredCapa = correctiveActions.filter(c => {
    if (filterOrigen !== 'TODOS' && c.origen !== filterOrigen) return false;
    if (filterEstado !== 'TODOS' && c.estado !== filterEstado) return false;
    if (selectedSede !== 'TODAS' && c.sede !== 'TODAS' && c.sede !== selectedSede) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        c.codigo.toLowerCase().includes(q) ||
        c.hallazgoProblema.toLowerCase().includes(q) ||
        c.responsableImplementacion.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleVerifyEfficacy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCapaForClose) return;

    const updated: CorrectiveAction = {
      ...selectedCapaForClose,
      estado: 'VERIFICADA_EFICAZ',
      fechaCierreReal: new Date().toISOString().split('T')[0],
      evidenciaCierre: evidenciaCierre.trim() || 'Verificación in situ y firma de conformidad SSOMA.',
      verificadoPor: currentUser.name,
      comentariosVerificacion: comentariosVerif.trim() || 'Cierre técnico validado sin recurrencia del desvío.'
    };

    saveCorrectiveAction(updated);
    setSelectedCapaForClose(null);
  };

  const handleCreateCapa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hallazgo.trim() || !accionPropuesta.trim()) return;

    const newCapa: CorrectiveAction = {
      id: `capa-${Date.now()}`,
      codigo: `CAPA-2026-${String(correctiveActions.length + 1).padStart(3, '0')}`,
      origen,
      referenciaOrigenId: 'MANUAL',
      hallazgoProblema: hallazgo.trim(),
      clausulaISO: '10.2',
      causaRaizIdentificada: causaRaiz.trim() || 'Pendiente de análisis causal 5 Porqués.',
      accionCorrectivaPropuesta: accionPropuesta.trim(),
      responsableImplementacion: responsable.trim() || 'Supervisor de Área',
      fechaCompromiso,
      estado: 'ABIERTA',
      esCritica,
      sede: selectedSede === 'TODAS' ? 'SEDE_CENTRAL_LURIN' : selectedSede
    };

    saveCorrectiveAction(newCapa);
    setShowCreateModal(false);
  };

  const totalAbiertas = correctiveActions.filter(c => c.estado === 'ABIERTA' || c.estado === 'EN_PROCESO').length;
  const totalCriticas = correctiveActions.filter(c => c.esCritica && c.estado !== 'VERIFICADA_EFICAZ').length;
  const totalCerradas = correctiveActions.filter(c => c.estado === 'VERIFICADA_EFICAZ').length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">Acciones Correctivas (CAPA Centralizada)</h1>
            <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
              ISO 45001 Cl. 10.2 · No Conformidades &amp; Mejora Continua
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Módulo centralizado para el tratamiento sistemático de causas raíz de hallazgos derivados de inspecciones operativas, auditorías, accidentes y evaluaciones legales.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Aperturar Nueva Acción CAPA
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span>Acciones en Curso / Abiertas</span>
            <Clock className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">{totalAbiertas}</span>
            <span className="text-slate-400 text-[11px] font-mono">de {correctiveActions.length}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Con plazos de entrega comprometidos</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span>Hallazgos Críticos Pendientes</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-400 tabular-nums">{totalCriticas}</span>
            <span className="text-rose-400/80 text-[11px] font-mono">Alta prioridad</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Afectan seguridad química de procesos</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span>Verificadas y Eficaces</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">{totalCerradas}</span>
            <span className="text-emerald-400/80 text-[11px] font-mono">Cierre verificado</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Con evidencia documentada conforme</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por código, problema o responsable..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white placeholder-slate-500 focus:outline-hidden font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-500" /> Origen:
          </span>
          <select
            value={filterOrigen}
            onChange={(e) => setFilterOrigen(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 focus:outline-hidden font-mono"
          >
            <option value="TODOS">Todos los Orígenes</option>
            <option value="INSPECCION">Inspección Operativa</option>
            <option value="AUDITORIA">Auditoría ISO 45001</option>
            <option value="ACCIDENTE_INCIDENTE">Accidente / Incidente</option>
            <option value="EVALUACION_LEGAL">Evaluación Legal</option>
          </select>

          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 focus:outline-hidden font-mono"
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="ABIERTA">Abierta</option>
            <option value="EN_PROCESO">En Proceso</option>
            <option value="VERIFICADA_EFICAZ">Verificada Eficaz</option>
            <option value="VENCIDA">Vencida</option>
          </select>
        </div>
      </div>

      {/* Tabla CAPA */}
      <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400">
              <tr>
                <th className="px-3 py-3">Código</th>
                <th className="px-3 py-3">Origen &amp; Ref.</th>
                <th className="px-4 py-3">Hallazgo / Desvío Detectado</th>
                <th className="px-4 py-3">Acción Correctiva Propuesta</th>
                <th className="px-3 py-3">Responsable</th>
                <th className="px-3 py-3">Fecha Compromiso</th>
                <th className="px-3 py-3">Estado</th>
                <th className="px-3 py-3 text-right">Verificación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredCapa.map((capa) => (
                <tr key={capa.id} className="hover:bg-slate-850/60 transition-colors">
                  <td className="px-3 py-3 font-mono font-semibold text-orange-400 whitespace-nowrap">
                    {capa.codigo}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className="font-semibold text-white block">{capa.origen.replace(/_/g, ' ')}</span>
                    <span className="font-mono text-[10px] text-slate-500">Ref: {capa.referenciaOrigenId}</span>
                  </td>
                  <td className="px-4 py-3 max-w-sm">
                    <div className="flex items-center gap-1.5">
                      {capa.esCritica && (
                        <span className="px-1 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-mono font-bold shrink-0">
                          CRÍTICA
                        </span>
                      )}
                      <p className="font-medium text-slate-200 leading-tight">{capa.hallazgoProblema}</p>
                    </div>
                    {capa.causaRaizIdentificada && (
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 font-mono">
                        Causa Raíz: {capa.causaRaizIdentificada}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 max-w-sm text-slate-300 text-[11px] leading-relaxed">
                    {capa.accionCorrectivaPropuesta}
                  </td>
                  <td className="px-3 py-3 text-slate-300 whitespace-nowrap">
                    {capa.responsableImplementacion}
                  </td>
                  <td className="px-3 py-3 font-mono text-slate-300 whitespace-nowrap">
                    {capa.fechaCompromiso}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <StatusBadge status={capa.estado} />
                  </td>
                  <td className="px-3 py-3 text-right whitespace-nowrap">
                    {capa.estado === 'VERIFICADA_EFICAZ' ? (
                      <span className="text-[11px] font-mono text-emerald-400 flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Cerrada
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedCapaForClose(capa);
                          setEvidenciaCierre('');
                          setComentariosVerif('');
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded shadow-xs transition-colors inline-flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Verificar Eficacia
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Verificación de Eficacia */}
      {selectedCapaForClose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-6 space-y-4 text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-semibold text-white">Verificación de Eficacia y Cierre CAPA</h3>
                <p className="text-slate-400 font-mono text-[11px]">{selectedCapaForClose.codigo}</p>
              </div>
              <button onClick={() => setSelectedCapaForClose(null)} className="text-slate-400 hover:text-white">&times;</button>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-1">
              <span className="font-semibold text-slate-200">Hallazgo:</span>
              <p className="text-slate-300">{selectedCapaForClose.hallazgoProblema}</p>
              <span className="font-semibold text-orange-400 block pt-1">Acción Ejecutada:</span>
              <p className="text-slate-300">{selectedCapaForClose.accionCorrectivaPropuesta}</p>
            </div>

            <form onSubmit={handleVerifyEfficacy} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">
                  Evidencia Documentada de Cierre Físico / Operativo *
                </label>
                <textarea
                  required
                  rows={2}
                  value={evidenciaCierre}
                  onChange={(e) => setEvidenciaCierre(e.target.value)}
                  placeholder="Detalle fotos, orden de trabajo de mantenimiento ejecutada o acta de reunión..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">
                  Dictamen de Verificación de Eficacia (Sin Recurrencia) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={comentariosVerif}
                  onChange={(e) => setComentariosVerif(e.target.value)}
                  placeholder="Comprobado en campo que la causa raíz fue eliminada eficazmente..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-slate-400">
                Auditor / Validador: <strong className="text-white">{currentUser.name}</strong> ({currentUser.role})
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedCapaForClose(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded"
                >
                  Confirmar Cierre y Eficacia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Apertura Nueva Acción */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-6 space-y-4 text-xs animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <h3 className="text-base font-semibold text-white">Apertura Formal de Acción Correctiva (CAPA)</h3>

            <form onSubmit={handleCreateCapa} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Origen del Hallazgo *</label>
                <select
                  value={origen}
                  onChange={(e) => setOrigen(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                >
                  <option value="INSPECCION">Inspección de Seguridad</option>
                  <option value="AUDITORIA">Auditoría Interna/Externa</option>
                  <option value="ACCIDENTE_INCIDENTE">Accidente o Incidente</option>
                  <option value="EVALUACION_LEGAL">Evaluación de Requisito Legal</option>
                  <option value="COMITE_SST">Reunión del Comité Paritario SST</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Descripción del Hallazgo / No Conformidad *</label>
                <textarea
                  required
                  rows={2}
                  value={hallazgo}
                  onChange={(e) => setHallazgo(e.target.value)}
                  placeholder="Describa el hecho y la desviación respecto al estándar o procedimiento..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Causa Raíz Identificada</label>
                <textarea
                  rows={2}
                  value={causaRaiz}
                  onChange={(e) => setCausaRaiz(e.target.value)}
                  placeholder="Resultado del análisis causal 5 Porqués..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Acción Correctiva Propuesta (5W2H) *</label>
                <textarea
                  required
                  rows={2}
                  value={accionPropuesta}
                  onChange={(e) => setAccionPropuesta(e.target.value)}
                  placeholder="Detalle la medida técnica o administrativa para eliminar la causa raíz..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Responsable de Implementación *</label>
                  <input
                    type="text"
                    required
                    value={responsable}
                    onChange={(e) => setResponsable(e.target.value)}
                    placeholder="Ej: Jefe de Mantenimiento"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Fecha Compromiso *</label>
                  <input
                    type="date"
                    required
                    value={fechaCompromiso}
                    onChange={(e) => setFechaCompromiso(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="esCritica"
                  checked={esCritica}
                  onChange={(e) => setEsCritica(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-orange-500 focus:ring-0"
                />
                <label htmlFor="esCritica" className="text-slate-300 font-mono text-[11px]">
                  Marcar como Hallazgo Crítico (Afecta directamente la contención química de planta)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded"
                >
                  Aperturar CAPA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
