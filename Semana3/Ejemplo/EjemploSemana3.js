/* 1. ARREGLOS BÁSICOS */

/* Ejemplo 1: Lista de Calificaciones */

// Crear un arreglo de calificaciones
let calificaciones = [85, 92, 78, 96, 88];

console.log("Todas las calificaciones:", calificaciones);
console.log("Primera calificacion:", calificaciones[0]);
console.log("Última calificacion:", calificaciones[calificaciones.length - 1]);
console.log("Total de calificaciones:", calificaciones.length);

/* Ejemplo 2: Modificar Elementos */

let frutas = ["manzana", "banana", "naranja"];

// Antes
console.log("Frutas originales:", frutas);

// Modificar elemento existente
frutas[1] = "pera";

// Agregar nuevo elemento
frutas[3] = "uva";

// Después
console.log("Frutas modificadas:", frutas);
// Resultado: ["manzana", "pera", "naranja", "uva"]


/* 2. ARREGLOS BIDIMENSIONALES */

/* Ejemplo 3: Tabla de Estudiantes */

// Matriz: [nombre, edad, calificación]
let estudiantes = [
    ["Ana", 20, 85],
    ["Luis", 19, 92],
    ["María", 21, 78]
];

// Acceder a información específica
console.log("Primer estudiante:", estudiantes[0][0]); // "Ana"
console.log("Edad de Luis:", estudiantes[1][1]);       // 19
console.log("Calificacion de Maria:", estudiantes[2][2]); // 78

// Recorrer toda la matriz
for (let i = 0; i < estudiantes.length; i++) {
    let nombre = estudiantes[i][0];
    let edad = estudiantes[i][1];
    let calificacion = estudiantes[i][2];
    
    console.log(`${nombre} tiene ${edad} años y saco ${calificacion}`);
}

/*
Explicación:

estudiantes[0] = primera fila completa
estudiantes[0][0] = primer elemento de la primera fila
Usamos bucle for para recorrer cada estudiante
Extraemos cada dato con su índice correspondiente
*/

/* 3. CONVERSIÓN DE STRINGS */

/* Ejemplo 4: Análisis de Texto */

let frase = "Hola mundo JavaScript";

// Convertir a arreglo de caracteres
let caracteres = frase.split('');
console.log("Caracteres:", caracteres);
console.log("Total de caracteres:", caracteres.length);

// Convertir a arreglo de palabras
let palabras = frase.split(' ');
console.log("Palabras:", palabras);
console.log("Total de palabras:", palabras.length);

// Encontrar una letra específica
let posicionO = caracteres.indexOf('o');
console.log("Primera 'o' esta en posicion:", posicionO);

/*
Explicación:

split('') separa cada carácter (incluyendo espacios)
split(' ') separa por espacios para obtener palabras
indexOf() encuentra la primera aparición de un elemento
*/

/* 4. ESTRUCTURAS DE DATOS AVANZADAS */

/* Ejemplo 5: Catálogo de Productos (Object) */

let producto = {
    nombre: "Laptop",
    precio: 15000,
    marca: "Dell",
    disponible: true
};

// Acceder a propiedades
console.log("Producto:", producto.nombre);
console.log("Precio: Q" + producto.precio);

// Modificar propiedades
producto.precio = 14000;
producto.descuento = 10; // Agregar nueva propiedad

console.log("Producto actualizado:", producto);

/* Ejemplo 6: Inventario (Map) */

let inventario = new Map();

// Agregar productos
inventario.set("laptop", 5);
inventario.set("mouse", 20);
inventario.set("teclado", 15);

// Consultar inventario
console.log("Laptops disponibles:", inventario.get("laptop"));
console.log("Hay teclados:", inventario.has("teclado"));

// Mostrar todo el inventario
for (let [producto, cantidad] of inventario) {
    console.log(`${producto}: ${cantidad} unidades`);
}

