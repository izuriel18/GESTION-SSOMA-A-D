/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MÓDULO 06: GESTIÓN DE SUSTANCIAS QUÍMICAS
 * Módulo especializado para industria química: SGA/GHS, CAS, SDS,
 * Matriz de Compatibilidad de Almacenamiento y Simulador de Conflicto Reactivo HAZMAT.
 */

import React, { useState } from 'react';
import { useSSOMA } from '../../context/SSOMAContext';
import { ChemicalSubstance, GHSPictogram } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  FlaskConical,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Flame,
  Skull,
  ShieldAlert,
  FileText,
  Clock,
  Eye,
  Grid,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  ArrowRightLeft,
  ShieldCheck,
  AlertOctagon,
  Sparkles
} from 'lucide-react';

// Renderizado de Pictogramas SGA / GHS Oficiales en SVG
const GHSPictogramIcon: React.FC<{ type: GHSPictogram; size?: number }> = ({ type, size = 32 }) => {
  let title: string = type;
  let symbol = <AlertTriangle className="w-4 h-4 text-slate-900" />;

  switch (type) {
    case 'FLAMABLE':
      title = 'Inflamable';
      symbol = <Flame className="w-5 h-5 text-slate-950" />;
      break;
    case 'CORROSIVO':
      title = 'Corrosivo';
      symbol = <span className="font-bold text-[10px] text-slate-950">COR</span>;
      break;
    case 'TOXICO_AGUDO':
      title = 'Toxicidad Aguda (Mortal)';
      symbol = <Skull className="w-5 h-5 text-slate-950" />;
      break;
    case 'PELIGRO_SALUD':
      title = 'Peligro Grave para la Salud (CMR)';
      symbol = <ShieldAlert className="w-5 h-5 text-slate-950" />;
      break;
    case 'NOCIVO_IRRITANTE':
      title = 'Nocivo / Irritante';
      symbol = <span className="font-bold text-sm text-slate-950">!</span>;
      break;
    case 'MEDIO_AMBIENTE':
      title = 'Peligro para el Medio Ambiente Acuático';
      symbol = <span className="font-bold text-[10px] text-slate-950">ENV</span>;
      break;
    case 'COMBURENTE':
      title = 'Comburente / Oxidante';
      symbol = <Flame className="w-4 h-4 text-slate-950" />;
      break;
    default:
      symbol = <AlertTriangle className="w-4 h-4 text-slate-950" />;
  }

  return (
    <div
      title={`Pictograma SGA: ${title}`}
      className="inline-flex items-center justify-center bg-white border-2 border-red-600 rounded-sm transform rotate-45 shadow-xs overflow-hidden shrink-0"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <div className="transform -rotate-45 flex items-center justify-center font-mono">
        {symbol}
      </div>
    </div>
  );
};

export const SustanciasQuimicasModule: React.FC = () => {
  const { chemicals, saveChemical, selectedSede } = useSSOMA();

  const [activeView, setActiveView] = useState<'INVENTARIO' | 'COMPATIBILIDAD' | 'SIMULADOR' | 'ALERTAS_SDS'>('INVENTARIO');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrupo, setFilterGrupo] = useState<string>('TODOS');
  const [selectedChem, setSelectedChem] = useState<ChemicalSubstance | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  // Formulario Nueva Sustancia
  const [nombreComercial, setNombreComercial] = useState('');
  const [nombreQuimico, setNombreQuimico] = useState('');
  const [numeroCAS, setNumeroCAS] = useState('');
  const [numeroONU, setNumeroONU] = useState('');
  const [palabraAdvertencia, setPalabraAdvertencia] = useState<'PELIGRO' | 'ATENCIÓN'>('PELIGRO');
  const [ubicacion, setUbicacion] = useState('');
  const [stock, setStock] = useState(1000);
  const [unidad, setUnidad] = useState<'L' | 'Kg' | 'Gal' | 'Cilindros (55 Gal)' | 'IBC (1000 L)'>('L');
  const [compatibilidadGrupo, setCompatibilidadGrupo] = useState<'ACIDO_INORGANICO' | 'BASE_FUERTE' | 'SOLVENTE_INFLAMABLE' | 'OXIDANTE' | 'TOXICO'>('ACIDO_INORGANICO');
  const [sdsVersion, setSdsVersion] = useState('Rev. 01 - 2026');
  const [sdsVencimiento, setSdsVencimiento] = useState(
    new Date(Date.now() + 3 * 365 * 86400000).toISOString().split('T')[0]
  );
  const [selectedPictos, setSelectedPictos] = useState<GHSPictogram[]>(['CORROSIVO']);

  // Estado para la regla seleccionada en la matriz interactiva
  const [selectedMatrixPair, setSelectedMatrixPair] = useState<{ g1: string; g2: string } | null>(null);

  // Estado para el Simulador Reactivo de 2 Sustancias
  const [substanceAId, setSubstanceAId] = useState<string>(() => chemicals[0]?.id || '');
  const [substanceBId, setSubstanceBId] = useState<string>(() => chemicals[1]?.id || '');

  const filteredChemicals = chemicals.filter(c => {
    if (filterGrupo !== 'TODOS' && c.compatibilidadGrupo !== filterGrupo) return false;
    if (selectedSede !== 'TODAS' && c.sede !== 'TODAS' && c.sede !== selectedSede) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        c.nombreComercial.toLowerCase().includes(q) ||
        c.nombreQuimico.toLowerCase().includes(q) ||
        c.numeroCAS.toLowerCase().includes(q) ||
        c.codigoInterno.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateChemical = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreComercial.trim() || !numeroCAS.trim()) return;

    const newSubstance: ChemicalSubstance = {
      id: `chem-${Date.now()}`,
      codigoInterno: `SQ-${String(chemicals.length + 1).padStart(3, '0')}`,
      nombreComercial: nombreComercial.trim(),
      nombreQuimico: nombreQuimico.trim() || nombreComercial.trim(),
      numeroCAS: numeroCAS.trim(),
      numeroONU: numeroONU.trim() || 'UN N/A',
      formulaQuimica: 'N/A',
      palabraAdvertencia,
      pictogramasSGA: selectedPictos,
      clasePeligro: ['Peligro Químico Industrial'],
      indicacionesPeligroH: ['H314: Provoca quemaduras graves en la piel y lesiones oculares.'],
      consejosPrudenciaP: ['P280: Usar guantes, ropa de protección y protección ocular.'],
      ubicacionAlmacen: ubicacion.trim() || 'Nave de Almacén Químico',
      sede: selectedSede === 'TODAS' ? 'SEDE_CENTRAL_LURIN' : selectedSede,
      stockActual: Number(stock),
      unidadMedida: unidad,
      nivelStock: 'ADECUADO',
      compatibilidadGrupo,
      incompatibleCon: ['Sustancias incompatibles según SDS'],
      eppRequerido: ['Respirador para vapores químicos', 'Guantes de nitrilo/butilo', 'Gafas de seguridad'],
      medidasPrimerosAuxilios: 'Lavar con abundante agua durante 15 minutos en ducha de emergencia.',
      medidasDerrames: 'Contener con material absorbente inerte y neutralizar.',
      medidasIncendio: 'Usar polvo químico seco o CO2.',
      sdsVersion,
      sdsFechaEmision: new Date().toISOString().split('T')[0],
      sdsFechaVencimiento: sdsVencimiento,
      sdsEstado: 'VIGENTE'
    };

    saveChemical(newSubstance);
    setShowNewModal(false);
  };

  // Matriz de Compatibilidad Química Básica (Reglas de almacenamiento seguro)
  const compatGroups = [
    { key: 'ACIDO_INORGANICO', label: 'Ácidos Inorgánicos (H2SO4, HCl)' },
    { key: 'BASE_FUERTE', label: 'Bases Fuertes (NaOH, KOH)' },
    { key: 'SOLVENTE_INFLAMABLE', label: 'Solventes Inflamables (Tolueno)' },
    { key: 'OXIDANTE', label: 'Oxidantes (NaClO, H2O2)' }
  ];

  const getCompatibility = (g1: string, g2: string): { status: 'COMPATIBLE' | 'INCOMPATIBLE' | 'PRECAUCION'; reason: string; protocol: string } => {
    if (g1 === g2) {
      return {
        status: 'COMPATIBLE',
        reason: 'Pertenecen a la misma familia reactiva.',
        protocol: 'Almacenamiento contiguo permitido. Mantener cubetos limpios y rotulados.'
      };
    }
    if ((g1 === 'ACIDO_INORGANICO' && g2 === 'BASE_FUERTE') || (g1 === 'BASE_FUERTE' && g2 === 'ACIDO_INORGANICO')) {
      return {
        status: 'INCOMPATIBLE',
        reason: 'REACCIÓN EXOTÉRMICA VIOLENTA: Neutralización instantánea descontrolada con elevación térmica > 120°C y salpicaduras corrosivas.',
        protocol: 'PROHIBICIÓN ESTRICTA: Diques de contención estancos e independientes con separación física mínima de 5 metros según D.S. 042-F.'
      };
    }
    if ((g1 === 'ACIDO_INORGANICO' && g2 === 'OXIDANTE') || (g1 === 'OXIDANTE' && g2 === 'ACIDO_INORGANICO')) {
      return {
        status: 'INCOMPATIBLE',
        reason: 'DESPRENDIMIENTO DE GAS CLORO (Cl2) TÓXICO / LETAL: El contacto accidental de Ácido con Hipoclorito libera nubes de cloro asfixiante de alta toxicidad.',
        protocol: 'SEGREGACIÓN CRÍTICA: Prohibido compartir canaletas o sumideros comunes. Requiere sensores de fuga de gas Cl2 y ventilación forzada.'
      };
    }
    if ((g1 === 'SOLVENTE_INFLAMABLE' && g2 === 'OXIDANTE') || (g1 === 'OXIDANTE' && g2 === 'SOLVENTE_INFLAMABLE')) {
      return {
        status: 'INCOMPATIBLE',
        reason: 'PELIGRO DE IGNICIÓN ESPONTÁNEA Y EXPLOSIÓN: El oxidante enriquece la atmósfera de oxígeno detonando los vapores inflamables.',
        protocol: 'AISLAMIENTO TOTAL: Almacenar en bóvedas ATEX con muros corta-fuego RF-120 independientes.'
      };
    }
    return {
      status: 'PRECAUCION',
      reason: 'Riesgo moderado de reactividad cruzada bajo condiciones de temperatura o fuga no controlada.',
      protocol: 'Almacenar con separación física mínima de 3 metros y cubetos de retención del 110% de capacidad.'
    };
  };

  // Cálculo de conflicto para el simulador de 2 sustancias
  const chemA = chemicals.find(c => c.id === substanceAId) || chemicals[0];
  const chemB = chemicals.find(c => c.id === substanceBId) || chemicals[1] || chemicals[0];
  const simulationResult = chemA && chemB ? getCompatibility(chemA.compatibilidadGrupo, chemB.compatibilidadGrupo) : null;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">Gestión de Sustancias Químicas</h1>
            <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
              Sistema Globalmente Armonizado (SGA / GHS) · D.S. 015-2005-SA
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Catálogo químico oficial, clasificación de peligros, números CAS/ONU, hojas de datos de seguridad (SDS), matriz de almacenamiento y simulador de incompatibilidad reactiva.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Registrar Sustancia Química
        </button>
      </div>

      {/* Subtabs de Navegación */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveView('INVENTARIO')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded transition-colors ${
            activeView === 'INVENTARIO'
              ? 'bg-slate-800 text-orange-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          Inventario y Fichas SGA ({chemicals.length})
        </button>
        <button
          onClick={() => setActiveView('COMPATIBILIDAD')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded transition-colors ${
            activeView === 'COMPATIBILIDAD'
              ? 'bg-slate-800 text-orange-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Grid className="w-4 h-4" />
          Matriz de Compatibilidad de Almacenamiento
        </button>
        <button
          onClick={() => setActiveView('SIMULADOR')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded transition-colors ${
            activeView === 'SIMULADOR'
              ? 'bg-slate-800 text-orange-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          Simulador de Conflicto Reactivo
        </button>
        <button
          onClick={() => setActiveView('ALERTAS_SDS')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded transition-colors ${
            activeView === 'ALERTAS_SDS'
              ? 'bg-slate-800 text-orange-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          Vigencia de Hojas de Seguridad (SDS)
        </button>
      </div>

      {/* Vista 1: Inventario de Sustancias Químicas */}
      {activeView === 'INVENTARIO' && (
        <>
          {/* Barra de Búsqueda y Filtros */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por nombre químico, comercial o CAS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white placeholder-slate-500 focus:outline-hidden font-mono"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Filter className="w-3.5 h-3.5 text-slate-500" /> Grupo:
              </span>
              <select
                value={filterGrupo}
                onChange={(e) => setFilterGrupo(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 focus:outline-hidden font-mono"
              >
                <option value="TODOS">Todos los Grupos</option>
                <option value="ACIDO_INORGANICO">Ácidos Inorgánicos</option>
                <option value="BASE_FUERTE">Bases Fuertes</option>
                <option value="SOLVENTE_INFLAMABLE">Solventes Inflamables</option>
                <option value="OXIDANTE">Oxidantes</option>
              </select>
            </div>
          </div>

          {/* Cards Grid de Químicos con Pictogramas Reales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredChemicals.map((chem) => (
              <div
                key={chem.id}
                className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-4 hover:border-slate-700 transition-colors"
              >
                {/* Header de la Sustancia */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-orange-400">{chem.codigoInterno}</span>
                      <span className="text-slate-600">·</span>
                      <span className="font-mono text-xs text-slate-400">CAS: {chem.numeroCAS}</span>
                      <span className="font-mono text-xs text-slate-400">UN {chem.numeroONU}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">{chem.nombreComercial}</h3>
                    <p className="text-xs text-slate-400 font-mono italic">{chem.nombreQuimico}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                      chem.palabraAdvertencia === 'PELIGRO'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {chem.palabraAdvertencia}
                    </span>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">SDS: {chem.sdsVersion}</p>
                  </div>
                </div>

                {/* Pictogramas SGA */}
                <div className="p-3 bg-slate-950 border border-slate-800/80 rounded flex items-center justify-between">
                  <div className="flex items-center gap-4 py-1">
                    {chem.pictogramasSGA.map((picto, idx) => (
                      <GHSPictogramIcon key={idx} type={picto} size={28} />
                    ))}
                  </div>
                  <StatusBadge status={chem.sdsEstado} />
                </div>

                {/* Ubicación y Stock */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/60 p-2.5 rounded border border-slate-800/60">
                  <div>
                    <span className="text-slate-500 block font-mono text-[10px]">Ubicación Almacén:</span>
                    <span className="text-slate-200 font-medium truncate block">{chem.ubicacionAlmacen}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-mono text-[10px]">Stock Registrado:</span>
                    <span className="text-white font-mono font-bold">
                      {chem.stockActual.toLocaleString()} {chem.unidadMedida}
                    </span>
                  </div>
                </div>

                {/* Indicaciones H principales */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">
                    Peligros Principales (Frases H):
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                    {chem.indicacionesPeligroH.slice(0, 2).map((h, i) => (
                      <li key={i} className="line-clamp-1">{h}</li>
                    ))}
                  </ul>
                </div>

                {/* Footer Action */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    Grupo: <strong className="text-slate-300">{chem.compatibilidadGrupo.replace(/_/g, ' ')}</strong>
                  </span>
                  <button
                    onClick={() => setSelectedChem(chem)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-orange-400" />
                    Dossier Técnico &amp; SDS
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Vista 2: Matriz de Compatibilidad de Almacenamiento */}
      {activeView === 'COMPATIBILIDAD' && (
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-white">Matriz Interactiva de Incompatibilidad Química</h2>
            <p className="text-xs text-slate-400 mt-1">
              Haga clic sobre cualquier celda de intersección para examinar los riesgos y protocolos de segregación física exigidos.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 font-mono text-[10px] uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Grupo Químico</th>
                  {compatGroups.map(g => (
                    <th key={g.key} className="p-3 text-center">{g.key.replace(/_/g, ' ')}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {compatGroups.map(rowGroup => (
                  <tr key={rowGroup.key} className="bg-slate-950/40">
                    <td className="p-3 font-semibold text-white">{rowGroup.label}</td>
                    {compatGroups.map(colGroup => {
                      const res = getCompatibility(rowGroup.key, colGroup.key);
                      const isSelected = selectedMatrixPair?.g1 === rowGroup.key && selectedMatrixPair?.g2 === colGroup.key;

                      return (
                        <td key={colGroup.key} className="p-3 text-center">
                          <button
                            onClick={() => setSelectedMatrixPair({ g1: rowGroup.key, g2: colGroup.key })}
                            className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded border transition-all ${
                              isSelected ? 'ring-2 ring-white scale-105' : ''
                            } ${
                              res.status === 'COMPATIBLE'
                                ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800 hover:bg-emerald-900'
                                : res.status === 'INCOMPATIBLE'
                                ? 'bg-rose-950 text-rose-300 border-rose-800 hover:bg-rose-900'
                                : 'bg-amber-950/70 text-amber-300 border-amber-800 hover:bg-amber-900'
                            }`}
                          >
                            {res.status}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Panel Interactivo de la Regla Seleccionada */}
          {selectedMatrixPair ? (() => {
            const rule = getCompatibility(selectedMatrixPair.g1, selectedMatrixPair.g2);
            return (
              <div className={`p-4 rounded-lg border text-xs space-y-2 animate-in fade-in ${
                rule.status === 'INCOMPATIBLE'
                  ? 'bg-rose-950/30 border-rose-800/80'
                  : rule.status === 'COMPATIBLE'
                  ? 'bg-emerald-950/30 border-emerald-800/80'
                  : 'bg-amber-950/30 border-amber-800/80'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-white font-bold">{selectedMatrixPair.g1.replace(/_/g, ' ')}</span>
                    <span className="text-slate-500">+</span>
                    <span className="text-white font-bold">{selectedMatrixPair.g2.replace(/_/g, ' ')}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                    rule.status === 'INCOMPATIBLE' ? 'bg-rose-900 text-rose-200' : rule.status === 'COMPATIBLE' ? 'bg-emerald-900 text-emerald-200' : 'bg-amber-900 text-amber-200'
                  }`}>
                    {rule.status}
                  </span>
                </div>
                <p className="text-slate-200 leading-relaxed font-sans font-medium">{rule.reason}</p>
                <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800/80 font-mono text-[11px] text-orange-400">
                  <strong>Protocolo Requerido: </strong>{rule.protocol}
                </div>
              </div>
            );
          })() : (
            <div className="p-3 bg-slate-950 border border-slate-800 rounded text-center text-xs text-slate-500 font-mono">
              Haga clic sobre cualquier botón de la matriz superior para inspeccionar el protocolo específico de reactividad.
            </div>
          )}

          <div className="p-4 bg-slate-950 border border-slate-800 rounded space-y-2 text-xs">
            <span className="font-semibold text-orange-400 block uppercase font-mono">
              Directiva de Almacenamiento Seguro (D.S. 042-F y OSHA 1910.1200):
            </span>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>Los Ácidos Fuertes y Bases Fuertes deben contar con diques de contención independientes con volumen mínimo del 110% del tanque mayor.</li>
              <li>Los Solventes Inflamables deben almacenarse exclusivamente en bóvedas ATEX con muros corta-fuego RF-120 y sistema de puesta a tierra certificado.</li>
              <li>El Hipoclorito de Sodio nunca debe almacenarse contiguo a líneas ácidas; cualquier fuga cruzada libera Gas Cloro potencialmente fatal.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Vista 3: Simulador de Conflicto Reactivo (2 Sustancias) */}
      {activeView === 'SIMULADOR' && (
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Simulador de Conflicto Químico Reactivo</h2>
              <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-950 text-orange-400 border border-slate-800">
                HAZMAT · Análisis Cruzado de Incompatibilidad
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Seleccione dos sustancias químicas almacenadas en planta para analizar el riesgo de mezcla accidental, gases desprendidos y barreras de control de ingeniería.
            </p>
          </div>

          {/* Selectores de Sustancias */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
              <span className="text-xs font-mono font-bold text-orange-400 uppercase block">Sustancia A (Fuente 1)</span>
              <select
                value={substanceAId}
                onChange={(e) => setSubstanceAId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white font-mono focus:outline-hidden"
              >
                {chemicals.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.codigoInterno} - {c.nombreComercial} ({c.compatibilidadGrupo.replace(/_/g, ' ')})
                  </option>
                ))}
              </select>

              {chemA && (
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-slate-500">CAS: {chemA.numeroCAS}</span>
                    <span className="text-slate-400">UN {chemA.numeroONU}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    {chemA.pictogramasSGA.map((p, i) => (
                      <GHSPictogramIcon key={i} type={p} size={24} />
                    ))}
                    <span className="text-[11px] font-mono text-slate-400">{chemA.ubicacionAlmacen}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
              <span className="text-xs font-mono font-bold text-sky-400 uppercase block">Sustancia B (Fuente 2)</span>
              <select
                value={substanceBId}
                onChange={(e) => setSubstanceBId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white font-mono focus:outline-hidden"
              >
                {chemicals.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.codigoInterno} - {c.nombreComercial} ({c.compatibilidadGrupo.replace(/_/g, ' ')})
                  </option>
                ))}
              </select>

              {chemB && (
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-slate-500">CAS: {chemB.numeroCAS}</span>
                    <span className="text-slate-400">UN {chemB.numeroONU}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    {chemB.pictogramasSGA.map((p, i) => (
                      <GHSPictogramIcon key={i} type={p} size={24} />
                    ))}
                    <span className="text-[11px] font-mono text-slate-400">{chemB.ubicacionAlmacen}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resultado de la Simulación */}
          {chemA && chemB && simulationResult && (
            <div className={`p-5 rounded-lg border space-y-4 ${
              simulationResult.status === 'INCOMPATIBLE'
                ? 'bg-rose-950/20 border-rose-800/90'
                : simulationResult.status === 'COMPATIBLE'
                ? 'bg-emerald-950/20 border-emerald-800/90'
                : 'bg-amber-950/20 border-amber-800/90'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded ${
                    simulationResult.status === 'INCOMPATIBLE'
                      ? 'bg-rose-900/40 text-rose-300 border border-rose-700'
                      : simulationResult.status === 'COMPATIBLE'
                      ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700'
                      : 'bg-amber-900/40 text-amber-300 border border-amber-700'
                  }`}>
                    {simulationResult.status === 'INCOMPATIBLE' ? (
                      <AlertOctagon className="w-6 h-6 text-rose-400" />
                    ) : simulationResult.status === 'COMPATIBLE' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-amber-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Dictamen de Compatibilidad: {simulationResult.status}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {chemA.nombreComercial} vs {chemB.nombreComercial}
                    </p>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded text-xs font-mono font-bold ${
                  simulationResult.status === 'INCOMPATIBLE'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : simulationResult.status === 'COMPATIBLE'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {simulationResult.status === 'INCOMPATIBLE' ? 'PROHIBIDO ALMACENAMIENTO COMÚN' : 'ALMACENAMIENTO AUTORIZADO'}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-slate-300 uppercase font-mono text-[10px] block">
                    Consecuencia de Reacción Química:
                  </span>
                  <p className="text-slate-100 text-sm font-medium mt-1 leading-relaxed">
                    {simulationResult.reason}
                  </p>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded space-y-1">
                  <span className="font-semibold text-orange-400 uppercase font-mono text-[10px] block">
                    Protocolo de Ingeniería y Almacenamiento (D.S. 042-F):
                  </span>
                  <p className="text-slate-300 leading-relaxed font-mono">
                    {simulationResult.protocol}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vista 4: Alertas de Vencimiento de SDS */}
      {activeView === 'ALERTAS_SDS' && (
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Vigencia y Actualización de Hojas de Datos (SDS)</h2>
              <p className="text-xs text-slate-400">
                Control del ciclo de 3 años de revisión de SDS según normativa peruana y buenas prácticas industriales.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">Total monitoreadas: {chemicals.length}</span>
          </div>

          <div className="border border-slate-800 rounded overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Código</th>
                  <th className="p-3">Nombre Comercial</th>
                  <th className="p-3">CAS</th>
                  <th className="p-3">Versión SDS</th>
                  <th className="p-3">Fecha Emisión</th>
                  <th className="p-3">Vencimiento</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {chemicals.map((chem) => (
                  <tr key={chem.id} className="bg-slate-950/40 hover:bg-slate-850/60 transition-colors">
                    <td className="p-3 font-mono font-semibold text-orange-400">{chem.codigoInterno}</td>
                    <td className="p-3 font-semibold text-white">{chem.nombreComercial}</td>
                    <td className="p-3 font-mono text-slate-300">{chem.numeroCAS}</td>
                    <td className="p-3 font-mono text-slate-400">{chem.sdsVersion}</td>
                    <td className="p-3 font-mono text-slate-400">{chem.sdsFechaEmision}</td>
                    <td className="p-3 font-mono text-slate-200">{chem.sdsFechaVencimiento}</td>
                    <td className="p-3">
                      <StatusBadge status={chem.sdsEstado} />
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedChem(chem)}
                        className="px-2.5 py-1 text-[11px] font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors"
                      >
                        Ver Ficha
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Dossier Técnico & Ficha SDS */}
      {selectedChem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
              <div>
                <h3 className="text-base font-semibold text-white">{selectedChem.nombreComercial}</h3>
                <p className="text-xs text-slate-400 font-mono">
                  CAS: {selectedChem.numeroCAS} · ONU {selectedChem.numeroONU} · {selectedChem.formulaQuimica}
                </p>
              </div>
              <button onClick={() => setSelectedChem(null)} className="text-slate-400 hover:text-white text-lg px-2">
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto text-xs text-slate-300">
              {/* Advertencia y Pictogramas */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">Palabra de Advertencia</span>
                  <span className="text-base font-bold font-mono text-rose-400">{selectedChem.palabraAdvertencia}</span>
                </div>
                <div className="flex items-center gap-4">
                  {selectedChem.pictogramasSGA.map((p, idx) => (
                    <GHSPictogramIcon key={idx} type={p} size={30} />
                  ))}
                </div>
              </div>

              {/* EPP Específico Obligatorio */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-2">
                <span className="font-semibold text-orange-400 uppercase font-mono block">
                  EPP Específico Obligatorio para Manipulación:
                </span>
                <ul className="list-disc pl-5 space-y-1 text-slate-200">
                  {selectedChem.eppRequerido.map((epp, i) => (
                    <li key={i}>{epp}</li>
                  ))}
                </ul>
              </div>

              {/* Medidas ante derrames y primeros auxilios */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-1">
                  <span className="font-semibold text-sky-400 uppercase font-mono block text-[10px]">
                    Primeros Auxilios (Emergencia)
                  </span>
                  <p className="text-slate-300 leading-relaxed">{selectedChem.medidasPrimerosAuxilios}</p>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-1">
                  <span className="font-semibold text-amber-400 uppercase font-mono block text-[10px]">
                    Control ante Fugas y Derrames
                  </span>
                  <p className="text-slate-300 leading-relaxed">{selectedChem.medidasDerrames}</p>
                </div>
              </div>

              {/* Frases H y P completas */}
              <div className="space-y-2">
                <span className="font-semibold text-slate-300 uppercase font-mono block text-[11px]">
                  Indicaciones de Peligro (Frases H):
                </span>
                <ul className="space-y-1 list-disc pl-5 text-slate-300 font-mono text-[11px]">
                  {selectedChem.indicacionesPeligroH.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-slate-300 uppercase font-mono block text-[11px]">
                  Consejos de Prudencia (Frases P):
                </span>
                <ul className="space-y-1 list-disc pl-5 text-slate-400 font-mono text-[11px]">
                  {selectedChem.consejosPrudenciaP.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end p-4 bg-slate-950 border-t border-slate-800">
              <button
                onClick={() => setSelectedChem(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded"
              >
                Cerrar Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Registrar Nueva Sustancia */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-6 space-y-4 text-xs animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <h3 className="text-base font-semibold text-white">Alta de Sustancia Química en Catálogo SGA</h3>

            <form onSubmit={handleCreateChemical} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nombre Comercial *</label>
                  <input
                    type="text"
                    required
                    value={nombreComercial}
                    onChange={(e) => setNombreComercial(e.target.value)}
                    placeholder="Ej: Ácido Nítrico 65%"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nombre Químico (IUPAC)</label>
                  <input
                    type="text"
                    value={nombreQuimico}
                    onChange={(e) => setNombreQuimico(e.target.value)}
                    placeholder="Ej: Ácido Nítrico acuoso"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Número CAS *</label>
                  <input
                    type="text"
                    required
                    value={numeroCAS}
                    onChange={(e) => setNumeroCAS(e.target.value)}
                    placeholder="Ej: 7697-37-2"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Número ONU</label>
                  <input
                    type="text"
                    value={numeroONU}
                    onChange={(e) => setNumeroONU(e.target.value)}
                    placeholder="Ej: 2031"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Palabra de Advertencia</label>
                  <select
                    value={palabraAdvertencia}
                    onChange={(e) => setPalabraAdvertencia(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  >
                    <option value="PELIGRO">PELIGRO (Mayor severidad)</option>
                    <option value="ATENCIÓN">ATENCIÓN (Menor severidad)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Familia de Compatibilidad</label>
                  <select
                    value={compatibilidadGrupo}
                    onChange={(e) => setCompatibilidadGrupo(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  >
                    <option value="ACIDO_INORGANICO">Ácido Inorgánico</option>
                    <option value="BASE_FUERTE">Base Fuerte</option>
                    <option value="SOLVENTE_INFLAMABLE">Solvente Inflamable</option>
                    <option value="OXIDANTE">Oxidante</option>
                    <option value="TOXICO">Tóxico</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Ubicación en Planta / Almacén</label>
                <input
                  type="text"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  placeholder="Ej: Cubeto de Ácidos TK-104 - Sede Lurín"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Stock Almacenado</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unidad de Medida</label>
                  <select
                    value={unidad}
                    onChange={(e) => setUnidad(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  >
                    <option value="Kg">Kg</option>
                    <option value="L">L</option>
                    <option value="Gal">Galones</option>
                    <option value="Cilindros (55 Gal)">Cilindros (55 Gal)</option>
                    <option value="IBC (1000 L)">IBC (1000 L)</option>
                  </select>
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
                  Guardar Sustancia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
