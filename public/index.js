// const html elements
const btnSend = document.getElementById("btnSend");
const btnClear = document.getElementById("btnClear");
const txtPromptInput = document.getElementById("txtPromptInput");
const lstResults = document.getElementById("lstResults");

btnSend.addEventListener("click", sendToChatGPT);
btnClear.addEventListener("click", clearAll);

function sendToChatGPT() {
    let prompt = txtPromptInput.value.trim();
    let manual = `
    ### MANUAL DE USUARIO: TAKAYNAMO SOFTWARE
    
    #### UGEL 02 LA ESPERANZA
    ---
    
    **ÍNDICE**
    
    1. Introducción
    2. Módulo de Asistencia (Anexos 3 y 4)
    3. Módulo de Licencias
    4. Requisitos y Pasos para llenado de anexos
    5. Registro y Control de Asistencia
    
    ---
    
    **1. INTRODUCCIÓN**
    
    TAKAYNAMO es una herramienta diseñada para facilitar el envío virtual de los formatos de asistencia en concordancia con la R.S.G. 326-2017-MINEDU. De manera específica, se aplica a los formatos del Anexo 3 y 4.
    
    **2. MÓDULO DE ASISTENCIA (ANEXOS 3 y 4)**
    
    2.1. **Anexo 3 – Formato 1**: Registro y Control de Asistencia – Reporte de Asistencia Detallado.
    
    2.2. **Anexo 4 – Formato 2**: Registro y Control de Asistencia – Reporte Consolidado de Inasistencias, Tardanzas y Permisos sin Goce de Remuneraciones.
    
    **3. MÓDULO DE LICENCIAS**
    
    Este módulo aborda el registro y control de licencias otorgadas a los empleados.
    
    **4. REQUISITOS Y PASOS PARA LLENADO DE ANEXOS**
    
    ...
    
    **5. REGISTRO Y CONTROL DE ASISTENCIA**
    
    ...
    
    ---
    
    **NOTA**: La utilización del software TAKAYNAMO para el registro y envío de la asistencia mensual es mandatorio. No será necesario enviar dicha asistencia por otros medios una vez se haya implementado el sistema.
    
    --- 
    UGEL 02 La Esperanza Takaynamo-Software – Todos los derechos reservados.
    `;
    
    console.log(manual);
    

    if (!prompt) {
        alert('Por favor, introduce un texto antes de enviar.');
        return;
    }

    fetch("/api/chatgpt", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "prompt": "en base a este texto"+ manual +prompt })
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then((data) => {
        const stringParsed = replaceBackticksWithPre(data.message.content);
        lstResults.innerHTML += createItem(prompt, stringParsed);
    })
    .catch((error) => {
        console.error("Error:", error);
        alert('Ocurrió un error. Por favor, intenta de nuevo.');
    })
}

function createItem(prompt, message) {
    let item = `
        <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                
                <p>${escapeHTML(message)}</p>
            </div>
        </li>`;
    return item;
}

function replaceBackticksWithPre(string) {
    const regex = /```([\s\S]*?)```/g;
    return string.replace(regex, "<pre>$1</pre>");
}

function clearAll() {
    lstResults.innerHTML = "";
    txtPromptInput.value = "";
}

function escapeHTML(string) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(string));
    return div.innerHTML;
}
