/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GESTIÓN SSOMA A&D - Servicio de Almacenamiento y Capa de Datos
 * Preparado para conexión con Supabase (PostgreSQL + Auth + Storage)
 */

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
  SafetyMetrics,
  SedeType,
  AuditLogEntry,
  ErgonomicAssessment,
  AuditChecklistQuestion
} from '../types';

import {
  INITIAL_USER,
  INITIAL_PLAN_ACTIVITIES,
  INITIAL_IPERC_ROWS,
  INITIAL_LEGAL_REQUIREMENTS,
  INITIAL_CHEMICALS,
  INITIAL_INSPECTIONS,
  INITIAL_EPP_ITEMS,
  INITIAL_EPP_DELIVERIES,
  INITIAL_TRAININGS,
  INITIAL_INCIDENTS,
  INITIAL_MEDICAL_EXAMS,
  INITIAL_CORRECTIVE_ACTIONS,
  INITIAL_DOCUMENTS,
  INITIAL_AUDITS,
  INITIAL_ERGONOMICS,
  INITIAL_AUDIT_CHECKLIST
} from '../data/mockData';

const STORAGE_KEYS = {
  USER: 'ssoma_ayd_user',
  ACTIVITIES: 'ssoma_ayd_activities',
  IPERC: 'ssoma_ayd_iperc',
  LEGAL: 'ssoma_ayd_legal',
  CHEMICALS: 'ssoma_ayd_chemicals',
  INSPECTIONS: 'ssoma_ayd_inspections',
  EPP_ITEMS: 'ssoma_ayd_epp_items',
  EPP_DELIVERIES: 'ssoma_ayd_epp_deliveries',
  TRAININGS: 'ssoma_ayd_trainings',
  INCIDENTS: 'ssoma_ayd_incidents',
  MEDICAL: 'ssoma_ayd_medical',
  CORRECTIVE_ACTIONS: 'ssoma_ayd_capa',
  DOCUMENTS: 'ssoma_ayd_documents',
  AUDITS: 'ssoma_ayd_audits',
  SEDE_FILTER: 'ssoma_ayd_selected_sede',
  SUPABASE_CONFIG: 'ssoma_ayd_supabase_config',
  AUDIT_LOGS: 'ssoma_ayd_audit_logs',
  ERGONOMICS: 'ssoma_ayd_ergonomics',
  AUDIT_CHECKLIST: 'ssoma_ayd_audit_checklist'
};

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error guardando en localStorage para ${key}:`, err);
  }
}

export class SSOMADataService {
  // Configuración Supabase
  static getSupabaseConfig() {
    return getStored(STORAGE_KEYS.SUPABASE_CONFIG, {
      configured: false,
      supabaseUrl: '',
      supabaseAnonKey: '',
      dbEngine: 'PostgreSQL 15 (Supabase Cloud)',
      storageBucket: 'ssoma-evidencias',
      mode: 'MODO_DEMOSTRACION_LOCAL'
    });
  }

  static saveSupabaseConfig(config: { supabaseUrl: string; supabaseAnonKey: string }) {
    const updated = {
      ...this.getSupabaseConfig(),
      configured: Boolean(config.supabaseUrl && config.supabaseAnonKey),
      supabaseUrl: config.supabaseUrl,
      supabaseAnonKey: config.supabaseAnonKey,
      mode: config.supabaseUrl ? 'CONECTADO_SUPABASE' : 'MODO_DEMOSTRACION_LOCAL'
    };
    setStored(STORAGE_KEYS.SUPABASE_CONFIG, updated);
    return updated;
  }

  // Usuario
  static getCurrentUser(): CurrentUser {
    return getStored<CurrentUser>(STORAGE_KEYS.USER, INITIAL_USER);
  }

  static setCurrentUser(user: CurrentUser): void {
    setStored(STORAGE_KEYS.USER, user);
  }

  // Plan Anual
  static getActivities(): PlanActivity[] {
    return getStored<PlanActivity[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_PLAN_ACTIVITIES);
  }

  static saveActivity(activity: PlanActivity): PlanActivity[] {
    const list = this.getActivities();
    const index = list.findIndex(a => a.id === activity.id);
    let updated: PlanActivity[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = activity;
    } else {
      updated = [activity, ...list];
    }
    setStored(STORAGE_KEYS.ACTIVITIES, updated);
    return updated;
  }

  static executeActivityWithEvidence(
    activityId: string,
    evidence: {
      titulo: string;
      justificacion: string;
      fechaEjecucion: string;
      url?: string;
    }
  ): PlanActivity[] {
    const list = this.getActivities();
    const updated = list.map(act => {
      if (act.id === activityId) {
        return {
          ...act,
          estado: 'EJECUTADO' as const,
          fechaEjecucion: evidence.fechaEjecucion || new Date().toISOString().split('T')[0],
          evidenciaTitulo: evidence.titulo,
          evidenciaJustificacion: evidence.justificacion,
          evidenciaUrl: evidence.url || `/evidencias/GEN-${Date.now()}.pdf`
        };
      }
      return act;
    });
    setStored(STORAGE_KEYS.ACTIVITIES, updated);
    return updated;
  }

  // IPERC
  static getIPERCRows(): IPERCRow[] {
    return getStored<IPERCRow[]>(STORAGE_KEYS.IPERC, INITIAL_IPERC_ROWS);
  }

  static saveIPERCRow(row: IPERCRow): IPERCRow[] {
    const list = this.getIPERCRows();
    const index = list.findIndex(r => r.id === row.id);
    let updated: IPERCRow[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = row;
    } else {
      updated = [row, ...list];
    }
    setStored(STORAGE_KEYS.IPERC, updated);
    return updated;
  }

  // Requisitos Legales
  static getLegalRequirements(): LegalRequirement[] {
    return getStored<LegalRequirement[]>(STORAGE_KEYS.LEGAL, INITIAL_LEGAL_REQUIREMENTS);
  }

  static saveLegalRequirement(req: LegalRequirement): LegalRequirement[] {
    const list = this.getLegalRequirements();
    const index = list.findIndex(r => r.id === req.id);
    let updated: LegalRequirement[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = req;
    } else {
      updated = [req, ...list];
    }
    setStored(STORAGE_KEYS.LEGAL, updated);
    return updated;
  }

  // Sustancias Químicas
  static getChemicals(): ChemicalSubstance[] {
    return getStored<ChemicalSubstance[]>(STORAGE_KEYS.CHEMICALS, INITIAL_CHEMICALS);
  }

  static saveChemical(chem: ChemicalSubstance): ChemicalSubstance[] {
    const list = this.getChemicals();
    const index = list.findIndex(c => c.id === chem.id);
    let updated: ChemicalSubstance[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = chem;
    } else {
      updated = [chem, ...list];
    }
    setStored(STORAGE_KEYS.CHEMICALS, updated);
    return updated;
  }

  // Inspecciones
  static getInspections(): OperationalInspection[] {
    return getStored<OperationalInspection[]>(STORAGE_KEYS.INSPECTIONS, INITIAL_INSPECTIONS);
  }

  static saveInspection(inspection: OperationalInspection): OperationalInspection[] {
    const list = this.getInspections();
    const index = list.findIndex(i => i.id === inspection.id);
    let updated: OperationalInspection[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = inspection;
    } else {
      updated = [inspection, ...list];
    }
    setStored(STORAGE_KEYS.INSPECTIONS, updated);

    // 1. VINCULACIÓN AUTOMÁTICA CON EL PROGRAMA ANUAL DE SST (Ejemplo clave del usuario)
    if (inspection.actividadPlanId) {
      this.executeActivityWithEvidence(inspection.actividadPlanId, {
        titulo: `Informe de Inspección ${inspection.codigo} (${inspection.tipo.replace(/_/g, ' ')})`,
        justificacion: `Inspección operacional ejecutada con ${inspection.porcentajeConformidad}% de conformidad técnica y ${inspection.hallazgosCriticos} hallazgos críticos. Inspector: ${inspection.inspector}.`,
        fechaEjecucion: inspection.fecha,
        url: `/storage/informes/${inspection.codigo}.pdf`
      });
    }

    // 2. Si la inspección tuvo hallazgos críticos no conformes, relacionar automáticamente una Acción Correctiva CAPA
    const criticalFails = inspection.items.filter(item => item.resultado === 'NO_CONFORME' && item.criticidad === 'ALTA');
    if (criticalFails.length > 0) {
      const existingCapa = this.getCorrectiveActions();
      const alreadyCreated = existingCapa.some(c => c.referenciaOrigenId === inspection.codigo);
      if (!alreadyCreated) {
        const newCapa: CorrectiveAction = {
          id: `capa-auto-${Date.now()}`,
          codigo: `CAPA-${new Date().getFullYear()}-${String(existingCapa.length + 1).padStart(3, '0')}`,
          origen: 'INSPECCION',
          referenciaOrigenId: inspection.codigo,
          hallazgoProblema: `Hallazgo crítico detectado en ${inspection.tipo}: ${criticalFails.map(f => f.criterio).join('; ')}`,
          clausulaISO: '10.2',
          causaRaizIdentificada: 'Por determinar en análisis causal 5 Porqués.',
          accionCorrectivaPropuesta: `Subsanar hallazgos de inspección: ${inspection.observacionesGenerales}`,
          responsableImplementacion: inspection.responsableSubsanacion || 'Supervisor de Área',
          fechaCompromiso: inspection.fechaCompromiso || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          estado: 'ABIERTA',
          esCritica: true,
          sede: inspection.sede
        };
        this.saveCorrectiveAction(newCapa);
      }
    }

    // Registrar trazabilidad
    this.logAction({
      usuarioNombre: inspection.inspector,
      usuarioRol: 'SUPERVISOR_SSOMA',
      accion: 'CREACION',
      modulo: '05. Seguridad Operacional',
      descripcion: `Inspección ${inspection.codigo} registrada en ${inspection.area} (${inspection.porcentajeConformidad}% conf.)`,
      clausulaISO: '8.1.1'
    });

    return updated;
  }

  // EPP
  static getEPPItems(): EPPItem[] {
    return getStored<EPPItem[]>(STORAGE_KEYS.EPP_ITEMS, INITIAL_EPP_ITEMS);
  }

  static getEPPDeliveries(): EPPDeliveryRecord[] {
    return getStored<EPPDeliveryRecord[]>(STORAGE_KEYS.EPP_DELIVERIES, INITIAL_EPP_DELIVERIES);
  }

  static saveEPPDelivery(delivery: EPPDeliveryRecord): EPPDeliveryRecord[] {
    const list = this.getEPPDeliveries();
    const updated = [delivery, ...list];
    setStored(STORAGE_KEYS.EPP_DELIVERIES, updated);

    // Disminuir automáticamente el stock en almacén del EPP entregado
    const items = this.getEPPItems();
    const itemIdx = items.findIndex(i => i.id === delivery.eppId);
    if (itemIdx >= 0) {
      const updatedItems = [...items];
      updatedItems[itemIdx] = {
        ...updatedItems[itemIdx],
        stockAlmacen: Math.max(0, updatedItems[itemIdx].stockAlmacen - delivery.cantidad)
      };
      setStored(STORAGE_KEYS.EPP_ITEMS, updatedItems);
    }

    this.logAction({
      usuarioNombre: 'Encargado de Almacén SSOMA',
      usuarioRol: 'SUPERVISOR_SSOMA',
      accion: 'CREACION',
      modulo: '08. Gestión de EPP',
      descripcion: `Entrega de ${delivery.cantidad} ${delivery.eppNombre} a ${delivery.nombreTrabajador} (DNI ${delivery.dniTrabajador})`,
      clausulaISO: '8.1.2'
    });

    return updated;
  }

  // Capacitaciones
  static getTrainings(): TrainingCourse[] {
    return getStored<TrainingCourse[]>(STORAGE_KEYS.TRAININGS, INITIAL_TRAININGS);
  }

  static saveTraining(training: TrainingCourse): TrainingCourse[] {
    const list = this.getTrainings();
    const index = list.findIndex(t => t.id === training.id);
    let updated: TrainingCourse[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = training;
    } else {
      updated = [training, ...list];
    }
    setStored(STORAGE_KEYS.TRAININGS, updated);
    return updated;
  }

  // Incidentes & Accidentes
  static getIncidents(): SafetyIncident[] {
    return getStored<SafetyIncident[]>(STORAGE_KEYS.INCIDENTS, INITIAL_INCIDENTS);
  }

  static saveIncident(incident: SafetyIncident): SafetyIncident[] {
    const list = this.getIncidents();
    const index = list.findIndex(i => i.id === incident.id);
    let updated: SafetyIncident[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = incident;
    } else {
      updated = [incident, ...list];
    }
    setStored(STORAGE_KEYS.INCIDENTS, updated);
    return updated;
  }

  // Salud Ocupacional
  static getMedicalExams(): OccupationalMedicalExam[] {
    return getStored<OccupationalMedicalExam[]>(STORAGE_KEYS.MEDICAL, INITIAL_MEDICAL_EXAMS);
  }

  // Acciones Correctivas
  static getCorrectiveActions(): CorrectiveAction[] {
    return getStored<CorrectiveAction[]>(STORAGE_KEYS.CORRECTIVE_ACTIONS, INITIAL_CORRECTIVE_ACTIONS);
  }

  static saveCorrectiveAction(capa: CorrectiveAction): CorrectiveAction[] {
    const list = this.getCorrectiveActions();
    const index = list.findIndex(c => c.id === capa.id);
    let updated: CorrectiveAction[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = capa;
    } else {
      updated = [capa, ...list];
    }
    setStored(STORAGE_KEYS.CORRECTIVE_ACTIONS, updated);
    return updated;
  }

  // Gestión Documental
  static getDocuments(): DocumentRecord[] {
    return getStored<DocumentRecord[]>(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
  }

  // Auditorías
  static getAudits(): AuditRecord[] {
    return getStored<AuditRecord[]>(STORAGE_KEYS.AUDITS, INITIAL_AUDITS);
  }

  // Cálculo de Índices de Seguridad (Ley 29783 / MTPE)
  static calculateSafetyMetrics(sede: SedeType = 'TODAS'): SafetyMetrics {
    // Horas Hombre Trabajadas (HHT) estimadas para 148 trabajadores en el periodo
    const hhtBase = sede === 'TODAS' ? 180000 : 95000;
    const incidents = this.getIncidents().filter(i => sede === 'TODAS' || i.sede === sede);
    
    const incapacitantes = incidents.filter(i => i.tipo === 'ACCIDENTE_INCAPACITANTE' || i.tipo === 'ACCIDENTE_FATAL').length;
    const totalDias = incidents.reduce((acc, curr) => acc + (curr.diasPerdidos || 0), 0);

    // IF = (N° Acc * 1,000,000) / HHT
    const ifValue = hhtBase > 0 ? Number(((incapacitantes * 1000000) / hhtBase).toFixed(2)) : 0;
    // IS = (Días Perdidos * 1,000,000) / HHT
    const isValue = hhtBase > 0 ? Number(((totalDias * 1000000) / hhtBase).toFixed(2)) : 0;
    // IA = (IF * IS) / 1000
    const iaValue = Number(((ifValue * isValue) / 1000).toFixed(2));

    return {
      horasHombreTrabajadasPeriodo: hhtBase,
      totalAccidentesIncapacitantes: incapacitantes,
      totalDiasPerdidos: totalDias,
      indiceFrecuenciaIF: ifValue,
      indiceSeveridadIS: isValue,
      indiceAccidentabilidadIA: iaValue,
      metaMaximaIF: 2.5,
      metaMaximaIS: 15.0
    };
  }

  // Registro de Auditoría y Trazabilidad (ISO 45001)
  static getAuditLogs(): AuditLogEntry[] {
    return getStored<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOGS, [
      {
        id: 'log-01',
        timestamp: '2026-03-02 11:20:00',
        usuarioNombre: 'Ing. Alejandro Del Castillo',
        usuarioRol: 'SUPERVISOR_SSOMA',
        accion: 'EJECUCION_EVIDENCIA',
        modulo: '02. Planificación SSOMA',
        descripcion: 'Cierre de actividad PASST-2026-002 con informe INSP-2026-018.',
        clausulaISO: '8.1.1',
        ipOEquipo: '192.168.10.45 (Terminal Planta Lurín)'
      },
      {
        id: 'log-02',
        timestamp: '2026-02-18 14:10:00',
        usuarioNombre: 'Ing. Alejandro Del Castillo',
        usuarioRol: 'SUPERVISOR_SSOMA',
        accion: 'CREACION',
        modulo: '10. Accidentes e Incidentes',
        descripcion: 'Registro e investigación causal de incidente peligroso INC-2026-003 (Ácido Sulfúrico).',
        clausulaISO: '10.2',
        ipOEquipo: '192.168.10.45'
      },
      {
        id: 'log-03',
        timestamp: '2026-01-20 09:15:00',
        usuarioNombre: 'Ing. Alejandro Del Castillo',
        usuarioRol: 'SUPERVISOR_SSOMA',
        accion: 'MODIFICACION',
        modulo: '03. Gestión de Riesgos - IPERC',
        descripcion: 'Actualización de controles de ingeniería para trasvase de H2SO4 en reactor R-101.',
        clausulaISO: '6.1.2',
        ipOEquipo: '192.168.10.45'
      }
    ]);
  }

  static logAction(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const logs = this.getAuditLogs();
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipOEquipo: entry.ipOEquipo || 'Terminal Operativo SSOMA'
    };
    setStored(STORAGE_KEYS.AUDIT_LOGS, [newEntry, ...logs.slice(0, 99)]);
  }

  // Evaluaciones Ergonómicas (R.M. 375-2008-TR)
  static getErgonomics(): ErgonomicAssessment[] {
    return getStored<ErgonomicAssessment[]>(STORAGE_KEYS.ERGONOMICS, INITIAL_ERGONOMICS);
  }

  static saveErgonomic(ergo: ErgonomicAssessment): ErgonomicAssessment[] {
    const list = this.getErgonomics();
    const index = list.findIndex(e => e.id === ergo.id);
    let updated: ErgonomicAssessment[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = ergo;
    } else {
      updated = [ergo, ...list];
    }
    setStored(STORAGE_KEYS.ERGONOMICS, updated);
    return updated;
  }

  // Lista de Verificación de Auditorías ISO 45001
  static getAuditChecklist(): AuditChecklistQuestion[] {
    return getStored<AuditChecklistQuestion[]>(STORAGE_KEYS.AUDIT_CHECKLIST, INITIAL_AUDIT_CHECKLIST);
  }

  static saveAuditChecklistItem(item: AuditChecklistQuestion): AuditChecklistQuestion[] {
    const list = this.getAuditChecklist();
    const index = list.findIndex(q => q.id === item.id);
    let updated: AuditChecklistQuestion[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = item;
    } else {
      updated = [item, ...list];
    }
    setStored(STORAGE_KEYS.AUDIT_CHECKLIST, updated);
    return updated;
  }

  // Reset factory data
  static resetAllData(): void {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  }
}
