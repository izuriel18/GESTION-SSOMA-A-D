/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MÓDULO 07: SALUD OCUPACIONAL
 * Vigilancia Médica Ocupacional (EMOs, Aptitud, Restricciones) y
 * Evaluaciones Ergonómicas por Puestos Químicos (R.M. 375-2008-TR).
 * Estricta protección de confidencialidad de diagnósticos médicos (R.M. 312-2011-MINSA).
 */

import React, { useState } from 'react';
import { useSSOMA } from '../../context/SSOMAContext';
import { OccupationalMedicalExam, ErgonomicAssessment } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  HeartPulse,
  Lock,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Activity,
  FileText,
  ShieldCheck,
  Plus,
  Scale,
  Brain,
  Wrench
} from 'lucide-react';

export const SaludOcupacionalModule: React.FC = () => {
  const { medicalExams, ergonomicAssessments, saveErgonomicAssessment, selectedSede } = useSSOMA();

  const [activeTab, setActiveTab] = useState<'EMO' | 'ERGONOMIA'>('EMO');

  // Filtros EMO
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAptitud, setFilterAptitud] = useState<string>('TODOS');

  // Filtros Ergonomía
  const [ergoSearch, setErgoSearch] = useState('');
  const [ergoMetodo, setErgoMetodo] = useState<string>('TODOS');
  const [showNewErgoModal, setShowNewErgoModal] = useState(false);

  // Formulario Nueva Evaluación Ergonómica
  const [puestoTrabajo, setPuestoTrabajo] = useState('');
  const [area, setArea] = useState('');
  const [tareaEvaluada, setTareaEvaluada] = useState('');
  const [metodo, setMetodo] = useState<'REBA' | 'RULA' | 'NIOSH_ECUACION' | 'CHECKLIST_OCRA'>('REBA');
  const [puntuacion, setPuntuacion] = useState(6);
  const [nivelRiesgo, setNivelRiesgo] = useState<'INAPRECIABLE' | 'BAJO' | 'MEDIO' | 'ALTO' | 'MUY_ALTO'>('MEDIO');
  const [factor1, setFactor1] = useState('');
  const [medida1, setMedida1] = useState('');
  const [evaluador, setEvaluador] = useState('Lic. Renzo Paredes - Especialista Ergonomía');

  const filteredExams = medicalExams.filter(e => {
    if (filterAptitud !== 'TODOS' && e.aptitud !== filterAptitud) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        e.nombreTrabajador.toLowerCase().includes(q) ||
        e.dni.includes(q) ||
        e.puestoTrabajo.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalAptos = medicalExams.filter(e => e.aptitud === 'APTO').length;
  const conRestricciones = medicalExams.filter(e => e.aptitud === 'APTO_CON_RESTRICCIONES').length;

  const filteredErgo = ergonomicAssessments.filter(e => {
    if (ergoMetodo !== 'TODOS' && e.metodo !== ergoMetodo) return false;
    if (ergoSearch) {
      const q = ergoSearch.toLowerCase();
      return (
        e.puestoTrabajo.toLowerCase().includes(q) ||
        e.area.toLowerCase().includes(q) ||
        e.tareaEvaluada.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateErgonomic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!puestoTrabajo.trim() || !tareaEvaluada.trim()) return;

    const newAssessment: ErgonomicAssessment = {
      id: `ergo-${Date.now()}`,
      puestoTrabajo: puestoTrabajo.trim(),
      area: area.trim() || 'Área Operativa',
      tareaEvaluada: tareaEvaluada.trim(),
      metodo,
      puntuacionObtenida: Number(puntuacion),
      nivelRiesgo,
      factoresRiesgo: [factor1.trim() || 'Postura forzada mantenida durante ciclo operativo'],
      medidasIngenieriaErgonomica: [medida1.trim() || 'Rotación de puestos y adecuación de plano de trabajo'],
      fechaEvaluacion: new Date().toISOString().split('T')[0],
      evaluador: evaluador.trim()
    };

    saveErgonomicAssessment(newAssessment);
    setPuestoTrabajo('');
    setArea('');
    setTareaEvaluada('');
    setFactor1('');
    setMedida1('');
    setShowNewErgoModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">Salud Ocupacional &amp; Ergonomía</h1>
            <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
              R.M. 312-2011-MINSA · R.M. 375-2008-TR · Ley 29783
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Control de Exámenes Médicos Ocupacionales (EMO), seguimiento de restricciones laborales y evaluaciones ergonómicas por métodos normalizados (REBA, RULA, NIOSH).
          </p>
        </div>

        {/* Confidentiality Trust Marker */}
        <div className="flex items-center gap-2 p-2.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="text-[11px]">
            <p className="font-semibold text-slate-200">Confidencialidad Médica Protegida</p>
            <p className="text-slate-400 text-[10px]">Diagnósticos clínicos en custodia exclusiva del Médico Ocupacional (CMP).</p>
          </div>
        </div>
      </div>

      {/* Subtabs de Navegación */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('EMO')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded transition-colors ${
              activeTab === 'EMO'
                ? 'bg-slate-800 text-orange-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            Vigilancia Médica - EMOs ({medicalExams.length})
          </button>
          <button
            onClick={() => setActiveTab('ERGONOMIA')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded transition-colors ${
              activeTab === 'ERGONOMIA'
                ? 'bg-slate-800 text-orange-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Scale className="w-4 h-4" />
            Evaluaciones Ergonómicas R.M. 375-2008-TR ({ergonomicAssessments.length})
          </button>
        </div>

        {activeTab === 'ERGONOMIA' && (
          <button
            onClick={() => setShowNewErgoModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Evaluación Ergonómica
          </button>
        )}
      </div>

      {/* VISTA 1: EXÁMENES MÉDICOS OCUPACIONALES */}
      {activeTab === 'EMO' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-mono">Total Evaluados</span>
                <span className="text-2xl font-bold font-mono text-white tabular-nums">{medicalExams.length}</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Trabajadores en nómina</p>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded text-slate-400">
                <UserCheck className="w-5 h-5 text-orange-400" />
              </div>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-mono">Aptos 100%</span>
                <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">{totalAptos}</span>
                <p className="text-[11px] text-emerald-400/80 mt-0.5">Sin limitaciones operativas</p>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded text-slate-400">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-mono">Con Restricciones Laborales</span>
                <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">{conRestricciones}</span>
                <p className="text-[11px] text-amber-400/80 mt-0.5">Bajo vigilancia de puesto</p>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded text-slate-400">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por trabajador, DNI o puesto de trabajo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white placeholder-slate-500 focus:outline-hidden font-mono"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Filter className="w-3.5 h-3.5 text-slate-500" /> Dictamen:
              </span>
              <select
                value={filterAptitud}
                onChange={(e) => setFilterAptitud(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 focus:outline-hidden font-mono"
              >
                <option value="TODOS">Todos los Dictámenes</option>
                <option value="APTO">Apto</option>
                <option value="APTO_CON_RESTRICCIONES">Apto con Restricciones</option>
                <option value="NO_APTO_TEMPORAL">No Apto Temporal</option>
              </select>
            </div>
          </div>

          {/* Tabla EMO */}
          <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400">
                  <tr>
                    <th className="px-3 py-3">Código</th>
                    <th className="px-4 py-3">Trabajador &amp; DNI</th>
                    <th className="px-3 py-3">Puesto &amp; Área</th>
                    <th className="px-3 py-3">Tipo EMO</th>
                    <th className="px-3 py-3">Fecha Examen</th>
                    <th className="px-3 py-3">Vigencia EMO</th>
                    <th className="px-3 py-3">Aptitud Laboral</th>
                    <th className="px-4 py-3">Restricciones Operativas Notificadas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredExams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-slate-850/60 transition-colors">
                      <td className="px-3 py-3 font-mono font-semibold text-orange-400 whitespace-nowrap">
                        {exam.codigoTrabajador}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-white">{exam.nombreTrabajador}</p>
                        <p className="text-[11px] font-mono text-slate-400">DNI: {exam.dni}</p>
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-slate-200">{exam.puestoTrabajo}</p>
                        <p className="text-[11px] text-slate-400">{exam.area}</p>
                      </td>
                      <td className="px-3 py-3 font-mono text-slate-300">
                        {exam.tipoEMO}
                      </td>
                      <td className="px-3 py-3 font-mono text-slate-400">
                        {exam.fechaExamen}
                      </td>
                      <td className="px-3 py-3 font-mono text-slate-300">
                        {exam.fechaVencimiento}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <StatusBadge status={exam.aptitud} />
                      </td>
                      <td className="px-4 py-3 max-w-sm">
                        {exam.restriccionesLaborales.length > 0 ? (
                          <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-amber-300">
                            {exam.restriccionesLaborales.map((r, idx) => (
                              <li key={idx}>{r}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-mono">Sin restricciones reportadas</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 2: EVALUACIONES ERGONÓMICAS */}
      {activeTab === 'ERGONOMIA' && (
        <div className="space-y-6">
          {/* Banner Normativo de Ergonomía */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-600/20 text-orange-400 border border-orange-500/30 rounded">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Norma Básica de Ergonomía R.M. 375-2008-TR</h4>
                <p className="text-slate-400 mt-0.5">
                  Límite máximo de carga manual para varones en industria: 25 kg. Evaluación biomecánica de manipulación de sacos y pipeteo químico repetitivo.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-slate-300 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] shrink-0">
              Métodos Validados: REBA · RULA · NIOSH
            </span>
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar puesto, área o tarea ergonómica..."
                value={ergoSearch}
                onChange={(e) => setErgoSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white placeholder-slate-500 focus:outline-hidden font-mono"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Filter className="w-3.5 h-3.5 text-slate-500" /> Método:
              </span>
              <select
                value={ergoMetodo}
                onChange={(e) => setErgoMetodo(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 focus:outline-hidden font-mono"
              >
                <option value="TODOS">Todos los Métodos</option>
                <option value="REBA">REBA (Cuerpo Entero / Carga)</option>
                <option value="RULA">RULA (Extremidad Superior)</option>
                <option value="NIOSH_ECUACION">NIOSH (Ecuación de Levantamiento)</option>
                <option value="CHECKLIST_OCRA">OCRA (Movimiento Repetitivo)</option>
              </select>
            </div>
          </div>

          {/* Tarjetas de Evaluaciones Ergonómicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredErgo.map((ergo) => (
              <div
                key={ergo.id}
                className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 text-xs font-mono font-bold rounded bg-slate-950 text-orange-400 border border-slate-800">
                      Método {ergo.metodo} · Puntaje {ergo.puntuacionObtenida}
                    </span>
                    <h3 className="text-base font-semibold text-white mt-1.5">{ergo.puestoTrabajo}</h3>
                    <p className="text-xs text-slate-400">{ergo.area}</p>
                  </div>

                  <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                    ergo.nivelRiesgo === 'ALTO' || ergo.nivelRiesgo === 'MUY_ALTO'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : ergo.nivelRiesgo === 'MEDIO'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    Riesgo {ergo.nivelRiesgo}
                  </span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800/80 rounded space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500">Tarea Específica Evaluada:</span>
                  <p className="text-xs text-slate-200 leading-relaxed">{ergo.tareaEvaluada}</p>
                </div>

                {/* Factores de Riesgo */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">
                    Factores Biomecánicos Identificados:
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-slate-300">
                    {ergo.factoresRiesgo.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                {/* Medidas de Ingeniería Ergonómica */}
                <div className="space-y-1.5 p-3 bg-slate-950/70 border border-slate-800 rounded">
                  <span className="text-[10px] uppercase font-mono text-emerald-400 font-semibold flex items-center gap-1">
                    <Wrench className="w-3.5 h-3.5" />
                    Controles de Ingeniería Implementados:
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-slate-300">
                    {ergo.medidasIngenieriaErgonomica.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Evaluador: {ergo.evaluador}</span>
                  <span>Fecha: {ergo.fechaEvaluacion}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: NUEVA EVALUACIÓN ERGONÓMICA */}
      {showNewErgoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-6 space-y-4 text-xs animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-semibold text-white">Registro de Evaluación Ergonómica (R.M. 375-2008-TR)</h3>
              <button onClick={() => setShowNewErgoModal(false)} className="text-slate-400 hover:text-white">&times;</button>
            </div>

            <form onSubmit={handleCreateErgonomic} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Puesto de Trabajo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Operador de Envasado"
                    value={puestoTrabajo}
                    onChange={(e) => setPuestoTrabajo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Área / Nave</label>
                  <input
                    type="text"
                    placeholder="Ej: Línea de Embotellado Lurín"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tarea Evaluada *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Detallar movimientos, cargas y posturas (ej. paletizado de bidones de 20 L)..."
                  value={tareaEvaluada}
                  onChange={(e) => setTareaEvaluada(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Método</label>
                  <select
                    value={metodo}
                    onChange={(e) => setMetodo(e.target.value as any)}
                    className="w-full px-2.5 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  >
                    <option value="REBA">REBA</option>
                    <option value="RULA">RULA</option>
                    <option value="NIOSH_ECUACION">NIOSH</option>
                    <option value="CHECKLIST_OCRA">OCRA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Puntaje</label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={puntuacion}
                    onChange={(e) => setPuntuacion(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nivel Riesgo</label>
                  <select
                    value={nivelRiesgo}
                    onChange={(e) => setNivelRiesgo(e.target.value as any)}
                    className="w-full px-2 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono text-[11px]"
                  >
                    <option value="BAJO">Bajo</option>
                    <option value="MEDIO">Medio</option>
                    <option value="ALTO">Alto</option>
                    <option value="MUY_ALTO">Muy Alto</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Factores de Riesgo Biomecánico</label>
                <input
                  type="text"
                  placeholder="Ej: Flexión repetitiva de tronco > 40°, agarre en pinza"
                  value={factor1}
                  onChange={(e) => setFactor1(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Medida de Ingeniería Ergonómica Recomendada</label>
                <input
                  type="text"
                  placeholder="Ej: Instalación de brazo articulado de succión al vacío"
                  value={medida1}
                  onChange={(e) => setMedida1(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Ergónomo / Evaluador</label>
                <input
                  type="text"
                  value={evaluador}
                  onChange={(e) => setEvaluador(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewErgoModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded"
                >
                  Guardar Evaluación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
