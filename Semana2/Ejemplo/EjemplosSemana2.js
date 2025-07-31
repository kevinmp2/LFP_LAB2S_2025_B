
// ===== CONVENCIONES DE NOMBRES ===== 

let nombreProducto = "Laptop"; 
let precioProducto = 1500;

const IVA_PRODUCTO = 0.21;

// Malas prácticas
let nombreproducto = "Teléfono"; // No se recomienda usar minúsculas al inicio
let PRECIO = 2000; // No se recomienda usar mayúsculas sin un propósito claro

// ===== GESTIÓN DE MEMORIA SIMPLE =====

/*
Vamos a ver cómo JavaScript maneja la memoria automáticamente
y cómo podemos crear objetos de manera sencilla.
*/

function crearEstudiante() {
    let estudiante1 = {
        nombre: "Juan",
        edad: 20
    };
    
    let estudiante2 = { 
        nombre: "Ana",
        edad: 22
    };

    console.log(estudiante1);
    console.log(estudiante2);
    
    // Al finalizar la función, el Garbage Collector puede eliminar estos objetos
    // porque ya no son accesibles desde fuera
}


crearEstudiante();

// Ejemplo de problema común: referencias que no se liberan

let datosGlobales = [];

function agregarDatos() {
    // PROBLEMA: Los datos se acumulan y nunca se liberan
    for (let i = 0; i < 1000; i++) {
        datosGlobales.push({ numero: i, texto: `Dato ${i}` });
    }
    console.log("Datos agregados:", datosGlobales.length);
}

function limpiarDatos() {
    // SOLUCIÓN: Limpiar datos cuando ya no se necesiten
    datosGlobales = [];
    console.log("Datos limpiados");
}

agregarDatos();
limpiarDatos();


// Ejemplo 3: Tipos De Funciones

/**
 Vamos a crear una calculadora simple con diferentes tipos de funciones
 */

// Función declarativa

function sumar(a, b) {
    return a + b;
} 

sumar();

console.log("Suma:", sumar(5, 3));
console.log("Suma:", sumar(10, 20));

// ===== TIPOS DE FUNCIONES =====

const restar = function(a, b) {
    let resultado = a - b;
    return resultado;
}

console.log("Resta:", restar(10, 5));


// Arrow function

const multiplicar = (a, b) => a * b;

console.log("Multiplicación:", multiplicar(4, 5));


// ===== EJEMPLOS DE FUNCTION DECLARATION =====
/* Funciones básicas para operaciones cotidianas */

// Ejemplo 1: Calcular edad
function calcularEdad(anioNacimiento) {
    const anioActual = 2024;
    return anioActual - anioNacimiento;
}

// Ejemplo 2: Convertir temperatura
function celsiusAFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

// Ejemplo 3: Validar si es mayor de edad
function esMayorDeEdad(edad) {
    return edad >= 18;
}

// Ejemplo 4: Generar saludo personalizado
function generarSaludo(nombre, hora) {
    if (hora < 12) {
        return `Buenos días, ${nombre}`;
    } else if (hora < 18) {
        return `Buenas tardes, ${nombre}`;
    } else {
        return `Buenas noches, ${nombre}`;
    }
}

// Probando las funciones
console.log("=== Function Declaration - Ejemplos ===");
console.log("Edad de alguien nacido en 1995:", calcularEdad(1995));
console.log("25°C en Fahrenheit:", celsiusAFahrenheit(25));
console.log("¿17 años es mayor de edad?", esMayorDeEdad(17));
console.log("¿20 años es mayor de edad?", esMayorDeEdad(20));
console.log("Saludo a las 10 AM:", generarSaludo("María", 10));
console.log("Saludo a las 8 PM:", generarSaludo("Carlos", 20));


// ===== EJEMPLOS DE FUNCTION EXPRESSION =====

/* Funciones que se asignan a variables para uso específico */

// Ejemplo 1: Calcular descuento
const calcularDescuento = function(precio, porcentaje) {
    return precio * (porcentaje / 100);
};

// Ejemplo 2: Validar email simple
const validarEmail = function(email) {
    return email.includes('@') && email.includes('.');
};

// Ejemplo 3: Generar número aleatorio
const numeroAleatorio = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


// Ejemplo 4: Función que se asigna condicionalmente
let operacionMatematica;
const tipoOperacion = "suma"; // Cambiar por "resta" para ver diferencia

if (tipoOperacion === "suma") {
    operacionMatematica = function(a, b) {
        return a + b;
    };
} else {
    operacionMatematica = function(a, b) {
        return a - b;
    };
}

// Probando las funciones
console.log("=== Function Expression - Ejemplos ===");
console.log("Descuento de Q100 con 15%:", calcularDescuento(100, 15));
console.log("¿'juan@email.com' es válido?", validarEmail("juan@email.com"));
console.log("¿'juan.email' es válido?", validarEmail("juan.email"));
console.log("Número aleatorio entre 1 y 10:", numeroAleatorio(1, 10));
console.log("Operación 5 y 3:", operacionMatematica(5, 3));

// ===== EJEMPLOS DE ARROW FUNCTION =====

/* Funciones cortas y elegantes para operaciones rápidas */

// Ejemplo 1: Operaciones matemáticas básicas
const sumar2 = (a, b) => a + b;
const restar2 = (a, b) => a - b;
const multiplicar2 = (a, b) => a * b;
const elevarAlCuadrado2 = x => x * x;

// Ejemplo 2: Validaciones simples
const esNumeroPositivo2 = num => num > 0;
const esPar2 = num => num % 2 === 0;
const esTextoVacio2 = texto => texto.trim() === '';

// Ejemplo 3: Transformaciones de texto
const aMinusculas2 = texto => texto.toLowerCase();
const aMayusculas2 = texto => texto.toUpperCase();
const primeraLetra2 = texto => texto.charAt(0);

// Ejemplo 4: Funciones con cuerpo más complejo
const calcularIMC2 = (peso, altura) => {
    const imc = peso / (altura * altura);
    return Math.round(imc * 100) / 100;
};

const clasificarIMC2 = imc => {
    if (imc < 18.5) return "Bajo peso";
    if (imc < 25) return "Peso normal";
    if (imc < 30) return "Sobrepeso";
    return "Obesidad";
};

// Ejemplo 5: Arrow functions como callbacks
const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Filtrar números pares
const numerosPares = numeros.filter(num => num % 2 === 0);

// Multiplicar cada número por 2
const numerosDobles = numeros.map(num => num * 2);

// Sumar todos los números
const sumaTotal = numeros.reduce((suma, num) => suma + num, 0);

// Encontrar números mayores que 5
const mayoresQueCinco = numeros.filter(num => num > 5);

// Probando las funciones
console.log("=== Arrow Function - Ejemplos ===");
console.log("5 + 3 =", sumar2(5, 3));
console.log("8 - 3 =", restar2(8, 3));
console.log("4 * 6 =", multiplicar2(4, 6));
console.log("7 al cuadrado =", elevarAlCuadrado2(7));
console.log("¿-5 es positivo?", esNumeroPositivo2(-5));
console.log("¿8 es par?", esPar2(8));
console.log("¿'   ' está vacío?", esTextoVacio2("   "));
console.log("'HOLA' a minúsculas:", aMinusculas2("HOLA"));
console.log("'mundo' a mayúsculas:", aMayusculas2("mundo"));
console.log("Primera letra de 'JavaScript':", primeraLetra2("JavaScript"));

console.log("IMC de 70kg y 1.75m:", calcularIMC2(70, 1.75));
console.log("Clasificación del IMC 22.86:", clasificarIMC2(22.86));

console.log("Números originales:", numeros);
console.log("Números pares:", numerosPares);
console.log("Números dobles:", numerosDobles);
console.log("Suma total:", sumaTotal);
console.log("Mayores que 5:", mayoresQueCinco);


// ===== CLASES EN JAVASCRIPT (ES6+) =====


class Carro {
    constructor(marca, modelo) {
        this.marca = marca;
        this.modelo = modelo;
    }

    mostrarDetalles() {
        console.log(`Marca: ${this.marca}, Modelo: ${this.modelo}`);
    }
}

const miCarro = new Carro("Toyota", "Corolla");
console.log(miCarro);

const otroCarro = new Carro("Honda", "Civic");
otroCarro.mostrarDetalles();



/*Vamos a crear una clase para manejar estudiantes universitarios*/

class Estudiante {
    // Constructor ---> se ejecuta al crear un nuevo estudiante
    constructor(nombre, carnet, carrera) {
        this.nombre = nombre;
        this.carnet = carnet;
        this.carrera = carrera;
        this.materias = [];
        this.creditosAprobados = 0;
    }
    
    // Método para agregar materias
    agregarMateria(nombreMateria, creditos, nota) {
        const materia = {
            nombre: nombreMateria,
            creditos: creditos,
            nota: nota,
            aprobada: nota >= 61
        };
        
        this.materias.push(materia);
        
        if (materia.aprobada) {
            this.creditosAprobados += creditos;
        }
        
        console.log(`Materia ${nombreMateria} agregada con nota ${nota}`);
    }
    
    // Método para calcular promedio
    calcularPromedio() {
        if (this.materias.length === 0) return 0;
        
        const sumaNotas = this.materias.reduce((suma, materia) => suma + materia.nota, 0);
        return Math.round((sumaNotas / this.materias.length) * 100) / 100;
    }
    
    // Método para mostrar información
    mostrarInfo() {
        console.log(`=== INFORMACIÓN DEL ESTUDIANTE ===`);
        console.log(`Nombre: ${this.nombre}`);
        console.log(`Carnet: ${this.carnet}`);
        console.log(`Carrera: ${this.carrera}`);
        console.log(`Materias cursadas: ${this.materias.length}`);
        console.log(`Créditos aprobados: ${this.creditosAprobados}`);
        console.log(`Promedio general: ${this.calcularPromedio()}`);
    }
    
    // Método estático (no necesita instancia de la clase)
    static compararPromedios(estudiante1, estudiante2) {
        const promedio1 = estudiante1.calcularPromedio();
        const promedio2 = estudiante2.calcularPromedio();
        
        if (promedio1 > promedio2) {
            return `${estudiante1.nombre} tiene mejor promedio (${promedio1} vs ${promedio2})`;
        } else if (promedio2 > promedio1) {
            return `${estudiante2.nombre} tiene mejor promedio (${promedio2} vs ${promedio1})`;
        } else {
            return `Ambos estudiantes tienen el mismo promedio (${promedio1})`;
        }
    }
}

// Crear instancias de la clase
const estudiante1 = new Estudiante("María García", "2021-12345", "Ingeniería en Sistemas");
const estudiante2 = new Estudiante("Carlos López", "2021-67890", "Ingeniería Civil");


// Usar los métodos
estudiante1.agregarMateria("Matemática 1", 5, 85);
estudiante1.agregarMateria("Programación 1", 4, 92);
estudiante1.agregarMateria("Física 1", 4, 78);

estudiante2.agregarMateria("Matemática 1", 5, 88);
estudiante2.agregarMateria("Química", 4, 76);

estudiante1.mostrarInfo();
estudiante2.mostrarInfo();

// Usar método estático
console.log(Estudiante.compararPromedios(estudiante1, estudiante2));




