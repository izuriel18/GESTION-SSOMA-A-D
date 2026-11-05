/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GESTIÓN SSOMA A&D - Contexto Global de Estado y Trazabilidad
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  PlanActivity,
  IPERCRow,
  LegalRequirement,
  OperationalInspection,
  ChemicalSubstance,
  OccupationalMedicalExam,
  EPPItem,
  EPPDeliveryRecord,
  TrainingCourse,
  SafetyIncident,
  DocumentRecord,
  AuditRecord,
  CorrectiveAction,
  CurrentUser,
  UserRole,
  SedeType,
  SafetyMetrics,
  AuditLogEntry,
  ErgonomicAssessment,
  AuditChecklistQuestion
} from '../types';
import { SSOMADataService } from '../services/storage';

interface SSOMAContextType {
  currentUser: CurrentUser;
  setCurrentUser: (user: CurrentUser) => void;
  setUserRole: (role: UserRole) => void;
  selectedSede: SedeType;
  setSelectedSede: (sede: SedeType) => void;
  activeModule: string;
  setActiveModule: (moduleId: string) => void;

  // Colecciones de datos
  activities: PlanActivity[];
  ipercRows: IPERCRow[];
  legalRequirements: LegalRequirement[];
  chemicals: ChemicalSubstance[];
  inspections: OperationalInspection[];
  eppItems: EPPItem[];
  eppDeliveries: EPPDeliveryRecord[];
  trainings: TrainingCourse[];
  incidents: SafetyIncident[];
  medicalExams: OccupationalMedicalExam[];
  correctiveActions: CorrectiveAction[];
  documents: DocumentRecord[];
  audits: AuditRecord[];

  auditLogs: AuditLogEntry[];
  ergonomicAssessments: ErgonomicAssessment[];
  auditChecklist: AuditChecklistQuestion[];

  // Métricas calculadas
  safetyMetrics: SafetyMetrics;
  planStats: {
    total: number;
    ejecutadas: number;
    programadas: number;
    enProceso: number;
    vencidas: number;
    cumplimientoPct: number;
  };
  criticalFindingsCount: number;

  // Acciones y Mutaciones
  executeActivity: (activityId: string, evidence: { titulo: string; justificacion: string; fechaEjecucion: string; url?: string }) => void;
  saveActivity: (act: PlanActivity) => void;
  saveIPERCRow: (row: IPERCRow) => void;
  saveLegalRequirement: (req: LegalRequirement) => void;
  saveChemical: (chem: ChemicalSubstance) => void;
  saveInspection: (insp: OperationalInspection) => void;
  saveEPPDelivery: (deliv: EPPDeliveryRecord) => void;
  saveTraining: (tr: TrainingCourse) => void;
  saveIncident: (inc: SafetyIncident) => void;
  saveCorrectiveAction: (capa: CorrectiveAction) => void;
  saveErgonomicAssessment: (ergo: ErgonomicAssessment) => void;
  saveAuditChecklistItem: (item: AuditChecklistQuestion) => void;

  // Supabase State & Config
  supabaseConfig: ReturnType<typeof SSOMADataService.getSupabaseConfig>;
  updateSupabaseConfig: (config: { supabaseUrl: string; supabaseAnonKey: string }) => void;
  resetToDefaults: () => void;
}

const SSOMAContext = createContext<SSOMAContextType | undefined>(undefined);

export const SSOMAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<CurrentUser>(() => SSOMADataService.getCurrentUser());
  const [selectedSede, setSelectedSede] = useState<SedeType>('TODAS');
  const [activeModule, setActiveModule] = useState<string>('01_dashboard');

  const [activities, setActivities] = useState<PlanActivity[]>(() => SSOMADataService.getActivities());
  const [ipercRows, setIpercRows] = useState<IPERCRow[]>(() => SSOMADataService.getIPERCRows());
  const [legalRequirements, setLegalRequirements] = useState<LegalRequirement[]>(() => SSOMADataService.getLegalRequirements());
  const [chemicals, setChemicals] = useState<ChemicalSubstance[]>(() => SSOMADataService.getChemicals());
  const [inspections, setInspections] = useState<OperationalInspection[]>(() => SSOMADataService.getInspections());
  const [eppItems, setEppItems] = useState<EPPItem[]>(() => SSOMADataService.getEPPItems());
  const [eppDeliveries, setEppDeliveries] = useState<EPPDeliveryRecord[]>(() => SSOMADataService.getEPPDeliveries());
  const [trainings, setTrainings] = useState<TrainingCourse[]>(() => SSOMADataService.getTrainings());
  const [incidents, setIncidents] = useState<SafetyIncident[]>(() => SSOMADataService.getIncidents());
  const [medicalExams] = useState<OccupationalMedicalExam[]>(() => SSOMADataService.getMedicalExams());
  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction[]>(() => SSOMADataService.getCorrectiveActions());
  const [documents] = useState<DocumentRecord[]>(() => SSOMADataService.getDocuments());
  const [audits] = useState<AuditRecord[]>(() => SSOMADataService.getAudits());

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => SSOMADataService.getAuditLogs());
  const [ergonomicAssessments, setErgonomicAssessments] = useState<ErgonomicAssessment[]>(() => SSOMADataService.getErgonomics());
  const [auditChecklist, setAuditChecklist] = useState<AuditChecklistQuestion[]>(() => SSOMADataService.getAuditChecklist());

  const [supabaseConfig, setSupabaseConfig] = useState(() => SSOMADataService.getSupabaseConfig());

  // Actualizar rol del usuario
  const setUserRole = (role: UserRole) => {
    const updated = { ...currentUser, role };
    setCurrentUserState(updated);
    SSOMADataService.setCurrentUser(updated);
    SSOMADataService.logAction({
      usuarioNombre: currentUser.name,
      usuarioRol: role,
      accion: 'CAMBIO_ROL',
      modulo: '15. Configuración del Sistema',
      descripcion: `Cambio de perfil a ${role}`,
      clausulaISO: '5.3'
    });
    setAuditLogs([...SSOMADataService.getAuditLogs()]);
  };

  const setCurrentUser = (user: CurrentUser) => {
    setCurrentUserState(user);
    SSOMADataService.setCurrentUser(user);
  };

  // Mutaciones
  const executeActivity = (activityId: string, evidence: { titulo: string; justificacion: string; fechaEjecucion: string; url?: string }) => {
    const updated = SSOMADataService.executeActivityWithEvidence(activityId, evidence);
    setActivities([...updated]);
    setAuditLogs([...SSOMADataService.getAuditLogs()]);
  };

  const saveActivity = (act: PlanActivity) => {
    const updated = SSOMADataService.saveActivity(act);
    setActivities([...updated]);
    SSOMADataService.logAction({
      usuarioNombre: currentUser.name,
      usuarioRol: currentUser.role,
      accion: 'CREACION',
      modulo: '02. Planificación SSOMA',
      descripcion: `Nueva actividad registrada: ${act.actividad} (${act.codigo})`,
      clausulaISO: act.clausulaISO
    });
    setAuditLogs([...SSOMADataService.getAuditLogs()]);
  };

  const saveIPERCRow = (row: IPERCRow) => {
    const updated = SSOMADataService.saveIPERCRow(row);
    setIpercRows([...updated]);
    SSOMADataService.logAction({
      usuarioNombre: currentUser.name,
      usuarioRol: currentUser.role,
      accion: 'CREACION',
      modulo: '03. Gestión de Riesgos - IPERC',
      descripcion: `Evaluación de peligro: ${row.peligro} en puesto ${row.puestoTrabajo} (${row.nivelRiesgoPuro})`,
      clausulaISO: '6.1.2'
    });
    setAuditLogs([...SSOMADataService.getAuditLogs()]);
  };

  const saveLegalRequirement = (req: LegalRequirement) => {
    const updated = SSOMADataService.saveLegalRequirement(req);
    setLegalRequirements([...updated]);
    SSOMADataService.logAction({
      usuarioNombre: currentUser.name,
      usuarioRol: currentUser.role,
      accion: 'EVALUACION_LEGAL',
      modulo: '04. Requisitos Legales',
      descripcion: `Evaluación de ${req.numeroNorma} (${req.cumplimiento})`,
      clausulaISO: '6.1.3'
    });
    setAuditLogs([...SSOMADataService.getAuditLogs()]);
  };

  const saveChemical = (chem: ChemicalSubstance) => {
    const updated = SSOMADataService.saveChemical(chem);
    setChemicals([...updated]);
    SSOMADataService.logAction({
      usuarioNombre: currentUser.name,
      usuarioRol: currentUser.role,
      accion: 'CREACION',
      modulo: '06. Sustancias Químicas',
      descripcion: `Alta en catálogo SGA: ${chem.nombreComercial} (CAS ${chem.numeroCAS})`,
      clausulaISO: '8.1'
    });
    setAuditLogs([...SSOMADataService.getAuditLogs()]);
  };

  const saveInspection = (insp: OperationalInspection) => {
    const updated = SSOMADataService.saveInspection(insp);
    setInspections([...updated]);
    // Refresh activities because saveInspection may execute linked plan activities!
    setActivities([...SSOMADataService.getActivities()]);
    // Refresh CAPA as critical inspections generate CAPA
    setCorrectiveActions([...SSOMADataService.getCorrectiveActions()]);
    setAuditLogs([...SSOMADataService.getAuditLogs()]);
  };

  const saveEPPDelivery = (deliv: EPPDeliveryRecord) => {
    const updated = SSOMADataService.saveEPPDelivery(deliv);
    setEppDeliveries([...updated]);
    // Refresh EPP items because warehouse stock was decremented!
    setEppItems([...SSOMADataService.getEPPItems()]);
    setAuditLogs([...SSOMADataService.getAuditLogs()]);
  };

  const saveTraining = (tr: TrainingCourse) => {
    const updated = SSOMADataService.saveTraining(tr);
    setTrainings([...updated]);
    SSOMADataService.logAction({
      usuarioNombre: currentUser.name,
      usuarioRol: currentUser.role,
      accion: 'CREACION',
      modulo: '09. Capacitaciones',
      descripcion: `Curso programado: ${tr.tema} (${tr.duracionHoras}h)`,
      clausulaISO: '7.2'
    });
    setAuditLogs([...SSOMADataService.getAuditLogs()]);
  };

  const saveIncident = (inc: SafetyIncident) => {
    const updated = SSOMADataService.saveIncident(inc);
    setIncidents([...updated]);
    SSOMADataService.logAction({
      usuarioNombre: currentUser.name,
      usuarioRol: currentUser.role,
      accion: 'CREACION',
      modulo: '10. Accidentes e Incidentes',
      descripcion: `Reporte de ${inc.tipo} (${inc.codigo}): ${inc.descripcionHechos.substring(0, 40)}...`,
      clausulaISO: '10.2'
    });
    setAuditLogs([...SSOMADataService.getAuditLogs()]);
  };

  const saveCorrectiveAction = (capa: CorrectiveAction) => {
    const updated = SSOMADataService.saveCorrectiveAction(capa);
    setCorrectiveActions([...updated]);
    SSOMADataService.logAction({
      usuarioNombre: currentUser.name,
      usuarioRol: currentUser.role,
      accion: capa.estado === 'VERIFICADA_EFICAZ' ? 'CIERRE_CAPA' : 'CREACION',
      modulo: '13. Acciones Correctivas',
      descripcion: `Acción ${capa.codigo} [${capa.estado}]: ${capa.hallazgoProblema.substring(0, 40)}...`,
      clausulaISO: '10.2'
    });
    setAuditLogs([...SSOMADataService.getAuditLogs()]);
  };

  const saveErgonomicAssessment = (ergo: ErgonomicAssessment) => {
    const updated = SSOMADataService.saveErgonomic(ergo);
    setErgonomicAssessments([...updated]);
    setAuditLogs([...SSOMADataService.getAuditLogs()]);
  };

  const saveAuditChecklistItem = (item: AuditChecklistQuestion) => {
    const updated = SSOMADataService.saveAuditChecklistItem(item);
    setAuditChecklist([...updated]);
    setAuditLogs([...SSOMADataService.getAuditLogs()]);
  };

  const updateSupabaseConfig = (config: { supabaseUrl: string; supabaseAnonKey: string }) => {
    const updated = SSOMADataService.saveSupabaseConfig(config);
    setSupabaseConfig(updated);
  };

  const resetToDefaults = () => {
    SSOMADataService.resetAllData();
    window.location.reload();
  };

  // Cálculo de estadísticas del Plan Anual filtradas por Sede
  const planStats = useMemo(() => {
    const filtered = activities.filter(a => selectedSede === 'TODAS' || a.sede === 'TODAS' || a.sede === selectedSede);
    const total = filtered.length;
    const ejecutadas = filtered.filter(a => a.estado === 'EJECUTADO').length;
    const programadas = filtered.filter(a => a.estado === 'PROGRAMADO').length;
    const enProceso = filtered.filter(a => a.estado === 'EN_PROCESO').length;
    const vencidas = filtered.filter(a => a.estado === 'VENCIDO').length;
    const cumplimientoPct = total > 0 ? Math.round((ejecutadas / total) * 100) : 0;

    return {
      total,
      ejecutadas,
      programadas,
      enProceso,
      vencidas,
      cumplimientoPct
    };
  }, [activities, selectedSede]);

  // Métricas de Seguridad
  const safetyMetrics = useMemo(() => {
    return SSOMADataService.calculateSafetyMetrics(selectedSede);
  }, [incidents, selectedSede]);

  // Hallazgos Críticos Abiertos
  const criticalFindingsCount = useMemo(() => {
    return correctiveActions.filter(c => c.estado !== 'VERIFICADA_EFICAZ' && c.esCritica).length;
  }, [correctiveActions]);

  return (
    <SSOMAContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        setUserRole,
        selectedSede,
        setSelectedSede,
        activeModule,
        setActiveModule,
        activities,
        ipercRows,
        legalRequirements,
        chemicals,
        inspections,
        eppItems,
        eppDeliveries,
        trainings,
        incidents,
        medicalExams,
        correctiveActions,
        documents,
        audits,
        auditLogs,
        ergonomicAssessments,
        auditChecklist,
        safetyMetrics,
        planStats,
        criticalFindingsCount,
        executeActivity,
        saveActivity,
        saveIPERCRow,
        saveLegalRequirement,
        saveChemical,
        saveInspection,
        saveEPPDelivery,
        saveTraining,
        saveIncident,
        saveCorrectiveAction,
        saveErgonomicAssessment,
        saveAuditChecklistItem,
        supabaseConfig,
        updateSupabaseConfig,
        resetToDefaults
      }}
    >
      {children}
    </SSOMAContext.Provider>
  );
};

export const useSSOMA = () => {
  const context = useContext(SSOMAContext);
  if (!context) {
    throw new Error('useSSOMA debe ser utilizado dentro de un SSOMAProvider');
  }
  return context;
};
