/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MÓDULO 08: GESTIÓN DE EQUIPOS DE PROTECCIÓN PERSONAL (EPP)
 * Catálogo homologado de EPP para sector químico, kardex de asignación y vida útil.
 */

import React, { useState } from 'react';
import { useSSOMA } from '../../context/SSOMAContext';
import { EPPItem, EPPDeliveryRecord } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  HardHat,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Shield,
  FileCheck,
  Package
} from 'lucide-react';

export const GestionEPPModule: React.FC = () => {
  const { eppItems, eppDeliveries, saveEPPDelivery } = useSSOMA();

  const [activeTab, setActiveTab] = useState<'KARDEX' | 'CATALOGO'>('KARDEX');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  // Formulario Entrega de EPP
  const [dni, setDni] = useState('');
  const [nombre, setNombre] = useState('');
  const [puesto, setPuesto] = useState('');
  const [selectedEppId, setSelectedEppId] = useState(eppItems[0]?.id || '');
  const [cantidad, setCantidad] = useState(1);
  const [motivo, setMotivo] = useState<'DOTACION_INICIAL' | 'RENOVACION_PERIODICA' | 'DETERIORO_OPERATIVO' | 'PERDIDA'>('RENOVACION_PERIODICA');

  const filteredDeliveries = eppDeliveries.filter((d) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        d.nombreTrabajador.toLowerCase().includes(q) ||
        d.dniTrabajador.includes(q) ||
        d.eppNombre.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRegisterDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dni.trim() || !nombre.trim()) return;

    const eppObj = eppItems.find(i => i.id === selectedEppId);
    const vidaUtilMeses = eppObj?.vidaUtilMeses || 6;

    const proximaFecha = new Date();
    proximaFecha.setMonth(proximaFecha.getMonth() + vidaUtilMeses);

    const newDelivery: EPPDeliveryRecord = {
      id: `deliv-${Date.now()}`,
      fechaEntrega: new Date().toISOString().split('T')[0],
      dniTrabajador: dni.trim(),
      nombreTrabajador: nombre.trim(),
      puestoTrabajo: puesto.trim() || 'Operador de Planta Química',
      eppId: selectedEppId,
      eppNombre: eppObj?.nombre || 'EPP Químico',
      cantidad: Number(cantidad),
      motivo,
      proximaRenovacion: proximaFecha.toISOString().split('T')[0],
      conformidadFirmada: true,
      estado: 'VIGENTE'
    };

    saveEPPDelivery(newDelivery);
    setShowDeliveryModal(false);
    setDni('');
    setNombre('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">Gestión de Equipos de Protección (EPP)</h1>
            <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
              D.S. 005-2012-TR Art. 33 · NTP ISO 20345 / ANSI Z87.1
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Control de dotación y reposición periódica de EPP certificados, control de vida útil por horas de exposición a químicos y registro de entrega firmado.
          </p>
        </div>

        <button
          onClick={() => setShowDeliveryModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Registrar Entrega de EPP
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('KARDEX')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded transition-colors ${
            activeTab === 'KARDEX'
              ? 'bg-slate-800 text-orange-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Kardex de Asignación por Trabajador ({eppDeliveries.length})
        </button>
        <button
          onClick={() => setActiveTab('CATALOGO')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded transition-colors ${
            activeTab === 'CATALOGO'
              ? 'bg-slate-800 text-orange-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          Catálogo Homologado para Químicos ({eppItems.length})
        </button>
      </div>

      {/* Vista Kardex */}
      {activeTab === 'KARDEX' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por trabajador, DNI o EPP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white placeholder-slate-500 focus:outline-hidden font-mono"
              />
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Entregas registradas: {filteredDeliveries.length}
            </span>
          </div>

          <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400">
                <tr>
                  <th className="px-3 py-3">Fecha Entrega</th>
                  <th className="px-4 py-3">Trabajador &amp; DNI</th>
                  <th className="px-3 py-3">Puesto</th>
                  <th className="px-4 py-3">Equipo Entregado</th>
                  <th className="px-2 py-3 text-center">Cant.</th>
                  <th className="px-3 py-3">Motivo</th>
                  <th className="px-3 py-3">Próx. Renovación</th>
                  <th className="px-3 py-3">Conformidad</th>
                  <th className="px-3 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredDeliveries.map((deliv) => (
                  <tr key={deliv.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="px-3 py-3 font-mono text-slate-400 whitespace-nowrap">
                      {deliv.fechaEntrega}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="font-semibold text-white">{deliv.nombreTrabajador}</p>
                      <p className="text-[11px] font-mono text-slate-400">DNI: {deliv.dniTrabajador}</p>
                    </td>
                    <td className="px-3 py-3 text-slate-300 whitespace-nowrap">
                      {deliv.puestoTrabajo}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-200">
                      {deliv.eppNombre}
                    </td>
                    <td className="px-2 py-3 text-center font-mono font-bold text-white">
                      {deliv.cantidad}
                    </td>
                    <td className="px-3 py-3 text-slate-400 text-[11px] whitespace-nowrap">
                      {deliv.motivo.replace(/_/g, ' ')}
                    </td>
                    <td className="px-3 py-3 font-mono text-orange-400 whitespace-nowrap">
                      {deliv.proximaRenovacion}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Firmado
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <StatusBadge status={deliv.estado} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vista Catálogo Homologado */}
      {activeTab === 'CATALOGO' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {eppItems.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-mono text-xs font-semibold text-orange-400">{item.codigo}</span>
                  <h3 className="text-sm font-bold text-white mt-0.5">{item.nombre}</h3>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{item.categoria.replace(/_/g, ' ')}</p>
                </div>
                <div className="p-2 bg-slate-950 border border-slate-800 rounded text-right shrink-0">
                  <span className="text-[10px] text-slate-500 font-mono block">Stock Bodega</span>
                  <span className="text-lg font-bold font-mono text-white tabular-nums">{item.stockAlmacen}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{item.especificacionTecnica}</p>

              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Norma de Certificación:</span>
                  <span className="text-slate-200 font-semibold">{item.normaCertificacion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vida Útil Estándar:</span>
                  <span className="text-orange-400">{item.vidaUtilMeses} meses</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Protección Efectiva Frente a:
                </span>
                <div className="flex flex-wrap gap-1">
                  {item.sustanciasAplicables.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-300 rounded border border-slate-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Registrar Entrega */}
      {showDeliveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-6 space-y-4 text-xs animate-in fade-in zoom-in-95">
            <h3 className="text-base font-semibold text-white">Registro de Entrega de EPP (Formato R.M. 050-2013-TR)</h3>

            <form onSubmit={handleRegisterDelivery} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">DNI del Trabajador *</label>
                  <input
                    type="text"
                    required
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="8 dígitos"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombres y Apellidos"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Puesto de Trabajo</label>
                <input
                  type="text"
                  value={puesto}
                  onChange={(e) => setPuesto(e.target.value)}
                  placeholder="Ej: Operador de Reactores Químicos"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Equipo de Protección (Catálogo) *</label>
                <select
                  value={selectedEppId}
                  onChange={(e) => setSelectedEppId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                >
                  {eppItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.codigo} - {item.nombre} (Stock: {item.stockAlmacen})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Cantidad Entregada</label>
                  <input
                    type="number"
                    min={1}
                    value={cantidad}
                    onChange={(e) => setCantidad(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Motivo de la Entrega</label>
                  <select
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  >
                    <option value="RENOVACION_PERIODICA">Renovación Periódica</option>
                    <option value="DOTACION_INICIAL">Dotación Inicial</option>
                    <option value="DETERIORO_OPERATIVO">Deterioro Operativo</option>
                    <option value="PERDIDA">Pérdida / Reposición</option>
                  </select>
                </div>
              </div>

              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded text-[11px] text-slate-400">
                Se registrará la fecha de renovación automática calculada según la vida útil homologada del equipo.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDeliveryModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded"
                >
                  Guardar Entrega y Acta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
