/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MÓDULO 12: AUDITORÍAS SSOMA
 * Auditorías Internas y Externas alineadas a las cláusulas 4 a 10 de ISO 45001:2018.
 * Checklist interactivo con generación directa de Acciones Correctivas (CAPA).
 */

import React, { useState } from 'react';
import { useSSOMA } from '../../context/SSOMAContext';
import { AuditRecord, AuditChecklistQuestion, CorrectiveAction } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  FileText,
  ShieldCheck,
  ClipboardList,
  AlertOctagon,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const AuditoriasModule: React.FC = () => {
  const {
    audits,
    auditChecklist,
    saveAuditChecklistItem,
    saveCorrectiveAction,
    currentUser,
    selectedSede
  } = useSSOMA();

  const [activeTab, setActiveTab] = useState<'PROGRAMA' | 'CHECKLIST_ISO'>('PROGRAMA');
  const [selectedAudit, setSelectedAudit] = useState<AuditRecord | null>(null);

  // Filtros del Checklist ISO
  const [checklistSearch, setChecklistSearch] = useState('');
  const [checklistFilter, setChecklistFilter] = useState<string>('TODOS');

  // Modal para Nueva Pregunta / Requisito
  const [showNewQuestionModal, setShowNewQuestionModal] = useState(false);
  const [newClausula, setNewClausula] = useState('6.1');
  const [newRequisito, setNewRequisito] = useState('');
  const [newPregunta, setNewPregunta] = useState('');
  const [newResultado, setNewResultado] = useState<'CONFORME' | 'NO_CONFORMIDAD_MENOR' | 'NO_CONFORMIDAD_MAYOR' | 'OPORTUNIDAD_MEJORA'>('CONFORME');
  const [newEvidencia, setNewEvidencia] = useState('');

  // Modal para Generar CAPA desde Hallazgo de Auditoría
  const [capaTarget, setCapaTarget] = useState<AuditChecklistQuestion | null>(null);
  const [capaCausaRaiz, setCapaCausaRaiz] = useState('');
  const [capaAccion, setCapaAccion] = useState('');
  const [capaResponsable, setCapaResponsable] = useState('Ing. Manuel Vega - Supervisor SSOMA');
  const [capaFechaCompromiso, setCapaFechaCompromiso] = useState(
    new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
  );
  const [capaExitoMsg, setCapaExitoMsg] = useState<string | null>(null);

  // Cláusulas ISO 45001 evaluadas
  const isoClauses = [
    { num: '4', title: 'Contexto de la Organización', desc: 'Comprensión de la organización, partes interesadas y alcance SSOMA.' },
    { num: '5', title: 'Liderazgo y Participación de los Trabajadores', desc: 'Compromiso de la Alta Dirección, política y consulta paritaria.' },
    { num: '6', title: 'Planificación', desc: 'Identificación de peligros (IPERC), requisitos legales y objetivos SST.' },
    { num: '7', title: 'Apoyo', desc: 'Recursos, competencias, toma de conciencia e información documentada.' },
    { num: '8', title: 'Operación', desc: 'Eliminación de peligros, gestión del cambio y respuesta ante emergencias químicas.' },
    { num: '9', title: 'Evaluación del Desempeño', desc: 'Seguimiento, medición, análisis, auditoría interna y revisión por la dirección.' },
    { num: '10', title: 'Mejora', desc: 'Incidentes, no conformidades, acciones correctivas CAPA y mejora continua.' }
  ];

  // Métricas del Checklist ISO
  const totalItems = auditChecklist.length;
  const conformes = auditChecklist.filter(i => i.hallazgoResultado === 'CONFORME').length;
  const ncMenores = auditChecklist.filter(i => i.hallazgoResultado === 'NO_CONFORMIDAD_MENOR').length;
  const ncMayores = auditChecklist.filter(i => i.hallazgoResultado === 'NO_CONFORMIDAD_MAYOR').length;
  const oportunidades = auditChecklist.filter(i => i.hallazgoResultado === 'OPORTUNIDAD_MEJORA').length;
  const cumplimientoISO = totalItems > 0 ? Math.round((conformes / totalItems) * 100) : 0;

  const filteredChecklist = auditChecklist.filter(item => {
    if (checklistFilter !== 'TODOS' && item.hallazgoResultado !== checklistFilter) return false;
    if (checklistSearch) {
      const q = checklistSearch.toLowerCase();
      return (
        item.clausula.toLowerCase().includes(q) ||
        item.requisitoISO.toLowerCase().includes(q) ||
        item.preguntaAuditoria.toLowerCase().includes(q) ||
        item.evidenciaObjetiva.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleUpdateChecklistResult = (
    item: AuditChecklistQuestion,
    resultado: 'CONFORME' | 'NO_CONFORMIDAD_MENOR' | 'NO_CONFORMIDAD_MAYOR' | 'OPORTUNIDAD_MEJORA'
  ) => {
    saveAuditChecklistItem({
      ...item,
      hallazgoResultado: resultado
    });
  };

  const handleCreateChecklistQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequisito.trim() || !newPregunta.trim()) return;

    const newQuestion: AuditChecklistQuestion = {
      id: `iso-chk-${Date.now()}`,
      clausula: newClausula.trim(),
      requisitoISO: newRequisito.trim(),
      preguntaAuditoria: newPregunta.trim(),
      hallazgoResultado: newResultado,
      evidenciaObjetiva: newEvidencia.trim() || 'Verificación en campo por auditor interno.'
    };

    saveAuditChecklistItem(newQuestion);
    setNewRequisito('');
    setNewPregunta('');
    setNewEvidencia('');
    setShowNewQuestionModal(false);
  };

  const handleOpenCapaModal = (item: AuditChecklistQuestion) => {
    setCapaTarget(item);
    setCapaCausaRaiz(`Falla en control operacional conforme a Cláusula ${item.clausula} de ISO 45001: ${item.requisitoISO}.`);
    setCapaAccion(`Implementar procedimiento documentado y capacitación para corregir el desvío en Cláusula ${item.clausula}.`);
    setCapaExitoMsg(null);
  };

  const handleGenerateCAPA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capaTarget) return;

    const newCAPA: CorrectiveAction = {
      id: `capa-${Date.now()}`,
      codigo: `CAPA-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      origen: 'AUDITORIA',
      referenciaOrigenId: capaTarget.id,
      hallazgoProblema: `Hallazgo en Cláusula ISO ${capaTarget.clausula} (${capaTarget.requisitoISO}): ${capaTarget.evidenciaObjetiva}`,
      clausulaISO: capaTarget.clausula,
      causaRaizIdentificada: capaCausaRaiz.trim(),
      accionCorrectivaPropuesta: capaAccion.trim(),
      responsableImplementacion: capaResponsable.trim(),
      fechaCompromiso: capaFechaCompromiso,
      estado: 'ABIERTA',
      esCritica: capaTarget.hallazgoResultado === 'NO_CONFORMIDAD_MAYOR',
      sede: selectedSede === 'TODAS' ? 'SEDE_CENTRAL_LURIN' : selectedSede
    };

    saveCorrectiveAction(newCAPA);
    setCapaExitoMsg(`¡Acción Correctiva ${newCAPA.codigo} generada exitosamente y registrada en el Módulo 13 (CAPA)!`);
    setTimeout(() => {
      setCapaTarget(null);
      setCapaExitoMsg(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">Auditorías del Sistema de Gestión SSOMA</h1>
            <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
              ISO 45001 Cl. 9.2 · D.S. 005-2012-TR Art. 43
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Planificación de auditorías internas y externas, evaluación de requisitos de las cláusulas 4 a 10 de ISO 45001:2018 y vinculación directa con el plan de Acciones Correctivas (CAPA).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'CHECKLIST_ISO' && (
            <button
              onClick={() => setShowNewQuestionModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded shadow-sm transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              Agregar Requisito de Auditoría
            </button>
          )}
        </div>
      </div>

      {/* Subtabs de Navegación */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('PROGRAMA')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded transition-colors ${
            activeTab === 'PROGRAMA'
              ? 'bg-slate-800 text-orange-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          Programa de Auditorías ({audits.length})
        </button>
        <button
          onClick={() => setActiveTab('CHECKLIST_ISO')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded transition-colors ${
            activeTab === 'CHECKLIST_ISO'
              ? 'bg-slate-800 text-orange-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          Lista de Verificación ISO 45001:2018 ({auditChecklist.length})
        </button>
      </div>

      {/* VISTA 1: PROGRAMA DE AUDITORÍAS */}
      {activeTab === 'PROGRAMA' && (
        <div className="space-y-6">
          {/* Cláusulas ISO 45001 Informativas */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
            <span className="text-xs font-semibold text-white uppercase font-mono tracking-wider block">
              Estructura de Alto Nivel ISO 45001:2018 (Cláusulas Auditables)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {isoClauses.map((cl) => (
                <div
                  key={cl.num}
                  className="p-2.5 bg-slate-950 border border-slate-800 rounded hover:border-orange-500/50 transition-colors"
                >
                  <span className="text-xs font-mono font-bold text-orange-400 block">Cláusula {cl.num}</span>
                  <p className="text-[11px] font-semibold text-slate-200 mt-0.5 truncate">{cl.title}</p>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{cl.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tabla de Auditorías */}
          <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400">
                  <tr>
                    <th className="px-3 py-3">Código</th>
                    <th className="px-3 py-3">Tipo de Auditoría</th>
                    <th className="px-4 py-3">Alcance y Procesos Auditados</th>
                    <th className="px-3 py-3">Criterios</th>
                    <th className="px-3 py-3">Periodo</th>
                    <th className="px-3 py-3">Auditor Líder</th>
                    <th className="px-3 py-3 text-center">Hallazgos (NC / OM)</th>
                    <th className="px-3 py-3">Estado</th>
                    <th className="px-3 py-3 text-right">Detalle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {audits.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-850/60 transition-colors">
                      <td className="px-3 py-3 font-mono font-semibold text-orange-400 whitespace-nowrap">
                        {a.codigo}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap font-medium text-white">
                        {a.tipo.replace(/_/g, ' ')}
                      </td>
                      <td className="px-4 py-3 max-w-sm text-slate-200">
                        {a.alcance}
                      </td>
                      <td className="px-3 py-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {a.criteriosNormativos.join(', ')}
                      </td>
                      <td className="px-3 py-3 font-mono text-slate-300 whitespace-nowrap">
                        {a.fechaInicio} al {a.fechaFin}
                      </td>
                      <td className="px-3 py-3 text-slate-300 whitespace-nowrap">
                        {a.auditorLider}
                      </td>
                      <td className="px-3 py-3 text-center font-mono whitespace-nowrap">
                        {a.estado === 'CERRADA' ? (
                          <span className="text-slate-300">
                            <strong className="text-rose-400">{a.hallazgosConteo.noConformidadMayor} NC May</strong> ·{' '}
                            <strong className="text-amber-400">{a.hallazgosConteo.noConformidadMenor} NC Men</strong> ·{' '}
                            <strong className="text-sky-400">{a.hallazgosConteo.oportunidadMejora} OM</strong>
                          </span>
                        ) : (
                          <span className="text-slate-500 font-mono">Planificada</span>
                        )}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <StatusBadge status={a.estado} />
                      </td>
                      <td className="px-3 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedAudit(a)}
                          className="px-2.5 py-1 text-[11px] font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors"
                        >
                          Ver Plan
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 2: LISTA DE VERIFICACIÓN INTERACTIVA ISO 45001 */}
      {activeTab === 'CHECKLIST_ISO' && (
        <div className="space-y-5">
          {/* Dashboard Resumen de Conformidad */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">Total Evaluados</span>
              <span className="text-xl font-bold font-mono text-white tabular-nums">{totalItems}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Requisitos auditables</span>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">Conformes</span>
              <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">{conformes} ({cumplimientoISO}%)</span>
              <span className="text-[10px] text-emerald-400/80 block mt-0.5">Conformidad plena</span>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">NC Menores</span>
              <span className="text-xl font-bold font-mono text-amber-400 tabular-nums">{ncMenores}</span>
              <span className="text-[10px] text-amber-400/80 block mt-0.5">Requieren CAPA</span>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">NC Mayores</span>
              <span className="text-xl font-bold font-mono text-rose-400 tabular-nums">{ncMayores}</span>
              <span className="text-[10px] text-rose-400/80 block mt-0.5">Riesgo crítico de auditoría</span>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">Oportunidades</span>
              <span className="text-xl font-bold font-mono text-sky-400 tabular-nums">{oportunidades}</span>
              <span className="text-[10px] text-sky-400/80 block mt-0.5">Mejora continua</span>
            </div>
          </div>

          {/* Filtros y Búsqueda */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por cláusula, requisito o evidencia objetiva..."
                value={checklistSearch}
                onChange={(e) => setChecklistSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white placeholder-slate-500 focus:outline-hidden font-mono"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Filter className="w-3.5 h-3.5 text-slate-500" /> Dictamen:
              </span>
              <select
                value={checklistFilter}
                onChange={(e) => setChecklistFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 focus:outline-hidden font-mono"
              >
                <option value="TODOS">Todos los Dictámenes</option>
                <option value="CONFORME">Conforme</option>
                <option value="NO_CONFORMIDAD_MENOR">No Conformidad Menor</option>
                <option value="NO_CONFORMIDAD_MAYOR">No Conformidad Mayor</option>
                <option value="OPORTUNIDAD_MEJORA">Oportunidad de Mejora</option>
              </select>
            </div>
          </div>

          {/* Lista de Requisitos Evaluados */}
          <div className="space-y-3">
            {filteredChecklist.map((item) => {
              const isNonConformity = item.hallazgoResultado === 'NO_CONFORMIDAD_MENOR' || item.hallazgoResultado === 'NO_CONFORMIDAD_MAYOR';

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    item.hallazgoResultado === 'NO_CONFORMIDAD_MAYOR'
                      ? 'bg-rose-950/20 border-rose-800/80'
                      : item.hallazgoResultado === 'NO_CONFORMIDAD_MENOR'
                      ? 'bg-amber-950/20 border-amber-800/80'
                      : item.hallazgoResultado === 'OPORTUNIDAD_MEJORA'
                      ? 'bg-sky-950/20 border-sky-800/80'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-xs font-mono font-bold rounded bg-slate-950 text-orange-400 border border-slate-800">
                          Cláusula {item.clausula}
                        </span>
                        <h4 className="text-sm font-semibold text-white">{item.requisitoISO}</h4>
                      </div>

                      <p className="text-xs text-slate-300 font-mono bg-slate-950/60 p-2.5 rounded border border-slate-800/50">
                        <strong className="text-slate-400">Pregunta Auditor: </strong>
                        {item.preguntaAuditoria}
                      </p>

                      <div className="text-xs text-slate-300 pt-1">
                        <span className="font-semibold text-slate-400 font-mono text-[11px] block">Evidencia Objetiva Verificada:</span>
                        <p className="italic text-slate-200 mt-0.5">{item.evidenciaObjetiva}</p>
                      </div>
                    </div>

                    {/* Dictamen y Acción Inmediata */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <select
                          value={item.hallazgoResultado}
                          onChange={(e) => handleUpdateChecklistResult(item, e.target.value as any)}
                          className={`px-2.5 py-1 text-xs font-mono font-bold rounded border focus:outline-hidden ${
                            item.hallazgoResultado === 'CONFORME'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : item.hallazgoResultado === 'NO_CONFORMIDAD_MAYOR'
                              ? 'bg-rose-950 text-rose-300 border-rose-800'
                              : item.hallazgoResultado === 'NO_CONFORMIDAD_MENOR'
                              ? 'bg-amber-950 text-amber-300 border-amber-800'
                              : 'bg-sky-950 text-sky-300 border-sky-800'
                          }`}
                        >
                          <option value="CONFORME">CONFORME</option>
                          <option value="NO_CONFORMIDAD_MENOR">NO CONFORMIDAD MENOR</option>
                          <option value="NO_CONFORMIDAD_MAYOR">NO CONFORMIDAD MAYOR</option>
                          <option value="OPORTUNIDAD_MEJORA">OPORTUNIDAD DE MEJORA</option>
                        </select>
                      </div>

                      {/* Botón de Generar CAPA si es No Conformidad */}
                      {isNonConformity && (
                        <button
                          onClick={() => handleOpenCapaModal(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded font-mono text-xs font-semibold shadow-xs transition-colors"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Generar CAPA Inmediata
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: GENERAR ACCIÓN CORRECTIVA (CAPA) DESDE HALLAZGO */}
      {capaTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-6 space-y-4 text-xs animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-semibold text-white">Generar Acción Correctiva (CAPA)</h3>
                <p className="text-orange-400 font-mono text-[11px]">
                  Origen: Auditoría ISO 45001 · Cláusula {capaTarget.clausula} ({capaTarget.hallazgoResultado.replace(/_/g, ' ')})
                </p>
              </div>
              <button onClick={() => setCapaTarget(null)} className="text-slate-400 hover:text-white">&times;</button>
            </div>

            {capaExitoMsg ? (
              <div className="p-4 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="font-semibold text-sm">{capaExitoMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleGenerateCAPA} className="space-y-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500">Hallazgo de Auditoría:</span>
                  <p className="text-slate-200">{capaTarget.evidenciaObjetiva}</p>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Causa Raíz Identificada *</label>
                  <textarea
                    required
                    rows={2}
                    value={capaCausaRaiz}
                    onChange={(e) => setCapaCausaRaiz(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Acción Correctiva Propuesta *</label>
                  <textarea
                    required
                    rows={2}
                    value={capaAccion}
                    onChange={(e) => setCapaAccion(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Responsable Implementación</label>
                    <input
                      type="text"
                      required
                      value={capaResponsable}
                      onChange={(e) => setCapaResponsable(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Fecha Compromiso</label>
                    <input
                      type="date"
                      required
                      value={capaFechaCompromiso}
                      onChange={(e) => setCapaFechaCompromiso(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCapaTarget(null)}
                    className="px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded"
                  >
                    Registrar CAPA Oficial
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: REGISTRAR NUEVO REQUISITO EN CHECKLIST */}
      {showNewQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-6 space-y-4 text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-semibold text-white">Nuevo Requisito para Checklist ISO 45001</h3>
              <button onClick={() => setShowNewQuestionModal(false)} className="text-slate-400 hover:text-white">&times;</button>
            </div>

            <form onSubmit={handleCreateChecklistQuestion} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Cláusula ISO *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 8.1.2"
                    value={newClausula}
                    onChange={(e) => setNewClausula(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dictamen Inicial</label>
                  <select
                    value={newResultado}
                    onChange={(e) => setNewResultado(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  >
                    <option value="CONFORME">Conforme</option>
                    <option value="NO_CONFORMIDAD_MENOR">No Conformidad Menor</option>
                    <option value="NO_CONFORMIDAD_MAYOR">No Conformidad Mayor</option>
                    <option value="OPORTUNIDAD_MEJORA">Oportunidad de Mejora</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Título del Requisito ISO *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Jerarquía de los Controles Operacionales"
                  value={newRequisito}
                  onChange={(e) => setNewRequisito(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pregunta Guía de Auditoría *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="¿Cómo se aplica la eliminación, sustitución y controles de ingeniería en el trasvase de químicos?"
                  value={newPregunta}
                  onChange={(e) => setNewPregunta(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Evidencia Objetiva Verificada</label>
                <textarea
                  rows={2}
                  placeholder="Detallar registros, informes, PETS o inspecciones constatadas..."
                  value={newEvidencia}
                  onChange={(e) => setNewEvidencia(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewQuestionModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded"
                >
                  Guardar en Checklist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalle de Auditoría */}
      {selectedAudit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-6 space-y-4 text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-semibold text-white">{selectedAudit.codigo}</h3>
                <p className="text-slate-400 font-mono text-[11px]">Plan y Criterios de Auditoría</p>
              </div>
              <button onClick={() => setSelectedAudit(null)} className="text-slate-400 hover:text-white">&times;</button>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-1">
              <span className="font-semibold text-white block">Alcance Formal:</span>
              <p className="text-slate-300 leading-relaxed">{selectedAudit.alcance}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-slate-300">
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded">
                <span className="text-slate-500 block text-[10px]">Auditor Líder:</span>
                <span>{selectedAudit.auditorLider}</span>
              </div>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded">
                <span className="text-slate-500 block text-[10px]">Equipo Auditor:</span>
                <span>{selectedAudit.equipoAuditor.join(', ')}</span>
              </div>
            </div>

            {selectedAudit.estado === 'CERRADA' && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-2">
                <span className="font-semibold text-orange-400 block font-mono">Resumen de Hallazgos Auditados:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-emerald-400 block font-bold text-base">{selectedAudit.hallazgosConteo.conformidades}</span>
                    <span className="text-slate-400">Requisitos Conformes</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-amber-400 block font-bold text-base">{selectedAudit.hallazgosConteo.noConformidadMenor}</span>
                    <span className="text-slate-400">No Conformidades Menores</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedAudit(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded font-semibold text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
