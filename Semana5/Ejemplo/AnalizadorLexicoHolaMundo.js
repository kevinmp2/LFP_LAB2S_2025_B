// El codigo que vamos a analizar (nuestro "programa fuente")
const codigoFuente = 'print("Hola Mundo");';

console.log("CODIGO A ANALIZAR:", codigoFuente);
console.log("=" .repeat(50)); // separador 

// ==========================================
// FASE 1: ANALISIS LEXICO
// ==========================================

// Función que convierte texto en "tokens" (palabras significativas)
function hacerAnalisisLexico(codigo) {
    console.log("INICIANDO ANALISIS LEXICO");
    
    const tokens = [];        // Aqui guardaremos los tokens encontrados
    let posicion = 0;         // Posicion actual en el codigo
    
    // Recorremos el codigo caracter por caracter
    while (posicion < codigo.length) {
        
        const caracter = codigo[posicion];  // Caracter actual
        console.log(`   Leyendo caracter: '${caracter}' en posicion ${posicion}`);
        
        // ¿Es un espacio? Lo saltamos
        if (caracter === ' ') {
            console.log("     → Es un espacio, lo ignoramos");
            posicion++;
            continue;
        }
        
        // ¿Es una letra? Entonces es una palabra (identificador o comando)
        if (caracter >= 'a' && caracter <= 'z') {
            let palabra = '';
            
            // Leemos toda la palabra
            while (posicion < codigo.length && 
                   codigo[posicion] >= 'a' && codigo[posicion] <= 'z') {
                palabra += codigo[posicion];
                posicion++;
            }
            
            console.log(`     → Encontramos la palabra o bien el comando: "${palabra}"`);
            tokens.push({ tipo: 'COMANDO', valor: palabra });
            continue;
        }
        
        // ¿Es una comilla? Entonces viene un texto (string)
        if (caracter === '"') {
            let texto = '';
            posicion++;  // Saltamos la primera comilla
            
            // Leemos hasta encontrar la comilla de cierre
            while (posicion < codigo.length && codigo[posicion] !== '"') {
                texto += codigo[posicion];
                posicion++;
            }
            
            posicion++;  // Saltamos la comilla de cierre
            console.log(`     → Encontramos texto: "${texto}"`);
            tokens.push({ tipo: 'TEXTO', valor: texto });
            continue;
        }
        
        // ¿Es un parentesis de apertura?
        if (caracter === '(') {
            console.log("     → Encontramos un parentesis de apertura");
            tokens.push({ tipo: 'PARENTESIS_ABRE', valor: '(' });
            posicion++;
            continue;
        }
        
        // ¿Es un parentesis de cierre?
        if (caracter === ')') {
            console.log("     → Encontramos un parentesis de cierre");
            tokens.push({ tipo: 'PARENTESIS_CIERRA', valor: ')' });
            posicion++;
            continue;
        }
        
        // ¿Es un punto y coma?
        if (caracter === ';') {
            console.log("     → Encontramos punto y coma (fin de instruccion)");
            tokens.push({ tipo: 'FIN_INSTRUCCION', valor: ';' });
            posicion++;
            continue;
        }
        
        // Si llegamos aqui, es un caracter desconocido
        console.log(`     → Caracter desconocido, lo saltamos`);
        posicion++;
    }

    console.log("ANALISIS LEXICO COMPLETADO");
    return tokens;
}

// Ejecutamos el analisis lexico
const tokens = hacerAnalisisLexico(codigoFuente);

// Mostramos los tokens encontrados
console.log("\nTOKENS ENCONTRADOS:");
tokens.forEach((token, indice) => {
    console.log(`   ${indice + 1}. ${token.tipo}: "${token.valor}"`);
});

console.log("\n" + "=".repeat(50));
