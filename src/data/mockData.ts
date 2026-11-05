/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GESTIÓN SSOMA A&D - Datos Iniciales de Alta Fidelidad
 * Empresa: QUÍMICA & DERIVADOS INDUSTRIALES S.A.C. (RUC 20554892110)
 * Sedes: Sede Central Lurín (Planta de Formulación) & Planta Callao (Almacén Marítimo)
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
  ErgonomicAssessment,
  AuditChecklistQuestion
} from '../types';

export const INITIAL_USER: CurrentUser = {
  id: 'usr-001',
  name: 'Ing. Alejandro Del Castillo',
  email: 'a.delcastillo@aydquimica.pe',
  role: 'SUPERVISOR_SSOMA',
  cipOCol: 'CIP 184592 - Ing. Químico / Esp. Higiene Industrial',
  sede: 'SEDE_CENTRAL_LURIN',
};

export const INITIAL_PLAN_ACTIVITIES: PlanActivity[] = [
  {
    id: 'act-01',
    codigo: 'PASST-2026-001',
    programaTipo: 'SST',
    actividad: 'Revisión y actualización de la Matriz IPERC de la Planta de Reactores',
    objetivo: 'Identificar nuevos peligros tras la modernización de la línea de condensadores.',
    responsable: 'Ing. Alejandro Del Castillo (SSOMA)',
    frecuencia: 'ANUAL',
    mesProgramado: 1,
    anio: 2026,
    fechaProgramada: '2026-01-20',
    fechaEjecucion: '2026-01-18',
    estado: 'EJECUTADO',
    evidenciaUrl: '/evidencias/IPERC-ACT-01.pdf',
    evidenciaTitulo: 'Acta del Comité SST y Matriz IPERC Rev. 04 firmada',
    evidenciaJustificacion: 'Validada en sesión ordinaria del Comité SST N° 01-2026 con participación de los trabajadores.',
    clausulaISO: '6.1.2',
    sede: 'SEDE_CENTRAL_LURIN'
  },
  {
    id: 'act-02',
    codigo: 'PASST-2026-002',
    programaTipo: 'INSPECCION',
    actividad: 'Inspección técnica de Duchas y Lavaojos de Emergencia en Zona Química',
    objetivo: 'Garantizar flujo de agua desmineralizada y activación en menos de 1 segundo.',
    responsable: 'Téc. Marco Benítez (Seguridad Operativa)',
    frecuencia: 'MENSUAL',
    mesProgramado: 2,
    anio: 2026,
    fechaProgramada: '2026-02-14',
    fechaEjecucion: '2026-02-14',
    estado: 'EJECUTADO',
    evidenciaUrl: '/evidencias/INSP-DUCHAS-FEB.pdf',
    evidenciaTitulo: 'Informe de Inspección INSP-2026-018 con registro fotográfico',
    evidenciaJustificacion: 'Inspección mensual conforme ANSI Z358.1 y D.S. 042-F.',
    clausulaISO: '8.1.1',
    sede: 'SEDE_CENTRAL_LURIN'
  },
  {
    id: 'act-03',
    codigo: 'PASST-2026-003',
    programaTipo: 'CAPACITACION',
    actividad: 'Capacitación Obligatoria N° 1: Manejo Seguro de Sustancias Químicas y Sistema SGA',
    objetivo: 'Cumplir con el mandato legal de 4 capacitaciones mínimas según Ley 29783.',
    responsable: 'Dpto. SSOMA / Asesor Externo Químico',
    frecuencia: 'TRIMESTRAL',
    mesProgramado: 3,
    anio: 2026,
    fechaProgramada: '2026-03-10',
    fechaEjecucion: '2026-03-10',
    estado: 'EJECUTADO',
    evidenciaUrl: '/evidencias/CAPAC-01-SGA.pdf',
    evidenciaTitulo: 'Registro de Asistencia oficial y evaluación de conocimiento (Promedio 16.8/20)',
    evidenciaJustificacion: 'Capacitación presencial ejecutada con 42 operadores de producción y almacén.',
    clausulaISO: '7.2',
    sede: 'TODAS'
  },
  {
    id: 'act-04',
    codigo: 'PASST-2026-004',
    programaTipo: 'INSPECCION',
    actividad: 'Inspección de Sistemas de Supresión de Incendios y Extintores CO2/PQS',
    objetivo: 'Verificar presión, precintos, señalización y prueba hidrostática.',
    responsable: 'Empresa Certificada NFPA / Sup. SSOMA',
    frecuencia: 'MENSUAL',
    mesProgramado: 3,
    anio: 2026,
    fechaProgramada: '2026-03-25',
    fechaEjecucion: '2026-03-25',
    estado: 'EJECUTADO',
    evidenciaUrl: '/evidencias/INSP-EXTINTORES-MAR.pdf',
    evidenciaTitulo: 'Cartilla de operatividad de 64 extintores y sistema rociador',
    evidenciaJustificacion: 'Completada al 100%. Se reemplazaron 2 precintos de seguridad vencidos.',
    clausulaISO: '8.2',
    sede: 'PLANTA_CALLAO'
  },
  {
    id: 'act-05',
    codigo: 'PASST-2026-005',
    programaTipo: 'CAPACITACION',
    actividad: 'Capacitación Obligatoria N° 2: Respuesta Inmediata ante Derrames Químicos y Kit Spill',
    objetivo: 'Adiestramiento de la brigada de emergencias en neutralización y contención.',
    responsable: 'Jefe de Brigada / SSOMA',
    frecuencia: 'PUNTUAL',
    mesProgramado: 4,
    anio: 2026,
    fechaProgramada: '2026-04-18',
    estado: 'PROGRAMADO',
    clausulaISO: '8.2',
    sede: 'SEDE_CENTRAL_LURIN'
  },
  {
    id: 'act-06',
    codigo: 'PASST-2026-006',
    programaTipo: 'AUDITORIA',
    actividad: 'Auditoría Interna del Sistema de Gestión SSOMA según ISO 45001:2018',
    objetivo: 'Evaluar la conformidad de los procesos de almacenamiento y producción química.',
    responsable: 'Equipo de Auditores Internos Calificados',
    frecuencia: 'SEMESTRAL',
    mesProgramado: 6,
    anio: 2026,
    fechaProgramada: '2026-06-15',
    estado: 'PROGRAMADO',
    clausulaISO: '9.2',
    sede: 'TODAS'
  },
  {
    id: 'act-07',
    codigo: 'PASST-2026-007',
    programaTipo: 'SST',
    actividad: 'Monitoreo Ocupacional de Agentes Químicos (Vapores Orgánicos y Neblinas Ácidas)',
    objetivo: 'Comprobar que las concentraciones ambientales no superen los TLV del D.S. 015-2005-SA.',
    responsable: 'Laboratorio Acreditado INACAL',
    frecuencia: 'ANUAL',
    mesProgramado: 5,
    anio: 2026,
    fechaProgramada: '2026-05-12',
    estado: 'PROGRAMADO',
    clausulaISO: '9.1.1',
    sede: 'SEDE_CENTRAL_LURIN'
  },
  {
    id: 'act-08',
    codigo: 'PASST-2026-008',
    programaTipo: 'INSPECCION',
    actividad: 'Inspección de Contención Secundaria y Cubetos en Parque de Tanques',
    objetivo: 'Verificar integridad de geomembranas y capacidad de retención del 110%.',
    responsable: 'Ing. Alejandro Del Castillo',
    frecuencia: 'TRIMESTRAL',
    mesProgramado: 4,
    anio: 2026,
    fechaProgramada: '2026-04-22',
    estado: 'PROGRAMADO',
    clausulaISO: '8.1.1',
    sede: 'PLANTA_CALLAO'
  }
];

export const INITIAL_IPERC_ROWS: IPERCRow[] = [
  {
    id: 'iperc-001',
    codigo: 'IPERC-PRD-01',
    proceso: 'Fabricación y Formulación Química',
    actividad: 'Carga de Reactivos Ácidos en Reactor R-101',
    tarea: 'Conexión de manguera de trasvase y adición de Ácido Sulfúrico 98%',
    puestoTrabajo: 'Operador de Planta de Reactores',
    tipoPeligro: 'QUIMICO',
    peligro: 'Sustancia química corrosiva de alta concentración (H2SO4 98%) a 45°C',
    riesgo: 'Salpicadura, proyección o fuga por acople defectuoso a alta presión',
    consecuencia: 'Quemaduras químicas graves de 3er grado en piel y daño ocular irreversible',
    controlesExistentes: 'Procedimiento PETS-PRD-004, dique de contención, ducha de seguridad a 4 metros',
    indicePersonas: 2,
    indiceProcedimientos: 2,
    indiceCapacitacion: 2,
    indiceExposicion: 3,
    indiceProbabilidad: 9, // Suma: 9
    indiceSeveridad: 3,   // Severidad crítica
    nivelRiesgoPuro: 'CRITICO',
    valorRiesgoPuro: 27,
    jerarquiaControl: 'INGENIERIA',
    medidaControlPropuesta: 'Instalación de acople rápido en seco con sensor de enclavamiento neumático y pantalla de policarbonato deflectora. Uso de traje Tychem C y careta facial con ventilación forzada.',
    probabilidadResidual: 4,
    severidadResidual: 2,
    nivelRiesgoResidual: 'MEDIO',
    valorRiesgoResidual: 8,
    responsable: 'Jefe de Planta / Sup. SSOMA',
    fechaRevision: '2026-01-20',
    estadoSeguimiento: 'IMPLEMENTADO'
  },
  {
    id: 'iperc-002',
    codigo: 'IPERC-ALM-02',
    proceso: 'Almacenamiento y Logística de Químicos',
    actividad: 'Traslado y Estibado de Cilindros de Solvente Inflamable (Tolueno)',
    tarea: 'Transporte con montacargas a batería en nave de inflamables',
    puestoTrabajo: 'Montacarguista Certificado',
    tipoPeligro: 'FISICO',
    peligro: 'Generación de chispas mecánicas o electricidad estática en atmósfera inflamable',
    riesgo: 'Incendio clase B o explosión en área confinada de solventes',
    consecuencia: 'Quemaduras graves, asfixia por humo tóxico y destrucción de instalaciones',
    controlesExistentes: 'Montacargas antiexplosivo (EX), polo a tierra para tambores, detector de vapores LEL',
    indicePersonas: 2,
    indiceProcedimientos: 1,
    indiceCapacitacion: 2,
    indiceExposicion: 2,
    indiceProbabilidad: 7,
    indiceSeveridad: 3,
    nivelRiesgoPuro: 'ALTO',
    valorRiesgoPuro: 21,
    jerarquiaControl: 'INGENIERIA',
    medidaControlPropuesta: 'Sistema automatizado de puesta a tierra con semáforo verde/rojo que inhabilita el trasvase sin continuidad eléctrica. Purgador automático de vapores.',
    probabilidadResidual: 3,
    severidadResidual: 2,
    nivelRiesgoResidual: 'BAJO',
    valorRiesgoResidual: 6,
    responsable: 'Sup. Almacén / SSOMA',
    fechaRevision: '2026-01-22',
    estadoSeguimiento: 'IMPLEMENTADO'
  },
  {
    id: 'iperc-003',
    codigo: 'IPERC-LAB-03',
    proceso: 'Control de Calidad y Ensayos Químicos',
    actividad: 'Análisis Titulométrico con Soluciones Patrón Ácido-Base',
    tarea: 'Pipeteo y titulación con Hidróxido de Sodio concentrado y Ácido Clorhídrico',
    puestoTrabajo: 'Analista de Laboratorio de Control de Calidad',
    tipoPeligro: 'QUIMICO',
    peligro: 'Inhalación de vapores irritantes de HCl y contacto dérmico con base cáustica',
    riesgo: 'Inhalación de gases clorados y salpicadura dérmica',
    consecuencia: 'Irritación de vías respiratorias superiores, dermatitis química o conjuntivitis',
    controlesExistentes: 'Campana de extracción de gases certificada, pipeteadores automáticos, guantes de nitrilo',
    indicePersonas: 1,
    indiceProcedimientos: 1,
    indiceCapacitacion: 1,
    indiceExposicion: 2,
    indiceProbabilidad: 5,
    indiceSeveridad: 2,
    nivelRiesgoPuro: 'MEDIO',
    valorRiesgoPuro: 10,
    jerarquiaControl: 'ADMINISTRATIVO',
    medidaControlPropuesta: 'Calibración semestral de caudal de campana extractora y sustitución progresiva de reactivos por kits microanalíticos listos para uso.',
    probabilidadResidual: 3,
    severidadResidual: 1,
    nivelRiesgoResidual: 'BAJO',
    valorRiesgoResidual: 3,
    responsable: 'Jefa de Control de Calidad',
    fechaRevision: '2026-02-05',
    estadoSeguimiento: 'IMPLEMENTADO'
  }
];

export const INITIAL_LEGAL_REQUIREMENTS: LegalRequirement[] = [
  {
    id: 'leg-01',
    codigo: 'REQ-LEG-01',
    tipoNorma: 'LEY',
    numeroNorma: 'Ley N° 29783',
    tituloNorma: 'Ley de Seguridad y Salud en el Trabajo',
    organismoEmisor: 'CONGRESO',
    articuloObligacion: 'Art. 29, 30 y 31: Constitución y funcionamiento del Comité Paritario de SST',
    descripcionRequisito: 'El empleador con 20 o más trabajadores debe constituir un Comité de SST con igual número de representantes del empleador y de los trabajadores, con mandato vigente y reuniones mensuales.',
    aplicabilidadSector: 'Todo el personal en Sede Lurín y Planta Callao (148 trabajadores en planilla)',
    responsableEvaluacion: 'Gerencia General / Sup. SSOMA',
    cumplimiento: 'CONFORME',
    evidenciaCumplimiento: 'Acta de Instalación del Comité SST 2025-2027 y Actas de Reunión Mensual N° 01, 02 y 03 del 2026 registradas en el Libro de Actas legalizado.',
    fechaUltimaEvaluacion: '2026-03-01',
    fechaProximaReevaluacion: '2026-06-01',
    clausulaISO: '5.4'
  },
  {
    id: 'leg-02',
    codigo: 'REQ-LEG-02',
    tipoNorma: 'DECRETO_SUPREMO',
    numeroNorma: 'D.S. N° 005-2012-TR',
    tituloNorma: 'Reglamento de la Ley N° 29783',
    organismoEmisor: 'MTPE',
    articuloObligacion: 'Art. 33: Registros obligatorios del Sistema de Gestión de SST',
    descripcionRequisito: 'Mantener actualizados y a disposición de la inspección de trabajo los 8 registros obligatorios (Accidentes, Enfermedades, EMOs, Monitoreos, Inspecciones, Estadísticas, EPP y Capacitaciones).',
    aplicabilidadSector: 'Operaciones químicas, almacenes y oficinas administrativas',
    responsableEvaluacion: 'Ing. Alejandro Del Castillo (SSOMA)',
    cumplimiento: 'CONFORME',
    evidenciaCumplimiento: 'Formatos referenciales R.M. 050-2013-TR digitalizados en la plataforma SSOMA A&D con firmas electrónicas y copias de respaldo.',
    fechaUltimaEvaluacion: '2026-02-28',
    fechaProximaReevaluacion: '2026-05-30',
    clausulaISO: '7.5'
  },
  {
    id: 'leg-03',
    codigo: 'REQ-LEG-03',
    tipoNorma: 'DECRETO_SUPREMO',
    numeroNorma: 'D.S. N° 015-2005-SA',
    tituloNorma: 'Reglamento de Valores Límite Permisibles para Agentes Químicos en el Ambiente de Trabajo',
    organismoEmisor: 'MINSA',
    articuloObligacion: 'Art. 5, 6 y Anexo I: Monitoreo ocupacional y cumplimiento de TLV-TWA y TLV-STEL',
    descripcionRequisito: 'Efectuar mediciones ambientales de concentraciones de sustancias químicas y adoptar medidas técnicas cuando se alcance el 50% del valor límite permisible (Nivel de Acción).',
    aplicabilidadSector: 'Área de reactores, formulación, disolución y almacenamiento químico',
    responsableEvaluacion: 'Médico Ocupacional / Higienista Industrial',
    cumplimiento: 'EN_PROCESO',
    evidenciaCumplimiento: 'Monitoreo 2025 concluyó conforme para vapores de Tolueno (18 ppm vs TLV 20 ppm). Monitoreo 2026 programado para mayo con laboratorio acreditado.',
    fechaUltimaEvaluacion: '2026-01-15',
    fechaProximaReevaluacion: '2026-05-15',
    clausulaISO: '9.1.1'
  },
  {
    id: 'leg-04',
    codigo: 'REQ-LEG-04',
    tipoNorma: 'DECRETO_SUPREMO',
    numeroNorma: 'D.S. N° 042-F',
    tituloNorma: 'Reglamento de Seguridad Industrial',
    organismoEmisor: 'MTPE',
    articuloObligacion: 'Art. 128 a 135: Almacenamiento, ventilación y manipulación de sustancias inflamables y tóxicas',
    descripcionRequisito: 'Las sustancias inflamables deben almacenarse en recintos aislados, ventilados, con muros cortafuego, sistemas antiexplosivos y señalización conforme a NTP 399.010-1.',
    aplicabilidadSector: 'Naves de Almacén A y B (Lurín y Callao)',
    responsableEvaluacion: 'Jefe de Mantenimiento y SSOMA',
    cumplimiento: 'CONFORME',
    evidenciaCumplimiento: 'Certificado ITSE (Defensa Civil) vigente para ambas plantas. Certificación ATEX de luminarias en nave de inflamables.',
    fechaUltimaEvaluacion: '2026-02-10',
    fechaProximaReevaluacion: '2026-08-10',
    clausulaISO: '8.1.1'
  }
];

export const INITIAL_CHEMICALS: ChemicalSubstance[] = [
  {
    id: 'chem-01',
    codigoInterno: 'SQ-AC-001',
    nombreComercial: 'Ácido Sulfúrico 98% Técnico',
    nombreQuimico: 'Ácido Sulfúrico',
    numeroCAS: '7664-93-9',
    numeroONU: '1830',
    formulaQuimica: 'H2SO4',
    palabraAdvertencia: 'PELIGRO',
    pictogramasSGA: ['CORROSIVO', 'PELIGRO_SALUD'],
    clasePeligro: ['Corrosivo para metales Cat 1', 'Corrosión cutánea Cat 1A', 'Lesiones oculares graves Cat 1'],
    indicacionesPeligroH: [
      'H314: Provoca graves quemaduras en la piel y lesiones oculares.',
      'H290: Puede ser corrosivo para los metales.',
      'H350: Puede provocar cáncer por inhalación de nieblas ácidas inorgánicas fuertes.'
    ],
    consejosPrudenciaP: [
      'P260: No respirar el polvo/el humo/el gas/la niebla/los vapores.',
      'P280: Llevar guantes/ropa de protección/equipo de protección para los ojos/la cara.',
      'P301+P330+P331: EN CASO DE INGESTIÓN: Enjuagar la boca. NO provocar el vómito.',
      'P303+P361+P353: EN CASO DE CONTACTO CON LA PIEL: Quitar inmediatamente toda la ropa contaminada. Enjuagar la piel con agua durante 20 min.'
    ],
    ubicacionAlmacen: 'Patio de Tanques TK-101 y TK-102 (Zona Aislada Ácidos)',
    sede: 'SEDE_CENTRAL_LURIN',
    stockActual: 18500,
    unidadMedida: 'Kg',
    nivelStock: 'ADECUADO',
    compatibilidadGrupo: 'ACIDO_INORGANICO',
    incompatibleCon: ['Bases fuertes (NaOH, KOH)', 'Agua (reacción exotérmica violenta)', 'Metales en polvo', 'Sustancias orgánicas combustibles'],
    eppRequerido: [
      'Traje químico de protección estanco Tychem 2000 o equivalente',
      'Respirador de media cara con cartuchos para gases ácidos (ej. 3M 6002)',
      'Careta facial de policarbonato con visor antiempañante',
      'Guantes largos de caucho butílico o neopreno de caña larga',
      'Botas de seguridad de PVC con puntera de acero'
    ],
    medidasPrimerosAuxilios: 'Lavar inmediatamente con abundante agua corriente durante un mínimo de 15 a 20 minutos ininterrumpidos en ducha o lavaojos. No aplicar neutralizantes químicos directamente sobre la piel.',
    medidasDerrames: 'Evacuar el área. Contener con dique de arena o absorbente inerte sintético. Neutralizar paulatinamente con cal apagada o bicarbonato sódico. NO USAR AGUA DIRECTA al ácido puro.',
    medidasIncendio: 'En caso de incendio circundante usar polvo químico seco o dióxido de carbono (CO2). Evitar que el agua de extinción entre al contenedor.',
    sdsVersion: 'Rev. 05 - 2024',
    sdsFechaEmision: '2024-04-10',
    sdsFechaVencimiento: '2027-04-10',
    sdsEstado: 'VIGENTE'
  },
  {
    id: 'chem-02',
    codigoInterno: 'SQ-BS-002',
    nombreComercial: 'Hidróxido de Sodio 50% (Sosa Cáustica Líquida)',
    nombreQuimico: 'Hidróxido de Sodio en solución acuosa',
    numeroCAS: '1310-73-2',
    numeroONU: '1824',
    formulaQuimica: 'NaOH (aq)',
    palabraAdvertencia: 'PELIGRO',
    pictogramasSGA: ['CORROSIVO'],
    clasePeligro: ['Corrosivo para metales Cat 1', 'Corrosión cutánea Cat 1A'],
    indicacionesPeligroH: [
      'H314: Provoca graves quemaduras en la piel y lesiones oculares.',
      'H290: Puede ser corrosivo para los metales ligeros (aluminio, zinc).'
    ],
    consejosPrudenciaP: [
      'P280: Llevar guantes de protección/ropa de protección/equipo de protección para los ojos/la cara.',
      'P305+P351+P338: EN CASO DE CONTACTO CON LOS OJOS: Enjuagar con agua cuidadosamente durante varios minutos.'
    ],
    ubicacionAlmacen: 'Cubeto C-3 Nave de Bases',
    sede: 'SEDE_CENTRAL_LURIN',
    stockActual: 12000,
    unidadMedida: 'Kg',
    nivelStock: 'ADECUADO',
    compatibilidadGrupo: 'BASE_FUERTE',
    incompatibleCon: ['Ácidos fuertes (reacción exotérmica violenta)', 'Aluminio y Estaño (genera gas Hidrógeno explosivo)'],
    eppRequerido: [
      'Delantal de PVC o traje Tychem',
      'Guantes de nitrilo pesado o neopreno',
      'Gafas de seguridad tipo monogafa con sello hermético y careta facial',
      'Botas de jebe resistentes a álcalis'
    ],
    medidasPrimerosAuxilios: 'Lavar con agua continua durante 20 minutos. Acudir de inmediato al servicio médico.',
    medidasDerrames: 'Absorber con material inerte (vermiculita o arena seca). Neutralizar cuidadosamente con ácido débil (ácido acético diluido).',
    medidasIncendio: 'El producto no es combustible. Usar medios de extinción apropiados para el fuego circundante.',
    sdsVersion: 'Rev. 04 - 2023',
    sdsFechaEmision: '2023-09-15',
    sdsFechaVencimiento: '2026-09-15',
    sdsEstado: 'POR_VENCER'
  },
  {
    id: 'chem-03',
    codigoInterno: 'SQ-OX-003',
    nombreComercial: 'Hipoclorito de Sodio 10-12% (Cloro Industrial)',
    nombreQuimico: 'Hipoclorito de Sodio en solución',
    numeroCAS: '7681-52-9',
    numeroONU: '1791',
    formulaQuimica: 'NaClO',
    palabraAdvertencia: 'PELIGRO',
    pictogramasSGA: ['CORROSIVO', 'MEDIO_AMBIENTE'],
    clasePeligro: ['Corrosivo cutáneo Cat 1B', 'Toxicidad acuática aguda Cat 1'],
    indicacionesPeligroH: [
      'H314: Provoca graves quemaduras en la piel y lesiones oculares.',
      'H400: Muy tóxico para los organismos acuáticos.',
      'EUH031: En contacto con ácidos libera gases tóxicos (gas cloro libre).'
    ],
    consejosPrudenciaP: [
      'P273: Evitar su liberación al medio ambiente.',
      'P280: Llevar guantes/prendas/gafas/máscara de protección.'
    ],
    ubicacionAlmacen: 'Tanque Vertical TK-204 (Zona Ventilada)',
    sede: 'PLANTA_CALLAO',
    stockActual: 8400,
    unidadMedida: 'L',
    nivelStock: 'ADECUADO',
    compatibilidadGrupo: 'OXIDANTE',
    incompatibleCon: ['Ácidos (libera gas cloro altamente letal)', 'Amoniaco (forma cloraminas explosivas)', 'Materia orgánica oxidable'],
    eppRequerido: [
      'Respirador con cartucho para vapores de cloro (amarillo)',
      'Monogafas anti-salpicaduras',
      'Guantes de nitrilo reforzados',
      'Delantal impermeable'
    ],
    medidasPrimerosAuxilios: 'Trasladar al aire fresco inmediatamente. Si hay dificultad respiratoria administrar oxígeno previa prescripción.',
    medidasDerrames: 'Contener derrame. No permitir vertido a la red de alcantarillado. Neutralizar con solución de tiosulfato de sodio o bisulfito sódico.',
    medidasIncendio: 'Usar abundante agua en pulverización para enfriar contenedores expuestos.',
    sdsVersion: 'Rev. 06 - 2024',
    sdsFechaEmision: '2024-01-10',
    sdsFechaVencimiento: '2027-01-10',
    sdsEstado: 'VIGENTE'
  },
  {
    id: 'chem-04',
    codigoInterno: 'SQ-SOL-004',
    nombreComercial: 'Tolueno Grado Síntesis 99.8%',
    nombreQuimico: 'Metilbenceno',
    numeroCAS: '108-88-3',
    numeroONU: '1294',
    formulaQuimica: 'C7H8',
    palabraAdvertencia: 'PELIGRO',
    pictogramasSGA: ['FLAMABLE', 'PELIGRO_SALUD', 'NOCIVO_IRRITANTE'],
    clasePeligro: ['Líquido inflamable Cat 2', 'Tóxico para la reproducción Cat 2', 'STOT RE Cat 2', 'Peligro por aspiración Cat 1'],
    indicacionesPeligroH: [
      'H225: Líquido y vapores muy inflamables.',
      'H304: Puede ser mortal en caso de ingestión y penetración en las vías respiratorias.',
      'H361d: Se sospecha que daña al feto.',
      'H336: Puede provocar somnolencia o vértigo.'
    ],
    consejosPrudenciaP: [
      'P210: Mantener alejado del calor, de superficies calientes, de chispas, de llamas abiertas. No fumar.',
      'P243: Tomar medidas de precaución contra las descargas electrostáticas.',
      'P301+P310: EN CASO DE INGESTIÓN: Llamar inmediatamente a un centro de toxicología o a un médico.'
    ],
    ubicacionAlmacen: 'Búnker de Inflamables (Depósito Atex con Extinción Automática CO2)',
    sede: 'PLANTA_CALLAO',
    stockActual: 4500,
    unidadMedida: 'L',
    nivelStock: 'STOCK_MINIMO',
    compatibilidadGrupo: 'SOLVENTE_INFLAMABLE',
    incompatibleCon: ['Agentes oxidantes fuertes (ácido nítrico, peróxidos)', 'Halógenos', 'Ácidos fuertes'],
    eppRequerido: [
      'Respirador de media cara con filtros para vapores orgánicos (etiqueta negra/marrón 3M 6001)',
      'Gafas panorámicas de seguridad con sello facial',
      'Guantes de alcohol polivinílico (PVA) o Vitón (el nitrilo estándar se degrada)',
      'Calzado conductivo antiestático sin herrajes ferrosos',
      'Ropa de trabajo 100% algodón antiestático'
    ],
    medidasPrimerosAuxilios: 'Si es ingerido NO PROVOCAR EL VÓMITO por riesgo de aspiración pulmonar. Trasladar al hospital urgentemente.',
    medidasDerrames: 'Eliminar todas las fuentes de ignición. Usar herramientas antichispa (bronce/berilio). Cubrir con espuma antialcohol o tierra de diatomeas.',
    medidasIncendio: 'Espuma para alcoholes, polvo químico seco, agua nebulizada.',
    sdsVersion: 'Rev. 03 - 2022',
    sdsFechaEmision: '2022-12-01',
    sdsFechaVencimiento: '2025-12-01',
    sdsEstado: 'VENCIDA'
  }
];

export const INITIAL_INSPECTIONS: OperationalInspection[] = [
  {
    id: 'insp-001',
    codigo: 'INSP-2026-024',
    fecha: '2026-03-02',
    sede: 'SEDE_CENTRAL_LURIN',
    area: 'Nave de Reactores Químicos R-101 y R-102',
    inspector: 'Ing. Alejandro Del Castillo',
    cargoInspector: 'Supervisor SSOMA',
    tipo: 'AREAS_QUIMICAS',
    items: [
      { id: 'it-1', criterio: 'Diques de contención sin fisuras y válvulas de drenaje cerradas con candado LOTO', resultado: 'CONFORME', criticidad: 'ALTA' },
      { id: 'it-2', criterio: 'Sensores de vapores y alarmas sonoras operativas con calibración al día', resultado: 'CONFORME', criticidad: 'ALTA' },
      { id: 'it-3', criterio: 'Kit antiderrame completo (cordones absorbentes, absorbente granulado, bolsas amarillas y palas antiestáticas)', resultado: 'CONFORME', criticidad: 'MEDIA' },
      { id: 'it-4', criterio: 'Hojas SDS visibles y actualizadas en el punto de trabajo en porta-fichas acrílico', resultado: 'NO_CONFORME', observacion: 'Falta actualizar la ficha SDS de Tolueno a su última versión.', criticidad: 'MEDIA' },
      { id: 'it-5', criterio: 'Uso obligatorio y correcto del EPP químico específico por parte de los operadores', resultado: 'CONFORME', criticidad: 'ALTA' }
    ],
    porcentajeConformidad: 80,
    hallazgosCriticos: 1,
    observacionesGenerales: 'Operación en buen orden general. Se detecta falta de actualización de la carpeta física de SDS en la estación de descarga.',
    responsableSubsanacion: 'Téc. Marco Benítez (Encargado de Almacén)',
    fechaCompromiso: '2026-03-08',
    firmado: true,
    estado: 'CON_ACCIONES_ABIERTAS'
  },
  {
    id: 'insp-002',
    codigo: 'INSP-2026-025',
    fecha: '2026-03-03',
    sede: 'SEDE_CENTRAL_LURIN',
    area: 'Circuito de Duchas y Lavaojos de Emergencia (12 estaciones)',
    inspector: 'Téc. Marco Benítez',
    cargoInspector: 'Inspector de Seguridad de Planta',
    tipo: 'LAVAOJOS_DUCHAS',
    items: [
      { id: 'it-21', criterio: 'Presión de flujo de agua entre 30 y 80 psi conforme a norma ANSI Z358.1', resultado: 'CONFORME', criticidad: 'ALTA' },
      { id: 'it-22', criterio: 'Activación en una sola maniobra y mantenimiento de flujo continuo sin sostener palanca', resultado: 'CONFORME', criticidad: 'ALTA' },
      { id: 'it-23', criterio: 'Tapas antipolvo de los difusores lavaojos presentes y operativas', resultado: 'CONFORME', criticidad: 'MEDIA' },
      { id: 'it-24', criterio: 'Área perimetral libre de obstáculos en un radio de 1 metro y demarcada en franjas amarillas y negras', resultado: 'CONFORME', criticidad: 'ALTA' },
      { id: 'it-25', criterio: 'Bitácora de prueba semanal firmada por el operador de turno', resultado: 'CONFORME', criticidad: 'BAJA' }
    ],
    porcentajeConformidad: 100,
    hallazgosCriticos: 0,
    observacionesGenerales: 'Todas las 12 estaciones probadas con manómetro y caudalímetro portátil. Excelente respuesta hidráulica.',
    responsableSubsanacion: 'N/A',
    fechaCompromiso: '2026-03-31',
    firmado: true,
    estado: 'CONCLUIDA'
  }
];

export const INITIAL_EPP_ITEMS: EPPItem[] = [
  {
    id: 'epp-01',
    codigo: 'EPP-RES-01',
    nombre: 'Respirador de Rostro Completo (Full Face) Serie 6800 con Doble Filtro Químico',
    categoria: 'PROTECCION_RESPIRATORIA',
    especificacionTecnica: 'Visor de policarbonato resistente a impactos y salpicaduras. Compatible con cartuchos 6003 y 6006.',
    normaCertificacion: 'NIOSH 42 CFR 84 / ANSI Z87.1+',
    sustanciasAplicables: ['Ácido Sulfúrico', 'Ácido Clorhídrico', 'Cloro Gas', 'Tolueno'],
    stockAlmacen: 28,
    unidadMedida: 'Unidades',
    vidaUtilMeses: 24,
    aptoSectorQuimico: true
  },
  {
    id: 'epp-02',
    codigo: 'EPP-MAN-02',
    nombre: 'Guantes de Caucho Butílico 0.5mm Caña Larga (35cm)',
    categoria: 'PROTECCION_MANOS',
    especificacionTecnica: 'Resistencia química extrema contra ácidos inorgánicos concentrados, bases y cetonas.',
    normaCertificacion: 'EN 388 (2010X) / EN ISO 374-1 Tipo A (BKLMPST)',
    sustanciasAplicables: ['Ácido Sulfúrico 98%', 'Hidróxido de Sodio 50%', 'Hipoclorito de Sodio'],
    stockAlmacen: 64,
    unidadMedida: 'Pares',
    vidaUtilMeses: 6,
    aptoSectorQuimico: true
  },
  {
    id: 'epp-03',
    codigo: 'EPP-CUE-03',
    nombre: 'Traje de Protección Química con Capucha Tychem 2000 C con Costuras Selladas',
    categoria: 'PROTECCION_CUERPO',
    especificacionTecnica: 'Barrera certificada contra más de 180 sustancias químicas peligrosas y bioaerosoles. Nivel C.',
    normaCertificacion: 'EN 14605 Tipo 3-B y 4-B',
    sustanciasAplicables: ['Todos los ácidos y bases concentrados'],
    stockAlmacen: 45,
    unidadMedida: 'Unidades',
    vidaUtilMeses: 12,
    aptoSectorQuimico: true
  },
  {
    id: 'epp-04',
    codigo: 'EPP-PIE-04',
    nombre: 'Bota de Seguridad Química de PVC con Puntera y Plantilla de Acero Dieléctrica',
    categoria: 'PROTECCION_PIES',
    especificacionTecnica: 'Suela antideslizante con compuesto resistente a hidrocarburos y corrosivos.',
    normaCertificacion: 'ASTM F2413-18 / NTP ISO 20345:2017 S5 SRC',
    sustanciasAplicables: ['Sustancias químicas líquidas en patio y naves'],
    stockAlmacen: 32,
    unidadMedida: 'Pares',
    vidaUtilMeses: 12,
    aptoSectorQuimico: true
  }
];

export const INITIAL_EPP_DELIVERIES: EPPDeliveryRecord[] = [
  {
    id: 'deliv-01',
    fechaEntrega: '2026-01-15',
    dniTrabajador: '45892104',
    nombreTrabajador: 'Carlos Huamán Quispe',
    puestoTrabajo: 'Operador de Reactores Químicos',
    eppId: 'epp-02',
    eppNombre: 'Guantes de Caucho Butílico 0.5mm Caña Larga',
    cantidad: 2,
    motivo: 'DOTACION_INICIAL',
    proximaRenovacion: '2026-07-15',
    conformidadFirmada: true,
    estado: 'VIGENTE'
  },
  {
    id: 'deliv-02',
    fechaEntrega: '2025-10-10',
    dniTrabajador: '70214896',
    nombreTrabajador: 'Jorge Mendoza Salazar',
    puestoTrabajo: 'Operador de Envasado de Químicos',
    eppId: 'epp-01',
    eppNombre: 'Respirador Full Face Serie 6800',
    cantidad: 1,
    motivo: 'RENOVACION_PERIODICA',
    proximaRenovacion: '2026-04-10',
    conformidadFirmada: true,
    estado: 'PROXIMO_A_VENCER'
  }
];

export const INITIAL_TRAININGS: TrainingCourse[] = [
  {
    id: 'cur-01',
    codigo: 'CAP-2026-01',
    tema: 'Manejo Seguro de Sustancias Químicas Peligrosas y Clasificación SGA/GHS',
    tipo: 'ESPECIFICA_QUIMICA',
    esObligatoria4Minimas: true,
    duracionHoras: 4,
    instructor: 'Ing. Químico Claudia Valdivia (CIP 204112)',
    institucion: 'Asociación Peruana de Higiene Industrial',
    fechaProgramada: '2026-03-10',
    fechaEjecutada: '2026-03-10',
    participantesProgramados: 45,
    participantesAsistieron: 43,
    notaPromedio: 16.8,
    porcentajeAprobados: 97.6,
    estado: 'EJECUTADA',
    evidenciaListaUrl: '/evidencias/asistencia-cap-01.pdf'
  },
  {
    id: 'cur-02',
    codigo: 'CAP-2026-02',
    tema: 'Actuación Inmediata ante Derrames Químicos y Manejo de Kits Spill',
    tipo: 'RESPUESTA_EMERGENCIAS',
    esObligatoria4Minimas: true,
    duracionHoras: 4,
    instructor: 'Cap. CBP Juan Mendoza (Brigada HAZMAT)',
    institucion: 'Cuerpo General de Bomberos Voluntarios del Perú',
    fechaProgramada: '2026-04-18',
    participantesProgramados: 40,
    participantesAsistieron: 0,
    estado: 'PROGRAMADA'
  },
  {
    id: 'cur-03',
    codigo: 'CAP-2026-03',
    tema: 'Identificación de Peligros, Evaluación de Riesgos y Medidas de Control (IPERC)',
    tipo: 'NORMATIVA_LEY_29783',
    esObligatoria4Minimas: true,
    duracionHoras: 4,
    instructor: 'Ing. Alejandro Del Castillo (SSOMA)',
    institucion: 'SSOMA Interno A&D',
    fechaProgramada: '2026-01-25',
    fechaEjecutada: '2026-01-25',
    participantesProgramados: 50,
    participantesAsistieron: 49,
    notaPromedio: 17.2,
    porcentajeAprobados: 100,
    estado: 'EJECUTADA',
    evidenciaListaUrl: '/evidencias/asistencia-cap-03.pdf'
  },
  {
    id: 'cur-04',
    codigo: 'CAP-2026-04',
    tema: 'Ergonomía en la Manipulación Manual de Cargas y Cilindros Químicos (R.M. 375-2008-TR)',
    tipo: 'SALUD_OCUPACIONAL',
    esObligatoria4Minimas: true,
    duracionHoras: 3,
    instructor: 'Lic. Fisioterapia y Ergonomía Renzo Paredes',
    institucion: 'ErgoSafety Perú',
    fechaProgramada: '2026-05-20',
    participantesProgramados: 35,
    participantesAsistieron: 0,
    estado: 'PROGRAMADA'
  }
];

export const INITIAL_INCIDENTS: SafetyIncident[] = [
  {
    id: 'inc-01',
    codigo: 'INC-2026-003',
    tipo: 'INCIDENTE_PELIGROSO',
    fechaHora: '2026-02-18 10:45',
    sede: 'SEDE_CENTRAL_LURIN',
    areaExacta: 'Zona de Trasvase de Ácidos - Reactor R-101',
    trabajadorAfectado: 'Operador Carlos Huamán',
    puestoTrabajo: 'Operador de Reactores',
    diasPerdidos: 0,
    sustanciaInvolucrada: 'Ácido Sulfúrico 98%',
    descripcionHechos: 'Durante el acople de la manguera flexible de trasvase se detectó un micro-goteo de ácido sulfúrico (aprox. 50 ml) sobre la bandeja colectora secundaria. El operador portaba traje Tychem y careta completa, por lo que no hubo contacto con la piel. Se detuvo la bomba en 4 segundos mediante la parada de emergencia.',
    causasInmediatasActos: ['No verificar el estado del empaque toroidal de teflón antes de iniciar el bombeo'],
    causasInmediatasCondiciones: ['Desgaste prematuro del empaque por temperatura de operación previa'],
    causasBasicasFactoresPersonales: ['Exceso de confianza en la estanqueidad de la línea'],
    causasBasicasFactoresTrabajo: ['Falta de frecuencia de recambio preventivo programado para sellos de teflón en líneas de ácido concentrado'],
    analisis5Porques: [
      '¿Por qué hubo goteo? -> Porque el sello de teflón perdió elasticidad.',
      '¿Por qué perdió elasticidad? -> Porque operó durante 4 meses continuos con ácido a 40°C.',
      '¿Por qué operó 4 meses sin cambio? -> Porque el plan de mantenimiento preveía cambio semestral.',
      '¿Por qué el plan decía semestral? -> Porque no se consideró la frecuencia de uso intensivo.',
      '¿Causa raíz? -> Falta de criterio de mantenimiento predictivo y preventivo ajustado al ciclo térmico de la línea.'
    ],
    medidasCorrectivasInmediatas: 'Sustitución inmediata del empaque por uno de PTFE virgen encapsulado. Se activó kit spill para neutralizar los 50 ml en bandeja.',
    investigadorLider: 'Ing. Alejandro Del Castillo',
    miembroComiteSST: 'Sr. Víctor Rivas (Rep. Trabajadores)',
    estadoInvestigacion: 'CERRADA_CON_PLAN',
    notificadoMTPE: true
  }
];

export const INITIAL_MEDICAL_EXAMS: OccupationalMedicalExam[] = [
  {
    id: 'emo-001',
    codigoTrabajador: 'TRAB-042',
    nombreTrabajador: 'Carlos Huamán Quispe',
    dni: '45892104',
    puestoTrabajo: 'Operador de Reactores Químicos',
    area: 'Producción Química',
    tipoEMO: 'PERIODICO',
    fechaExamen: '2025-11-12',
    fechaVencimiento: '2026-11-12',
    aptitud: 'APTO_CON_RESTRICCIONES',
    restriccionesLaborales: [
      'Uso estricto y continuo de protección auditiva de doble atenuación (tapón + orejera) en sala de compresores',
      'No levantar peso mayor a 25 kg de manera manual sin ayuda mecánica'
    ],
    medidasRecomendadasSSOMA: [
      'Capacitación en higiene postural y técnica de levantamiento seguro',
      'Rotación en áreas de nivel de ruido < 80 dBA cada 2 horas'
    ],
    clinicaOcupacional: 'Centro Médico Ocupacional San Gabriel (Autorizado DIGESA)',
    medicoOcupacionalCMP: 'Dr. Roberto Montoya - CMP 34112 / RNE 18450',
    estadoSeguimiento: 'CUMPLIDO'
  },
  {
    id: 'emo-002',
    codigoTrabajador: 'TRAB-058',
    nombreTrabajador: 'Rosa Elvira Méndez',
    dni: '42881903',
    puestoTrabajo: 'Analista de Control de Calidad',
    area: 'Laboratorio Químico',
    tipoEMO: 'PERIODICO',
    fechaExamen: '2025-08-20',
    fechaVencimiento: '2026-08-20',
    aptitud: 'APTO',
    restriccionesLaborales: [],
    medidasRecomendadasSSOMA: [
      'Pausas activas visuales cada 50 minutos de trabajo frente a refractómetro y pantallas'
    ],
    clinicaOcupacional: 'Clínica Ocupacional del Sol',
    medicoOcupacionalCMP: 'Dra. Patricia Alva - CMP 41209 / RNE 19201',
    estadoSeguimiento: 'CUMPLIDO'
  }
];

export const INITIAL_CORRECTIVE_ACTIONS: CorrectiveAction[] = [
  {
    id: 'capa-001',
    codigo: 'CAPA-2026-004',
    origen: 'ACCIDENTE_INCIDENTE',
    referenciaOrigenId: 'INC-2026-003',
    hallazgoProblema: 'Fuga de 50 ml de H2SO4 por fatiga de junta en acople de manguera de llenado de reactor R-101.',
    clausulaISO: '10.2',
    causaRaizIdentificada: 'Plan de mantenimiento preventivo con frecuencia semestral inadecuada para el esfuerzo térmico y químico del empaque de PTFE.',
    accionCorrectivaPropuesta: 'Reducir la frecuencia de recambio preventivo de sellos de transferencia química a 60 días naturales e incorporar lista de verificación pre-uso obligatoria.',
    responsableImplementacion: 'Ing. Mantenimiento Mecánico y Sup. SSOMA',
    fechaCompromiso: '2026-03-15',
    estado: 'EN_PROCESO',
    esCritica: true,
    sede: 'SEDE_CENTRAL_LURIN'
  },
  {
    id: 'capa-002',
    codigo: 'CAPA-2026-005',
    origen: 'INSPECCION',
    referenciaOrigenId: 'INSP-2026-024',
    hallazgoProblema: 'Hoja de Datos de Seguridad (SDS) de Tolueno desactualizada en punto de descarga de nave de solventes.',
    clausulaISO: '7.5',
    causaRaizIdentificada: 'Falta de auditoría periódica de las carpetas de seguridad en campo tras la actualización digital en servidor.',
    accionCorrectivaPropuesta: 'Implementar código QR plastificado en cada estación química con enlace directo a la versión vigente en el repositorio cloud y reemplazar formato impreso.',
    responsableImplementacion: 'Téc. Marco Benítez',
    fechaCompromiso: '2026-03-08',
    estado: 'ABIERTA',
    esCritica: false,
    sede: 'SEDE_CENTRAL_LURIN'
  },
  {
    id: 'capa-003',
    codigo: 'CAPA-2026-006',
    origen: 'EVALUACION_LEGAL',
    referenciaOrigenId: 'REQ-LEG-03',
    hallazgoProblema: 'Vencimiento próximo del informe de monitoreo ocupacional de agentes químicos conforme al D.S. 015-2005-SA.',
    clausulaISO: '9.1.2',
    causaRaizIdentificada: 'Ciclo anual de licitación de laboratorio acreditado.',
    accionCorrectivaPropuesta: 'Ejecutar orden de servicio con laboratorio acreditado por INACAL para toma de muestras en mayo 2026.',
    responsableImplementacion: 'Ing. Alejandro Del Castillo',
    fechaCompromiso: '2026-04-30',
    estado: 'EN_PROCESO',
    esCritica: false,
    sede: 'TODAS'
  }
];

export const INITIAL_DOCUMENTS: DocumentRecord[] = [
  {
    id: 'doc-01',
    codigo: 'POL-SSOMA-001',
    titulo: 'Política del Sistema Integrado de Gestión de Seguridad, Salud en el Trabajo y Medio Ambiente',
    categoria: 'POLITICA',
    version: '04',
    fechaAprobacion: '2026-01-05',
    fechaRevision: '2026-01-05',
    responsableElaboracion: 'Ing. Alejandro Del Castillo (SSOMA)',
    responsableAprobacion: 'Dr. Fernando Arévalo (Gerente General)',
    estado: 'VIGENTE',
    clausulaISO: '5.2',
    archivoUbicacion: '/documentos/POL-SSOMA-001_Rev04.pdf',
    historialCambios: [
      { version: '01', fecha: '2020-02-10', motivo: 'Emisión inicial bajo OHSAS 18001', autor: 'SSOMA' },
      { version: '02', fecha: '2022-01-15', motivo: 'Migración a ISO 45001:2018', autor: 'SSOMA' },
      { version: '03', fecha: '2024-01-10', motivo: 'Inclusión de compromisos de sostenibilidad y SGA', autor: 'SSOMA' },
      { version: '04', fecha: '2026-01-05', motivo: 'Actualización y ratificación por la Alta Dirección', autor: 'SSOMA' }
    ]
  },
  {
    id: 'doc-02',
    codigo: 'RISST-AYD-2026',
    titulo: 'Reglamento Interno de Seguridad y Salud en el Trabajo (RISST)',
    categoria: 'REGLAMENTO_RISST',
    version: '06',
    fechaAprobacion: '2026-01-12',
    fechaRevision: '2026-01-12',
    responsableElaboracion: 'Comité de SST / Dpto. SSOMA',
    responsableAprobacion: 'Comité Paritario de SST',
    estado: 'VIGENTE',
    clausulaISO: '5.3',
    archivoUbicacion: '/documentos/RISST_AYD_2026_Aprobado.pdf',
    historialCambios: [
      { version: '05', fecha: '2024-01-20', motivo: 'Adecuación a protocolos COVID post-pandemia', autor: 'Comité SST' },
      { version: '06', fecha: '2026-01-12', motivo: 'Inclusión de protocolos para nuevas naves de envasado químico', autor: 'Comité SST' }
    ]
  },
  {
    id: 'doc-03',
    codigo: 'PETS-PRD-004',
    titulo: 'Procedimiento Escrito de Trabajo Seguro: Carga y Descarga de Ácidos Concentrados en Reactores',
    categoria: 'PROCEDIMIENTO_PETS',
    version: '03',
    fechaAprobacion: '2025-10-14',
    fechaRevision: '2025-10-14',
    responsableElaboracion: 'Jefe de Producción / SSOMA',
    responsableAprobacion: 'Gerente de Operaciones',
    estado: 'VIGENTE',
    clausulaISO: '8.1.1',
    archivoUbicacion: '/documentos/PETS-PRD-004_Acidos.pdf',
    historialCambios: [
      { version: '03', fecha: '2025-10-14', motivo: 'Inclusión de acoples secos y bloqueo de seguridad', autor: 'Jefe Producción' }
    ]
  },
  {
    id: 'doc-04',
    codigo: 'PL-EMERG-2026',
    titulo: 'Plan de Respuesta ante Emergencias y Contingencias Químicas',
    categoria: 'PLAN_PROGRAMA',
    version: '05',
    fechaAprobacion: '2026-01-10',
    fechaRevision: '2026-01-10',
    responsableElaboracion: 'Brigada de Emergencia / SSOMA',
    responsableAprobacion: 'Gerencia General / CGBVP',
    estado: 'VIGENTE',
    clausulaISO: '8.2',
    archivoUbicacion: '/documentos/PL-EMERG-2026_Rev05.pdf',
    historialCambios: [
      { version: '05', fecha: '2026-01-10', motivo: 'Actualización de directorio telefónico de emergencia y simulacros', autor: 'SSOMA' }
    ]
  }
];

export const INITIAL_AUDITS: AuditRecord[] = [
  {
    id: 'aud-01',
    codigo: 'AUD-INT-2025-02',
    tipo: 'INTERNA',
    alcance: 'Procesos de Formulación de Mezclas Químicas, Mantenimiento y Almacén en Sede Lurín',
    criteriosNormativos: ['ISO 45001:2018', 'Ley 29783', 'D.S. 005-2012-TR'],
    fechaInicio: '2025-11-20',
    fechaFin: '2025-11-22',
    auditorLider: 'Ing. Patricia Barba (Auditor Líder IRCA)',
    equipoAuditor: ['Ing. Alejandro Del Castillo', 'Téc. Marco Benítez'],
    estado: 'CERRADA',
    hallazgosConteo: {
      noConformidadMayor: 0,
      noConformidadMenor: 2,
      oportunidadMejora: 5,
      conformidades: 38
    }
  },
  {
    id: 'aud-02',
    codigo: 'AUD-INT-2026-01',
    tipo: 'INTERNA',
    alcance: 'Todos los procesos del Sistema SSOMA en Sede Central Lurín y Planta Callao',
    criteriosNormativos: ['ISO 45001:2018', 'Ley 29783'],
    fechaInicio: '2026-06-15',
    fechaFin: '2026-06-18',
    auditorLider: 'Ing. Patricia Barba (Auditor Líder IRCA)',
    equipoAuditor: ['Ing. Alejandro Del Castillo', 'Ing. Gabriel Solís'],
    estado: 'PLANIFICADA',
    hallazgosConteo: {
      noConformidadMayor: 0,
      noConformidadMenor: 0,
      oportunidadMejora: 0,
      conformidades: 0
    }
  }
];

export const INITIAL_ERGONOMICS: ErgonomicAssessment[] = [
  {
    id: 'ergo-01',
    puestoTrabajo: 'Operador de Reactores Químicos',
    area: 'Planta de Formulación - Lurín',
    tareaEvaluada: 'Levantamiento y vertido de sacos de reactivos químicos de 25 kg en tolva R-101',
    metodo: 'REBA',
    puntuacionObtenida: 8,
    nivelRiesgo: 'ALTO',
    factoresRiesgo: [
      'Flexión de tronco > 45° al levantar sacos a nivel del suelo',
      'Torsión de cuello y columna en el vertido hacia tolva',
      'Frecuencia de 12 levantamientos por hora'
    ],
    medidasIngenieriaErgonomica: [
      'Instalación de mesa elevadora neumática de tijera para mantener la carga a la altura de la cintura',
      'Implementación de polipasto con ventosa de vacío para manipulación mecánica de sacos',
      'Rotación de puestos cada 90 minutos conforme a R.M. 375-2008-TR'
    ],
    fechaEvaluacion: '2026-02-15',
    evaluador: 'Lic. Renzo Paredes - Especialista en Ergonomía Ocupacional'
  },
  {
    id: 'ergo-02',
    puestoTrabajo: 'Analista de Control de Calidad',
    area: 'Laboratorio Químico',
    tareaEvaluada: 'Pipeteo manual repetitivo y titulación química en campana extractora',
    metodo: 'RULA',
    puntuacionObtenida: 5,
    nivelRiesgo: 'MEDIO',
    factoresRiesgo: [
      'Postura estática de muñeca y pinza digital mantenida > 4 horas al día',
      'Elevación de hombros por altura de la mesa de titulación'
    ],
    medidasIngenieriaErgonomica: [
      'Adquisición de micropipetas electrónicas multicanal ergonómicas',
      'Ajuste de sillas de laboratorio con reposabrazos 3D y reposapiés regulables'
    ],
    fechaEvaluacion: '2026-01-28',
    evaluador: 'Lic. Renzo Paredes'
  }
];

export const INITIAL_AUDIT_CHECKLIST: AuditChecklistQuestion[] = [
  {
    id: 'iso-chk-01',
    clausula: '4.1',
    requisitoISO: 'Comprensión de la organización y de su contexto',
    preguntaAuditoria: '¿Se han determinado las cuestiones externas e internas (químicas, legales, operativas) que afectan la capacidad de lograr los resultados previstos del SGSST?',
    hallazgoResultado: 'CONFORME',
    evidenciaObjetiva: 'Matriz FODA SSOMA 2026 y análisis PESTEL documentados en el expediente POL-SSOMA-001.'
  },
  {
    id: 'iso-chk-02',
    clausula: '5.2',
    requisitoISO: 'Política de la Seguridad y Salud en el Trabajo',
    preguntaAuditoria: '¿La política incluye el compromiso para proporcionar condiciones de trabajo seguras, prevenir lesiones y eliminar peligros en instalaciones químicas?',
    hallazgoResultado: 'CONFORME',
    evidenciaObjetiva: 'Política Rev. 04 firmada por el Gerente General y difundida en paneles de Planta Lurín y Callao.'
  },
  {
    id: 'iso-chk-03',
    clausula: '6.1.2',
    requisitoISO: 'Identificación de peligros y evaluación de riesgos (IPERC)',
    preguntaAuditoria: '¿El proceso de identificación de peligros evalúa los agentes químicos corrosivos, inflamables y tóxicos en actividades rutinarias y no rutinarias?',
    hallazgoResultado: 'CONFORME',
    evidenciaObjetiva: 'Matriz IPERC-PRD-01 con jerarquía de controles de acoples rápidos y trajes Tychem para H2SO4.'
  },
  {
    id: 'iso-chk-04',
    clausula: '7.5.3',
    requisitoISO: 'Control de la información documentada',
    preguntaAuditoria: '¿Las Hojas de Datos de Seguridad (SDS) en puntos de almacenamiento se encuentran vigentes y legibles?',
    hallazgoResultado: 'NO_CONFORMIDAD_MENOR',
    evidenciaObjetiva: 'Se detectó ficha SDS de Tolueno desactualizada en punto de descarga de Planta Callao (generó CAPA-2026-005).'
  },
  {
    id: 'iso-chk-05',
    clausula: '8.2',
    requisitoISO: 'Preparación y respuesta ante emergencias',
    preguntaAuditoria: '¿Se realizan pruebas periódicas de duchas de seguridad, lavaojos y sistemas de extinción de incendios?',
    hallazgoResultado: 'CONFORME',
    evidenciaObjetiva: 'Registros INSP-2026-018 e INSP-2026-025 con 100% de operatividad en circuito hidráulico.'
  },
  {
    id: 'iso-chk-06',
    clausula: '10.2',
    requisitoISO: 'Incidentes, no conformidades y acciones correctivas',
    preguntaAuditoria: '¿Se investigan los incidentes peligrosos determinando causas raíz mediante el modelo de causalidad y análisis 5 Porqués?',
    hallazgoResultado: 'CONFORME',
    evidenciaObjetiva: 'Informe de investigación INC-2026-003 cerrado con plan de mantenimiento predictivo de juntas PTFE.'
  }
];

