/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GESTIÓN SSOMA A&D - Modal de Configuración y Preparación de Backend Supabase
 * Diseñado para auditoría y despliegue Vercel / Supabase (PostgreSQL 15)
 */

import React, { useState } from 'react';
import { useSSOMA } from '../../context/SSOMAContext';
import { Database, Server, Key, Copy, Check, X, Shield, Code2, AlertTriangle } from 'lucide-react';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ isOpen, onClose }) => {
  const { supabaseConfig, updateSupabaseConfig } = useSSOMA();
  const [supabaseUrl, setSupabaseUrl] = useState(supabaseConfig.supabaseUrl || '');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(supabaseConfig.supabaseAnonKey || '');
  const [copiedSql, setCopiedSql] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'sql_schema' | 'architecture'>('status');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSupabaseConfig({
      supabaseUrl: supabaseUrl.trim(),
      supabaseAnonKey: supabaseAnonKey.trim()
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const sqlDDL = `-- ========================================================
-- GESTIÓN SSOMA A&D - ESQUEMA RELACIONAL POSTGRESQL (SUPABASE)
-- Aligned with ISO 45001:2018 & Ley 29783 (Perú)
-- ========================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA DE SEDES Y USUARIOS (Auth RLS)
CREATE TABLE IF NOT EXISTS sedes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo VARCHAR(50) UNIQUE NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  direccion TEXT,
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PLAN ANUAL SST (ISO 45001 Cl. 6.1 / Ley 29783 Art. 32)
CREATE TABLE IF NOT EXISTS ssoma_plan_actividades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo VARCHAR(50) UNIQUE NOT NULL,
  programa_tipo VARCHAR(50) NOT NULL,
  actividad TEXT NOT NULL,
  objetivo TEXT NOT NULL,
  responsable VARCHAR(150) NOT NULL,
  frecuencia VARCHAR(50) NOT NULL,
  mes_programado INT CHECK (mes_programado BETWEEN 1 AND 12),
  anio INT NOT NULL,
  fecha_programada DATE NOT NULL,
  fecha_ejecucion DATE,
  estado VARCHAR(30) DEFAULT 'PROGRAMADO',
  evidencia_url TEXT,
  evidencia_titulo TEXT,
  evidencia_justificacion TEXT,
  clausula_iso VARCHAR(20),
  sede_codigo VARCHAR(50),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MATRIZ IPERC (ISO 45001 Cl. 6.1.2)
CREATE TABLE IF NOT EXISTS ssoma_matriz_iperc (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo VARCHAR(50) UNIQUE NOT NULL,
  proceso VARCHAR(150) NOT NULL,
  actividad TEXT NOT NULL,
  tarea TEXT NOT NULL,
  puesto_trabajo VARCHAR(150) NOT NULL,
  tipo_peligro VARCHAR(50) NOT NULL,
  peligro TEXT NOT NULL,
  riesgo TEXT NOT NULL,
  consecuencia TEXT NOT NULL,
  controles_existentes TEXT,
  indice_probabilidad INT NOT NULL,
  indice_severidad INT NOT NULL,
  valor_riesgo_puro INT NOT NULL,
  nivel_riesgo_puro VARCHAR(30) NOT NULL,
  jerarquia_control VARCHAR(50) NOT NULL,
  medida_control_propuesta TEXT NOT NULL,
  nivel_riesgo_residual VARCHAR(30) NOT NULL,
  responsable VARCHAR(150) NOT NULL,
  fecha_revision DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SUSTANCIAS QUÍMICAS SGA (GHS)
CREATE TABLE IF NOT EXISTS ssoma_sustancias_quimicas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo_interno VARCHAR(50) UNIQUE NOT NULL,
  nombre_comercial VARCHAR(200) NOT NULL,
  nombre_quimico VARCHAR(200) NOT NULL,
  numero_cas VARCHAR(50) NOT NULL,
  numero_onu VARCHAR(20),
  formula_quimica VARCHAR(100),
  palabra_advertencia VARCHAR(20) NOT NULL,
  pictogramas_sga TEXT[] NOT NULL,
  compatibilidad_grupo VARCHAR(50) NOT NULL,
  ubicacion_almacen VARCHAR(200) NOT NULL,
  stock_actual NUMERIC(12,2) NOT NULL,
  unidad_medida VARCHAR(20) NOT NULL,
  sds_version VARCHAR(50) NOT NULL,
  sds_fecha_vencimiento DATE NOT NULL,
  sds_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ACCIONES CORRECTIVAS CAPA (ISO 45001 Cl. 10.2)
CREATE TABLE IF NOT EXISTS ssoma_acciones_correctivas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo VARCHAR(50) UNIQUE NOT NULL,
  origen VARCHAR(50) NOT NULL,
  referencia_origen_id VARCHAR(50),
  hallazgo_problema TEXT NOT NULL,
  causa_raiz_identificada TEXT NOT NULL,
  accion_correctiva_propuesta TEXT NOT NULL,
  responsable_implementacion VARCHAR(150) NOT NULL,
  fecha_compromiso DATE NOT NULL,
  fecha_cierre_real DATE,
  estado VARCHAR(30) DEFAULT 'ABIERTA',
  es_critica BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE ssoma_plan_actividades ENABLE ROW LEVEL SECURITY;
ALTER TABLE ssoma_matriz_iperc ENABLE ROW LEVEL SECURITY;
ALTER TABLE ssoma_sustancias_quimicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ssoma_acciones_correctivas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura para usuarios autenticados" ON ssoma_plan_actividades
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Escritura para Supervisores y Administradores" ON ssoma_plan_actividades
  FOR ALL TO authenticated USING (
    auth.jwt() ->> 'role' IN ('SUPERVISOR_SSOMA', 'ADMINISTRADOR')
  );`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlDDL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-950/70 text-emerald-400 border border-emerald-800/80 rounded">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white">Arquitectura & Conexión Backend</h3>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-amber-950/70 text-amber-300 border border-amber-800/70">
                  {supabaseConfig.configured ? 'SUPABASE CONFIGURADO' : 'MODO DEMOSTRACIÓN ACTIVO'}
                </span>
              </div>
              <p className="text-xs text-slate-400">PostgreSQL 15 · Supabase Auth · Supabase Storage · Despliegue Vercel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 px-6 pt-3 bg-slate-950 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('status')}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'status'
                ? 'border-orange-500 text-orange-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Estado del Backend & API Keys
          </button>
          <button
            onClick={() => setActiveTab('sql_schema')}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'sql_schema'
                ? 'border-orange-500 text-orange-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Esquema SQL DDL (PostgreSQL)
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'architecture'
                ? 'border-orange-500 text-orange-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Auditoría Google Antigravity & Vercel
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'status' && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded">
                <div className="flex items-start gap-3">
                  <Server className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-200">
                      Entorno de Demostración Operacional Activo
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      La aplicación opera de manera 100% interactiva con persistencia local en sesión (LocalStorage), datos completos de la industria química peruana e indicadores de seguridad (IF, IS, IA) calculados en tiempo real.
                    </p>
                  </div>
                </div>
              </div>

              {savedSuccess && (
                <div className="flex items-center gap-2 p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Configuración guardada en el cliente con éxito.</span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Supabase Project URL (VITE_SUPABASE_URL)
                  </label>
                  <input
                    type="url"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-sm text-white placeholder-slate-600 focus:outline-hidden focus:border-orange-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Supabase Public Anon Key (VITE_SUPABASE_ANON_KEY)
                  </label>
                  <input
                    type="password"
                    value={supabaseAnonKey}
                    onChange={(e) => setSupabaseAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-sm text-white placeholder-slate-600 focus:outline-hidden focus:border-orange-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Solo use la clave pública anónima (Anon Public Key). Nunca ingrese claves de servicio con permisos de bypass (service_role).
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <span className="text-xs text-slate-400">
                    Bucket de almacenamiento: <code className="text-orange-400 font-mono">ssoma-evidencias</code>
                  </span>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded transition-colors"
                  >
                    <Key className="w-4 h-4" />
                    Guardar Parámetros de Conexión
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'sql_schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-300">
                  Copie y ejecute este script DDL en el SQL Editor de su proyecto Supabase para aprovisionar las tablas relacionales y políticas RLS:
                </p>
                <button
                  onClick={copySql}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-orange-400" />}
                  {copiedSql ? 'Copiado al Portapapeles' : 'Copiar DDL'}
                </button>
              </div>

              <pre className="p-4 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-slate-300 overflow-x-auto max-h-96 leading-relaxed">
                {sqlDDL}
              </pre>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-2">
                <div className="flex items-center gap-2 text-orange-400 font-semibold">
                  <Shield className="w-4 h-4" />
                  <span>Preparación para Auditoría Google Antigravity & ISO 45001</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-slate-400">
                  <li>Separación estricta de responsabilidades: tipos (`src/types/index.ts`), servicios de datos (`src/services/storage.ts`), contexto reactivo (`src/context/SSOMAContext.tsx`) y módulos aislados.</li>
                  <li>Trazabilidad de ejecuciones con firma de responsable, evidencia obligatoria y marcas temporales conforme al requisito 7.5 de ISO 45001.</li>
                  <li>Módulo de sustancias químicas con compatibilidad SGA/GHS y cálculo de índices de seguridad basados en horas hombre trabajadas reales.</li>
                  <li>Cero exposición de credenciales privadas o tokens con permisos de servicio en el frontend.</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <Code2 className="w-4 h-4" />
                  <span>Despliegue en Vercel</span>
                </div>
                <p className="text-slate-400">
                  El proyecto cuenta con build de producción estándar Vite + TypeScript. En Vercel, defina las variables:
                  <code className="block mt-1 font-mono text-slate-300 bg-slate-900 p-2 rounded">
                    VITE_SUPABASE_URL=https://[project-ref].supabase.co<br />
                    VITE_SUPABASE_ANON_KEY=[anon-public-key]
                  </code>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 bg-slate-950 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
          >
            Cerrar Panel
          </button>
        </div>
      </div>
    </div>
  );
};
