/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MÓDULO 05: SEGURIDAD OPERACIONAL
 * Formularios e Informes de Inspección (Áreas, Duchas de Emergencia, Extintores, 5S)
 * Generación de informe descargable/imprimible y relación con Acciones Correctivas.
 */

import React, { useState } from 'react';
import { useSSOMA } from '../../context/SSOMAContext';
import { OperationalInspection, InspectionType, InspectionCheckItem } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ShieldCheck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  FileDown,
  Printer,
  Calendar,
  Eye,
  Camera,
  AlertTriangle,
  Building
} from 'lucide-react';

export const SeguridadOperacionalModule: React.FC = () => {
  const { inspections, saveInspection, selectedSede, currentUser, activities } = useSSOMA();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<string>('TODOS');
  const [selectedInspectionForReport, setSelectedInspectionForReport] = useState<OperationalInspection | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  // Formulario Nueva Inspección
  const [tipo, setTipo] = useState<InspectionType>('AREAS_QUIMICAS');
  const [area, setArea] = useState('');
  const [actividadPlanId, setActividadPlanId] = useState<string>('');
  const [inspector, setInspector] = useState(currentUser.name);
  const [cargoInspector, setCargoInspector] = useState('Supervisor SSOMA');
  const [responsableSubsanacion, setResponsableSubsanacion] = useState('');
  const [fechaCompromiso, setFechaCompromiso] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [observacionesGenerales, setObservacionesGenerales] = useState('');

  // Checklists dinámicos según tipo de inspección
  const defaultChecklists: Record<InspectionType, { criterio: string; criticidad: 'BAJA' | 'MEDIA' | 'ALTA' }[]> = {
    AREAS_QUIMICAS: [
      { criterio: 'Diques de contención de tanques libres de fisuras y con capacidad ≥ 110%', criticidad: 'ALTA' },
      { criterio: 'Hojas de Datos de Seguridad (SDS) visibles y vigentes en el punto de trasvase', criticidad: 'MEDIA' },
      { criterio: 'Kit antiderrame (paños absorbentes, cordones, palas antiestáticas) operativo', criticidad: 'ALTA' },
      { criterio: 'Sistema de ventilación forzada o extracción localizada funcionando', criticidad: 'ALTA' },
      { criterio: 'Uso obligatorio del EPP específico (respirador, traje Tychem, guantes butilo)', criticidad: 'ALTA' }
    ],
    LAVAOJOS_DUCHAS: [
      { criterio: 'Válvula de activación manual/pedal se abre en menos de 1 segundo (ANSI Z358.1)', criticidad: 'ALTA' },
      { criterio: 'Caudal y presión de agua continuo sin requerir sujeción constante', criticidad: 'ALTA' },
      { criterio: 'Tapas de protección antipolvo de los difusores lavaojos presentes', criticidad: 'MEDIA' },
      { criterio: 'Acceso perimetral completamente despejado en radio de 1 metro', criticidad: 'ALTA' },
      { criterio: 'Señalización fotoluminiscente visible y registro de prueba semanal firmado', criticidad: 'BAJA' }
    ],
    EXTINTORES: [
      { criterio: 'Manómetro en zona verde de presión operativa (PQS / Agua)', criticidad: 'ALTA' },
      { criterio: 'Precinto de seguridad y pasador metálico intactos', criticidad: 'ALTA' },
      { criterio: 'Manguera y corneta sin grietas, obstrucciones ni deformaciones', criticidad: 'MEDIA' },
      { criterio: 'Tarjeta de inspección mensual al día y prueba hidrostática vigente', criticidad: 'MEDIA' },
      { criterio: 'Altura de montaje y señalización reglamentaria conforme a NTP 350.043', criticidad: 'BAJA' }
    ],
    HERRAMIENTAS: [
      { criterio: 'Herramientas antichispa (cobre-berilio o bronce) en zonas ATEX de solventes', criticidad: 'ALTA' },
      { criterio: 'Aislamiento dieléctrico sin rajaduras ni empalmes improvisados', criticidad: 'ALTA' },
      { criterio: 'Cables eléctricos y enchufes industriales tipo Legrand sin conductores expuestos', criticidad: 'ALTA' },
      { criterio: 'Almacenamiento ordenado en cajas porta-herramientas con código de color del mes', criticidad: 'BAJA' }
    ],
    ORDEN_LIMPIEZA_5S: [
      { criterio: 'Pasillos y vías de evacuación libres de bultos, cables o residuos químicos', criticidad: 'ALTA' },
      { criterio: 'Demarcación de pisos (zonas de tránsito, almacenaje y equipos de emergencia)', criticidad: 'MEDIA' },
      { criterio: 'Tachos de residuos sólidos clasificados según código de colores NTP 900.058', criticidad: 'MEDIA' },
      { criterio: 'Ausencia de trapos o paños con solventes acumulados fuera de recipientes herméticos', criticidad: 'ALTA' }
    ],
    CONDICIONES_SEGURIDAD: [
      { criterio: 'Iluminación general y de emergencia operativa en naves industriales', criticidad: 'ALTA' },
      { criterio: 'Paradas de emergencia y enclavamientos de reactores operativas', criticidad: 'ALTA' },
      { criterio: 'Conexiones a tierra y barras equipotenciales de descarga estática operativas', criticidad: 'ALTA' }
    ]
  };

  const [itemsChecklist, setItemsChecklist] = useState<InspectionCheckItem[]>(
    defaultChecklists.AREAS_QUIMICAS.map((it, idx) => ({
      id: `chk-${idx}`,
      criterio: it.criterio,
      resultado: 'CONFORME',
      observacion: '',
      criticidad: it.criticidad
    }))
  );

  const handleTipoChange = (newTipo: InspectionType) => {
    setTipo(newTipo);
    setItemsChecklist(
      defaultChecklists[newTipo].map((it, idx) => ({
        id: `chk-${idx}`,
        criterio: it.criterio,
        resultado: 'CONFORME',
        observacion: '',
        criticidad: it.criticidad
      }))
    );
  };

  const handleItemResultChange = (id: string, resultado: 'CONFORME' | 'NO_CONFORME' | 'NO_APLICA') => {
    setItemsChecklist(prev =>
      prev.map(item => item.id === id ? { ...item, resultado } : item)
    );
  };

  const handleItemObsChange = (id: string, observacion: string) => {
    setItemsChecklist(prev =>
      prev.map(item => item.id === id ? { ...item, observacion } : item)
    );
  };

  const handleSaveNewInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!area.trim()) return;

    const totalEvaluados = itemsChecklist.filter(i => i.resultado !== 'NO_APLICA').length;
    const totalConformes = itemsChecklist.filter(i => i.resultado === 'CONFORME').length;
    const porcentaje = totalEvaluados > 0 ? Math.round((totalConformes / totalEvaluados) * 100) : 100;
    const hallazgosCrit = itemsChecklist.filter(i => i.resultado === 'NO_CONFORME' && i.criticidad === 'ALTA').length;

    const newInsp: OperationalInspection = {
      id: `insp-${Date.now()}`,
      codigo: `INSP-2026-${String(inspections.length + 1).padStart(3, '0')}`,
      fecha: new Date().toISOString().split('T')[0],
      sede: selectedSede === 'TODAS' ? 'SEDE_CENTRAL_LURIN' : selectedSede,
      area: area.trim(),
      inspector: inspector.trim(),
      cargoInspector: cargoInspector.trim(),
      tipo,
      items: itemsChecklist,
      porcentajeConformidad: porcentaje,
      hallazgosCriticos: hallazgosCrit,
      observacionesGenerales: observacionesGenerales.trim() || 'Inspección concluida según procedimiento de seguridad operacional.',
      responsableSubsanacion: responsableSubsanacion.trim() || 'Supervisor de Área',
      fechaCompromiso,
      firmado: true,
      estado: hallazgosCrit > 0 ? 'CON_ACCIONES_ABIERTAS' : 'CONCLUIDA',
      actividadPlanId: actividadPlanId || undefined
    };

    saveInspection(newInsp);
    setShowNewModal(false);
    setSelectedInspectionForReport(newInsp);
  };

  const filteredInspections = inspections.filter(insp => {
    if (filterTipo !== 'TODOS' && insp.tipo !== filterTipo) return false;
    if (selectedSede !== 'TODAS' && insp.sede !== 'TODAS' && insp.sede !== selectedSede) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        insp.area.toLowerCase().includes(q) ||
        insp.codigo.toLowerCase().includes(q) ||
        insp.inspector.toLowerCase().includes(q)
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
            <h1 className="text-xl font-bold tracking-tight text-white">Seguridad Operacional &amp; Inspecciones</h1>
            <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
              ISO 45001 Cl. 8.1.1 · D.S. 005-2012-TR Art. 42
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Inspecciones planeadas de áreas químicas, duchas y lavaojos de emergencia, extintores, herramientas y orden 5S con emisión directa de informes técnicos descargables.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Ejecutar Nueva Inspección
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por área, código de inspección o inspector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white placeholder-slate-500 focus:outline-hidden font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-500" /> Tipo:
          </span>
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 focus:outline-hidden font-mono"
          >
            <option value="TODOS">Todos los Tipos</option>
            <option value="AREAS_QUIMICAS">Áreas Químicas</option>
            <option value="LAVAOJOS_DUCHAS">Lavaojos y Duchas</option>
            <option value="EXTINTORES">Extintores</option>
            <option value="HERRAMIENTAS">Herramientas</option>
            <option value="ORDEN_LIMPIEZA_5S">Orden y Limpieza 5S</option>
            <option value="CONDICIONES_SEGURIDAD">Condiciones de Seguridad</option>
          </select>
        </div>
      </div>

      {/* Tabla de Historial de Inspecciones */}
      <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400">
              <tr>
                <th className="px-3 py-3">Código</th>
                <th className="px-3 py-3">Fecha</th>
                <th className="px-3 py-3">Tipo de Inspección</th>
                <th className="px-4 py-3">Área Evaluada</th>
                <th className="px-3 py-3">Inspector SSOMA</th>
                <th className="px-3 py-3 text-center">Conformidad</th>
                <th className="px-3 py-3 text-center">Hallazgos Críticos</th>
                <th className="px-3 py-3">Estado</th>
                <th className="px-3 py-3 text-right">Informe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredInspections.map((insp) => (
                <tr key={insp.id} className="hover:bg-slate-850/60 transition-colors">
                  <td className="px-3 py-3 font-mono font-semibold text-orange-400 whitespace-nowrap">
                    {insp.codigo}
                  </td>
                  <td className="px-3 py-3 font-mono text-slate-300 whitespace-nowrap">
                    {insp.fecha}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap font-medium text-white">
                    {insp.tipo.replace(/_/g, ' ')}
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate text-slate-300">
                    {insp.area}
                  </td>
                  <td className="px-3 py-3 text-slate-300 whitespace-nowrap">
                    {insp.inspector}
                  </td>
                  <td className="px-3 py-3 text-center whitespace-nowrap">
                    <span className={`font-mono font-bold ${insp.porcentajeConformidad === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {insp.porcentajeConformidad}%
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center whitespace-nowrap">
                    {insp.hallazgosCriticos > 0 ? (
                      <span className="font-mono text-rose-400 font-bold bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
                        {insp.hallazgosCriticos} Críticos
                      </span>
                    ) : (
                      <span className="font-mono text-emerald-400 text-[11px]">0 Hallazgos</span>
                    )}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <StatusBadge status={insp.estado} />
                  </td>
                  <td className="px-3 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedInspectionForReport(insp)}
                      className="px-2.5 py-1 text-[11px] font-mono text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3 text-orange-400" />
                      Ver Informe
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nueva Inspección */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
              <div>
                <h3 className="text-base font-semibold text-white">Formulario Técnico de Inspección Operacional</h3>
                <p className="text-xs text-slate-400 font-mono">Conforme a D.S. 005-2012-TR y estándares de seguridad química</p>
              </div>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-white">&times;</button>
            </div>

            <form onSubmit={handleSaveNewInspection} className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">
                    Tipo de Inspección *
                  </label>
                  <select
                    value={tipo}
                    onChange={(e) => handleTipoChange(e.target.value as InspectionType)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  >
                    <option value="AREAS_QUIMICAS">Inspección de Áreas Químicas</option>
                    <option value="LAVAOJOS_DUCHAS">Inspección de Duchas y Lavaojos (ANSI Z358.1)</option>
                    <option value="EXTINTORES">Inspección de Extintores (NTP 350.043)</option>
                    <option value="HERRAMIENTAS">Inspección de Herramientas Antichispa</option>
                    <option value="ORDEN_LIMPIEZA_5S">Inspección de Orden y Limpieza (5S)</option>
                    <option value="CONDICIONES_SEGURIDAD">Inspección de Condiciones de Seguridad</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">
                    Área o Ubicación Exacta *
                  </label>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Ej: Nave de Reactores R-101 / Patio de Tanques TK-102"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">
                    Inspector SSOMA
                  </label>
                  <input
                    type="text"
                    value={inspector}
                    onChange={(e) => setInspector(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">
                    Cargo del Inspector
                  </label>
                  <input
                    type="text"
                    value={cargoInspector}
                    onChange={(e) => setCargoInspector(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>
              </div>

              {/* Vinculación con Actividad del Programa Anual SST */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded">
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[11px] flex items-center justify-between">
                  <span>Vincular a Actividad del Programa Anual SST (Opcional)</span>
                  <span className="text-orange-400 font-mono text-[10px]">Trazabilidad Automática</span>
                </label>
                <select
                  value={actividadPlanId}
                  onChange={(e) => setActividadPlanId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white font-mono text-xs"
                >
                  <option value="">-- Sin vinculación a actividad programada --</option>
                  {activities
                    .filter(a => a.programaTipo === 'INSPECCION' || a.programaTipo === 'SST')
                    .map(act => (
                      <option key={act.id} value={act.id}>
                        [{act.codigo}] Mes {act.mesProgramado} - {act.actividad} ({act.estado})
                      </option>
                    ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  Al vincular, el sistema marcará automáticamente la actividad como <strong>EJECUTADA</strong> en el mes programado, guardará el informe como evidencia y actualizará el Dashboard.
                </p>
              </div>

              {/* Checklist dinámico */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-slate-300 font-semibold border-b border-slate-800 pb-1">
                  <span>Lista de Verificación de Criterios Técnicos</span>
                  <span className="text-[10px] text-slate-400 font-mono">C = Conforme | NC = No Conforme | NA = No Aplica</span>
                </div>

                <div className="space-y-2">
                  {itemsChecklist.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-950 border border-slate-800 rounded space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-slate-200 font-medium">{item.criterio}</p>
                          <span className={`inline-block mt-0.5 text-[10px] font-mono px-1 rounded ${
                            item.criticidad === 'ALTA' ? 'text-rose-400 bg-rose-950/40' : 'text-slate-400'
                          }`}>
                            Criticidad: {item.criticidad}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleItemResultChange(item.id, 'CONFORME')}
                            className={`px-2.5 py-1 rounded font-mono text-[11px] font-semibold transition-colors ${
                              item.resultado === 'CONFORME'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            Conforme
                          </button>
                          <button
                            type="button"
                            onClick={() => handleItemResultChange(item.id, 'NO_CONFORME')}
                            className={`px-2.5 py-1 rounded font-mono text-[11px] font-semibold transition-colors ${
                              item.resultado === 'NO_CONFORME'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            No Conforme
                          </button>
                          <button
                            type="button"
                            onClick={() => handleItemResultChange(item.id, 'NO_APLICA')}
                            className={`px-2.5 py-1 rounded font-mono text-[11px] transition-colors ${
                              item.resultado === 'NO_APLICA'
                                ? 'bg-slate-700 text-white'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            N/A
                          </button>
                        </div>
                      </div>

                      {item.resultado === 'NO_CONFORME' && (
                        <div>
                          <input
                            type="text"
                            required
                            placeholder="Describa el hallazgo o desviación observada (Obligatorio si NC)..."
                            value={item.observacion || ''}
                            onChange={(e) => handleItemObsChange(item.id, e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-900 border border-rose-800 rounded text-rose-200 placeholder-rose-400/50 text-xs"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">
                  Observaciones Generales de la Inspección
                </label>
                <textarea
                  rows={2}
                  value={observacionesGenerales}
                  onChange={(e) => setObservacionesGenerales(e.target.value)}
                  placeholder="Resumen del recorrido, estado general de orden y recomendaciones..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">
                    Responsable de Subsanación
                  </label>
                  <input
                    type="text"
                    value={responsableSubsanacion}
                    onChange={(e) => setResponsableSubsanacion(e.target.value)}
                    placeholder="Ej: Jefe de Mantenimiento / Operaciones"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider">
                    Fecha Compromiso de Cierre
                  </label>
                  <input
                    type="date"
                    value={fechaCompromiso}
                    onChange={(e) => setFechaCompromiso(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded"
                >
                  Guardar Inspección y Generar Reporte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Visor de Informe Descargable / Imprimible (PDF Preview) */}
      {selectedInspectionForReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
            {/* Header Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-semibold text-white">
                  Informe de Inspección: {selectedInspectionForReport.codigo}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-orange-400" />
                  Imprimir / Descargar PDF
                </button>
                <button
                  onClick={() => setSelectedInspectionForReport(null)}
                  className="text-slate-400 hover:text-white text-lg px-2"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Printable Document Format */}
            <div className="p-8 space-y-6 overflow-y-auto text-xs bg-slate-900 text-slate-200">
              {/* Document Header Format */}
              <div className="border border-slate-700 p-4 rounded bg-slate-950 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                      QUÍMICA &amp; DERIVADOS INDUSTRIALES S.A.C.
                    </h2>
                    <p className="text-[11px] text-slate-400 font-mono">
                      SISTEMA DE GESTIÓN DE SEGURIDAD, SALUD Y MEDIO AMBIENTE (SSOMA)
                    </p>
                  </div>
                  <div className="text-right font-mono text-[11px] text-slate-400">
                    <p className="text-orange-400 font-bold">{selectedInspectionForReport.codigo}</p>
                    <p>Fecha: {selectedInspectionForReport.fecha}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-500 font-mono block">Sede:</span>
                    <span className="font-semibold text-white">{selectedInspectionForReport.sede}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono block">Área:</span>
                    <span className="font-semibold text-white">{selectedInspectionForReport.area}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono block">Inspector:</span>
                    <span className="font-semibold text-white">{selectedInspectionForReport.inspector}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono block">Conformidad:</span>
                    <span className="font-bold text-emerald-400 font-mono text-sm">
                      {selectedInspectionForReport.porcentajeConformidad}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-800 rounded overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Criterio Evaluado</th>
                      <th className="p-2.5 text-center">Criticidad</th>
                      <th className="p-2.5 text-center">Resultado</th>
                      <th className="p-2.5">Observación Técnica</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {selectedInspectionForReport.items.map((it, idx) => (
                      <tr key={idx} className="bg-slate-950/40">
                        <td className="p-2.5 text-slate-200">{it.criterio}</td>
                        <td className="p-2.5 text-center font-mono text-[10px] text-slate-400">{it.criticidad}</td>
                        <td className="p-2.5 text-center">
                          <StatusBadge status={it.resultado} />
                        </td>
                        <td className="p-2.5 text-slate-400 text-[11px]">{it.observacion || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary and Signatures */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                  Conclusiones y Dictamen del Inspector
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedInspectionForReport.observacionesGenerales}
                </p>
                <div className="pt-2 text-[11px] text-slate-400 flex justify-between font-mono">
                  <span>Subsanación asignada a: {selectedInspectionForReport.responsableSubsanacion}</span>
                  <span>Compromiso de cierre: {selectedInspectionForReport.fechaCompromiso}</span>
                </div>
              </div>

              {/* Signature boxes */}
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="border-t border-slate-700 pt-2 text-center text-[11px] text-slate-400 font-mono">
                  <p className="font-semibold text-slate-200">{selectedInspectionForReport.inspector}</p>
                  <p>{selectedInspectionForReport.cargoInspector}</p>
                  <p className="text-[10px] text-emerald-400 mt-1">Firma Digital Validada</p>
                </div>
                <div className="border-t border-slate-700 pt-2 text-center text-[11px] text-slate-400 font-mono">
                  <p className="font-semibold text-slate-200">{selectedInspectionForReport.responsableSubsanacion}</p>
                  <p>Responsable del Área / Subsanación</p>
                  <p className="text-[10px] text-slate-500 mt-1">Conformidad de Notificación</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
