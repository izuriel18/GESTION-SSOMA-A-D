/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GESTIÓN SSOMA A&D - Barra Superior (Top Bar Contract)
 */

import React, { useState } from 'react';
import { useSSOMA } from '../../context/SSOMAContext';
import { UserRole, SedeType } from '../../types';
import {
  ShieldAlert,
  Building2,
  UserCheck,
  Database,
  ChevronDown,
  Bell,
  Menu
} from 'lucide-react';
import { SupabaseConfigModal } from './SupabaseConfigModal';

interface HeaderProps {
  onToggleSidebarMobile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebarMobile }) => {
  const {
    currentUser,
    setUserRole,
    selectedSede,
    setSelectedSede,
    criticalFindingsCount,
    activeModule,
    supabaseConfig,
    setActiveModule
  } = useSSOMA();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showSedeDropdown, setShowSedeDropdown] = useState(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);

  // Formatear nombre del módulo para breadcrumb
  const moduleTitles: Record<string, string> = {
    '01_dashboard': '01. Dashboard General',
    '02_planificacion': '02. Planificación SSOMA',
    '03_iperc': '03. Gestión de Riesgos - IPERC',
    '04_legales': '04. Requisitos Legales',
    '05_operacional': '05. Seguridad Operacional',
    '06_quimicas': '06. Sustancias Químicas (SGA)',
    '07_salud': '07. Salud Ocupacional',
    '08_epp': '08. Gestión de EPP',
    '09_capacitaciones': '09. Capacitaciones',
    '10_incidentes': '10. Accidentes e Incidentes',
    '11_documental': '11. Gestión Documental',
    '12_auditorias': '12. Auditorías ISO 45001',
    '13_correctivas': '13. Acciones Correctivas (CAPA)',
    '14_reportes': '14. Reportes e Indicadores',
    '15_configuracion': '15. Configuración del Sistema'
  };

  const sedeLabels: Record<SedeType, string> = {
    TODAS: 'Todas las Sedes',
    SEDE_CENTRAL_LURIN: 'Sede Central Lurín (Planta)',
    PLANTA_CALLAO: 'Planta Callao (Almacén)',
    ALMACEN_VENTANILLA: 'Almacén Ventanilla'
  };

  const roles: { id: UserRole; label: string }[] = [
    { id: 'SUPERVISOR_SSOMA', label: 'Supervisor SSOMA' },
    { id: 'ADMINISTRADOR', label: 'Administrador' },
    { id: 'GERENCIA', label: 'Gerencia General' },
    { id: 'AUDITOR', label: 'Auditor ISO 45001' }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between gap-4 px-4 lg:px-6 py-2.5 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shrink-0">
        {/* Left Zone: Brand / Mobile menu trigger & Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebarMobile}
            className="p-1.5 text-slate-400 hover:text-white lg:hidden rounded hover:bg-slate-800 transition-colors"
            title="Abrir Menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold tracking-tight text-white hidden sm:inline whitespace-nowrap">
              GESTIÓN SSOMA A&amp;D
            </span>
            <span className="text-slate-600 hidden sm:inline">/</span>
            <span className="font-medium text-orange-400 truncate whitespace-nowrap">
              {moduleTitles[activeModule] || 'Módulo'}
            </span>
          </div>
        </div>

        {/* Center / Right Zone: Sedes, Roles, and Supabase status */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Selector de Sede */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSedeDropdown(!showSedeDropdown);
                setShowRoleDropdown(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded transition-colors whitespace-nowrap"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">{sedeLabels[selectedSede]}</span>
              <span className="md:hidden">Sede</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showSedeDropdown && (
              <div className="absolute right-0 mt-1 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-slate-800">
                  Seleccionar Sede Operativa
                </div>
                {(Object.keys(sedeLabels) as SedeType[]).map((sedeKey) => (
                  <button
                    key={sedeKey}
                    onClick={() => {
                      setSelectedSede(sedeKey);
                      setShowSedeDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                      selectedSede === sedeKey
                        ? 'text-orange-400 bg-orange-950/30 font-medium'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{sedeLabels[sedeKey]}</span>
                    {selectedSede === sedeKey && <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selector de Rol Activo */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setShowSedeDropdown(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded transition-colors whitespace-nowrap"
            >
              <UserCheck className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden lg:inline">{roles.find(r => r.id === currentUser.role)?.label}</span>
              <span className="lg:hidden">{currentUser.role.split('_')[0]}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-1 w-52 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-slate-800">
                  Cambiar Rol de Usuario
                </div>
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setUserRole(r.id);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                      currentUser.role === r.id
                        ? 'text-orange-400 bg-orange-950/30 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{r.label}</span>
                    {currentUser.role === r.id && <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Critical Hallazgos Alert Button */}
          {criticalFindingsCount > 0 && (
            <button
              onClick={() => setActiveModule('13_correctivas')}
              className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-rose-300 bg-rose-950/50 border border-rose-800/80 rounded hover:bg-rose-900/60 transition-colors"
              title={`${criticalFindingsCount} hallazgos críticos abiertos`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span className="font-mono font-bold tabular-nums">{criticalFindingsCount}</span>
              <span className="hidden xl:inline text-[11px]">Críticos</span>
            </button>
          )}

          {/* Supabase Status / Mode Button */}
          <button
            onClick={() => setShowSupabaseModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded transition-colors whitespace-nowrap"
            title="Ver estado de conexión Supabase y esquema SQL"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">
              {supabaseConfig.configured ? 'Supabase Conectado' : 'Modo Demo'}
            </span>
          </button>
        </div>
      </header>

      {/* Supabase Config / DDL Modal */}
      <SupabaseConfigModal
        isOpen={showSupabaseModal}
        onClose={() => setShowSupabaseModal(false)}
      />
    </>
  );
};
