/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MÓDULO 03: GESTIÓN DE RIESGOS - IPERC
 * Metodología R.M. 050-2013-TR configurable (Probabilidad × Severidad = Nivel de Riesgo)
 * Jerarquía de Controles y Riesgo Residual.
 */

import React, { useState } from 'react';
import { useSSOMA } from '../../context/SSOMAContext';
import { IPERCRow, RiskLevel } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  AlertTriangle,
  Plus,
  Filter,
  Search,
  Shield,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  FileSpreadsheet,
  Check
} from 'lucide-react';

export const IPERCModule: React.FC = () => {
  const { ipercRows, saveIPERCRow } = useSSOMA();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeligro, setFilterPeligro] = useState<string>('TODOS');
  const [filterNivel, setFilterNivel] = useState<string>('TODOS');
  const [showModal, setShowModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Metodología de Evaluación Configurable
  const [methodologyName, setMethodologyName] = useState('Matriz R.M. 050-2013-TR (4 Factores de Probabilidad)');
  const [criticoThreshold, setCriticoThreshold] = useState(25);
  const [altoThreshold, setAltoThreshold] = useState(17);
  const [medioThreshold, setMedioThreshold] = useState(9);

  // Formulario nuevo IPERC
  const [proceso, setProceso] = useState('');
  const [actividad, setActividad] = useState('');
  const [tarea, setTarea] = useState('');
  const [puesto, setPuesto] = useState('');
  const [tipoPeligro, setTipoPeligro] = useState<'QUIMICO' | 'FISICO' | 'MECANICO' | 'ELECTRICO' | 'ERGONOMICO' | 'LOCATIVO'>('QUIMICO');
  const [peligro, setPeligro] = useState('');
  const [riesgo, setRiesgo] = useState('');
  const [consecuencia, setConsecuencia] = useState('');
  const [controlesExistentes, setControlesExistentes] = useState('');
  const [indPersonas, setIndPersonas] = useState(2);
  const [indProcedimientos, setIndProcedimientos] = useState(2);
  const [indCapacitacion, setIndCapacitacion] = useState(2);
  const [indExposicion, setIndExposicion] = useState(2);
  const [indSeveridad, setIndSeveridad] = useState(3);
  const [jerarquia, setJerarquia] = useState<'ELIMINACION' | 'SUSTITUCION' | 'INGENIERIA' | 'ADMINISTRATIVO' | 'EPP'>('INGENIERIA');
  const [medidaPropuesta, setMedidaPropuesta] = useState('');
  const [responsable, setResponsable] = useState('');

  // Cálculo de Probabilidad y Riesgo Puro
  const indProbabilidad = indPersonas + indProcedimientos + indCapacitacion + indExposicion;
  const valorRiesgoPuro = indProbabilidad * indSeveridad;

  const getNivelRiesgo = (valor: number): RiskLevel => {
    if (valor >= criticoThreshold) return 'CRITICO';
    if (valor >= altoThreshold) return 'ALTO';
    if (valor >= medioThreshold) return 'MEDIO';
    return 'BAJO';
  };

  const handleCreateIPERC = (e: React.FormEvent) => {
    e.preventDefault();
    const nivelPuro = getNivelRiesgo(valorRiesgoPuro);

    const newRow: IPERCRow = {
      id: `iperc-${Date.now()}`,
      codigo: `IPERC-PRD-${String(ipercRows.length + 1).padStart(2, '0')}`,
      proceso: proceso || 'Operaciones Químicas',
      actividad: actividad || 'Manipulación y síntesis',
      tarea: tarea || 'Operación general',
      puestoTrabajo: puesto || 'Operador de Planta',
      tipoPeligro,
      peligro,
      riesgo,
      consecuencia,
      controlesExistentes: controlesExistentes || 'Uso de EPP básico',
      indicePersonas: indPersonas,
      indiceProcedimientos: indProcedimientos,
      indiceCapacitacion: indCapacitacion,
      indiceExposicion: indExposicion,
      indiceProbabilidad: indProbabilidad,
      indiceSeveridad: indSeveridad,
      nivelRiesgoPuro: nivelPuro,
      valorRiesgoPuro,
      jerarquiaControl: jerarquia,
      medidaControlPropuesta: medidaPropuesta,
      probabilidadResidual: Math.max(3, indProbabilidad - 4),
      severidadResidual: Math.max(1, indSeveridad - 1),
      nivelRiesgoResidual: 'BAJO',
      valorRiesgoResidual: Math.max(3, indProbabilidad - 4) * Math.max(1, indSeveridad - 1),
      responsable: responsable || 'Supervisor SSOMA',
      fechaRevision: new Date().toISOString().split('T')[0],
      estadoSeguimiento: 'EN_PROCESO'
    };

    saveIPERCRow(newRow);
    setShowModal(false);
  };

  // Filtrado
  const filteredRows = ipercRows.filter((r) => {
    if (filterPeligro !== 'TODOS' && r.tipoPeligro !== filterPeligro) return false;
    if (filterNivel !== 'TODOS' && r.nivelRiesgoPuro !== filterNivel) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        r.peligro.toLowerCase().includes(q) ||
        r.riesgo.toLowerCase().includes(q) ||
        r.puestoTrabajo.toLowerCase().includes(q) ||
        r.codigo.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">Gestión de Riesgos - Matriz IPERC</h1>
            <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
              ISO 45001 Cl. 6.1.2 · D.S. 005-2012-TR Art. 77
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Identificación Continua de Peligros, Evaluación de Riesgos y Jerarquía de Medidas de Control (Eliminación, Sustitución, Ingeniería, Administrativo y EPP).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowConfigModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors whitespace-nowrap"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-orange-400" />
            Configurar Metodología
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded shadow-sm transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Nuevo Peligro / Tarea
          </button>
        </div>
      </div>

      {/* Jerarquía de Controles Visual Summary */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-200 uppercase font-mono tracking-wider">
            Jerarquía de Controles Aplicada (ISO 45001 Cl. 8.1.2)
          </span>
          <span className="text-[11px] font-mono">Prioridad de Mayor a Menor Eficacia</span>
        </div>
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800/60 text-emerald-300">
            <p className="font-bold text-[11px]">1. ELIMINACIÓN</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Física del peligro</p>
          </div>
          <div className="p-2 rounded bg-teal-950/40 border border-teal-800/60 text-teal-300">
            <p className="font-bold text-[11px]">2. SUSTITUCIÓN</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Por químico menos tóxico</p>
          </div>
          <div className="p-2 rounded bg-sky-950/40 border border-sky-800/60 text-sky-300">
            <p className="font-bold text-[11px]">3. INGENIERÍA</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Aislamiento y extracción</p>
          </div>
          <div className="p-2 rounded bg-amber-950/40 border border-amber-800/60 text-amber-300">
            <p className="font-bold text-[11px]">4. ADMINISTRATIVO</p>
            <p className="text-[10px] text-slate-400 mt-0.5">PETS, rotación y señales</p>
          </div>
          <div className="p-2 rounded bg-orange-950/40 border border-orange-800/60 text-orange-300">
            <p className="font-bold text-[11px]">5. EPP ESPECÍFICO</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Última barrera</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar peligro, riesgo, puesto de trabajo o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-orange-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-500" /> Peligro:
          </span>
          <select
            value={filterPeligro}
            onChange={(e) => setFilterPeligro(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 focus:outline-hidden font-mono"
          >
            <option value="TODOS">Todos los Peligros</option>
            <option value="QUIMICO">Químico</option>
            <option value="FISICO">Físico</option>
            <option value="MECANICO">Mecánico</option>
            <option value="ELECTRICO">Eléctrico</option>
            <option value="ERGONOMICO">Ergonómico</option>
          </select>

          <select
            value={filterNivel}
            onChange={(e) => setFilterNivel(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 focus:outline-hidden font-mono"
          >
            <option value="TODOS">Todos los Niveles</option>
            <option value="CRITICO">Crítico</option>
            <option value="ALTO">Alto</option>
            <option value="MEDIO">Medio</option>
            <option value="BAJO">Bajo</option>
          </select>
        </div>
      </div>

      {/* Matriz IPERC Table */}
      <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400">
              <tr>
                <th className="px-3 py-3">Código</th>
                <th className="px-3 py-3">Proceso &amp; Puesto</th>
                <th className="px-3 py-3">Peligro Identificado</th>
                <th className="px-3 py-3">Riesgo &amp; Consecuencia</th>
                <th className="px-3 py-3 text-center">Riesgo Inicial</th>
                <th className="px-3 py-3">Jerarquía de Control Propuesta</th>
                <th className="px-3 py-3 text-center">Riesgo Residual</th>
                <th className="px-3 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-850/60 transition-colors">
                  <td className="px-3 py-3 font-mono font-semibold text-orange-400 whitespace-nowrap">
                    {row.codigo}
                  </td>
                  <td className="px-3 py-3 max-w-[200px]">
                    <p className="font-semibold text-white">{row.puestoTrabajo}</p>
                    <p className="text-[11px] text-slate-400 truncate">{row.proceso}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">Tarea: {row.tarea}</p>
                  </td>
                  <td className="px-3 py-3 max-w-[220px]">
                    <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700 mb-1">
                      {row.tipoPeligro}
                    </span>
                    <p className="text-slate-200 leading-tight">{row.peligro}</p>
                  </td>
                  <td className="px-3 py-3 max-w-[220px]">
                    <p className="font-medium text-slate-200 leading-tight">{row.riesgo}</p>
                    <p className="text-[11px] text-rose-400/90 mt-1">{row.consecuencia}</p>
                  </td>
                  <td className="px-3 py-3 text-center whitespace-nowrap">
                    <StatusBadge status={row.nivelRiesgoPuro} />
                    <p className="text-[10px] font-mono text-slate-400 mt-1">Valor: {row.valorRiesgoPuro}</p>
                  </td>
                  <td className="px-3 py-3 max-w-[240px]">
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold block mb-0.5">
                      [{row.jerarquiaControl}]
                    </span>
                    <p className="text-slate-300 text-[11px] leading-tight">{row.medidaControlPropuesta}</p>
                  </td>
                  <td className="px-3 py-3 text-center whitespace-nowrap">
                    <StatusBadge status={row.nivelRiesgoResidual} />
                    <p className="text-[10px] font-mono text-slate-400 mt-1">Valor: {row.valorRiesgoResidual}</p>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <StatusBadge status={row.estadoSeguimiento} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Configuración de Metodología */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-6 space-y-4 text-xs">
            <h3 className="text-base font-semibold text-white">Configuración de Metodología IPERC</h3>
            <p className="text-slate-400">
              Ajuste los rangos y umbrales de evaluación de riesgo conforme a la política técnica aprobada por la empresa (Ley 29783).
            </p>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nombre de la Metodología</label>
              <input
                type="text"
                value={methodologyName}
                onChange={(e) => setMethodologyName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Umbral Crítico (≥)</label>
                <input
                  type="number"
                  value={criticoThreshold}
                  onChange={(e) => setCriticoThreshold(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Umbral Alto (≥)</label>
                <input
                  type="number"
                  value={altoThreshold}
                  onChange={(e) => setAltoThreshold(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Umbral Medio (≥)</label>
                <input
                  type="number"
                  value={medioThreshold}
                  onChange={(e) => setMedioThreshold(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded"
              >
                Guardar Configuración
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Registrar Nuevo IPERC */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
              <h3 className="text-base font-semibold text-white">Registrar Peligro y Evaluación IPERC</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">&times;</button>
            </div>
            <form onSubmit={handleCreateIPERC} className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Proceso *</label>
                  <input
                    type="text"
                    required
                    value={proceso}
                    onChange={(e) => setProceso(e.target.value)}
                    placeholder="Ej: Síntesis y Reacción Química"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Puesto de Trabajo *</label>
                  <input
                    type="text"
                    required
                    value={puesto}
                    onChange={(e) => setPuesto(e.target.value)}
                    placeholder="Ej: Operador de Reactores Químicos"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Actividad</label>
                  <input
                    type="text"
                    value={actividad}
                    onChange={(e) => setActividad(e.target.value)}
                    placeholder="Ej: Dosificación de reactivos"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tipo de Peligro</label>
                  <select
                    value={tipoPeligro}
                    onChange={(e) => setTipoPeligro(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  >
                    <option value="QUIMICO">Químico</option>
                    <option value="FISICO">Físico</option>
                    <option value="MECANICO">Mecánico</option>
                    <option value="ELECTRICO">Eléctrico</option>
                    <option value="ERGONOMICO">Ergonómico</option>
                    <option value="LOCATIVO">Locativo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Peligro Específico *</label>
                <input
                  type="text"
                  required
                  value={peligro}
                  onChange={(e) => setPeligro(e.target.value)}
                  placeholder="Ej: Presencia de vapores corrosivos de HCl por venteo defectuoso"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Riesgo Asociado *</label>
                  <input
                    type="text"
                    required
                    value={riesgo}
                    onChange={(e) => setRiesgo(e.target.value)}
                    placeholder="Ej: Inhalación de vapores tóxicos"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Consecuencia *</label>
                  <input
                    type="text"
                    required
                    value={consecuencia}
                    onChange={(e) => setConsecuencia(e.target.value)}
                    placeholder="Ej: Edema pulmonar o irritación bronquial"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-3">
                <span className="font-semibold text-slate-200 uppercase font-mono tracking-wider block">
                  Evaluación de Riesgo Puro (R.M. 050-2013-TR)
                </span>
                <div className="grid grid-cols-5 gap-2 text-center">
                  <div>
                    <label className="text-[10px] text-slate-400">Personas (1-3)</label>
                    <input
                      type="number"
                      min={1}
                      max={3}
                      value={indPersonas}
                      onChange={(e) => setIndPersonas(Number(e.target.value))}
                      className="w-full text-center py-1 bg-slate-900 border border-slate-700 rounded font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Procedim. (1-3)</label>
                    <input
                      type="number"
                      min={1}
                      max={3}
                      value={indProcedimientos}
                      onChange={(e) => setIndProcedimientos(Number(e.target.value))}
                      className="w-full text-center py-1 bg-slate-900 border border-slate-700 rounded font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Capacitac. (1-3)</label>
                    <input
                      type="number"
                      min={1}
                      max={3}
                      value={indCapacitacion}
                      onChange={(e) => setIndCapacitacion(Number(e.target.value))}
                      className="w-full text-center py-1 bg-slate-900 border border-slate-700 rounded font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Exposición (1-3)</label>
                    <input
                      type="number"
                      min={1}
                      max={3}
                      value={indExposicion}
                      onChange={(e) => setIndExposicion(Number(e.target.value))}
                      className="w-full text-center py-1 bg-slate-900 border border-slate-700 rounded font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Severidad (1-3)</label>
                    <input
                      type="number"
                      min={1}
                      max={3}
                      value={indSeveridad}
                      onChange={(e) => setIndSeveridad(Number(e.target.value))}
                      className="w-full text-center py-1 bg-slate-900 border border-slate-700 rounded font-mono text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                  <span className="font-mono text-slate-400">
                    Probabilidad: {indProbabilidad} × Severidad: {indSeveridad} = Valor: {valorRiesgoPuro}
                  </span>
                  <StatusBadge status={getNivelRiesgo(valorRiesgoPuro)} />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Jerarquía de Control Aplicada *</label>
                <select
                  value={jerarquia}
                  onChange={(e) => setJerarquia(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                >
                  <option value="ELIMINACION">1. Eliminación</option>
                  <option value="SUSTITUCION">2. Sustitución</option>
                  <option value="INGENIERIA">3. Control de Ingeniería</option>
                  <option value="ADMINISTRATIVO">4. Control Administrativo / PETS</option>
                  <option value="EPP">5. Equipos de Protección Personal (EPP)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Medida de Control Propuesta *</label>
                <textarea
                  required
                  rows={2}
                  value={medidaPropuesta}
                  onChange={(e) => setMedidaPropuesta(e.target.value)}
                  placeholder="Detalle los controles técnicos de ingeniería o administrativos a implementar..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded"
                >
                  Guardar en Matriz IPERC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
