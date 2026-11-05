/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MÓDULO 09: PROGRAMA DE CAPACITACIONES
 * Mandato legal: Mínimo 4 capacitaciones al año (Ley 29783 Art. 35) + Capacitación HAZMAT
 */

import React, { useState } from 'react';
import { useSSOMA } from '../../context/SSOMAContext';
import { TrainingCourse } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  Users,
  Award,
  FileText,
  Calendar
} from 'lucide-react';

export const CapacitacionesModule: React.FC = () => {
  const { trainings, saveTraining } = useSSOMA();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<string>('TODOS');
  const [selectedTraining, setSelectedTraining] = useState<TrainingCourse | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Formulario Nueva Capacitación
  const [tema, setTema] = useState('');
  const [tipo, setTipo] = useState<'NORMATIVA_LEY_29783' | 'ESPECIFICA_QUIMICA' | 'RESPUESTA_EMERGENCIAS' | 'SALUD_OCUPACIONAL'>('ESPECIFICA_QUIMICA');
  const [esObligatoria, setEsObligatoria] = useState(true);
  const [duracion, setDuracion] = useState(4);
  const [instructor, setInstructor] = useState('');
  const [institucion, setInstitucion] = useState('');
  const [fecha, setFecha] = useState('2026-04-20');
  const [programados, setProgramados] = useState(40);

  const filteredTrainings = trainings.filter((t) => {
    if (filterTipo !== 'TODOS' && t.tipo !== filterTipo) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        t.tema.toLowerCase().includes(q) ||
        t.instructor.toLowerCase().includes(q) ||
        t.codigo.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const ejecutadas = trainings.filter(t => t.estado === 'EJECUTADA').length;
  const obligatoriasEjecutadas = trainings.filter(t => t.esObligatoria4Minimas && t.estado === 'EJECUTADA').length;

  const handleCreateTraining = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tema.trim() || !instructor.trim()) return;

    const newCourse: TrainingCourse = {
      id: `cur-${Date.now()}`,
      codigo: `CAP-2026-${String(trainings.length + 1).padStart(2, '0')}`,
      tema: tema.trim(),
      tipo,
      esObligatoria4Minimas: esObligatoria,
      duracionHoras: Number(duracion),
      instructor: instructor.trim(),
      institucion: institucion.trim() || 'Dpto. SSOMA',
      fechaProgramada: fecha,
      participantesProgramados: Number(programados),
      participantesAsistieron: 0,
      estado: 'PROGRAMADA'
    };

    saveTraining(newCourse);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">Programa Anual de Capacitaciones</h1>
            <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
              Ley 29783 Art. 35 · D.S. 005-2012-TR Art. 27
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Control del cumplimiento de las 4 capacitaciones mínimas obligatorias por ley y entrenamientos de alta especialización en riesgos químicos y respuesta ante emergencias.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Programar Nueva Capacitación
        </button>
      </div>

      {/* KPI Mandatory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span>Mandato Ley 29783 (4 Mínimas)</span>
            <Award className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {obligatoriasEjecutadas} de 4
            </span>
            <span className="text-emerald-400 font-mono font-semibold">
              ({Math.round((obligatoriasEjecutadas / 4) * 100)}%)
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Cumplimiento formal ante SUNAFIL</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span>Total Sesiones Ejecutadas</span>
            <GraduationCap className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {ejecutadas} de {trainings.length}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Avance global del programa 2026</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span>Eficacia y Calificaciones</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              17.0 / 20
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Promedio de aprobación</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Evaluaciones post-capacitación validadas</p>
        </div>
      </div>

      {/* Tabla de Capacitaciones */}
      <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400">
              <tr>
                <th className="px-3 py-3">Código</th>
                <th className="px-4 py-3">Tema de Capacitación &amp; Especialidad</th>
                <th className="px-3 py-3">Tipo</th>
                <th className="px-3 py-3">Instructor / Entidad</th>
                <th className="px-2 py-3 text-center">Horas</th>
                <th className="px-3 py-3 font-mono">Fecha</th>
                <th className="px-3 py-3 text-center">Asistencia</th>
                <th className="px-3 py-3">Estado</th>
                <th className="px-3 py-3 text-right">Acta / Lista</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredTrainings.map((c) => (
                <tr key={c.id} className="hover:bg-slate-850/60 transition-colors">
                  <td className="px-3 py-3 font-mono font-semibold text-orange-400 whitespace-nowrap">
                    {c.codigo}
                  </td>
                  <td className="px-4 py-3 max-w-sm">
                    <p className="font-semibold text-white">{c.tema}</p>
                    {c.esObligatoria4Minimas && (
                      <span className="text-[10px] font-mono text-orange-400 font-semibold block mt-0.5">
                        ★ Obligatoria Ley 29783
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap font-mono text-slate-400 text-[11px]">
                    {c.tipo.replace(/_/g, ' ')}
                  </td>
                  <td className="px-3 py-3 text-slate-300 whitespace-nowrap">
                    <p className="font-medium">{c.instructor}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{c.institucion}</p>
                  </td>
                  <td className="px-2 py-3 text-center font-mono font-semibold text-white">
                    {c.duracionHoras}h
                  </td>
                  <td className="px-3 py-3 font-mono text-slate-300 whitespace-nowrap">
                    {c.fechaProgramada}
                  </td>
                  <td className="px-3 py-3 text-center font-mono whitespace-nowrap">
                    {c.estado === 'EJECUTADA' ? (
                      <span className="text-emerald-400 font-semibold">
                        {c.participantesAsistieron} / {c.participantesProgramados} ({c.notaPromedio}/20)
                      </span>
                    ) : (
                      <span className="text-slate-500">
                        {c.participantesProgramados} inscritos
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <StatusBadge status={c.estado} />
                  </td>
                  <td className="px-3 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedTraining(c)}
                      className="px-2.5 py-1 text-[11px] font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors inline-flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3 text-orange-400" />
                      Ver Ficha
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ficha de Capacitación */}
      {selectedTraining && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-6 space-y-4 text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-semibold text-white">{selectedTraining.codigo}</h3>
                <p className="text-slate-400 font-mono text-[11px]">Registro Oficial R.M. 050-2013-TR</p>
              </div>
              <button onClick={() => setSelectedTraining(null)} className="text-slate-400 hover:text-white">&times;</button>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-1">
              <span className="font-semibold text-white block text-sm">{selectedTraining.tema}</span>
              <p className="text-slate-400">Instructor: {selectedTraining.instructor} ({selectedTraining.institucion})</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-slate-300 font-mono">
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded">
                <span className="text-slate-500 block text-[10px]">Fecha Programada:</span>
                <span>{selectedTraining.fechaProgramada}</span>
              </div>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded">
                <span className="text-slate-500 block text-[10px]">Duración:</span>
                <span>{selectedTraining.duracionHoras} horas lectivas</span>
              </div>
            </div>

            {selectedTraining.estado === 'EJECUTADA' && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded text-emerald-300 space-y-1 font-mono">
                <p className="font-semibold">Resultados de Evaluación:</p>
                <p>Asistentes: {selectedTraining.participantesAsistieron} participantes</p>
                <p>Nota Promedio Obtenida: {selectedTraining.notaPromedio} / 20</p>
                <p>Aprobados: {selectedTraining.porcentajeAprobados}%</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-mono text-xs border border-slate-700"
              >
                <Printer className="w-3.5 h-3.5 text-orange-400" />
                Imprimir Lista de Asistencia
              </button>
              <button
                onClick={() => setSelectedTraining(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded font-semibold text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Programar Nueva Capacitación */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-6 space-y-4 text-xs animate-in fade-in zoom-in-95">
            <h3 className="text-base font-semibold text-white">Programar Nueva Sesión de Capacitación</h3>

            <form onSubmit={handleCreateTraining} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tema de Capacitación *</label>
                <input
                  type="text"
                  required
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  placeholder="Ej: Procedimientos de Bloqueo y Etiquetado LOTO en Reactores"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Especialidad</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  >
                    <option value="ESPECIFICA_QUIMICA">Específica Química</option>
                    <option value="NORMATIVA_LEY_29783">Normativa Ley 29783</option>
                    <option value="RESPUESTA_EMERGENCIAS">Respuesta a Emergencias</option>
                    <option value="SALUD_OCUPACIONAL">Salud Ocupacional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duración (Horas)</label>
                  <input
                    type="number"
                    min={1}
                    value={duracion}
                    onChange={(e) => setDuracion(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Instructor *</label>
                  <input
                    type="text"
                    required
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    placeholder="Ej: Ing. Químico Especialista"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Institución / Entidad</label>
                  <input
                    type="text"
                    value={institucion}
                    onChange={(e) => setInstitucion(e.target.value)}
                    placeholder="Ej: SSOMA Interno / Asesoría Externa"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Fecha Programada</label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Participantes Programados</label>
                  <input
                    type="number"
                    min={1}
                    value={programados}
                    onChange={(e) => setProgramados(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="esOblig"
                  checked={esObligatoria}
                  onChange={(e) => setEsObligatoria(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-orange-500 focus:ring-0"
                />
                <label htmlFor="esOblig" className="text-slate-300 font-mono text-[11px]">
                  Computar dentro de las 4 capacitaciones mínimas de Ley 29783
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
                  Guardar en Programa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
