/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MÓDULO 10: ACCIDENTES E INCIDENTES
 * Investigación Causal según Modelo Frank Bird y Análisis de Causa Raíz (5 Porqués)
 * Formato oficial R.M. 050-2013-TR / Notificación SAT MTPE
 */

import React, { useState } from 'react';
import { useSSOMA } from '../../context/SSOMAContext';
import { SafetyIncident } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Flame,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  FileText,
  Printer,
  ShieldAlert,
  Clock,
  Layers,
  HelpCircle,
  Building
} from 'lucide-react';

export const AccidentesIncidentesModule: React.FC = () => {
  const { incidents, saveIncident, selectedSede, safetyMetrics } = useSSOMA();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<string>('TODOS');
  const [selectedIncidentForReport, setSelectedIncidentForReport] = useState<SafetyIncident | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Formulario Nuevo Incidente / Accidente
  const [tipo, setTipo] = useState<SafetyIncident['tipo']>('INCIDENTE_PELIGROSO');
  const [areaExacta, setAreaExacta] = useState('');
  const [trabajadorAfectado, setTrabajadorAfectado] = useState('');
  const [puestoTrabajo, setPuestoTrabajo] = useState('');
  const [sustancia, setSustancia] = useState('Ácido Sulfúrico 98%');
  const [diasPerdidos, setDiasPerdidos] = useState(0);
  const [descripcion, setDescripcion] = useState('');
  const [actoSubestandar, setActoSubestandar] = useState('');
  const [condicionSubestandar, setCondicionSubestandar] = useState('');
  const [causaBasicaPersonal, setCausaBasicaPersonal] = useState('');
  const [causaBasicaTrabajo, setCausaBasicaTrabajo] = useState('');
  const [medidaInmediata, setMedidaInmediata] = useState('');
  const [investigador, setInvestigador] = useState('Ing. Alejandro Del Castillo');

  const filteredIncidents = incidents.filter(i => {
    if (filterTipo !== 'TODOS' && i.tipo !== filterTipo) return false;
    if (selectedSede !== 'TODAS' && i.sede !== 'TODAS' && i.sede !== selectedSede) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        i.codigo.toLowerCase().includes(q) ||
        i.descripcionHechos.toLowerCase().includes(q) ||
        i.areaExacta.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion.trim() || !areaExacta.trim()) return;

    const newInc: SafetyIncident = {
      id: `inc-${Date.now()}`,
      codigo: `INC-2026-${String(incidents.length + 1).padStart(3, '0')}`,
      tipo,
      fechaHora: `${new Date().toISOString().split('T')[0]} 09:30`,
      sede: selectedSede === 'TODAS' ? 'SEDE_CENTRAL_LURIN' : selectedSede,
      areaExacta: areaExacta.trim(),
      trabajadorAfectado: trabajadorAfectado.trim() || 'N/A',
      puestoTrabajo: puestoTrabajo.trim() || 'Operador',
      diasPerdidos: Number(diasPerdidos),
      sustanciaInvolucrada: sustancia,
      descripcionHechos: descripcion.trim(),
      causasInmediatasActos: [actoSubestandar.trim() || 'No seguir PETS'],
      causasInmediatasCondiciones: [condicionSubestandar.trim() || 'Desgaste de empaque'],
      causasBasicasFactoresPersonales: [causaBasicaPersonal.trim() || 'Falta de percepción de riesgo'],
      causasBasicasFactoresTrabajo: [causaBasicaTrabajo.trim() || 'Frecuencia de mantenimiento preventivo insuficiente'],
      analisis5Porques: [
        '¿Por qué ocurrió? -> Desviación en el procedimiento operativo.',
        '¿Por qué hubo desviación? -> Ausencia de verificación de acople.',
        '¿Por qué no se verificó? -> Falta de lista de chequeo pre-arranque.',
        '¿Causa raíz? -> Falta de estandarización en el ciclo de mantenimiento predictivo.'
      ],
      medidasCorrectivasInmediatas: medidaInmediata.trim() || 'Parada de bomba y contención con kit spill.',
      investigadorLider: investigador.trim(),
      miembroComiteSST: 'Sr. Víctor Rivas (Comité Paritario)',
      estadoInvestigacion: 'REVISION_COMITE_SST',
      notificadoMTPE: tipo === 'ACCIDENTE_INCAPACITANTE' || tipo === 'INCIDENTE_PELIGROSO'
    };

    saveIncident(newInc);
    setShowCreateModal(false);
    setSelectedIncidentForReport(newInc);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">Investigación de Accidentes e Incidentes</h1>
            <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
              Ley 29783 Art. 92 · D.S. 005-2012-TR Art. 88
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Metodología de causalidad Frank Bird, determinación de causas inmediatas y básicas, análisis 5 Porqués y cálculo oficial de tasas IF, IS e IA.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Reportar Evento / Accidente
        </button>
      </div>

      {/* Safety Rates Box */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Horas Hombre (HHT)</span>
          <span className="text-xl font-bold font-mono text-white tabular-nums mt-1 block">
            {safetyMetrics.horasHombreTrabajadasPeriodo.toLocaleString()} hrs
          </span>
          <p className="text-[10px] text-slate-500 mt-1">Exposición acumulada</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Índice Frecuencia (IF)</span>
          <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums mt-1 block">
            {safetyMetrics.indiceFrecuenciaIF}
          </span>
          <p className="text-[10px] text-emerald-400/80 mt-1">Meta: &lt; {safetyMetrics.metaMaximaIF}</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Índice Severidad (IS)</span>
          <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums mt-1 block">
            {safetyMetrics.indiceSeveridadIS}
          </span>
          <p className="text-[10px] text-emerald-400/80 mt-1">Meta: &lt; {safetyMetrics.metaMaximaIS}</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Accidentabilidad (IA)</span>
          <span className="text-xl font-bold font-mono text-white tabular-nums mt-1 block">
            {safetyMetrics.indiceAccidentabilidadIA}
          </span>
          <p className="text-[10px] text-slate-400 mt-1">(IF × IS) / 1000</p>
        </div>
      </div>

      {/* Tabla de Eventos */}
      <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400">
              <tr>
                <th className="px-3 py-3">Código</th>
                <th className="px-3 py-3">Fecha y Hora</th>
                <th className="px-3 py-3">Tipo de Evento</th>
                <th className="px-4 py-3">Descripción de los Hechos</th>
                <th className="px-3 py-3">Ubicación / Área</th>
                <th className="px-2 py-3 text-center">Días Perdidos</th>
                <th className="px-3 py-3">Estado Investigación</th>
                <th className="px-3 py-3 text-right">Informe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredIncidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-850/60 transition-colors">
                  <td className="px-3 py-3 font-mono font-semibold text-orange-400 whitespace-nowrap">
                    {inc.codigo}
                  </td>
                  <td className="px-3 py-3 font-mono text-slate-400 whitespace-nowrap">
                    {inc.fechaHora}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap font-medium text-white">
                    {inc.tipo.replace(/_/g, ' ')}
                  </td>
                  <td className="px-4 py-3 max-w-sm">
                    <p className="line-clamp-2 text-slate-200 leading-relaxed">{inc.descripcionHechos}</p>
                    {inc.sustanciaInvolucrada && (
                      <span className="text-[10px] font-mono text-orange-400 block mt-1">
                        Sustancia: {inc.sustanciaInvolucrada}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-slate-300 whitespace-nowrap">
                    {inc.areaExacta}
                  </td>
                  <td className="px-2 py-3 text-center font-mono font-bold text-white">
                    {inc.diasPerdidos}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <StatusBadge status={inc.estadoInvestigacion} />
                  </td>
                  <td className="px-3 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedIncidentForReport(inc)}
                      className="px-2.5 py-1 text-[11px] font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors inline-flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3 text-orange-400" />
                      Informe Técnico
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Visor de Informe de Investigación */}
      {selectedIncidentForReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
              <h3 className="text-base font-semibold text-white">
                Informe Oficial de Investigación de Evento: {selectedIncidentForReport.codigo}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded font-mono"
                >
                  <Printer className="w-3.5 h-3.5 text-orange-400" /> Imprimir Acta
                </button>
                <button onClick={() => setSelectedIncidentForReport(null)} className="text-slate-400 hover:text-white px-2">
                  &times;
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto text-xs text-slate-300">
              <div className="border border-slate-800 p-4 rounded bg-slate-950 space-y-2">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white uppercase">Formato R.M. 050-2013-TR</span>
                  <span className="font-mono text-orange-400">{selectedIncidentForReport.codigo}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                  <div>Tipo: <strong className="text-white">{selectedIncidentForReport.tipo}</strong></div>
                  <div>Fecha: <strong className="text-white">{selectedIncidentForReport.fechaHora}</strong></div>
                  <div>Días Perdidos: <strong className="text-white">{selectedIncidentForReport.diasPerdidos}</strong></div>
                </div>
              </div>

              <div>
                <span className="font-semibold text-white uppercase font-mono block mb-1">Descripción de los Hechos</span>
                <p className="p-3 bg-slate-950 border border-slate-800 rounded leading-relaxed">
                  {selectedIncidentForReport.descripcionHechos}
                </p>
              </div>

              {/* Modelo Frank Bird */}
              <div className="space-y-3">
                <span className="font-semibold text-orange-400 uppercase font-mono block">
                  Análisis Causal (Modelo Frank Bird)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Causas Inmediatas (Actos)</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-200">
                      {selectedIncidentForReport.causasInmediatasActos.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Causas Inmediatas (Condiciones)</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-200">
                      {selectedIncidentForReport.causasInmediatasCondiciones.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Causas Básicas (Factores Personales)</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-200">
                      {selectedIncidentForReport.causasBasicasFactoresPersonales.map((fp, i) => <li key={i}>{fp}</li>)}
                    </ul>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Causas Básicas (Factores de Trabajo)</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-200">
                      {selectedIncidentForReport.causasBasicasFactoresTrabajo.map((ft, i) => <li key={i}>{ft}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 5 Porqués */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-1.5">
                <span className="font-semibold text-slate-200 uppercase font-mono block text-[11px]">
                  Árbol Causal de 5 Porqués
                </span>
                <ul className="space-y-1 text-[11px] font-mono text-slate-300">
                  {selectedIncidentForReport.analisis5Porques.map((pq, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-orange-400 font-bold shrink-0">{idx + 1}.</span>
                      <span>{pq}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Medidas Correctivas */}
              <div className="p-3 bg-emerald-950/30 border border-emerald-800/50 rounded space-y-1 text-emerald-300">
                <span className="font-semibold uppercase font-mono text-[10px] block">
                  Medida Correctiva Inmediata Validada
                </span>
                <p>{selectedIncidentForReport.medidasCorrectivasInmediatas}</p>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-800">
                <div className="text-center font-mono text-[11px] text-slate-400">
                  <p className="font-semibold text-white">{selectedIncidentForReport.investigadorLider}</p>
                  <p>Líder de Investigación SSOMA</p>
                </div>
                <div className="text-center font-mono text-[11px] text-slate-400">
                  <p className="font-semibold text-white">{selectedIncidentForReport.miembroComiteSST}</p>
                  <p>Representante Comité Paritario de SST</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Registrar Evento */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-6 space-y-4 text-xs animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <h3 className="text-base font-semibold text-white">Reporte de Accidente / Incidente Químico</h3>

            <form onSubmit={handleCreateIncident} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tipo de Evento *</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  >
                    <option value="INCIDENTE_PELIGROSO">Incidente Peligroso</option>
                    <option value="INCIDENTE">Incidente Simple</option>
                    <option value="ACCIDENTE_LEVE">Accidente Leve</option>
                    <option value="ACCIDENTE_INCAPACITANTE">Accidente Incapacitante</option>
                    <option value="CONDICION_SUBESTANDAR">Condición Subestándar</option>
                    <option value="ACTO_SUBESTANDAR">Acto Subestándar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Días Perdidos</label>
                  <input
                    type="number"
                    min={0}
                    value={diasPerdidos}
                    onChange={(e) => setDiasPerdidos(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Área o Instalación Exacta *</label>
                <input
                  type="text"
                  required
                  value={areaExacta}
                  onChange={(e) => setAreaExacta(e.target.value)}
                  placeholder="Ej: Estación de Venteo del Reactor R-102"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Trabajador Involucrado</label>
                  <input
                    type="text"
                    value={trabajadorAfectado}
                    onChange={(e) => setTrabajadorAfectado(e.target.value)}
                    placeholder="Nombre o N/A"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Sustancia Involucrada</label>
                  <input
                    type="text"
                    value={sustancia}
                    onChange={(e) => setSustancia(e.target.value)}
                    placeholder="Ej: Ácido Sulfúrico 98% / Tolueno"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Descripción Cronológica de los Hechos *</label>
                <textarea
                  required
                  rows={2}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Describa qué ocurrió, equipos implicados y respuesta inicial..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Acto Subestándar</label>
                  <input
                    type="text"
                    value={actoSubestandar}
                    onChange={(e) => setActoSubestandar(e.target.value)}
                    placeholder="Ej: Omitir prueba de sellado"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Condición Subestándar</label>
                  <input
                    type="text"
                    value={condicionSubestandar}
                    onChange={(e) => setCondicionSubestandar(e.target.value)}
                    placeholder="Ej: Empaque desgastado"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Medida Inmediata Adoptada *</label>
                <input
                  type="text"
                  required
                  value={medidaInmediata}
                  onChange={(e) => setMedidaInmediata(e.target.value)}
                  placeholder="Ej: Parada de línea y neutralización con Kit Spill"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
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
                  Registrar e Iniciar Investigación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
