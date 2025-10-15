const SyntaxError = require('./models/SyntaxError');


class Parser{
    #tokens;
    #position;
    #currentToken;
    #errors;

    constructor(tokens){
        this.#tokens = tokens;
        this.#position = 0;
        this.#currentToken = null;
        this.#errors = [];
    };

    parse(){
        this.#PROGRAM();


        // Verificar si hay tokens restantes después de analizar el programa
        if(!this.#match('EOF')){
            this.#errors.push(new SyntaxError(this.#currentToken?.value || 'EOF', this.#currentToken?.line || 0, this.#currentToken?.column || 0, `Se esperaba un fin de archivo`));
        };

        return {
            success: this.#errors.length === 0,
            errors: this.#errors
        };
    };

    // * <PROGRAM> ::= <CLASS_DECLARATION>
    #PROGRAM(){
        this.#CLASS_DECLARATION();
    };

    // * <CLASS_DECLARATION> ::= 'public' 'class' IDENTIFIER '{' <MAIN_METHOD> '}'
    #CLASS_DECLARATION(){
        // Consumir 'public'
        if(!this.#match('KEYWORD') || this.#look_ahead().value !== 'public'){
            this.#errors.push(new SyntaxError(
                this.#currentToken?.value || 'EOF',
                this.#currentToken?.line || 0,
                this.#currentToken?.column || 0,
                `Se esperaba la palabra reservada 'public' al inicio de la clase`
            ));
            return; // Detener análisis, no se puede recuperar
        }
        this.#advance(); // Consumir 'public'
        
        // Consumir 'class'
        if(!this.#match('KEYWORD') || this.#look_ahead().value !== 'class'){
            this.#errors.push(new SyntaxError(
                this.#currentToken?.value || 'EOF',
                this.#currentToken?.line || 0,
                this.#currentToken?.column || 0,
                `Se esperaba la palabra reservada 'class' después de 'public', pero se encontró '${this.#currentToken?.value || 'EOF'}'`
            ));
            // NO hacer return - continuar con el análisis
        } else {
            this.#advance(); // Consumir 'class'
        }
        
        // Consumir nombre de clase (IDENTIFIER)
        if(!this.#match('IDENTIFIER')){
            this.#errors.push(new SyntaxError(
                this.#currentToken?.value || 'EOF',
                this.#currentToken?.line || 0,
                this.#currentToken?.column || 0,
                `Se esperaba el nombre de la clase después de 'class', pero se encontró '${this.#currentToken?.value || 'EOF'}'`
            ));
            // NO hacer return - continuar
        } else {
            this.#advance(); // Consumir nombre de clase
        }
        
        this.#consume('LBRACE'); // '{'
        this.#MAIN_METHOD();
        this.#consume('RBRACE'); // '}'
    }


    // * <MAIN_METHOD> ::= 'public' 'static' 'void' 'main' '(' 'String' '[' ']' 'args' ')' <BLOCK>

    #MAIN_METHOD(){
        // Consumir 'public'
        if(!this.#match('KEYWORD') || this.#look_ahead().value !== 'public'){
            this.#errors.push(new SyntaxError(
                this.#currentToken?.value || 'EOF',
                this.#currentToken?.line || 0,
                this.#currentToken?.column || 0,
                `El método main debe comenzar con 'public'`
            ));
            // NO hacer return - continuar
        } else {
            this.#advance(); // 'public'
        }
        
        // Consumir 'static'
        if(!this.#match('KEYWORD') || this.#look_ahead().value !== 'static'){
            this.#errors.push(new SyntaxError(
                this.#currentToken?.value || 'EOF',
                this.#currentToken?.line || 0,
                this.#currentToken?.column || 0,
                `Se esperaba 'static' después de 'public' en el método main, pero se encontró '${this.#currentToken?.value || 'EOF'}'`
            ));
            // NO hacer return - continuar
        } else {
            this.#advance(); // 'static'
        }
        
        // Consumir 'void'
        if(!this.#match('KEYWORD') || this.#look_ahead().value !== 'void'){
            this.#errors.push(new SyntaxError(
                this.#currentToken?.value || 'EOF',
                this.#currentToken?.line || 0,
                this.#currentToken?.column || 0,
                `Se esperaba 'void' después de 'static' en el método main, pero se encontró '${this.#currentToken?.value || 'EOF'}'`
            ));
            // NO hacer return - continuar
        } else {
            this.#advance(); // 'void'
        }
        
        // Consumir 'main'
        if(!this.#match('KEYWORD') || this.#look_ahead().value !== 'main'){
            this.#errors.push(new SyntaxError(
                this.#currentToken?.value || 'EOF',
                this.#currentToken?.line || 0,
                this.#currentToken?.column || 0,
                `Se esperaba 'main' como nombre del método, pero se encontró '${this.#currentToken?.value || 'EOF'}'`
            ));
            // NO hacer return - continuar
        } else {
            this.#advance(); // 'main'
        }
        
        // Resto de la firma del método
        this.#consume('LPAREN'); // '('
        this.#consume('KEYWORD'); // 'String'
        this.#consume('LBRACKET'); // '['
        this.#consume('RBRACKET'); // ']'
        this.#consume('KEYWORD'); // 'args'
        this.#consume('RPAREN'); // ')'
        this.#consume('LBRACE'); // '{'
        this.#STATEMENTS();
        this.#consume('RBRACE'); // '}'
    }



    // * <BLOCK> ::= '{' <STATEMENTS> '}'
    // * <STATEMENTS> ::= <STATEMENT> <STATEMENTS> | ε
    #BLOCK() {
        this.#consume('LBRACE'); // {

        // Procesar todas las sentencias hasta encontrar }
        while (!this.#match('RBRACE') && !this.#match('EOF')) {
            this.#STATEMENT();
        }

        this.#consume('RBRACE'); // }
    }

    #STATEMENTS(){

        while(this.#currentToken && this.#currentToken.type !== 'RBRACE'){
            this.#STATEMENT();
        }
    };

    #STATEMENT(){
        if(this.#match('KEYWORD')) {
            const keyword = this.#look_ahead();

            // Declaracion de variable
            if(keyword.value === 'int' || keyword.value === 'String' || 
            keyword.value === 'boolean' || keyword.value === 'double' || 
            keyword.value === 'char'){
                this.#DECLARATION();
            }
            // Sentencia if
            else if(keyword.value === 'if'){
                this.#IF_STATEMENT();
            }
            // Sentencia for
            else if(keyword.value === 'for'){
                this.#FOR_STATEMENT();
            }
            // Sentencia while
            else if(keyword.value === 'while'){
                this.#WHILE_STATEMENT();
            }
            // System.out.println
            else if(keyword.value === 'System'){
                this.#PRINT_STATEMENT();
            }
            else {
                this.#errors.push(new SyntaxError(
                    keyword.value, 
                    keyword.line || 0, 
                    keyword.column || 0, 
                    `Palabra reservada inesperada: '${keyword.value}'`
                ));
                this.#advance();
            }
        }
        // Asignacion o incremento/decremento O posible error de tipo
        else if(this.#match('IDENTIFIER')){
            const identifier = this.#look_ahead();
            
            // 🔍 DETECTAR SI PARECE UNA DECLARACIÓN INCORRECTA
            // Si después del identificador viene otro identificador, probablemente
            // el usuario intentó declarar una variable con un tipo inválido
            // Ejemplo: doubleee pi = 3.14
            //          ^^^^^^^^ tipo inválido
            //                  ^^ variable
            
            const nextToken = this.#peekNext(); // Mirar el token después del identificador actual
            
            if(nextToken && nextToken.type === 'IDENTIFIER'){
                // Caso: IDENTIFIER IDENTIFIER ... (probablemente: tipo_inválido nombre_variable ...)
                this.#errors.push(new SyntaxError(
                    identifier.value,
                    identifier.line || 0,
                    identifier.column || 0,
                    `'${identifier.value}' no es un tipo de dato válido. Tipos válidos: int, double, char, String, boolean`
                ));
                
                // Intentar recuperarse: consumir ambos identificadores y buscar ';'
                this.#advance(); // Consumir el tipo inválido
                this.#advance(); // Consumir el nombre de variable
                
                // Consumir el resto de la línea hasta el ';'
                while(!this.#match('SEMICOLON') && !this.#match('EOF') && !this.#match('RBRACE')){
                    this.#advance();
                }
                if(this.#match('SEMICOLON')){
                    this.#advance();
                }
                return;
            }
            
            // Si no es el caso anterior, es una asignación/incremento normal
            this.#ASSIGNMENT_OR_INCREMENT();
        }
        else {
            this.#errors.push(new SyntaxError(
                this.#currentToken?.value || 'EOF', 
                this.#currentToken?.line || 0, 
                this.#currentToken?.column || 0, 
                `Sentencia inesperada: '${this.#currentToken?.value || 'EOF'}'`
            ));
            this.#advance();
        }
    }

    #peekNext() {
    if (this.#position + 1 < this.#tokens.length) {
        return this.#tokens[this.#position + 1];
    }
    return null;
    }


    // * <DECLARATION> ::= <TYPE> IDENTIFIER ('=' <EXPRESSION>)? ';'
    // * <TYPE> ::= 'int' | 'String' | 'boolean' | 'double' | 'char'

    #DECLARATION(){
        const typeToken = this.#currentToken;
        this.#consume('KEYWORD'); // Tipo de dato
        
        const varToken = this.#currentToken;
        this.#consume('IDENTIFIER'); // Nombre de variable

        let lastToken = varToken; // Guardar el último token válido
        
        // Verfica si hay una asignacion
        if(this.#match('ASSIGN')){ // '='
            this.#consume('ASSIGN'); // '='
            
            // Guardar el token antes de la expresión
            const beforeExpr = this.#currentToken;
            this.#EXPRESSION();
            
            // Actualizar lastToken con el último token de la expresión
            // Buscar hacia atrás el último token consumido
            if (this.#position > 0) {
                lastToken = this.#tokens[this.#position - 1];
            }
        }

        // Verificar punto y coma con mensaje de error mejorado
        if(!this.#match('SEMICOLON')){
            // Usar la posición DESPUÉS del último token válido
            const errorLine = lastToken?.line || 0;
            const errorColumn = (lastToken?.column || 0) + (lastToken?.value?.length || 0);
            
            this.#errors.push(new SyntaxError(
                ';', // El token que falta
                errorLine,
                errorColumn,
                `Falta punto y coma (;) al final de la declaración de la variable '${varToken?.value || ''}'`
            ));
            // NO avanzar tokens aquí, dejar que el siguiente análisis maneje el token actual
            // Esto permite que 'doubleeesss' sea reportado como un error separado
        } else {
            this.#consume('SEMICOLON'); // ';'
        }
    }

    // * <ASSIGNMENT_OR_INCREMENT> ::= IDENTIFIER '=' <EXPRESSION> ';' | IDENTIFIER '++' ';' | IDENTIFIER '--' ';'
    #ASSIGNMENT_OR_INCREMENT() {
        this.#consume('IDENTIFIER'); // nombre de variable

        // Verificar qué viene después
        if (this.#match('ASSIGN')) {
            this.#consume('ASSIGN'); // =
            this.#EXPRESSION();
            this.#consume('SEMICOLON'); // ;
        }
        else if (this.#match('INCREMENT')) {
            this.#consume('INCREMENT'); // ++
            this.#consume('SEMICOLON'); // ;
        }
        else if (this.#match('DECREMENT')) {
            this.#consume('DECREMENT'); // --
            this.#consume('SEMICOLON'); // ;
        }
        else {
            this.#errors.push(new SyntaxError(
                this.#currentToken?.value || 'EOF',
                this.#currentToken?.line || 0,
                this.#currentToken?.column || 0,
                "Se esperaba '=', '++' o '--'"
            ));
        }
    }

    // * <PRINT_STATEMENT> ::= 'System' '.' 'out' '.' 'println' '(' <EXPRESSION> ')' ';'
    #PRINT_STATEMENT() {
        this.#consume('KEYWORD'); // 'System'
        this.#consume('DOT'); // '.'
        this.#consume('KEYWORD'); // 'out'
        this.#consume('DOT'); // '.'
        this.#consume('KEYWORD'); // 'println'
        this.#consume('LPAREN'); // '('
        this.#EXPRESSION();
        this.#consume('RPAREN'); // ')'
        this.#consume('SEMICOLON'); // ';'
    }

    // * <IF_STATEMENT> ::= 'if' '(' <EXPRESSION> ')' <BLOCK> ('else' <BLOCK>)?
    #IF_STATEMENT() {
        this.#consume('KEYWORD'); // if
        this.#consume('LPAREN'); // (
        this.#EXPRESSION();
        this.#consume('RPAREN'); // )
        this.#BLOCK();

        // Verificar else opcional
        if (this.#match('KEYWORD') && this.#look_ahead().value === 'else') {
            this.#consume('KEYWORD'); // else
            this.#BLOCK();
        }
    }

    // * <FOR_STATEMENT> ::= 'for' '(' <FOR_INIT> ';' <EXPRESSION> ';' <FOR_UPDATE> ')' <BLOCK>
    #FOR_STATEMENT() {
        this.#consume('KEYWORD'); // for
        this.#consume('LPAREN'); // (
        
        // Inicialización (puede ser declaración o asignación)
        this.#FOR_INIT();
        this.#consume('SEMICOLON'); // ;
        
        // Condición
        this.#EXPRESSION();
        this.#consume('SEMICOLON'); // ;
        
        // Actualización
        this.#FOR_UPDATE();
        this.#consume('RPAREN'); // )
        
        // Cuerpo del for
        this.#BLOCK();
    }

    // * <FOR_INIT> ::= <TYPE> IDENTIFIER '=' <EXPRESSION> | IDENTIFIER '=' <EXPRESSION> | ε
    #FOR_INIT() {
        if (this.#match('SEMICOLON')) {
            return; // Inicialización vacía
        }

        // Declaración: int i = 0
        if (this.#match('KEYWORD')) {
            const keyword = this.#look_ahead().value;
            if (
                keyword === 'int' ||
                keyword === 'double' ||
                keyword === 'char' ||
                keyword === 'String' ||
                keyword === 'boolean'
            ) {
                this.#consume('KEYWORD'); // tipo
                this.#consume('IDENTIFIER'); // nombre
                this.#consume('ASSIGN'); // =
                this.#EXPRESSION();
                return;
            }
        }

        // Asignación: i = 0
        if (this.#match('IDENTIFIER')) {
            this.#consume('IDENTIFIER'); // nombre
            this.#consume('ASSIGN'); // =
            this.#EXPRESSION();
        }
    }

    //  * <FOR_UPDATE> ::= IDENTIFIER '++' | IDENTIFIER '--' | IDENTIFIER '=' <EXPRESSION>
    #FOR_UPDATE() {
        if (this.#match('RPAREN')) {
            return; // Actualización vacía
        }

        this.#consume('IDENTIFIER'); // nombre de variable

        if (this.#match('INCREMENT')) {
            this.#consume('INCREMENT'); // ++
        }
        else if (this.#match('DECREMENT')) {
            this.#consume('DECREMENT'); // --
        }
        else if (this.#match('ASSIGN')) {
            this.#consume('ASSIGN'); // =
            this.#EXPRESSION();
        }
    }

    // * <WHILE_STATEMENT> ::= 'while' '(' <EXPRESSION> ')' <BLOCK>
    #WHILE_STATEMENT() {
        this.#consume('KEYWORD'); // while
        this.#consume('LPAREN'); // (
        this.#EXPRESSION();
        this.#consume('RPAREN'); // )
        this.#BLOCK();
    }

    // * <EXPRESSION> ::= <COMPARISON>
    #EXPRESSION() {
        this.#COMPARISON();
    }

    // * <COMPARISON> ::= <ADDITION> ( ('==' | '!=' | '<' | '>' | '<=' | '>=') <ADDITION> )*
    #COMPARISON() {
        this.#ADDITION();

        while (this.#match('EQUAL', 'NOT_EQUAL', 'GREATER', 'LESS', 'GREATER_EQUAL', 'LESS_EQUAL')) {
            this.#consume('EQUAL', 'NOT_EQUAL', 'GREATER', 'LESS', 'GREATER_EQUAL', 'LESS_EQUAL');
            this.#ADDITION();
        }
    }

    // * <ADDITION> ::= <MULTIPLICATION> (('+' | '-') <MULTIPLICATION>)*
    #ADDITION() {
        this.#MULTIPLICATION();

        while (this.#match('PLUS', 'MINUS')) {
            this.#consume('PLUS', 'MINUS');
            this.#MULTIPLICATION();
        }
    }

    // * <MULTIPLICATION> ::= <UNARY> (('*' | '/') <UNARY>)*
    #MULTIPLICATION() {
        this.#PRIMARY();

        while (this.#match('MULTIPLY', 'DIVIDE')) {
            this.#consume('MULTIPLY', 'DIVIDE');
            this.#PRIMARY();
        }
    }

    // * <PRIMARY> ::= INTEGER | DECIMAL | STRING | CHAR | BOOLEAN | IDENTIFIER | '(' <EXPRESSION> ')'
    // * <BOOLEAN> ::= 'true' | 'false'

    #PRIMARY() {
        // Literales
        if (this.#match('INTEGER', 'DECIMAL', 'STRING', 'CHAR')) {
            this.#consume('INTEGER', 'DECIMAL', 'STRING', 'CHAR');
            return;
        }

        // Booleanos
        if (this.#match('KEYWORD')) {
            const keyword = this.#look_ahead().value;
            if (keyword === 'true' || keyword === 'false') {
                this.#consume('KEYWORD');
                return;
            }
        }

        // Identificador (variable)
        if (this.#match('IDENTIFIER')) {
            this.#consume('IDENTIFIER');
            return;
        }

        // Expresión entre paréntesis
        if (this.#match('LPAREN')) {
            this.#consume('LPAREN'); // (
            this.#EXPRESSION();
            this.#consume('RPAREN'); // )
            return;
        }

        // Error: token inesperado en expresión
        this.#errors.push(new SyntaxError(
            this.#currentToken?.value || 'EOF',
            this.#currentToken?.line || 0,
            this.#currentToken?.column || 0,
            `Token inesperado en expresión: ${this.#currentToken?.value || 'EOF'}`
        ));

        
    }

    // Consume el token actual si coincide con uno de los tipos esperados
    #consume(...types) {
        if (this.#match(...types)) {
            const token = this.#currentToken;
            this.#advance();
            return token;
        }

        // Reportar el error con el token actual
        this.#errors.push(new SyntaxError(
            this.#currentToken ? this.#currentToken.value : 'EOF',
            this.#currentToken?.line ?? 0,
            this.#currentToken?.column ?? 0,
            `Se esperaba una palabra clave o símbolo: ${types.join(' o ')} pero se encontró ${this.#currentToken ? this.#currentToken.value : 'EOF'}`
        ));
        
        // Modo pánico: avanzar al siguiente token para intentar recuperarse
        // Esto evita que se quede atascado en el mismo error
        this.#advance();
        
        return null;
    }

    // Verifica si el siguiente token coincide con alguno de los  tipos(lookahead)
    #match(...types) {
        const nextToken = this.#look_ahead();
        if (!nextToken) return false;
        
        for (let i = 0; i < types.length; i++) {
            const expectedType = types[i];
            
            // Si se busca KEYWORD, verificar si es cualquier tipo de palabra clave del lexer
            if (expectedType === 'KEYWORD') {
                if (nextToken.type.startsWith('KW_')) {
                    return true;
                }
            } 
            // Para otros tipos, verificar exactamente
            else if (nextToken.type === expectedType) {
                return true;
            }
        }
        return false;
    }

    // Obtiene el siguiente token sin consumirlo (lookahead)
    #look_ahead() {
        if (this.#position < this.#tokens.length) {
            this.#currentToken = this.#tokens[this.#position];
            return this.#currentToken;
        }
        this.#currentToken = { type: 'EOF', value: 'EOF', line: 0, column: 0 };
        return this.#currentToken;
    }

    
    // Avanza al siguiente token
    #advance() {
        this.#position++;
        if (this.#position < this.#tokens.length) {
            this.#currentToken = this.#tokens[this.#position];
        } else {
            this.#currentToken = { type: 'EOF', value: 'EOF', line: 0, column: 0 };
        }
    }

};

module.exports = Parser;













