/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GESTIÓN SSOMA A&D - Definición de Tipos y Modelos de Datos
 * Conforme a Ley 29783, D.S. 005-2012-TR, SGA/GHS e ISO 45001:2018
 */

export type UserRole = 'ADMINISTRADOR' | 'GERENCIA' | 'SUPERVISOR_SSOMA' | 'AUDITOR';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cipOCol?: string; // Colegiatura profesional si aplica
  sede: string;
  avatarUrl?: string;
}

export type SedeType = 'TODAS' | 'SEDE_CENTRAL_LURIN' | 'PLANTA_CALLAO' | 'ALMACEN_VENTANILLA';

export type PlanStatus = 'PROGRAMADO' | 'PENDIENTE' | 'EN_PROCESO' | 'EJECUTADO' | 'VENCIDO' | 'NO_EJECUTADO';

export interface PlanActivity {
  id: string;
  codigo: string;
  programaTipo: 'SST' | 'CAPACITACION' | 'INSPECCION' | 'AUDITORIA' | 'MEDIO_AMBIENTE';
  actividad: string;
  objetivo: string;
  responsable: string;
  frecuencia: 'MENSUAL' | 'BIMESTRAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL' | 'PUNTUAL';
  mesProgramado: number; // 1 - 12
  anio: number;
  fechaProgramada: string;
  fechaEjecucion?: string;
  estado: PlanStatus;
  evidenciaUrl?: string;
  evidenciaTitulo?: string;
  evidenciaJustificacion?: string;
  observaciones?: string;
  clausulaISO: string; // ej: "8.1.2", "9.2"
  sede: SedeType;
}

export type RiskLevel = 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';

export interface IPERCRow {
  id: string;
  codigo: string;
  proceso: string;
  actividad: string;
  tarea: string;
  puestoTrabajo: string;
  tipoPeligro: 'FISICO' | 'QUIMICO' | 'BIOLOGICO' | 'ERGONOMICO' | 'PSICOSOCIAL' | 'LOCATIVO' | 'MECANICO' | 'ELECTRICO';
  peligro: string;
  riesgo: string;
  consecuencia: string;
  // Controles existentes
  controlesExistentes: string;
  // Evaluación inicial
  indicePersonas: number;
  indiceProcedimientos: number;
  indiceCapacitacion: number;
  indiceExposicion: number;
  indiceProbabilidad: number;
  indiceSeveridad: number;
  nivelRiesgoPuro: RiskLevel;
  valorRiesgoPuro: number;
  // Jerarquía de Controles aplicados
  jerarquiaControl: 'ELIMINACION' | 'SUSTITUCION' | 'INGENIERIA' | 'ADMINISTRATIVO' | 'EPP';
  medidaControlPropuesta: string;
  // Evaluación residual
  probabilidadResidual: number;
  severidadResidual: number;
  nivelRiesgoResidual: RiskLevel;
  valorRiesgoResidual: number;
  responsable: string;
  fechaRevision: string;
  estadoSeguimiento: 'IMPLEMENTADO' | 'EN_PROCESO' | 'PENDIENTE';
}

export interface LegalRequirement {
  id: string;
  codigo: string;
  tipoNorma: 'LEY' | 'DECRETO_SUPREMO' | 'RESOLUCION_MINISTERIAL' | 'NORMA_TECNICA' | 'INTERNACIONAL';
  numeroNorma: string; // ej: "Ley N° 29783"
  tituloNorma: string;
  organismoEmisor: 'CONGRESO' | 'MTPE' | 'MINSA' | 'OSINERGMIN' | 'MINAM' | 'SUNAFIL' | 'ISO';
  articuloObligacion: string;
  descripcionRequisito: string;
  aplicabilidadSector: string;
  responsableEvaluacion: string;
  cumplimiento: 'CONFORME' | 'NO_CONFORME' | 'EN_PROCESO' | 'NO_APLICA';
  evidenciaCumplimiento: string;
  fechaUltimaEvaluacion: string;
  fechaProximaReevaluacion: string;
  clausulaISO: string; // ej: "6.1.3"
}

export type InspectionType = 
  | 'AREAS_QUIMICAS' 
  | 'EXTINTORES' 
  | 'LAVAOJOS_DUCHAS' 
  | 'HERRAMIENTAS' 
  | 'ORDEN_LIMPIEZA_5S' 
  | 'CONDICIONES_SEGURIDAD';

export interface InspectionCheckItem {
  id: string;
  criterio: string;
  resultado: 'CONFORME' | 'NO_CONFORME' | 'NO_APLICA';
  observacion?: string;
  criticidad: 'BAJA' | 'MEDIA' | 'ALTA';
}

export interface OperationalInspection {
  id: string;
  codigo: string;
  fecha: string;
  sede: SedeType;
  area: string;
  inspector: string;
  cargoInspector: string;
  tipo: InspectionType;
  items: InspectionCheckItem[];
  porcentajeConformidad: number;
  hallazgosCriticos: number;
  observacionesGenerales: string;
  responsableSubsanacion: string;
  fechaCompromiso: string;
  fotografias?: string[];
  firmado: boolean;
  estado: 'CONCLUIDA' | 'CON_ACCIONES_ABIERTAS' | 'CERRADA';
  actividadPlanId?: string; // Vínculo con Programa Anual SST
}

export type GHSPictogram = 
  | 'FLAMABLE' 
  | 'CORROSIVO' 
  | 'TOXICO_AGUDO' 
  | 'NOCIVO_IRRITANTE' 
  | 'EXPLOSIVO' 
  | 'COMBURENTE' 
  | 'GAS_PRESION' 
  | 'PELIGRO_SALUD' 
  | 'MEDIO_AMBIENTE';

export interface ChemicalSubstance {
  id: string;
  codigoInterno: string;
  nombreComercial: string;
  nombreQuimico: string;
  numeroCAS: string;
  numeroONU: string;
  formulaQuimica: string;
  palabraAdvertencia: 'PELIGRO' | 'ATENCIÓN';
  pictogramasSGA: GHSPictogram[];
  clasePeligro: string[];
  indicacionesPeligroH: string[]; // Frases H
  consejosPrudenciaP: string[]; // Frases P
  ubicacionAlmacen: string;
  sede: SedeType;
  stockActual: number;
  unidadMedida: 'L' | 'Kg' | 'Gal' | 'Cilindros (55 Gal)' | 'IBC (1000 L)';
  nivelStock: 'ADECUADO' | 'LIMITE_MAXIMO' | 'STOCK_MINIMO';
  compatibilidadGrupo: 'ACIDO_INORGANICO' | 'BASE_FUERTE' | 'SOLVENTE_INFLAMABLE' | 'OXIDANTE' | 'TOXICO';
  incompatibleCon: string[];
  eppRequerido: string[];
  medidasPrimerosAuxilios: string;
  medidasDerrames: string;
  medidasIncendio: string;
  sdsVersion: string;
  sdsFechaEmision: string;
  sdsFechaVencimiento: string; // Vence cada 3 años en Perú o revisión del fabricante
  sdsEstado: 'VIGENTE' | 'POR_VENCER' | 'VENCIDA';
  sdsUrl?: string;
}

export interface OccupationalMedicalExam {
  id: string;
  codigoTrabajador: string;
  nombreTrabajador: string;
  dni: string;
  puestoTrabajo: string;
  area: string;
  tipoEMO: 'INGRESO' | 'PERIODICO' | 'RETIRO' | 'REUBICACION';
  fechaExamen: string;
  fechaVencimiento: string;
  aptitud: 'APTO' | 'APTO_CON_RESTRICCIONES' | 'NO_APTO_TEMPORAL';
  // Confidencialidad médica: NO se exponen diagnósticos clínicos sensibles
  restriccionesLaborales: string[];
  medidasRecomendadasSSOMA: string[];
  clinicaOcupacional: string;
  medicoOcupacionalCMP: string;
  estadoSeguimiento: 'CUMPLIDO' | 'EN_OBSERVACION' | 'VENCIDO';
}

export interface EPPItem {
  id: string;
  codigo: string;
  nombre: string;
  categoria: 'PROTECCION_RESPIRATORIA' | 'PROTECCION_MANOS' | 'PROTECCION_VISUAL' | 'PROTECCION_CUERPO' | 'PROTECCION_PIES' | 'PROTECCION_AUDITIVA';
  especificacionTecnica: string;
  normaCertificacion: string; // ej: "ANSI/ISEA Z87.1", "EN 388 4544", "NIOSH N95"
  sustanciasAplicables: string[];
  stockAlmacen: number;
  unidadMedida: string;
  vidaUtilMeses: number;
  aptoSectorQuimico: boolean;
}

export interface EPPDeliveryRecord {
  id: string;
  fechaEntrega: string;
  dniTrabajador: string;
  nombreTrabajador: string;
  puestoTrabajo: string;
  eppId: string;
  eppNombre: string;
  cantidad: number;
  motivo: 'DOTACION_INICIAL' | 'RENOVACION_PERIODICA' | 'DETERIORO_OPERATIVO' | 'PERDIDA';
  proximaRenovacion: string;
  conformidadFirmada: boolean;
  estado: 'VIGENTE' | 'PROXIMO_A_VENCER' | 'VENCIDO';
}

export interface TrainingCourse {
  id: string;
  codigo: string;
  tema: string;
  tipo: 'NORMATIVA_LEY_29783' | 'ESPECIFICA_QUIMICA' | 'RESPUESTA_EMERGENCIAS' | 'SALUD_OCUPACIONAL';
  esObligatoria4Minimas: boolean;
  duracionHoras: number;
  instructor: string;
  institucion: string;
  fechaProgramada: string;
  fechaEjecutada?: string;
  participantesProgramados: number;
  participantesAsistieron: number;
  notaPromedio?: number;
  porcentajeAprobados?: number;
  estado: 'PROGRAMADA' | 'EJECUTADA' | 'POSTERGADA' | 'CANCELADA';
  evidenciaListaUrl?: string;
}

export interface SafetyIncident {
  id: string;
  codigo: string;
  tipo: 'ACCIDENTE_LEVE' | 'ACCIDENTE_INCAPACITANTE' | 'ACCIDENTE_FATAL' | 'INCIDENTE_PELIGROSO' | 'INCIDENTE' | 'ACTO_SUBESTANDAR' | 'CONDICION_SUBESTANDAR';
  fechaHora: string;
  sede: SedeType;
  areaExacta: string;
  trabajadorAfectado?: string;
  puestoTrabajo?: string;
  parteCuerpoAfectada?: string;
  diasPerdidos: number;
  sustanciaInvolucrada?: string;
  descripcionHechos: string;
  // Metodología Frank Bird
  causasInmediatasActos: string[];
  causasInmediatasCondiciones: string[];
  causasBasicasFactoresPersonales: string[];
  causasBasicasFactoresTrabajo: string[];
  analisis5Porques: string[];
  medidasCorrectivasInmediatas: string;
  investigadorLider: string;
  miembroComiteSST: string;
  estadoInvestigacion: 'EN_INVESTIGACION' | 'REVISION_COMITE_SST' | 'CERRADA_CON_PLAN';
  notificadoMTPE: boolean; // Notificación SAT conforme Ley 29783
}

export interface SafetyMetrics {
  horasHombreTrabajadasPeriodo: number;
  totalAccidentesIncapacitantes: number;
  totalDiasPerdidos: number;
  indiceFrecuenciaIF: number; // (N° Acc * 1,000,000) / HHT
  indiceSeveridadIS: number;   // (Días Perdidos * 1,000,000) / HHT
  indiceAccidentabilidadIA: number; // (IF * IS) / 1000
  metaMaximaIF: number;
  metaMaximaIS: number;
}

export interface DocumentRecord {
  id: string;
  codigo: string;
  titulo: string;
  categoria: 'POLITICA' | 'REGLAMENTO_RISST' | 'PROCEDIMIENTO_PETS' | 'FORMATO' | 'PLAN_PROGRAMA' | 'MATRIZ_IPERC' | 'INFORME';
  version: string;
  fechaAprobacion: string;
  fechaRevision: string;
  responsableElaboracion: string;
  responsableAprobacion: string;
  estado: 'VIGENTE' | 'EN_REVISION' | 'OBSOLETO';
  clausulaISO: string;
  archivoUbicacion: string;
  historialCambios: { version: string; fecha: string; motivo: string; autor: string }[];
}

export interface AuditRecord {
  id: string;
  codigo: string;
  tipo: 'INTERNA' | 'EXTERNA_CERTIFICADORA' | 'INSPECCION_SUNAFIL' | 'MINTRA';
  alcance: string;
  criteriosNormativos: string[]; // ej: ["ISO 45001:2018", "Ley 29783"]
  fechaInicio: string;
  fechaFin: string;
  auditorLider: string;
  equipoAuditor: string[];
  estado: 'PLANIFICADA' | 'EN_EJECUCION' | 'INFORME_EMITIDO' | 'PLAN_ACCION_ABIERTO' | 'CERRADA';
  hallazgosConteo: {
    noConformidadMayor: number;
    noConformidadMenor: number;
    oportunidadMejora: number;
    conformidades: number;
  };
}

export interface CorrectiveAction {
  id: string;
  codigo: string;
  origen: 'INSPECCION' | 'AUDITORIA' | 'ACCIDENTE_INCIDENTE' | 'EVALUACION_LEGAL' | 'COMITE_SST';
  referenciaOrigenId: string;
  hallazgoProblema: string;
  clausulaISO?: string;
  causaRaizIdentificada: string;
  accionCorrectivaPropuesta: string;
  responsableImplementacion: string;
  fechaCompromiso: string;
  fechaCierreReal?: string;
  evidenciaCierre?: string;
  estado: 'ABIERTA' | 'EN_PROCESO' | 'IMPLEMENTADA' | 'VERIFICADA_EFICAZ' | 'VENCIDA';
  verificadoPor?: string;
  comentariosVerificacion?: string;
  esCritica: boolean;
  sede: SedeType;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  usuarioNombre: string;
  usuarioRol: UserRole;
  accion: 'CREACION' | 'MODIFICACION' | 'EJECUCION_EVIDENCIA' | 'CIERRE_CAPA' | 'EVALUACION_LEGAL' | 'CAMBIO_ROL';
  modulo: string;
  descripcion: string;
  clausulaISO?: string;
  ipOEquipo?: string;
}

export interface ErgonomicAssessment {
  id: string;
  puestoTrabajo: string;
  area: string;
  tareaEvaluada: string;
  metodo: 'REBA' | 'RULA' | 'NIOSH_ECUACION' | 'CHECKLIST_OCRA';
  puntuacionObtenida: number;
  nivelRiesgo: 'INAPRECIABLE' | 'BAJO' | 'MEDIO' | 'ALTO' | 'MUY_ALTO';
  factoresRiesgo: string[];
  medidasIngenieriaErgonomica: string[];
  fechaEvaluacion: string;
  evaluador: string;
}

export interface AuditChecklistQuestion {
  id: string;
  clausula: string;
  requisitoISO: string;
  preguntaAuditoria: string;
  hallazgoResultado: 'CONFORME' | 'NO_CONFORMIDAD_MENOR' | 'NO_CONFORMIDAD_MAYOR' | 'OPORTUNIDAD_MEJORA';
  evidenciaObjetiva: string;
}

