/* PDF exports for the executive dashboard. */

function obtenerJsPdf(){
    if(!window.jspdf || !window.jspdf.jsPDF){
        throw new Error("La libreria jsPDF no esta disponible.");
    }
    return window.jspdf.jsPDF;
}

function agregarTextoSeguro(pdf, texto, x, y, ancho = 180){
    const lineas = pdf.splitTextToSize(String(texto), ancho);
    pdf.text(lineas, x, y);
    return lineas.length * 6;
}

function agregarPortada(pdf){
    pdf.setFillColor(36, 59, 99);
    pdf.rect(0, 0, 210, 297, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.text("INFORME DE SEGUIMIENTO", 20, 50);
    pdf.setFontSize(18);
    pdf.text("Programa DAP El Salvador", 20, 70);
    pdf.setFontSize(12);
    pdf.text("Req. 124-2026 | Lote 2", 20, 90);
    pdf.text(datosProyecto.proyecto.cliente, 20, 100);
    pdf.text(new Date().toLocaleDateString("es-ES"), 20, 115);
}

async function generarInformeEjecutivo(){
    const JsPDF = obtenerJsPdf();
    const pdf = new JsPDF();
    agregarPortada(pdf);
    pdf.addPage();
    let y = 20;

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(16);
    pdf.text("Resumen Ejecutivo", 10, y);
    y += 15;
    pdf.setFontSize(11);
    pdf.text(`Avance General: ${calcularAvanceGeneral()}%`, 10, y);
    y += 8;
    pdf.text(`Entregables Completados: ${contarEntregablesTerminados()} de ${datosProyecto.kpis.entregablesTotales}`, 10, y);
    y += 8;
    pdf.text(`Riesgos Altos: ${datosProyecto.kpis.riesgosAltos}`, 10, y);
    y += 15;

    pdf.setFontSize(14);
    pdf.text("Avance por Fases", 10, y);
    y += 10;
    pdf.setFontSize(11);
    datosProyecto.fases.forEach(fase => {
        pdf.text(`${fase.nombre}: ${fase.avance}%`, 15, y);
        y += 8;
    });

    y += 5;
    pdf.setFontSize(14);
    pdf.text("Entregables", 10, y);
    y += 10;
    pdf.setFontSize(11);
    datosProyecto.entregables.forEach(item => {
        if(y > 280){
            pdf.addPage();
            y = 20;
        }
        y += agregarTextoSeguro(pdf, `${item.id} - ${item.nombre} (${item.avance}%)`, 15, y);
    });
    pdf.save("Informe_Ejecutivo_MARN.pdf");
}

async function generarInformeTecnico(){
    const JsPDF = obtenerJsPdf();
    const pdf = new JsPDF();
    agregarPortada(pdf);
    pdf.addPage();
    let y = 20;

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(16);
    pdf.text("Informe Tecnico", 10, y);
    y += 15;
    pdf.setFontSize(14);
    pdf.text("Caso Piloto Cafe", 10, y);
    y += 10;
    pdf.setFontSize(11);
    datosProyecto.casoPilotoCafe.actividades.forEach(actividad => {
        y += agregarTextoSeguro(pdf, `${actividad.nombre}: ${actividad.avance}%`, 15, y);
    });

    y += 8;
    pdf.setFontSize(14);
    pdf.text("Capacitacion", 10, y);
    y += 10;
    pdf.setFontSize(11);
    pdf.text(`Horas Meta: ${datosProyecto.proyecto.horasCapacitacionMeta}`, 15, y);
    y += 8;
    pdf.text(`Horas Ejecutadas: ${datosProyecto.proyecto.horasCapacitacionEjecutadas}`, 15, y);
    y += 15;

    pdf.setFontSize(14);
    pdf.text("Riesgos", 10, y);
    y += 10;
    pdf.setFontSize(11);
    datosProyecto.riesgos.forEach(riesgo => {
        if(y > 260){
            pdf.addPage();
            y = 20;
        }
        y += agregarTextoSeguro(pdf, `${riesgo.id} - ${riesgo.riesgo} [${riesgo.nivel}]`, 15, y);
        y += 3;
    });

    if(y > 240){
        pdf.addPage();
        y = 20;
    }
    pdf.setFontSize(14);
    pdf.text("Decisiones Pendientes", 10, y);
    y += 10;
    pdf.setFontSize(11);
    datosProyecto.decisionesPendientes.forEach(item => {
        y += agregarTextoSeguro(pdf, item.decision, 15, y);
    });
    pdf.save("Informe_Tecnico_MARN.pdf");
}

async function capturarDashboardPDF(){
    if(typeof html2canvas !== "function"){
        throw new Error("La libreria html2canvas no esta disponible.");
    }
    const JsPDF = obtenerJsPdf();
    const canvas = await html2canvas(document.body, {scale: 2});
    const pdf = new JsPDF("p", "mm", "a4");
    const ancho = 190;
    const alto = canvas.height * ancho / canvas.width;
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 10, 10, ancho, alto);
    pdf.save("Dashboard_MARN.pdf");
}
