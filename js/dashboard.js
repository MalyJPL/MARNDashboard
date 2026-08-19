/*
=========================================================
DASHBOARD.JS

Proyecto:
Programa DAP El Salvador
Req. 124-2026 - Lote 2

Cliente:
MARN

Autor:
Maly Johanna Puerto López

Descripción:
Este archivo:

1. Lee el proyecto.json
2. Calcula indicadores
3. Llena las tablas
4. Llena las tarjetas KPI
5. Actualiza paneles

=========================================================
*/


/*
=========================================================
VARIABLE GLOBAL
=========================================================

Aquí se almacenan los datos leídos desde
proyecto.json.

Todo el dashboard consulta esta variable.

*/

let datosProyecto;


/*
=========================================================
INICIO DEL DASHBOARD
=========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    iniciarDashboard
);


/*
=========================================================
FUNCIÓN PRINCIPAL
=========================================================
*/

async function iniciarDashboard(){

    try{

        await cargarDatos();

        actualizarFecha();

        cargarKPIs();

        cargarResumen();

        cargarFases();

        cargarEntregables();

        cargarCasoCafe();

        cargarCapacitacion();

        cargarRiesgos();

        cargarDecisiones();

        cargarHitos();

        cargarRutaCritica();

        console.log(
            "Dashboard cargado correctamente."
        );

    }
    catch(error){

        console.error(error);

        alert(
            "No fue posible cargar proyecto.json"
        );

    }

}


/*
=========================================================
LECTURA DEL JSON
=========================================================
*/

async function cargarDatos(){

    const respuesta =
        await fetch(
            "data/proyecto.json"
        );

    if(!respuesta.ok){

        throw new Error(
            "Error leyendo proyecto.json"
        );

    }

    datosProyecto =
        await respuesta.json();

}


/*
=========================================================
FECHA DE ACTUALIZACIÓN
=========================================================
*/

function actualizarFecha(){

    const hoy = new Date();

    const fecha =
        hoy.toLocaleDateString(
            "es-ES",
            {
                year:"numeric",
                month:"long",
                day:"numeric"
            }
        );

    const encabezado =
        document.getElementById(
            "fechaActualizacion"
        );

    const pie =
        document.getElementById(
            "fechaPie"
        );

    encabezado.textContent =
        "Última actualización: " + fecha;

    pie.textContent =
        fecha;

}


/*
=========================================================
KPIs
=========================================================
*/

function cargarKPIs(){

    const avance =
        document.getElementById(
            "kpiAvanceGeneral"
        );

    avance.textContent =
        calcularAvanceGeneral() + "%";


    const entregables =
        document.getElementById(
            "kpiEntregables"
        );

    entregables.textContent =
        contarEntregablesTerminados()
        +
        " / "
        +
        datosProyecto.kpis.entregablesTotales;


    const riesgos =
        document.getElementById(
            "kpiRiesgos"
        );

    riesgos.textContent =
        datosProyecto.kpis.riesgosAltos;


    const dias =
        document.getElementById(
            "kpiDias"
        );

    dias.textContent =
        calcularDiasRestantes();

}


/*
=========================================================
AVANCE GENERAL

Promedio simple de entregables
=========================================================
*/

function calcularAvanceGeneral(){

    const entregables =
        datosProyecto.entregables;

    let suma = 0;

    entregables.forEach(e => {

        suma += e.avance;

    });

    const promedio =
        suma / entregables.length;

    return Math.round(
        promedio
    );

}


/*
=========================================================
ENTREGABLES TERMINADOS
=========================================================
*/

function contarEntregablesTerminados(){

    return datosProyecto.entregables
        .filter(
            e =>
            e.estado.toLowerCase()
            === "completado"
        ).length;

}


/*
=========================================================
DÍAS RESTANTES
=========================================================
*/

function calcularDiasRestantes(){

    const cierre =
        new Date(
            datosProyecto.proyecto
            .fechaCierreContractual
        );

    const hoy =
        new Date();

    const diferencia =
        cierre - hoy;

    return Math.ceil(
        diferencia /
        (1000*60*60*24)
    );

}


/*
=========================================================
RESUMEN EJECUTIVO
=========================================================
*/

function cargarResumen(){

    const div =
        document.getElementById(
            "resumenEjecutivo"
        );

    div.innerHTML = `

        <p>
        <strong>Cliente:</strong>
        ${datosProyecto.proyecto.cliente}
        </p>

        <p>
        <strong>Contrato:</strong>
        ${datosProyecto.proyecto.contrato}
        </p>

        <p>
        <strong>Inicio:</strong>
        ${datosProyecto.proyecto.fechaInicio}
        </p>

        <p>
        <strong>Cierre:</strong>
        ${datosProyecto.proyecto.fechaCierreContractual}
        </p>

        <p>
        <strong>Buffer:</strong>
        ${datosProyecto.proyecto.fechaBuffer}
        </p>

    `;

}


/*
=========================================================
FASES
=========================================================
*/

function cargarFases(){

    const contenedor =
        document.getElementById(
            "fasesContainer"
        );

    contenedor.innerHTML = "";

    datosProyecto.fases.forEach(

        fase => {

            contenedor.innerHTML +=

            `
            <div class="fase-card">

                <h3>${fase.nombre}</h3>

                <div class="barra-contenedor">

                    <div
                        class="barra-avance"
                        style="width:${fase.avance}%">
                    </div>

                </div>

                <p>
                    ${fase.avance}%
                </p>

            </div>
            `;

        }

    );

}


/*
=========================================================
ENTREGABLES
=========================================================
*/

function cargarEntregables(){

    const tbody =
        document.querySelector(
            "#tablaEntregables tbody"
        );

    tbody.innerHTML = "";

    datosProyecto.entregables
    .forEach(item => {

        tbody.innerHTML +=

        `
        <tr>

            <td>${item.id}</td>

            <td>${item.nombre}</td>

            <td>${item.fase}</td>

            <td>${item.fechaObjetivo}</td>

            <td>${item.estado}</td>

            <td>${item.avance}%</td>

        </tr>
        `;

    });

}


/*
=========================================================
CASO PILOTO CAFÉ
=========================================================
*/

function cargarCasoCafe(){

    const contenedor =
        document.getElementById(
            "casoCafeContainer"
        );

    contenedor.innerHTML = "";

    datosProyecto.casoPilotoCafe
    .actividades
    .forEach(item => {

        contenedor.innerHTML +=

        `
        <div class="cafe-item">

            <h4>
                ${item.nombre}
            </h4>

            <p>
                Estado:
                ${item.estado}
            </p>

            <p>
                Avance:
                ${item.avance}%
            </p>

        </div>
        `;

    });

}


/*
=========================================================
CAPACITACIÓN
=========================================================
*/

function cargarCapacitacion(){

    const meta =
        datosProyecto.proyecto
        .horasCapacitacionMeta;

    const ejecutadas =
        datosProyecto.proyecto
        .horasCapacitacionEjecutadas;

    document.getElementById(
        "horasMeta"
    ).textContent = meta;

    document.getElementById(
        "horasEjecutadas"
    ).textContent = ejecutadas;

    let porcentaje = 0;

    if(meta > 0){

        porcentaje =
            Math.round(
                (ejecutadas / meta)
                * 100
            );

    }

    document.getElementById(
        "barraCapacitacion"
    ).style.width =
        porcentaje + "%";

}


/*
=========================================================
RIESGOS
=========================================================
*/

function cargarRiesgos(){

    const tbody =
        document.querySelector(
            "#tablaRiesgos tbody"
        );

    tbody.innerHTML = "";

    datosProyecto.riesgos
    .forEach(riesgo => {

        tbody.innerHTML +=

        `
        <tr>

            <td>${riesgo.id}</td>

            <td>${riesgo.riesgo}</td>

            <td>${riesgo.probabilidad}</td>

            <td>${riesgo.impacto}</td>

            <td>${riesgo.nivel}</td>

            <td>${riesgo.mitigacion}</td>

        </tr>
        `;

    });

}


/*
=========================================================
DECISIONES
=========================================================
*/

function cargarDecisiones(){

    const tbody =
        document.querySelector(
            "#tablaDecisiones tbody"
        );

    tbody.innerHTML = "";

    datosProyecto.decisionesPendientes
    .forEach(item => {

        tbody.innerHTML +=

        `
        <tr>

            <td>${item.id}</td>

            <td>${item.decision}</td>

            <td>${item.responsable}</td>

            <td>${item.estado}</td>

        </tr>
        `;

    });

}


/*
=========================================================
HITOS
=========================================================
*/

function cargarHitos(){

    const contenedor =
        document.getElementById(
            "hitosContainer"
        );

    contenedor.innerHTML = "";

    datosProyecto.hitos
    .forEach(hito => {

        contenedor.innerHTML +=

        `
        <div class="hito">

            <strong>
                ${hito.nombre}
            </strong>

            <br>

            ${hito.fecha}

        </div>
        `;

    });

}


/*
=========================================================
RUTA CRÍTICA
=========================================================
*/

function cargarRutaCritica(){

    const contenedor =
        document.getElementById(
            "rutaCriticaContainer"
        );

    contenedor.innerHTML = "";

    datosProyecto.rutaCritica
    .forEach(item => {

        contenedor.innerHTML +=

        `
        <div class="ruta-item">

            ${item}

        </div>
        `;

    });

}