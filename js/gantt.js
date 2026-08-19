/*
=========================================================
GANTT.JS

Dashboard Ejecutivo MARN

Responsabilidades:

1. Leer cronograma desde proyecto.json
2. Generar encabezado semanal
3. Dibujar barras del cronograma
4. Resaltar la ruta crítica
5. Mostrar buffer de proyecto

FASE I
  Plan de Trabajo
  Desarrollo Materiales
  Ejecución Curso

FASE II
  Co-creación Manual

FASE III
  Levantamiento Datos Café
  Modelación ACV
  Taller OpenLCA
  Revisión Técnica

FASE IV
  Socialización
  Informe Final
  Buffer
=========================================================
*/


/*
=========================================================
VARIABLES GANTT
=========================================================
*/

const FECHA_INICIO_GANTT =
    new Date("2026-08-17");

const FECHA_FIN_GANTT =
    new Date("2026-12-08");

/*
=========================================================
ESPERAR QUE EL DASHBOARD CARGUE

dashboard.js carga proyecto.json

Luego podemos dibujar el Gantt
=========================================================
*/

window.addEventListener(
    "load",
    iniciarGantt
);


/*
=========================================================
FUNCIÓN PRINCIPAL
=========================================================
*/

function iniciarGantt(){

    setTimeout(() => {

        if(
            typeof datosProyecto !== "undefined"
            &&
            datosProyecto?.cronograma
        ){

            dibujarGantt();

        }

    },300);

}


/*
=========================================================
DIBUJAR GANTT
=========================================================
*/

function dibujarGantt(){

    const contenedor =
        document.getElementById(
            "ganttContainer"
        );

    contenedor.innerHTML = "";

    const semanas =
        generarSemanas();

    let html =
        crearEncabezadoGantt(
            semanas
        );

    datosProyecto.cronograma.forEach(

        actividad => {

            html +=
                crearFilaActividad(
                    actividad,
                    semanas
                );

        }

    );

    contenedor.innerHTML =
        html;

}


/*
=========================================================
GENERAR SEMANAS

Crea semanas desde:

19/08/2026

hasta

08/12/2026

=========================================================
*/

function generarSemanas(){

    let semanas = [];

    let fechaActual =
        new Date(
            FECHA_INICIO_GANTT
        );

    while(
        fechaActual <= FECHA_FIN_GANTT
    ){

        semanas.push(
            new Date(fechaActual)
        );

        fechaActual.setDate(
            fechaActual.getDate()
            + 7
        );

    }

    return semanas;

}


/*
=========================================================
ENCABEZADO DEL GANTT
=========================================================
*/

function crearEncabezadoGantt(
    semanas
){

    let html =
        `<div class="gantt">`;

    html +=
        `<div class="gantt-header">`;

    html +=
        `<div class="gantt-week">
            Actividad
        </div>`;

    semanas.forEach(
        semana => {

            html +=
            `
            <div class="gantt-week">
                ${formatearFechaSemana(
                    semana
                )}
            </div>
            `;

        }
    );

    html +=
        `</div>`;

    return html;

}


/*
=========================================================
FILA DEL GANTT
=========================================================
*/

function crearFilaActividad(
    actividad,
    semanas
){

    let html =
        `<div class="gantt-row">`;

    html +=

        `<div class="gantt-actividad">
            ${actividad.actividad}
        </div>`;


    const inicio =
        new Date(
            actividad.inicio
        );

    const fin =
        new Date(
            actividad.fin
        );

    semanas.forEach(
        semana => {

           const dentro =
               semanaDentroActividad(
                   semana,
                   inicio,
                    fin
               );

            let clase =
                "gantt-celda";

            if(dentro){

                if(
                    actividad.rutaCritica
                ){

                    clase +=
                        " ruta-critica";

                }
                else{

                    clase +=
                        " gantt-activa";

                }

            }

            html +=
                `<div class="${clase}">
                </div>`;

        }
    );


    html +=
        `</div>`;

    return html;

}


/*
=========================================================
VALIDAR SI LA SEMANA CAE DENTRO
DE LA ACTIVIDAD
=========================================================
*/

function semanaDentroActividad(

    semana,

    inicio,

    fin

){

    const limiteSemana =
        new Date(
            semana
        );

    limiteSemana.setDate(
        limiteSemana.getDate()
        + 6
    );

    return (
        inicio <= limiteSemana
        &&
        fin >= semana
    );

}


/*
=========================================================
FORMATO DE FECHA

Ejemplo:

19 Ago

=========================================================
*/

function formatearFechaSemana(
   fecha
){

    const opciones = {

        day:"2-digit",

        month:"short"

    };

    return fecha.toLocaleDateString(
        "es-ES",
        opciones
    );

}