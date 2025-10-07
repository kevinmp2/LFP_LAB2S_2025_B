const Token = require("./models/Token.js");
const ErrorLexico = require("./models/LexicalError.js");
const Character = require("./utils/Character.js");


/**
 * Analizador Lexico basado en AFD con estados
*/

class Lexer {
    // Propiedades privadas
    #input; // Cadena de entrada
    #pos_char; // Posicion del caracter actual
    #buffer; // Buffer para construir tokens
    #char_line; // Linea actual
    #char_col; // Columna actual
    #next_char; // Siguiente caracter a procesar
    #keywords; // Palabras reservadas
    #tokens; // Tokens reconocidos
    #errors; // Errores lexicos

    constructor(input) {
        this.#input = input;
        this.#pos_char = 0;
        this.#buffer = '';
        this.#char_line = 1;
        this.#char_col = 1;
        this.#next_char = '';
        this.#tokens = [];
        this.#errors = [];

        // Definicion de palabras reservadas(JAVA)
         this.#keywords = {
            'public': 'KW_public',
            'class': 'KW_class',
            'static': 'KW_static',
            'void': 'KW_void',
            'main': 'KW_main',
            'String': 'KW_String',
            'args': 'KW_args',
            'int': 'KW_int',
            'double': 'KW_double',
            'char': 'KW_char',
            'boolean': 'KW_boolean',
            'true': 'KW_true',
            'false': 'KW_false',
            'if': 'KW_if',
            'else': 'KW_else',
            'for': 'KW_for',
            'while': 'KW_while',
            'System': 'KW_System',
            'out': 'KW_out',
            'println': 'KW_println'
        };
    }

    // Inicializar el buffer con el caracter actual
    #initBuffer(currentChar) {
        this.#buffer = currentChar;
        this.#char_col++;
        this.#pos_char++;

    }

    // Agregar caracter al buffer y actualizar posicion
    
    #addCharToBuffer(currentChar) {
        this.#buffer += currentChar;
        this.#char_col++;
        this.#pos_char++;
    }
    
    // Crear un nuevo token con el buffer actual
    #createToken(type) {
       return new Token(type, this.#buffer, this.#char_line, this.#char_col - this.#buffer.length);
    }

    // Agregar un error lexico a la lista de errores
    #addError(description) {
        this.#errors.push(new ErrorLexico(
            this.#next_char,
            this.#char_line,
            this.#char_col, 
            description
        ));
    }

    // Inicia el proceso de tokenizacion 
    analyze() {
        let token;
        
        while((token = this.nextToken()).type !== 'EOF') {
            this.#tokens.push(token);
        }

        return {
            tokens: this.#tokens,
            errors: this.#errors,
            success: this.#errors.length === 0
        };
    }

    // Obtener el siguiente token de la entrada
    nextToken = () => this.#S0();
    
    // Estado inicial del automata finito determinista (AFD)
    #S0() {
        while(this.#pos_char < this.#input.length) {
            this.#next_char = this.#input[this.#pos_char];



            // δ(letra, S0) = S1, si letra ∈ {A-Z, a-z, _}
            // Reconoce: IDENTIFICADORES y PALABRAS RESERVADAS
            if (Character.isAlpha(this.#next_char)) {
                this.#initBuffer(this.#next_char);
                return this.#S1();
            }

            // δ(dígito, S0) = S4, si dígito ∈ {0-9}
            // Reconoce: NUMEROS ENTEROS Y DECIMALES
            if (Character.isDigit(this.#next_char)) {
                this.#initBuffer(this.#next_char);
                const token = this.#S4();
                if (token) return token;
            }

            // δ(", S0) = S7
            // Reconoce: CADENAS
            if (this.#next_char === '"') {
                this.#initBuffer(this.#next_char);
                return this.#S7();
            }

            //δ(', S0) = S9
            // Reconoce: CARACTERES
            if (this.#next_char === "'") {
                this.#initBuffer(this.#next_char);
                return this.#S9();
            }

            // δ(+, S0) = S12
            // Reconoce: PLUS, INCREMENT
            if (this.#next_char === '+') {
                this.#initBuffer(this.#next_char);
                return this.#S12();
            }

            // δ(-, S0) = S14
            // Reconoce: MINUS, DECREMENT
            if (this.#next_char === '-') {
                this.#initBuffer(this.#next_char);
                return this.#S14();
            }

            // δ(*, S0) = S16
            // Reconoce: MULTIPLY
            if (this.#next_char === '*') {
                this.#initBuffer(this.#next_char);
                return this.#S16();
            }

            // δ(/, S0) = S17
            // Reconoce: DIVIDE, COMENTARIOS
            if (this.#next_char === '/') {
                this.#initBuffer(this.#next_char);
                const result = this.#S17();
                if (result) return result;
                continue; // Los comentarios no retornan token
            }

            // δ(=, S0) = S21
            // Reconoce: ASSIGN, EQUAL
            if (this.#next_char === '=') {
                this.#initBuffer(this.#next_char);
                return this.#S21();
            }

            // δ(!, S0) = S23
            // Reconoce: NOT_EQUAL
            if (this.#next_char === '!') {
                this.#initBuffer(this.#next_char);
                return this.#S23();
            }

            // δ(>, S0) = S25
            // Reconoce: GREATER, GREATER_EQUAL
            if (this.#next_char === '>') {
                this.#initBuffer(this.#next_char);
                return this.#S25();
            }

            // δ(<, S0) = S27
            // Reconoce: LESS, LESS_EQUAL
            if (this.#next_char === '<') {
                this.#initBuffer(this.#next_char);
                return this.#S27();
            }

            // δ({, S0) = S29
            if (this.#next_char === '{') {
                this.#initBuffer(this.#next_char);
                return this.#S29();
            }

            // δ(}, S0) = S30
            if (this.#next_char === '}') {
                this.#initBuffer(this.#next_char);
                return this.#S30();
            }

            // δ((, S0) = S31
            if (this.#next_char === '(') {
                this.#initBuffer(this.#next_char);
                return this.#S31();
            }

            // δ(), S0) = S32
            if (this.#next_char === ')') {
                this.#initBuffer(this.#next_char);
                return this.#S32();
            }

            // δ([, S0) = S33
            if (this.#next_char === '[') {
                this.#initBuffer(this.#next_char);
                return this.#S33();
            }

            // δ(], S0) = S34
            if (this.#next_char === ']') {
                this.#initBuffer(this.#next_char);
                return this.#S34();
            }

            // δ(;, S0) = S35
            if (this.#next_char === ';') {
                this.#initBuffer(this.#next_char);
                return this.#S35();
            }

            // δ(,, S0) = S36
            if (this.#next_char === ',') {
                this.#initBuffer(this.#next_char);
                return this.#S36();
            }

            // δ(., S0) = S37
            if (this.#next_char === '.') {
                this.#initBuffer(this.#next_char);
                return this.#S37();
            }

            // CARACTERES IGNORADOS
        
            if (this.#next_char === '' || this.#next_char === ' ') {
                this.#char_col++;
            }

            else if (this.#next_char === '\t') {
                this.#char_col += 4;
            }

            else if (this.#next_char === '\n') {
                this.#char_col = 1;
                this.#char_line++;
            }

            else if (this.#next_char === '\r') {
                this.#char_col++;
            }
            
            // ERROR LÉXICO
            else {
                this.#addError('Carácter no reconocido');
                this.#char_col++;
            }

            this.#pos_char++;
        }

        return new Token('EOF', 'EOF', this.#char_line, this.#char_col);

    }

    // Estado S1: Reconocimiento de IDENTIFICADORES y PALABRAS RESERVADAS
    #S1() {
        // δ(alfanumérico, S1) = S1, si c ∈ {A-Z, a-z, 0-9, _}
        while (Character.isAlphanumeric((this.#next_char = this.#input[this.#pos_char]))) {
            this.#addCharToBuffer(this.#next_char);
        }

        // Estado de aceptación: KEYWORD o IDENTIFIER
        const tokeType = this.#keywords[this.#buffer] || 'IDENTIFIER';
        
        return this.#createToken(tokeType);
    }

    // Estado S4: Reconocimiento de NÚMEROS ENTEROS y DECIMALES
    #S4() {
        // δ(dígito, S4) = S4, si dígito ∈ {0-9}
        while (Character.isDigit((this.#next_char = this.#input[this.#pos_char]))) {
            this.#addCharToBuffer(this.#next_char);
        }

        // δ(., S4) = S5, si el caracter es un punto decimal
        if (this.#next_char === '.') {
            this.#addCharToBuffer(this.#next_char);
            return this.#S5();
        }

        // Estado de aceptación: INTEGER
        return this.#createToken('INTEGER');
    }

    // Estado S5: Reconocimiento de NÚMEROS DECIMALES
    #S5() {
        // Debe haber al menos un dígito después del punto decimal
        if (!Character.isDigit((this.#next_char = this.#input[this.#pos_char]))) {
            this.#addError('Se esperaba al menos un dígito después del punto decimal');
            return null;
        }

        return this.#S6();
    }

    // Estado S6: Continuación del reconocimiento de NÚMEROS DECIMALES
    #S6() {
        // δ(dígito, S6) = S6, si dígito ∈ {0-9}
        while (Character.isDigit((this.#next_char = this.#input[this.#pos_char]))) {
            this.#addCharToBuffer(this.#next_char);
        }

        // Verifica si hay un punto decimal adicional (error)
        if (this.#next_char === '.') {
            this.#addError('Número decimal mal formado: múltiples puntos decimales');
            return null;
        }

        return this.#createToken('DECIMAL');
    }


    // Estado S7: Reconocimiento de CADENAS(STRING)
    #S7() {
        // δ(cualquier caracter, S7) = S7, mientras no sea " o \n
        while((this.#next_char = this.#input[this.#pos_char]) !== '"' && this.#next_char !== '\n') {
            this.#addCharToBuffer(this.#next_char);
        }

        // δ(", S7) = S8, si el caracter es una comilla doble (fin de cadena)
        if (this.#next_char === '"') {
            this.#addCharToBuffer(this.#next_char);
            return this.#S8();
        }

        // Error: cadena no cerrada
        this.#addError('Cadena no cerrada');
        return null;        
    }

    // Estado S8: Aceptación de CADENAS(STRING)
    #S8() {
        // Remover las comillas del valor del token
        const value = this.#buffer.substring(1, this.#buffer.length - 1); // Excluir las comillas
        return this.#createToken('STRING', value, this.#char_line, this.#char_col - this.#buffer.length);
    }


    // Estado S9: Reconocimiento de CARACTERES(CHAR)
    #S9() {
        this.#next_char = this.#input[this.#pos_char];

        //Verificar que no sea fin de linea o EOF
        if (this.#next_char === '\n' || this.#next_char === '\0') {
            this.#addError('Carácter no cerrado');
            return null;
        }

        // Agregar el caracter al buffer
        this.#addCharToBuffer(this.#next_char);
        return this.#S10();
    }

    // Estado S10: Continuación del reconocimiento de CARACTERES(CHAR)
    #S10() {
        this.#next_char = this.#input[this.#pos_char];

        // δ(', S10) = S11, si el caracter es una comilla simple (fin de carácter)
        if (this.#next_char === "'") {
            this.#addCharToBuffer(this.#next_char);
            return this.#S11();
        }

        this.#addError('Carácter no cerrado');

        while(this.#next_char !== "'" && this.#next_char !== '\n') {
            this.#addCharToBuffer(this.#next_char);
            this.#next_char = this.#input[this.#pos_char];
        }

        return null;        
    }

    // Estado S11: Aceptación de CARACTERES(CHAR)
    #S11() {
        // Remover las comillas del valor del token
        const value = this.#buffer.substring(1, this.#buffer.length - 1); // Excluir las comillas
        return new Token('CHAR', value, this.#char_line, this.#char_col - this.#buffer.length);
    }

    // Estado S12: Reconocimiento de PLUS(+) e INCREMENT(++)

    #S12() {
        this.#next_char = this.#input[this.#pos_char];

        // δ(+, S12) = S13(incremento)
        if (this.#next_char === '+') {
            this.#addCharToBuffer(this.#next_char);
            return this.#S13();
        }

        // Estado de aceptación: PLUS
        return this.#createToken('PLUS');
    }

    // Estado S13: Aceptación de INCREMENT(++)

    #S13() {
        return this.#createToken('INCREMENT');
    }


    // Estado S14: Reconocimiento de MINUS(-) y DECREMENT(--)
    #S14() {
        this.#next_char = this.#input[this.#pos_char];

        // δ(-, S14) = S15(decremento)
        if (this.#next_char === '-') {
            this.#addCharToBuffer(this.#next_char);
            return this.#S15();
        }

        // Estado de aceptación: MINUS
        return this.#createToken('MINUS');
    }

    // Estado S15: Aceptación de DECREMENT(--)
    #S15() {
        return this.#createToken('DECREMENT');
    }

    // Estado S16: Aceptación de MULTIPLY(*)
    #S16() {
        return this.#createToken('MULTIPLY');
    }

    // Estado S17: Reconocimiento de DIVIDE(/) y COMENTARIOS(//, /* */)
    #S17() {
        this.#next_char = this.#input[this.#pos_char];

        // δ(/, S17) = S18(comentario de línea)
        if (this.#next_char === '/') {
            this.#addCharToBuffer(this.#next_char);
            this.#S18();
            return null; // Los comentarios no retornan token
        }

        // δ(*, S17) = S19(comentario de bloque)
        if (this.#next_char === '*') {
            this.#addCharToBuffer(this.#next_char);
            this.#S19();
            return null; // Los comentarios no retornan token
        }

        return this.#createToken('DIVIDE');
    }

    // Estado S18: Reconocimiento de COMENTARIOS DE LÍNEA(//)
    #S18() {
        // Consumir hasta el fin de linea
        while((this.#next_char = this.#input[this.#pos_char]) !== '\n') {
            this.#char_col++;
            this.#pos_char++;
        }
    }

    // Estado S19: Reconocimiento de COMENTARIOS DE BLOQUE(/* */)
    #S19() {

        const startLine = this.#char_line;
        const startCol = this.#char_col - 2; // -2 para incluir el /*

        while(this.#pos_char < this.#input.length) {
            this.#next_char = this.#input[this.#pos_char];

            // Posible fin de comentario: '*/'
            if (this.#next_char === '*') {
            this.#char_col++;
            this.#pos_char++;

            // Mira el siguiente carácter sin salirte del rango
            if (this.#pos_char < this.#input.length && this.#input[this.#pos_char] === '/') {
                this.#char_col++;
                this.#pos_char++;
                return; // Fin del comentario de bloque
            }

            // No era '/', seguimos dentro del comentario
            continue;
            }

            // Manejo de fin de línea
            if (this.#next_char === '\n') {
                this.#char_line++;
                this.#char_col = 1;
                this.#pos_char++;
                continue;
            }

            // Ignorar retornos de carro
            if (this.#next_char === '\r') {
                this.#pos_char++;
                continue;
            }

           
            this.#char_col++;
            this.#pos_char++;
        }
      
        this.#errors.push(new ErrorLexico(
            '/*',
            startLine,
            startCol,
            'Comentario de bloque no cerrado'
        ));
        return;
    }

    // Estado S21: Reconocimiento de ASSIGN(=) y EQUAL(==)
    #S21() {
        this.#next_char = this.#input[this.#pos_char];

        // δ(=, S21) = S22 (igualdad)
        if (this.#next_char === '=') {
            this.#addCharToBuffer(this.#next_char);
            return this.#S22();
        }

        // Estado de aceptación: ASSIGN
        return this.#createToken('ASSIGN');
    }

    // Estado S22: Aceptación de EQUAL(==)
    #S22() {
        return this.#createToken('EQUAL');
    }

    // Estado S23: Reconocimiento de NOT_EQUAL(!=) o de NOT(!)
    #S23() {
        this.#next_char = this.#input[this.#pos_char];

        // δ(=, S23) = S24 (diferente)
        if (this.#next_char === '=') {
            this.#addCharToBuffer(this.#next_char);
            return this.#S24();
        }

        // Estado de aceptación: NOT(!) solo no es valido en Java
        this.#addError('Operador "!" no válido en Java. Use "!=" para desigualdad.');
        return null;

    }

    // Estado S24: Aceptación de NOT_EQUAL(!=)
    #S24() {
        return this.#createToken('NOT_EQUAL');
    }


    #S25() {
        this.#next_char = this.#input[this.#pos_char];

        // δ(=, S25) = S26 (mayor o igual)
        if (this.#next_char === '=') {
            this.#addCharToBuffer(this.#next_char);
            return this.#S26();
        }

        // Estado de aceptación: MAYOR
        return this.#createToken('GREATER');
    }

    // Estado S26: Aceptación de GREATER_EQUAL(>=)
    #S26() {
        return this.#createToken('GREATER_EQUAL');
    }

    // Estado S27: Reconocimiento de LESS(<) y LESS_EQUAL(<=)
    #S27() {
        this.#next_char = this.#input[this.#pos_char];

        // δ(<, S27) = S28 (menor o igual)
        if (this.#next_char === '=') {
            this.#addCharToBuffer(this.#next_char);
            return this.#S28();
        }

        // Estado de aceptación: LESS
        return this.#createToken('LESS');


    }


    // Estado S28: Aceptación de LESS_EQUAL(<=)
    #S28() {
        return this.#createToken('LESS_EQUAL');
    }

    // Estado S29: Aceptación de LLAVE ABIERTA({)
    #S29() {
        return this.#createToken('LBRACE');
    }

    // Estado S30: Aceptación de LLAVE CERRADA(})
    #S30() {
        return this.#createToken('RBRACE');
    }

    // Estado S31: Aceptación de PARÉNTESIS ABIERTO(()
    #S31() {
        return this.#createToken('LPAREN');
    }

    // Estado S32: Aceptación de PARÉNTESIS CERRADO())
    #S32() {
        return this.#createToken('RPAREN');
    }

    // Estado S33: Aceptación de CORCHETE ABIERTO([)
    #S33() {
        return this.#createToken('LBRACKET');
    }

    // Estado S34: Aceptación de CORCHETE CERRADO(])
    #S34() {
        return this.#createToken('RBRACKET');
    }


    // Estado S35: Aceptación de PUNTO Y COMA(;)
    #S35() {
        return this.#createToken('SEMICOLON');
    } 

    // Estado S36: Aceptación de COMA(,)
    #S36() {
        return this.#createToken('COMMA');
    }

    // Estado S37: Aceptación de PUNTO(.)
    #S37() {
        return this.#createToken('DOT');
    }

}

module.exports = Lexer;
