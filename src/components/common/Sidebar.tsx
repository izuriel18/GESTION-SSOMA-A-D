/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GESTIÓN SSOMA A&D - Menú Lateral de 15 Módulos
 * Identidad Visual: Azul Petróleo, Azul Marino, Gris Industrial, Acento Naranja
 */

import React from 'react';
import { useSSOMA } from '../../context/SSOMAContext';
import {
  LayoutDashboard,
  CalendarCheck2,
  AlertTriangle,
  Scale,
  ShieldCheck,
  FlaskConical,
  HeartPulse,
  HardHat,
  GraduationCap,
  Flame,
  FileCheck2,
  FileSpreadsheet,
  CheckSquare,
  BarChart3,
  Settings,
  X,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const {
    activeModule,
    setActiveModule,
    criticalFindingsCount,
    chemicals,
    activities,
    currentUser
  } = useSSOMA();

  // Badges y contadores calculados
  const sdsVencidas = chemicals.filter(c => c.sdsEstado === 'VENCIDA').length;
  const actividadesPendientes = activities.filter(a => a.estado === 'PENDIENTE' || a.estado === 'VENCIDO').length;

  const modules = [
    {
      id: '01_dashboard',
      code: '01',
      label: 'DASHBOARD GENERAL',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: '02_planificacion',
      code: '02',
      label: 'PLANIFICACIÓN SSOMA',
      icon: CalendarCheck2,
      badge: actividadesPendientes > 0 ? `${actividadesPendientes}` : null,
      badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-800'
    },
    {
      id: '03_iperc',
      code: '03',
      label: 'GESTIÓN DE RIESGOS - IPERC',
      icon: AlertTriangle,
      badge: null
    },
    {
      id: '04_legales',
      code: '04',
      label: 'REQUISITOS LEGALES',
      icon: Scale,
      badge: null
    },
    {
      id: '05_operacional',
      code: '05',
      label: 'SEGURIDAD OPERACIONAL',
      icon: ShieldCheck,
      badge: null
    },
    {
      id: '06_quimicas',
      code: '06',
      label: 'SUSTANCIAS QUÍMICAS',
      icon: FlaskConical,
      badge: sdsVencidas > 0 ? `${sdsVencidas} SDS` : null,
      badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-800'
    },
    {
      id: '07_salud',
      code: '07',
      label: 'SALUD OCUPACIONAL',
      icon: HeartPulse,
      badge: null
    },
    {
      id: '08_epp',
      code: '08',
      label: 'GESTIÓN DE EPP',
      icon: HardHat,
      badge: null
    },
    {
      id: '09_capacitaciones',
      code: '09',
      label: 'CAPACITACIONES',
      icon: GraduationCap,
      badge: null
    },
    {
      id: '10_incidentes',
      code: '10',
      label: 'ACCIDENTES E INCIDENTES',
      icon: Flame,
      badge: null
    },
    {
      id: '11_documental',
      code: '11',
      label: 'GESTIÓN DOCUMENTAL',
      icon: FileCheck2,
      badge: null
    },
    {
      id: '12_auditorias',
      code: '12',
      label: 'AUDITORÍAS',
      icon: FileSpreadsheet,
      badge: null
    },
    {
      id: '13_correctivas',
      code: '13',
      label: 'ACCIONES CORRECTIVAS',
      icon: CheckSquare,
      badge: criticalFindingsCount > 0 ? `${criticalFindingsCount}` : null,
      badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-800'
    },
    {
      id: '14_reportes',
      code: '14',
      label: 'REPORTES E INDICADORES',
      icon: BarChart3,
      badge: null
    },
    {
      id: '15_configuracion',
      code: '15',
      label: 'CONFIGURACIÓN DEL SISTEMA',
      icon: Settings,
      badge: null
    }
  ];

  const handleSelect = (id: string) => {
    setActiveModule(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 lg:w-72 bg-slate-950 border-r border-slate-800/90 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 shrink-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/90 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded bg-orange-600 text-white font-black text-sm shadow-md">
              A&amp;D
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>GESTIÓN SSOMA</span>
              </div>
              <div className="text-[10px] text-slate-400 tracking-wider uppercase font-mono">
                Sector Químico · ISO 45001
              </div>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 text-slate-400 hover:text-white lg:hidden rounded hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Company & User Profile Mini Strip */}
        <div className="px-5 py-2.5 bg-slate-900/60 border-b border-slate-800/60 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-mono text-[10px] uppercase text-orange-400 font-semibold tracking-wider">
              Operador Activo
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Ley 29783</span>
          </div>
          <p className="text-xs font-semibold text-slate-200 truncate mt-0.5">{currentUser.name}</p>
          <p className="text-[11px] text-slate-400 font-mono truncate">{currentUser.cipOCol}</p>
        </div>

        {/* Navigation Modules (15 modules) */}
        <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
          <div className="px-2.5 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Módulos del Sistema
          </div>
          {modules.map((m) => {
            const Icon = m.icon;
            const isActive = activeModule === m.id;

            return (
              <button
                key={m.id}
                onClick={() => handleSelect(m.id)}
                className={`group flex items-center justify-between w-full px-2.5 py-2 text-xs font-medium rounded transition-colors text-left ${
                  isActive
                    ? 'bg-slate-800/90 text-white font-semibold shadow-xs border-l-2 border-orange-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-orange-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                  <div className="flex items-baseline gap-1.5 truncate">
                    <span className="font-mono text-[10px] text-slate-500 shrink-0">
                      {m.code}.
                    </span>
                    <span className="truncate">{m.label}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-1">
                  {m.badge && (
                    <span
                      className={`px-1.5 py-0.2 text-[10px] font-mono border rounded font-semibold ${
                        m.badgeColor || 'text-slate-300 bg-slate-800 border-slate-700'
                      }`}
                    >
                      {m.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-orange-400 shrink-0" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Legal & Standards footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800/90 text-[11px] text-slate-400">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-mono text-[10px]">ISO 45001:2018</span>
            <span className="font-mono text-[10px]">D.S. 005-2012-TR</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-400 truncate">
            Química &amp; Derivados Ind. S.A.C.
          </div>
        </div>
      </aside>
    </>
  );
};
