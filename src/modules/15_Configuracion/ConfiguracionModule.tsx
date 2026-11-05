/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MÓDULO 15: CONFIGURACIÓN DEL SISTEMA
 * Matriz de Roles & Permisos (RLS), Sedes, Trazabilidad ISO 45001:2018,
 * Historial de Auditoría (Audit Log) y Arquitectura Supabase.
 */

import React, { useState } from 'react';
import { useSSOMA } from '../../context/SSOMAContext';
import { UserRole } from '../../types';
import {
  Settings,
  Shield,
  Users,
  Building,
  Database,
  RotateCcw,
  CheckCircle2,
  Lock,
  Layers,
  Key,
  Info,
  History,
  Search,
  Filter,
  FileSpreadsheet
} from 'lucide-react';
import { SupabaseConfigModal } from '../../components/common/SupabaseConfigModal';

export const ConfiguracionModule: React.FC = () => {
  const {
    currentUser,
    setUserRole,
    supabaseConfig,
    resetToDefaults,
    auditLogs
  } = useSSOMA();

  const [activeTab, setActiveTab] = useState<'ROLES' | 'EMPRESA' | 'ISO45001' | 'AUDIT_LOGS' | 'SUPABASE'>('ROLES');
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);

  // Filtros Audit Logs
  const [logSearch, setLogSearch] = useState('');
  const [logActionFilter, setLogActionFilter] = useState<string>('TODAS');

  // Matriz de Permisos por Rol
  const permissionsMatrix = [
    { module: '01. Dashboard General', admin: 'Lectura / Escritura', gerencia: 'Solo Lectura', supervisor: 'Lectura / Escritura', auditor: 'Solo Lectura' },
    { module: '02. Planificación SSOMA (PASST)', admin: 'Total / Aprobación', gerencia: 'Aprobación Final', supervisor: 'Registro y Ejecución', auditor: 'Solo Lectura' },
    { module: '03. Matriz IPERC', admin: 'Total', gerencia: 'Revisión', supervisor: 'Elaboración y Edición', auditor: 'Auditoría / Trazabilidad' },
    { module: '04. Requisitos Legales', admin: 'Total', gerencia: 'Solo Lectura', supervisor: 'Evaluación y Evidencias', auditor: 'Verificación Legal' },
    { module: '05. Seguridad Operacional', admin: 'Total', gerencia: 'Solo Lectura', supervisor: 'Inspecciones e Informes', auditor: 'Muestreo / Evidencias' },
    { module: '06. Sustancias Químicas (SGA)', admin: 'Total', gerencia: 'Solo Lectura', supervisor: 'Inventario y SDS', auditor: 'Solo Lectura' },
    { module: '07. Salud Ocupacional (EMO)', admin: 'Configuración', gerencia: 'Estadísticas Generales', supervisor: 'Restricciones Operativas (Sin Diagnóstico)', auditor: 'Aptitudes (Sin Diagnóstico)' },
    { module: '08. Gestión de EPP', admin: 'Total', gerencia: 'Solo Lectura', supervisor: 'Kardex y Asignación', auditor: 'Solo Lectura' },
    { module: '09. Capacitaciones', admin: 'Total', gerencia: 'Solo Lectura', supervisor: 'Registro y Asistencia', auditor: 'Listas y Notas' },
    { module: '10. Accidentes e Incidentes', admin: 'Total', gerencia: 'Notificación MTPE', supervisor: 'Investigación Frank Bird', auditor: 'Revisión Causal' },
    { module: '11. Gestión Documental', admin: 'Aprobación / Control', gerencia: 'Aprobación de Política', supervisor: 'Elaboración / Revisión', auditor: 'Lista Maestra' },
    { module: '12. Auditorías', admin: 'Total', gerencia: 'Apertura / Cierre', supervisor: 'Atención de Hallazgos', auditor: 'Emisión de Informes' },
    { module: '13. Acciones Correctivas (CAPA)', admin: 'Total', gerencia: 'Supervisión', supervisor: 'Plan y Cierre', auditor: 'Verificación de Eficacia' }
  ];

  const filteredLogs = auditLogs.filter(log => {
    if (logActionFilter !== 'TODAS' && log.accion !== logActionFilter) return false;
    if (logSearch) {
      const q = logSearch.toLowerCase();
      return (
        log.usuarioNombre.toLowerCase().includes(q) ||
        log.modulo.toLowerCase().includes(q) ||
        log.descripcion.toLowerCase().includes(q) ||
        (log.clausulaISO && log.clausulaISO.toLowerCase().includes(q))
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
            <h1 className="text-xl font-bold tracking-tight text-white">Configuración del Sistema SSOMA</h1>
            <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
              Seguridad RLS · Sedes · Trazabilidad Inmutable · Supabase
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Gestión de roles de usuario, matriz de control de accesos, parámetros organizacionales, bitácora de auditoría y preparación para base de datos PostgreSQL.
          </p>
        </div>

        <button
          onClick={() => setShowSupabaseModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded shadow-sm transition-colors shrink-0"
        >
          <Database className="w-4 h-4 text-emerald-400" />
          Ver Arquitectura Supabase
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('ROLES')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded transition-colors ${
            activeTab === 'ROLES'
              ? 'bg-slate-800 text-orange-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          Roles y Permisos (RLS)
        </button>
        <button
          onClick={() => setActiveTab('EMPRESA')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded transition-colors ${
            activeTab === 'EMPRESA'
              ? 'bg-slate-800 text-orange-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Building className="w-4 h-4" />
          Datos de la Empresa y Sedes
        </button>
        <button
          onClick={() => setActiveTab('ISO45001')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded transition-colors ${
            activeTab === 'ISO45001'
              ? 'bg-slate-800 text-orange-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          Trazabilidad ISO 45001:2018
        </button>
        <button
          onClick={() => setActiveTab('AUDIT_LOGS')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded transition-colors ${
            activeTab === 'AUDIT_LOGS'
              ? 'bg-slate-800 text-orange-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <History className="w-4 h-4" />
          Bitácora de Trazabilidad ({auditLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('SUPABASE')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded transition-colors ${
            activeTab === 'SUPABASE'
              ? 'bg-slate-800 text-orange-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          Backend &amp; Modo Demostración
        </button>
      </div>

      {/* Tab: Roles y Permisos */}
      {activeTab === 'ROLES' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-600/20 text-orange-400 border border-orange-500/30 rounded">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Rol de Operación Actual: {currentUser.role}</h3>
                <p className="text-xs text-slate-400">
                  Usuario autenticado: {currentUser.name} ({currentUser.email})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Cambiar a:</span>
              {(['SUPERVISOR_SSOMA', 'ADMINISTRADOR', 'GERENCIA', 'AUDITOR'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setUserRole(r)}
                  className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors ${
                    currentUser.role === r
                      ? 'bg-orange-600 text-white border-orange-500 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {r.split('_')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900">
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-white font-mono uppercase">
                Matriz de Seguridad a Nivel de Filas (Row Level Security - RLS)
              </span>
              <span className="text-slate-400 font-mono text-[11px]">4 Roles Diferenciados</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Módulo Funcional</th>
                    <th className="p-3">Supervisor SSOMA</th>
                    <th className="p-3">Administrador</th>
                    <th className="p-3">Gerencia General</th>
                    <th className="p-3">Auditor ISO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {permissionsMatrix.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-850/60 transition-colors">
                      <td className="p-3 font-semibold text-white">{row.module}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-300">{row.supervisor}</td>
                      <td className="p-3 font-mono text-[11px] text-orange-400">{row.admin}</td>
                      <td className="p-3 font-mono text-[11px] text-sky-400">{row.gerencia}</td>
                      <td className="p-3 font-mono text-[11px] text-emerald-400">{row.auditor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Datos de la Empresa y Sedes */}
      {activeTab === 'EMPRESA' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase font-mono">
              Razón Social de la Empresa (Titular)
            </h3>
            <div className="space-y-2 font-mono text-slate-300">
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-500">Razón Social:</span>
                <span className="text-white font-semibold">QUÍMICA &amp; DERIVADOS INDUSTRIALES S.A.C.</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-500">RUC:</span>
                <span className="text-orange-400 font-bold">20554892110</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-500">Actividad Económica:</span>
                <span>CIIU 2011 - Fabricación de sustancias químicas básicas</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-500">Nivel de Riesgo D.S. 003-98-SA:</span>
                <span className="text-rose-400 font-bold">Riesgo Alto (SCTR Obligatorio)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Comité de SST:</span>
                <span className="text-emerald-400">Instalado y Vigente (Periodo 2025-2027)</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase font-mono">
              Sedes Operativas Registradas
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="font-bold text-white">Sede Central Lurín</span>
                  <span className="text-emerald-400 text-[10px]">Planta de Formulación</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Av. Las Industrias Mz. B Lote 4, Parque Industrial de Lurín, Lima.
                </p>
                <p className="text-[10px] text-slate-500 font-mono">92 trabajadores · Reactores R-101 y R-102</p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="font-bold text-white">Planta Callao</span>
                  <span className="text-sky-400 text-[10px]">Almacén y Patio de Tanques</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Av. Néstor Gambetta Km. 8.5, Zona Industrial del Callao.
                </p>
                <p className="text-[10px] text-slate-500 font-mono">56 trabajadores · Depósito de Solventes ATEX</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Trazabilidad ISO 45001:2018 */}
      {activeTab === 'ISO45001' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-2 text-xs">
            <div className="flex items-center gap-2 text-orange-400 font-semibold">
              <Info className="w-4 h-4 shrink-0" />
              <span>Alineación Técnica con ISO 45001:2018 y Cláusula de Responsabilidad</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              La arquitectura del sistema GESTIÓN SSOMA A&amp;D está estructurada siguiendo el ciclo PHVA (Planificar, Hacer, Verificar, Actuar) y los requisitos de las cláusulas 4 a 10 de la norma ISO 45001:2018.
            </p>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded text-slate-400 text-[11px]">
              <strong>Aviso Legal y Normativo:</strong> Este software es una herramienta informática de soporte para la gestión, registro y trazabilidad de evidencias. La certificación oficial de ISO 45001:2018 exige auditorías de tercera parte acreditadas ante INACAL u organismos internacionales y la efectiva cultura preventiva en campo; la aplicación no certifica ni garantiza por sí misma la conformidad absoluta sin la intervención humana correspondiente.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
              <span className="text-orange-400 font-mono font-bold block">4. Contexto de la Organización</span>
              <p className="text-slate-300">Mapeado en: Configuración de Sedes, Procesos Químicos y Gestión Documental.</p>
              <span className="text-orange-400 font-mono font-bold block pt-2">5. Liderazgo y Participación</span>
              <p className="text-slate-300">Mapeado en: Política SSOMA firmada, Comité Paritario SST y roles de usuarios.</p>
              <span className="text-orange-400 font-mono font-bold block pt-2">6. Planificación</span>
              <p className="text-slate-300">Mapeado en: Módulo 02 Planificación (PASST), Módulo 03 IPERC y Módulo 04 Matriz Legal.</p>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
              <span className="text-orange-400 font-mono font-bold block">7. Apoyo &amp; 8. Operación</span>
              <p className="text-slate-300">Mapeado en: Módulos 05 Seguridad Operacional, 06 Sustancias Químicas, 08 EPP y 09 Capacitaciones.</p>
              <span className="text-orange-400 font-mono font-bold block pt-2">9. Evaluación del Desempeño</span>
              <p className="text-slate-300">Mapeado en: Módulo 12 Auditorías Internas y Módulo 14 Reportes e Indicadores (IF, IS, IA).</p>
              <span className="text-orange-400 font-mono font-bold block pt-2">10. Mejora</span>
              <p className="text-slate-300">Mapeado en: Módulo 10 Investigación de Incidentes (Frank Bird) y Módulo 13 Acciones Correctivas (CAPA).</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Historial de Auditoría (Audit Logs) */}
      {activeTab === 'AUDIT_LOGS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por usuario, módulo o descripción..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white placeholder-slate-500 focus:outline-hidden font-mono"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Filter className="w-3.5 h-3.5 text-slate-500" /> Acción:
              </span>
              <select
                value={logActionFilter}
                onChange={(e) => setLogActionFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 focus:outline-hidden font-mono"
              >
                <option value="TODAS">Todas las Acciones</option>
                <option value="CREACION">Creación</option>
                <option value="MODIFICACION">Modificación</option>
                <option value="EJECUCION_EVIDENCIA">Ejecución con Evidencia</option>
                <option value="CIERRE_CAPA">Cierre CAPA</option>
                <option value="EVALUACION_LEGAL">Evaluación Legal</option>
                <option value="CAMBIO_ROL">Cambio de Rol</option>
              </select>
            </div>
          </div>

          <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900">
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-white font-mono uppercase">
                Registro Inmutable de Eventos y Trazabilidad Operacional
              </span>
              <span className="text-slate-400 font-mono text-[11px]">{filteredLogs.length} eventos registrados</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-3 py-3">Fecha &amp; Hora</th>
                    <th className="px-3 py-3">Usuario &amp; Rol</th>
                    <th className="px-3 py-3">Acción</th>
                    <th className="px-3 py-3">Módulo</th>
                    <th className="px-4 py-3">Detalle de la Operación</th>
                    <th className="px-3 py-3 font-mono">Cláusula ISO</th>
                    <th className="px-3 py-3 font-mono">Estación / IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-850/60 transition-colors">
                      <td className="px-3 py-3 text-slate-400 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="text-white font-semibold font-sans block">{log.usuarioNombre}</span>
                        <span className="text-[10px] text-orange-400">{log.usuarioRol}</span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.accion === 'EJECUCION_EVIDENCIA'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : log.accion === 'CIERRE_CAPA'
                            ? 'bg-sky-950 text-sky-300 border border-sky-800'
                            : log.accion === 'CAMBIO_ROL'
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {log.accion}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-sans text-slate-300 whitespace-nowrap">
                        {log.modulo}
                      </td>
                      <td className="px-4 py-3 font-sans text-slate-200 max-w-sm">
                        {log.descripcion}
                      </td>
                      <td className="px-3 py-3 text-orange-400 font-bold whitespace-nowrap">
                        {log.clausulaISO || 'N/A'}
                      </td>
                      <td className="px-3 py-3 text-slate-500 whitespace-nowrap text-[10px]">
                        {log.ipOEquipo || 'Terminal-Local'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Backend & Supabase */}
      {activeTab === 'SUPABASE' && (
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-4 text-xs">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Estado del Backend: Modo Demostración Activo</h3>
              <p className="text-slate-400 mt-1">
                La aplicación guarda todos los cambios en el almacenamiento local seguro de su sesión y cuenta con el esquema SQL relacional completo para su posterior conexión con Supabase (PostgreSQL 15) y despliegue en Vercel.
              </p>
            </div>
            <button
              onClick={() => setShowSupabaseModal(true)}
              className="px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded shrink-0"
            >
              Abrir Asistente Supabase
            </button>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded space-y-2">
            <span className="font-semibold text-slate-200 uppercase font-mono block">
              Restablecer Datos de Demostración
            </span>
            <p className="text-slate-400">
              Si desea reiniciar las inspecciones, actividades y sustancias químicas a los valores iniciales de fábrica de Química &amp; Derivados Industriales S.A.C., use la siguiente opción:
            </p>
            <button
              onClick={resetToDefaults}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded font-mono text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restablecer Base de Datos a Valores Iniciales
            </button>
          </div>
        </div>
      )}

      <SupabaseConfigModal
        isOpen={showSupabaseModal}
        onClose={() => setShowSupabaseModal(false)}
      />
    </div>
  );
};
