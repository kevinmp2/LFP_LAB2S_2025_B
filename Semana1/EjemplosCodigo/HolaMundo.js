
// HolaMundo.js --> Esto es un comentario de una sola linea

/*
Esto es un comentario de varias lineas

function SaludarMundo() {
    console.log("¡Hola, Mundo!");
}

SaludarMundo();
*/


// Ejemplo de como imprimir un mensaje en la consola
console.log("Ejemplo de una funcion");
console.log("Hola, Mundo");



/*
   =========================================================
  | EJEMPLOS BASICOS PARA ENTENDER COMO FUNCIONA JAVASCRIPT |
   =========================================================
*/

console.log("====== EJEMPLO 1:  VARIABLES Y TIPOS DE DATOS ======");

/*
    "var" es una palabra reservada que se utiliza para declarar variables en JavaScript. 
    Aunque se puede usar, es recomendable utilizar let o const para declarar variables en el código moderno. 
    
    var informacion = "Juan Agosto";
    
    "let" es una palabra reservada que se utiliza para declarar variables de bloque en JavaScript. 
    Se puede reasignar el valor de una variable declarada con let.

    let informacion = "Juan Agosto";

    "const" es una palabra reservada que se utiliza para declarar constantes en JavaScript.
    Una constante debe ser inicializada en el momento de su declaración y no se puede reasignar.

    const informacion = "Juan Agosto"; // No se puede cambiar el valor de una constante

*/

let informacion = "Juan Agosto";

console.log("Informacion: ",  informacion);

// Mostrar el tipo de dato de la variable informacion con el operador typeof
console.log(typeof informacion)


// Cambiar el valor de la variable informacion a un número
informacion = 25;
console.log("Informacion: ",  informacion);

// Mostrar el tipo de dato de la variable informacion con el operador typeof
console.log(typeof informacion)


// Cambiar el valor de la variable informacion a un booleano
informacion = true;
console.log("Informacion: ",  informacion);

// Mostrar el tipo de dato de la variable informacion con el operador typeof
console.log(typeof informacion)


/*
Crear un programa que almacene la información personal de un estudiante y 
muestre cómo JavaScript maneja diferentes tipos de datos automáticamente.
*/

console.log("==================== PROGRAMA ==========================");

let info = "Juan Agosto";  // String
console.log("Nombre: ", info);
console.log("Tipo: ", typeof info);

info = 20;  // Ahora es un número
console.log("Edad: ", info);
console.log("Tipo: ", typeof info);

info = true;  // Ahora es boolean
console.log("Es estudiante? ", info);
console.log("Tipo: ", typeof info);


console.log("====== EJEMPLO 2: FUNCIONES BÁSICAS ======");

// Funcion basica que recibe un parametro(nombre) y retorna un saludo
function saludar(nombre) {
    return "Hola " + nombre ;
}

// Llamar a la funcion saludar con el parametro "Juan" y mostrar el resultado en la consola
console.log(saludar("Juan"));

/*
Crear funciones básicas para una calculadora que muestre 
cómo JavaScript maneja funciones y parámetros.
*/

console.log("==================== PROGRAMA ==========================");

// Funcion para que recibe dos parametros (a, b) y retorna la suma de ambos
function sumar(a, b) {
    return a + b;
}

// Funcion para que recibe dos parametros (a, b) y retorna la multiplicacion de ambos
function multiplicar(a, b) {
    return a * b;
}

// Funcion para que recibe dos parametros (a, b) y retorna la division de ambos
function dividir(a, b) {

    // Verificar si el divisor es cero para evitar división por cero
    if (b === 0) {
        return "Error: No se puede dividir por cero";
    }

    // Si el divisor no es cero, realizar la división
    return a / b;
}

/*
   Uso de las funciones de la calculadora
*/

// Suma de dos números  
console.log("5 + 3 =", sumar(5, 3));

// Multiplicación de dos números
console.log("4 * 7 =", multiplicar(4, 7));

// División de dos números
console.log("10 / 2 =", dividir(10, 2));

// Intento de división por cero, error esperado 
console.log("10 / 0 =", dividir(10, 0));
