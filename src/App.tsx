/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GESTIÓN SSOMA A&D - Sistema Integral de Seguridad, Salud Ocupacional y Medio Ambiente
 * Sector Químico · Conforme a Ley 29783 & ISO 45001:2018
 */

import React, { useState } from 'react';
import { SSOMAProvider, useSSOMA } from './context/SSOMAContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';

// Módulos
import { DashboardModule } from './modules/01_Dashboard/DashboardModule';
import { PlanificacionModule } from './modules/02_Planificacion/PlanificacionModule';
import { IPERCModule } from './modules/03_IPERC/IPERCModule';
import { RequisitosLegalesModule } from './modules/04_RequisitosLegales/RequisitosLegalesModule';
import { SeguridadOperacionalModule } from './modules/05_SeguridadOperacional/SeguridadOperacionalModule';
import { SustanciasQuimicasModule } from './modules/06_SustanciasQuimicas/SustanciasQuimicasModule';
import { SaludOcupacionalModule } from './modules/07_SaludOcupacional/SaludOcupacionalModule';
import { GestionEPPModule } from './modules/08_GestionEPP/GestionEPPModule';
import { CapacitacionesModule } from './modules/09_Capacitaciones/CapacitacionesModule';
import { AccidentesIncidentesModule } from './modules/10_AccidentesIncidentes/AccidentesIncidentesModule';
import { GestionDocumentalModule } from './modules/11_GestionDocumental/GestionDocumentalModule';
import { AuditoriasModule } from './modules/12_Auditorias/AuditoriasModule';
import { AccionesCorrectivasModule } from './modules/13_AccionesCorrectivas/AccionesCorrectivasModule';
import { ReportesIndicadoresModule } from './modules/14_ReportesIndicadores/ReportesIndicadoresModule';
import { ConfiguracionModule } from './modules/15_Configuracion/ConfiguracionModule';

function SSOMAAppContent() {
  const { activeModule } = useSSOMA();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderModule = () => {
    switch (activeModule) {
      case '01_dashboard':
        return <DashboardModule />;
      case '02_planificacion':
        return <PlanificacionModule />;
      case '03_iperc':
        return <IPERCModule />;
      case '04_legales':
        return <RequisitosLegalesModule />;
      case '05_operacional':
        return <SeguridadOperacionalModule />;
      case '06_quimicas':
        return <SustanciasQuimicasModule />;
      case '07_salud':
        return <SaludOcupacionalModule />;
      case '08_epp':
        return <GestionEPPModule />;
      case '09_capacitaciones':
        return <CapacitacionesModule />;
      case '10_incidentes':
        return <AccidentesIncidentesModule />;
      case '11_documental':
        return <GestionDocumentalModule />;
      case '12_auditorias':
        return <AuditoriasModule />;
      case '13_correctivas':
        return <AccionesCorrectivasModule />;
      case '14_reportes':
        return <ReportesIndicadoresModule />;
      case '15_configuracion':
        return <ConfiguracionModule />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#081325] text-slate-100 overflow-hidden selection:bg-orange-600 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#0a192f]">
        <Header onToggleSidebarMobile={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-12">
          <div className="max-w-7xl mx-auto">
            {renderModule()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SSOMAProvider>
      <SSOMAAppContent />
    </SSOMAProvider>
  );
}
