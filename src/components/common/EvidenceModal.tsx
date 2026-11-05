/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GESTIÓN SSOMA A&D - Modal de Registro de Evidencia Documentada
 * Regla: No permitir marcar actividades como ejecutadas sin evidencia o justificación.
 */

import React, { useState } from 'react';
import { PlanActivity } from '../../types';
import { ShieldCheck, Upload, AlertCircle, X, FileText, CheckCircle2 } from 'lucide-react';

interface EvidenceModalProps {
  activity: PlanActivity | null;
  onClose: () => void;
  onConfirm: (evidence: { titulo: string; justificacion: string; fechaEjecucion: string; url?: string }) => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({ activity, onClose, onConfirm }) => {
  const [titulo, setTitulo] = useState('');
  const [justificacion, setJustificacion] = useState('');
  const [fechaEjecucion, setFechaEjecucion] = useState(new Date().toISOString().split('T')[0]);
  const [archivoSimulado, setArchivoSimulado] = useState('Informe_Tecnico_Evidencia.pdf');
  const [error, setError] = useState<string | null>(null);

  if (!activity) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      setError('Debe ingresar el título formal de la evidencia o código de acta.');
      return;
    }
    if (!justificacion.trim() || justificacion.trim().length < 15) {
      setError('La justificación técnica documentada debe tener al menos 15 caracteres para garantizar trazabilidad.');
      return;
    }

    onConfirm({
      titulo: titulo.trim(),
      justificacion: justificacion.trim(),
      fechaEjecucion,
      url: `/storage/evidencias/${activity.codigo}_${Date.now()}.pdf`
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600/20 text-orange-400 border border-orange-500/30 rounded">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Registro de Ejecución y Evidencia</h3>
              <p className="text-xs text-slate-400 font-mono">Código: {activity.codigo} · ISO 45001 Cl. {activity.clausulaISO}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded text-sm text-slate-300">
            <p className="text-xs text-slate-400 uppercase font-mono tracking-wider mb-1">Actividad Programada:</p>
            <p className="font-medium text-slate-100">{activity.actividad}</p>
            <p className="text-xs text-slate-400 mt-1">Responsable: {activity.responsable}</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Título o Código del Documento de Evidencia *
            </label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => {
                setTitulo(e.target.value);
                setError(null);
              }}
              placeholder="Ej: Acta de Reunión Ordinaria N° 03-2026 / Informe INSP-2026-024"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-orange-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Fecha de Ejecución Real *
              </label>
              <input
                type="date"
                required
                value={fechaEjecucion}
                onChange={(e) => setFechaEjecucion(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-sm text-white focus:outline-hidden focus:border-orange-500 transition-colors font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Archivo de Evidencia (PDF / Acta)
              </label>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-950 border border-slate-700 rounded text-xs text-slate-300 font-mono">
                <FileText className="w-4 h-4 text-orange-400" />
                <span className="truncate flex-1">{archivoSimulado}</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-sans">
                  <CheckCircle2 className="w-3 h-3" /> Adjunto
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Justificación Documentada de Cierre Técnico *
            </label>
            <textarea
              required
              rows={3}
              value={justificacion}
              onChange={(e) => {
                setJustificacion(e.target.value);
                setError(null);
              }}
              placeholder="Describa el resultado de la ejecución, personas involucradas, conformidad técnica o hallazgos verificados para sustento de auditoría."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-orange-500 transition-colors"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Obligatorio según ISO 45001 (Cl. 7.5 Información Documentada) y Ley 29783.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded shadow-md transition-colors"
            >
              <Upload className="w-4 h-4" />
              Validar y Marcar Ejecutado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
