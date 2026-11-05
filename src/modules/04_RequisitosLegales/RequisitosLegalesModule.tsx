/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MÓDULO 04: GESTIÓN DE REQUISITOS LEGALES
 * Marco Normativo Peruano (Ley 29783, D.S. 005-2012-TR, D.S. 015-2005-SA, D.S. 042-F, ISO 45001:2018)
 */

import React, { useState } from 'react';
import { useSSOMA } from '../../context/SSOMAContext';
import { LegalRequirement } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Scale,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  FileText,
  AlertCircle,
  ExternalLink,
  Calendar
} from 'lucide-react';

export const RequisitosLegalesModule: React.FC = () => {
  const { legalRequirements, saveLegalRequirement } = useSSOMA();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterNorma, setFilterNorma] = useState<string>('TODOS');
  const [filterCumplimiento, setFilterCumplimiento] = useState<string>('TODOS');
  const [selectedReq, setSelectedReq] = useState<LegalRequirement | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Formulario de Evaluación / Reevaluación
  const [evalCumplimiento, setEvalCumplimiento] = useState<'CONFORME' | 'NO_CONFORME' | 'EN_PROCESO' | 'NO_APLICA'>('CONFORME');
  const [evalEvidencia, setEvalEvidencia] = useState('');
  const [evalProximaFecha, setEvalProximaFecha] = useState('');

  // Formulario Nuevo Requisito Legal
  const [newNorma, setNewNorma] = useState('Ley N° 29783');
  const [newTipo, setNewTipo] = useState<'LEY' | 'DECRETO_SUPREMO' | 'RESOLUCION_MINISTERIAL' | 'NORMA_TECNICA' | 'INTERNACIONAL'>('LEY');
  const [newTitulo, setNewTitulo] = useState('');
  const [newOrganismo, setNewOrganismo] = useState<'CONGRESO' | 'MTPE' | 'MINSA' | 'OSINERGMIN' | 'MINAM' | 'SUNAFIL' | 'ISO'>('MTPE');
  const [newArticulo, setNewArticulo] = useState('');
  const [newDescripcion, setNewDescripcion] = useState('');
  const [newSector, setNewSector] = useState('');
  const [newResponsable, setNewResponsable] = useState('');
  const [newClausulaISO, setNewClausulaISO] = useState('6.1.3');

  const filteredRequirements = legalRequirements.filter((req) => {
    if (filterNorma !== 'TODOS' && req.tipoNorma !== filterNorma) return false;
    if (filterCumplimiento !== 'TODOS' && req.cumplimiento !== filterCumplimiento) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        req.numeroNorma.toLowerCase().includes(q) ||
        req.tituloNorma.toLowerCase().includes(q) ||
        req.articuloObligacion.toLowerCase().includes(q) ||
        req.descripcionRequisito.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalConforme = legalRequirements.filter(r => r.cumplimiento === 'CONFORME').length;
  const porcentajeCumplimiento = legalRequirements.length > 0
    ? Math.round((totalConforme / legalRequirements.length) * 100)
    : 0;

  const handleOpenEvaluate = (req: LegalRequirement) => {
    setSelectedReq(req);
    setEvalCumplimiento(req.cumplimiento);
    setEvalEvidencia(req.evidenciaCumplimiento);
    setEvalProximaFecha(req.fechaProximaReevaluacion);
    setShowEditModal(true);
  };

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;

    const updated: LegalRequirement = {
      ...selectedReq,
      cumplimiento: evalCumplimiento,
      evidenciaCumplimiento: evalEvidencia,
      fechaUltimaEvaluacion: new Date().toISOString().split('T')[0],
      fechaProximaReevaluacion: evalProximaFecha || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0]
    };

    saveLegalRequirement(updated);
    setShowEditModal(false);
  };

  const handleCreateNewLegal = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: LegalRequirement = {
      id: `leg-${Date.now()}`,
      codigo: `REQ-LEG-${String(legalRequirements.length + 1).padStart(2, '0')}`,
      tipoNorma: newTipo,
      numeroNorma: newNorma,
      tituloNorma: newTitulo || 'Normativa de Seguridad y Salud en el Trabajo',
      organismoEmisor: newOrganismo,
      articuloObligacion: newArticulo,
      descripcionRequisito: newDescripcion,
      aplicabilidadSector: newSector || 'Operaciones Químicas y Administrativas',
      responsableEvaluacion: newResponsable || 'Supervisor SSOMA',
      cumplimiento: 'EN_PROCESO',
      evidenciaCumplimiento: 'Requisito incorporado a la matriz para plan de adecuación.',
      fechaUltimaEvaluacion: new Date().toISOString().split('T')[0],
      fechaProximaReevaluacion: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
      clausulaISO: newClausulaISO
    };

    saveLegalRequirement(newReq);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">Gestión de Requisitos Legales SSOMA</h1>
            <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
              ISO 45001 Cl. 6.1.3 · Marco Jurídico Peruano
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Matriz legal de identificación, evaluación del cumplimiento normativo y trazabilidad de evidencias conforme a la Ley N° 29783 y decretos sectoriales químicos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Cumplimiento Legal Global
            </span>
            <span className="text-xl font-mono font-black text-emerald-400 tabular-nums">
              {porcentajeCumplimiento}%
            </span>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded shadow-sm transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            Nueva Obligación Legal
          </button>
        </div>
      </div>

      {/* Normativa Peruana Destacada */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded space-y-1">
          <span className="text-[10px] font-mono text-orange-400 font-semibold">LEY N° 29783</span>
          <p className="font-semibold text-white">Ley de SST</p>
          <p className="text-[11px] text-slate-400">Comité Paritario, 4 capacitaciones mínimas y RISST.</p>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded space-y-1">
          <span className="text-[10px] font-mono text-sky-400 font-semibold">D.S. N° 005-2012-TR</span>
          <p className="font-semibold text-white">Reglamento Ley 29783</p>
          <p className="text-[11px] text-slate-400">8 registros obligatorios, auditorías y monitoreos.</p>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded space-y-1">
          <span className="text-[10px] font-mono text-emerald-400 font-semibold">D.S. N° 015-2005-SA</span>
          <p className="font-semibold text-white">Límites Químicos</p>
          <p className="text-[11px] text-slate-400">Valores TLV-TWA y TLV-STEL para agentes químicos.</p>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded space-y-1">
          <span className="text-[10px] font-mono text-purple-400 font-semibold">D.S. N° 042-F</span>
          <p className="font-semibold text-white">Seguridad Industrial</p>
          <p className="text-[11px] text-slate-400">Almacenamiento de inflamables, duchas y ventilación.</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar norma, artículo o descripción de requisito..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-orange-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-500" /> Tipo:
          </span>
          <select
            value={filterNorma}
            onChange={(e) => setFilterNorma(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 focus:outline-hidden font-mono"
          >
            <option value="TODOS">Todos los Tipos</option>
            <option value="LEY">Ley</option>
            <option value="DECRETO_SUPREMO">Decreto Supremo</option>
            <option value="RESOLUCION_MINISTERIAL">R.M.</option>
            <option value="INTERNACIONAL">Internacional (ISO)</option>
          </select>

          <select
            value={filterCumplimiento}
            onChange={(e) => setFilterCumplimiento(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 focus:outline-hidden font-mono"
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="CONFORME">Conforme</option>
            <option value="EN_PROCESO">En Proceso</option>
            <option value="NO_CONFORME">No Conforme</option>
          </select>
        </div>
      </div>

      {/* Matriz Legal Table */}
      <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400">
              <tr>
                <th className="px-3 py-3">Código</th>
                <th className="px-3 py-3">Norma Legal &amp; Emisor</th>
                <th className="px-4 py-3">Artículo &amp; Obligación Legal</th>
                <th className="px-4 py-3">Evidencia Documentada de Cumplimiento</th>
                <th className="px-3 py-3">Responsable</th>
                <th className="px-3 py-3">Próx. Reeval.</th>
                <th className="px-3 py-3">Estado</th>
                <th className="px-3 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredRequirements.map((req) => (
                <tr key={req.id} className="hover:bg-slate-850/60 transition-colors">
                  <td className="px-3 py-3 font-mono font-semibold text-orange-400 whitespace-nowrap">
                    {req.codigo}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <p className="font-semibold text-white">{req.numeroNorma}</p>
                    <p className="text-[11px] text-slate-400">{req.organismoEmisor}</p>
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">ISO {req.clausulaISO}</p>
                  </td>
                  <td className="px-4 py-3 max-w-sm">
                    <p className="font-semibold text-slate-200 leading-tight">{req.articuloObligacion}</p>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {req.descripcionRequisito}
                    </p>
                  </td>
                  <td className="px-4 py-3 max-w-sm">
                    <div className="flex items-start gap-1.5 text-slate-300">
                      <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-[11px] leading-relaxed">{req.evidenciaCumplimiento}</p>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-slate-300 whitespace-nowrap">
                    {req.responsableEvaluacion}
                  </td>
                  <td className="px-3 py-3 font-mono text-slate-300 whitespace-nowrap">
                    {req.fechaProximaReevaluacion}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <StatusBadge status={req.cumplimiento} />
                  </td>
                  <td className="px-3 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleOpenEvaluate(req)}
                      className="px-2.5 py-1 text-[11px] font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors inline-flex items-center gap-1"
                    >
                      Evaluar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Evaluar / Actualizar Cumplimiento */}
      {showEditModal && selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-6 space-y-4 text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-semibold text-white">Evaluación de Conformidad Legal</h3>
                <p className="text-slate-400 font-mono text-[11px]">{selectedReq.numeroNorma} · {selectedReq.codigo}</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">&times;</button>
            </div>

            <form onSubmit={handleSaveEvaluation} className="space-y-4">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded">
                <p className="text-slate-300 font-medium">{selectedReq.articuloObligacion}</p>
                <p className="text-[11px] text-slate-400 mt-1">{selectedReq.descripcionRequisito}</p>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">
                  Nivel de Cumplimiento Técnico *
                </label>
                <select
                  value={evalCumplimiento}
                  onChange={(e) => setEvalCumplimiento(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                >
                  <option value="CONFORME">Conforme (Evidencia verificada y vigente)</option>
                  <option value="EN_PROCESO">En Proceso (Plan de adecuación en curso)</option>
                  <option value="NO_CONFORME">No Conforme (Requiere Acción Correctiva CAPA)</option>
                  <option value="NO_APLICA">No Aplica</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">
                  Evidencia Documentada de Respaldo *
                </label>
                <textarea
                  required
                  rows={3}
                  value={evalEvidencia}
                  onChange={(e) => setEvalEvidencia(e.target.value)}
                  placeholder="Detalle actas, registros, informes de monitoreo o resoluciones que sustentan el cumplimiento..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">
                  Próxima Fecha de Reevaluación Programada *
                </label>
                <input
                  type="date"
                  required
                  value={evalProximaFecha}
                  onChange={(e) => setEvalProximaFecha(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded"
                >
                  Actualizar Evaluación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Registrar Nuevo Requisito Legal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-6 space-y-4 text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-semibold text-white">Incorporar Norma / Requisito Legal</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">&times;</button>
            </div>

            <form onSubmit={handleCreateNewLegal} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tipo de Norma</label>
                  <select
                    value={newTipo}
                    onChange={(e) => setNewTipo(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  >
                    <option value="LEY">Ley</option>
                    <option value="DECRETO_SUPREMO">Decreto Supremo</option>
                    <option value="RESOLUCION_MINISTERIAL">Resolución Ministerial</option>
                    <option value="NORMA_TECNICA">Norma Técnica Peruana</option>
                    <option value="INTERNACIONAL">Norma Internacional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Organismo Emisor</label>
                  <select
                    value={newOrganismo}
                    onChange={(e) => setNewOrganismo(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  >
                    <option value="MTPE">MTPE</option>
                    <option value="CONGRESO">Congreso</option>
                    <option value="MINSA">MINSA</option>
                    <option value="SUNAFIL">SUNAFIL</option>
                    <option value="OSINERGMIN">OSINERGMIN</option>
                    <option value="MINAM">MINAM</option>
                    <option value="ISO">ISO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Número y Denominación de la Norma *</label>
                <input
                  type="text"
                  required
                  value={newNorma}
                  onChange={(e) => setNewNorma(e.target.value)}
                  placeholder="Ej: R.M. N° 375-2008-TR (Norma Básica de Ergonomía)"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Artículo u Obligación Específica *</label>
                <input
                  type="text"
                  required
                  value={newArticulo}
                  onChange={(e) => setNewArticulo(e.target.value)}
                  placeholder="Ej: Título III: Manipulación manual de cargas químicas"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Descripción de la Obligación *</label>
                <textarea
                  required
                  rows={2}
                  value={newDescripcion}
                  onChange={(e) => setNewDescripcion(e.target.value)}
                  placeholder="Describa el mandato legal aplicable a las instalaciones químicas..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Responsable</label>
                  <input
                    type="text"
                    value={newResponsable}
                    onChange={(e) => setNewResponsable(e.target.value)}
                    placeholder="Ej: Supervisor SSOMA"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Cláusula ISO 45001</label>
                  <input
                    type="text"
                    value={newClausulaISO}
                    onChange={(e) => setNewClausulaISO(e.target.value)}
                    placeholder="Ej: 6.1.3"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  />
                </div>
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
                  Guardar Requisito
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
