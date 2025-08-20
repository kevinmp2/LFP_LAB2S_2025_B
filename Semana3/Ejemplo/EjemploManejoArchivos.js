// MANEJO DE ARCHIVOS - Sistema De Gestion De Estudiantes

/**
  Ejemplo Sistema De Gestion De Estudiantes
  Este ejemplo muestra cómo manejar un sistema de gestión de estudiantes 
  utilizando lectura y escritura de archivos.
 
 
 
  */

// Importar el módulo 'fs' (File System) para leer y escribir archivos
const fs = require('fs');

// Importar el módulo 'readline' para leer entrada del usuario desde la consola
const readline = require('readline');

// Crear una interfaz para leer desde la consola (stdin = entrada estándar)
// y escribir a la consola (stdout = salida estándar)
const rl = readline.createInterface({
    input: process.stdin,   // De dónde leer (teclado)
    output: process.stdout  // Dónde escribir (pantalla)
});

// Variables globales del programa
let estudiantes = [];      // Array que almacena todos los estudiantes cargados
let archivoActual = "";    // String que guarda el nombre/ruta del archivo actual

// FUNCIÓN: mostrarMenu()
// Propósito: Mostrar el menú principal con las opciones disponibles
function mostrarMenu() {
    // \n = salto de línea, .repeat(50) repite el carácter "=" 50 veces
    console.log("\n" + "=".repeat(50));
    console.log("     SISTEMA DE GESTIÓN DE ESTUDIANTES");
    console.log("=".repeat(50));
    console.log("1. Cargar archivo (modo interactivo)");
    console.log("2. Cargar archivo (con path)");
    console.log("3. Generar reporte HTML");
    console.log("4. Salir del programa");
    console.log("=".repeat(50));
    
    // rl.question() muestra un mensaje y espera que el usuario escriba algo
    // Cuando el usuario presiona Enter, ejecuta la función manejarOpcion
    rl.question('Selecciona una opción (1-4): ', manejarOpcion);
}

// FUNCIÓN: manejarOpcion(opcion)
// Propósito: Procesar la opción que eligió el usuario del menú
// Parámetro: opcion - el texto que escribió el usuario
function manejarOpcion(opcion) {
    // .trim() quita espacios en blanco al inicio y final
    // switch evalúa el valor y ejecuta el case correspondiente
    switch(opcion.trim()) {
        case '1':
            cargarArchivoInteractivo();  // Llama a función para modo interactivo
            break;
        case '2':
            cargarArchivoConPath();      // Llama a función para modo con ruta
            break;
        case '3':
            generarReporteHTML();        // Llama a función para generar reporte
            break;
        case '4':
            console.log("Gracias por usar el sistema");
            rl.close();                  // Cierra la interfaz de readline
            return;                      // Sale de la función (termina programa)
        default:
            // Si no coincide con ningún case, ejecuta este bloque
            console.log("Opción inválida. Por favor selecciona 1, 2, 3 o 4.");
            mostrarMenu();               // Vuelve a mostrar el menú
    }
}

// FUNCIÓN: cargarArchivoInteractivo()
// Propósito: Cargar un archivo especificando solo el nombre (busca en carpeta actual)
function cargarArchivoInteractivo() {
    console.log("\nCARGAR ARCHIVO (MODO INTERACTIVO)");
    console.log("-".repeat(40));  // Línea decorativa de 40 guiones
    console.log("Este modo busca el archivo en la carpeta actual");
    
    // Pedir al usuario el nombre del archivo
    rl.question('Ingresa el nombre del archivo (ej: estudiantes.txt): ', function(nombreArchivo) {
        // Cuando el usuario ingresa el nombre, llama a procesarCargaArchivo
        procesarCargaArchivo(nombreArchivo);
    });
}

// FUNCIÓN: cargarArchivoConPath()
// Propósito: Cargar un archivo especificando la ruta completa
function cargarArchivoConPath() {
    console.log("\nCARGAR ARCHIVO (CON PATH COMPLETO)");
    console.log("-".repeat(42));
    console.log("Este modo permite especificar la ruta completa del archivo");
    console.log("Ejemplos de rutas:");
    console.log("   Windows: C:\\Users\\Usuario\\Documents\\estudiantes.txt");
    console.log("   Linux/Mac: /home/usuario/documentos/estudiantes.txt");
    console.log("   Relativa: ./carpeta/estudiantes.txt");
    
    // Pedir al usuario la ruta completa del archivo
    rl.question('\nIngresa la ruta completa del archivo: ', function(rutaArchivo) {
        // Cuando el usuario ingresa la ruta, llama a procesarCargaArchivo
        procesarCargaArchivo(rutaArchivo);
    });
}

// FUNCIÓN: procesarCargaArchivo(rutaArchivo)
// Propósito: Función común que lee el archivo y procesa su contenido
// Parámetro: rutaArchivo - ruta o nombre del archivo a cargar
function procesarCargaArchivo(rutaArchivo) {
    // Guardar la ruta del archivo en la variable global
    archivoActual = rutaArchivo;
    
    console.log(`\nIntentando cargar: ${rutaArchivo}`);
    
    // fs.readFile() lee un archivo de forma asíncrona
    // Parámetros: ruta del archivo, codificación, función callback
    fs.readFile(rutaArchivo, 'utf8', function(error, contenido) {
        // Si ocurre un error al leer el archivo
        if (error) {
            console.log(`Error: No se pudo leer el archivo '${rutaArchivo}'`);
            
            // Analizar diferentes tipos de errores y mostrar mensajes específicos
            if (error.code === 'ENOENT') {
                // ENOENT = Error No Entry (archivo no existe)
                console.log("   El archivo no existe en la ruta especificada.");
                console.log("   Verifica que:");
                console.log("      • El nombre del archivo sea correcto");
                console.log("      • La ruta esté bien escrita");
                console.log("      • Tengas permisos para acceder al archivo");
            } else if (error.code === 'EACCES') {
                // EACCES = Error Access (sin permisos)
                console.log("   No tienes permisos para leer este archivo.");
            } else if (error.code === 'EISDIR') {
                // EISDIR = Error Is Directory (es un directorio, no archivo)
                console.log("   La ruta especificada es un directorio, no un archivo.");
            } else {
                // Cualquier otro error
                console.log(`   Código de error: ${error.code}`);
                console.log(`   Detalle: ${error.message}`);
            }
            
            // Volver al menú principal
            mostrarMenu();
            return;  // Salir de la función
        }
        
        // Si no hay error, procesar el contenido del archivo
        try {
            // Intentar procesar el archivo y convertirlo en array de estudiantes
            estudiantes = procesarArchivo(contenido);
            
            // Verificar si se encontraron estudiantes
            if (estudiantes.length === 0) {
                console.log("No se encontraron estudiantes válidos en el archivo.");
                console.log("Verifica que el archivo tenga el formato correcto:");
                console.log("nombre, carnet, cui, correo, carrera");
            } else {
                // Mostrar información de éxito
                console.log(`Archivo cargado exitosamente desde: ${rutaArchivo}`);
                console.log(`Se cargaron ${estudiantes.length} estudiantes:`);

                // Mostrar estadísticas adicionales
                console.log(`\nEstadísticas:`);
                console.log(`Carreras encontradas: ${obtenerCarrerasUnicas().length}`);
                
                // Obtener la carrera con más estudiantes
                const carrerasConteo = contarEstudiantesPorCarrera();
                // El operador || devuelve 'N/A' si no hay carreras, 0 si no hay cantidad
                console.log(`Carrera con más estudiantes: ${carrerasConteo[0]?.carrera || 'N/A'} (${carrerasConteo[0]?.cantidad || 0})`);
            }
            
        } catch (parseError) {
            // Si ocurre un error al procesar el contenido del archivo
            console.log("Error al procesar el archivo:", parseError.message);
            console.log("Verifica que el archivo tenga el formato correcto:");
            console.log("• Los datos deben estar separados por comas");
            console.log("• Cada línea debe tener: nombre, carnet, cui, correo, carrera");
            estudiantes = [];  // Vaciar el array de estudiantes
        }
        
        // Volver al menú principal
        mostrarMenu();
    });
}

// FUNCIÓN: procesarArchivo(contenido)
// Propósito: Convertir el texto del archivo en un array de objetos estudiante
// Parámetro: contenido - el texto completo del archivo
// Retorna: array de objetos estudiante
function procesarArchivo(contenido) {
    // .split('\n') divide el texto en líneas usando el salto de línea
    const lineas = contenido.split('\n');
    const estudiantesEncontrados = [];  // Array para almacenar estudiantes válidos

    // Recorrer cada línea del archivo
    for (let i = 0; i < lineas.length; i++) {
        // .trim() quita espacios en blanco al inicio y final de la línea
        const linea = lineas[i].trim();
        
        // Saltar la línea de encabezados (si contiene esta texto)
        if (linea.includes("nombre, carnet, cui, correo, carrera")) {
            continue;  // Pasar a la siguiente iteración del bucle
        }
        
        // Procesar líneas que tengan contenido y no empiecen con "="
        if (linea && !linea.startsWith("=")) {
            // .split(',') divide la línea en partes usando la coma como separador
            const partes = linea.split(',');
            
            // Verificar que tenga al menos 5 campos
            if (partes.length >= 5) {
                // Crear objeto estudiante con los datos
                const estudiante = {
                    nombre: partes[0].trim(),   // Quitar espacios del nombre
                    carnet: partes[1].trim(),   // Quitar espacios del carnet
                    cui: partes[2].trim(),      // Quitar espacios del CUI
                    correo: partes[3].trim(),   // Quitar espacios del correo
                    carrera: partes[4].trim()   // Quitar espacios de la carrera
                };
                
                // Validar que los campos requeridos no estén vacíos
                if (estudiante.nombre && estudiante.carnet && estudiante.carrera) {
                    // Agregar el estudiante al array
                    estudiantesEncontrados.push(estudiante);
                } else {
                    // Informar sobre líneas con datos faltantes
                    console.log(`Línea ${i + 1} ignorada: faltan datos obligatorios`);
                }
            } else {
                // Informar sobre líneas con formato incorrecto
                console.log(`Línea ${i + 1} ignorada: formato incorrecto`);
            }
        }
    }
    
    // Retornar el array con todos los estudiantes válidos encontrados
    return estudiantesEncontrados;
}

// FUNCIÓN: generarReporteHTML()
// Propósito: Crear un archivo HTML con un reporte de todos los estudiantes
function generarReporteHTML() {
    console.log("\nGENERAR REPORTE HTML");
    console.log("-".repeat(25));
    
    // Verificar si hay estudiantes cargados
    if (estudiantes.length === 0) {
        console.log("No hay estudiantes cargados.");
        console.log("Primero selecciona la opción 1 o 2 para cargar un archivo.");
        mostrarMenu();
        return;  // Salir de la función
    }
    
    // Definir el nombre del archivo de reporte
    const nombreReporte = "reporte_estudiantes.html";
    
    // Crear el contenido HTML usando template literals (backticks)
    // ${} permite insertar variables dentro del string
    let html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Estudiantes</title>
    <style>
        /* Estilos CSS para el reporte */
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            text-align: center;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        .info {
            background-color: #ecf0f1;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd;
        }
        th {
            background-color: #3498db;
            color: white;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        tr:hover {
            background-color: #e8f4fd;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #7f8c8d;
            font-size: 14px;
        }
        .stats {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
        }
        .stat-box {
            background-color: #3498db;
            color: white;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
            min-width: 150px;
        }
        .stat-number {
            font-size: 24px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>REPORTE DE ESTUDIANTES</h1>

        <div class="info">
            <strong>Archivo procesado:</strong> ${archivoActual}<br>
            <strong>Total de estudiantes:</strong> ${estudiantes.length}
        </div>
        
        <div class="stats">
            <div class="stat-box">
                <div class="stat-number">${estudiantes.length}</div>
                <div>Estudiantes</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">${obtenerCarrerasUnicas().length}</div>
                <div>Carreras</div>
            </div>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Carnet</th>
                    <th>Carrera</th>
                </tr>
            </thead>
            <tbody>`;

    // .forEach() ejecuta una función para cada elemento del array
    // Recibe dos parámetros: el elemento actual y su índice
    estudiantes.forEach((estudiante, index) => {
        // Agregar una fila de tabla para cada estudiante
        html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${estudiante.nombre}</td>
                    <td>${estudiante.carnet}</td>
                    <td>${estudiante.carrera}</td>
                </tr>`;
    });

    // Cerrar las etiquetas HTML
    html += `
            </tbody>
        </table>

    </div>
</body>
</html>`;

    // fs.writeFile() escribe contenido a un archivo de forma asíncrona
    // Parámetros: nombre del archivo, contenido, codificación, función callback
    fs.writeFile(nombreReporte, html, 'utf8', function(error) {
        // Si ocurre un error al escribir el archivo
        if (error) {
            console.log("Error al generar el reporte:", error.message);
            mostrarMenu();
            return;
        }
        
        // Si se escribió exitosamente
        console.log("Reporte HTML generado exitosamente");
        console.log(`Archivo guardado como: ${nombreReporte}`);
        console.log(`Contenido del reporte:`);
        console.log(`   • ${estudiantes.length} estudiantes incluidos`);
        console.log(`   • ${obtenerCarrerasUnicas().length} carreras diferentes`);
        console.log("\nTip: Abre el archivo HTML en tu navegador para verlo");
        
        // Volver al menú principal
        mostrarMenu();
    });
}

// FUNCIÓN: obtenerCarrerasUnicas()
// Propósito: Obtener un array con las carreras únicas (sin repetir)
// Retorna: array con nombres de carreras sin duplicados
function obtenerCarrerasUnicas() {
    // .map() crea un nuevo array transformando cada elemento
    // Extrae solo las carreras de todos los estudiantes
    const carreras = estudiantes.map(est => est.carrera);
    
    // new Set() crea un conjunto que elimina duplicados automáticamente
    // [...] (spread operator) convierte el Set de vuelta a array
    return [...new Set(carreras)];
}

// FUNCIÓN: contarEstudiantesPorCarrera()
// Propósito: Contar cuántos estudiantes hay en cada carrera
// Retorna: array de objetos con carrera y cantidad, ordenado por cantidad
function contarEstudiantesPorCarrera() {
    const conteo = {};  // Objeto para almacenar los conteos
    
    // Recorrer todos los estudiantes
    estudiantes.forEach(estudiante => {
        const carrera = estudiante.carrera;
        // Si la carrera ya existe, sumarle 1, si no existe, inicializar en 1
        conteo[carrera] = (conteo[carrera] || 0) + 1;
    });
    
    // Object.entries() convierte el objeto en array de [clave, valor]
    // .map() transforma cada [carrera, cantidad] en objeto {carrera, cantidad}
    // .sort() ordena por cantidad de mayor a menor (b.cantidad - a.cantidad)
    return Object.entries(conteo)
        .map(([carrera, cantidad]) => ({ carrera, cantidad }))
        .sort((a, b) => b.cantidad - a.cantidad);
}

// FUNCIÓN: iniciarPrograma()
// Propósito: Función principal que inicia el programa
function iniciarPrograma() {
    console.log("Iniciando Sistema de Gestión de Estudiantes...");
    console.log("Modos de carga disponibles:");
    console.log("Modo interactivo: Solo nombre del archivo (busca en carpeta actual)");
    console.log("Modo path: Ruta absoluta o relativa del archivo (puede estar en cualquier ubicación)");

    // setTimeout() ejecuta una función después de un tiempo determinado (en milisegundos)
    // Mostrar menú principal después de 2 segundos (2000 ms)
    setTimeout(mostrarMenu, 2000);
}

// Llamar a la función principal para iniciar el programa
iniciarPrograma();