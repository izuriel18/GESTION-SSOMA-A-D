/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MÓDULO 11: GESTIÓN DOCUMENTAL
 * Lista Maestra de Información Documentada (ISO 45001 Cl. 7.5 & D.S. 005-2012-TR Art. 33)
 */

import React, { useState } from 'react';
import { useSSOMA } from '../../context/SSOMAContext';
import { DocumentRecord } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  FileCheck2,
  Search,
  Filter,
  FileText,
  Clock,
  History,
  Download,
  ExternalLink,
  Shield,
  Layers
} from 'lucide-react';

export const GestionDocumentalModule: React.FC = () => {
  const { documents } = useSSOMA();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('TODOS');
  const [selectedDocForHistory, setSelectedDocForHistory] = useState<DocumentRecord | null>(null);

  const filteredDocs = documents.filter((d) => {
    if (filterCategory !== 'TODOS' && d.categoria !== filterCategory) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        d.codigo.toLowerCase().includes(q) ||
        d.titulo.toLowerCase().includes(q) ||
        d.responsableElaboracion.toLowerCase().includes(q)
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
            <h1 className="text-xl font-bold tracking-tight text-white">Gestión Documental SSOMA</h1>
            <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
              ISO 45001 Cl. 7.5 · Lista Maestra Controlada
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Control de versiones, fechas de vigencia, aprobaciones de la Alta Dirección y trazabilidad de cambios en políticas, RISST, procedimientos PETS y registros legales.
          </p>
        </div>

        <div className="p-2.5 bg-slate-950 border border-slate-800 rounded text-right shrink-0">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Total Documentos Controlados</span>
          <span className="text-xl font-bold font-mono text-white tabular-nums">{documents.length}</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por código, título o elaborador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white placeholder-slate-500 focus:outline-hidden font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-500" /> Categoría:
          </span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 focus:outline-hidden font-mono"
          >
            <option value="TODOS">Todas las Categorías</option>
            <option value="POLITICA">Política SSOMA</option>
            <option value="REGLAMENTO_RISST">Reglamento RISST</option>
            <option value="PROCEDIMIENTO_PETS">Procedimientos PETS</option>
            <option value="PLAN_PROGRAMA">Planes y Programas</option>
            <option value="FORMATO">Formatos Oficiales</option>
          </select>
        </div>
      </div>

      {/* Tabla Lista Maestra */}
      <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400">
              <tr>
                <th className="px-3 py-3">Código</th>
                <th className="px-4 py-3">Título del Documento</th>
                <th className="px-3 py-3">Categoría</th>
                <th className="px-2 py-3 text-center">Versión</th>
                <th className="px-3 py-3">Aprobación</th>
                <th className="px-3 py-3">Aprobado Por</th>
                <th className="px-3 py-3">Cláusula ISO</th>
                <th className="px-3 py-3">Estado</th>
                <th className="px-3 py-3 text-right">Historial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-850/60 transition-colors">
                  <td className="px-3 py-3 font-mono font-semibold text-orange-400 whitespace-nowrap">
                    {doc.codigo}
                  </td>
                  <td className="px-4 py-3 max-w-sm">
                    <p className="font-semibold text-white leading-tight">{doc.titulo}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">Resp: {doc.responsableElaboracion}</p>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-slate-400 text-[11px] font-mono">
                    {doc.categoria.replace(/_/g, ' ')}
                  </td>
                  <td className="px-2 py-3 text-center font-mono font-bold text-white">
                    v.{doc.version}
                  </td>
                  <td className="px-3 py-3 font-mono text-slate-300 whitespace-nowrap">
                    {doc.fechaAprobacion}
                  </td>
                  <td className="px-3 py-3 text-slate-300 whitespace-nowrap">
                    {doc.responsableAprobacion}
                  </td>
                  <td className="px-3 py-3 font-mono text-slate-400 whitespace-nowrap">
                    ISO {doc.clausulaISO}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <StatusBadge status={doc.estado} />
                  </td>
                  <td className="px-3 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedDocForHistory(doc)}
                      className="px-2.5 py-1 text-[11px] font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors inline-flex items-center gap-1"
                    >
                      <History className="w-3 h-3 text-orange-400" />
                      Historial ({doc.historialCambios?.length || 1})
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Historial de Versiones */}
      {selectedDocForHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-6 space-y-4 text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-semibold text-white">Historial de Control de Cambios</h3>
                <p className="text-slate-400 font-mono text-[11px]">{selectedDocForHistory.codigo} · {selectedDocForHistory.titulo}</p>
              </div>
              <button onClick={() => setSelectedDocForHistory(null)} className="text-slate-400 hover:text-white">&times;</button>
            </div>

            <div className="space-y-3">
              {selectedDocForHistory.historialCambios?.map((h, idx) => (
                <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded space-y-1">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="font-bold text-orange-400">Versión {h.version}</span>
                    <span className="text-slate-400">{h.fecha}</span>
                  </div>
                  <p className="text-slate-200">{h.motivo}</p>
                  <p className="text-[10px] text-slate-500 font-mono">Autor: {h.autor}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedDocForHistory(null)}
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
