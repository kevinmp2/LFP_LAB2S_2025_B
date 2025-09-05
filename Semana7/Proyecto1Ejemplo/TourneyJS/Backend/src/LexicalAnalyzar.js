// lexicalAnalyzer.js - Módulo del Analizador Léxico Simplificado
class LexicalAnalyzer {
    constructor() {
        this.tokens = [];
        this.errors = [];
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.input = '';
        
        // Palabras reservadas
        this.keywords = {
            'TORNEO': 'PALABRA_RESERVADA',
            'EQUIPOS': 'PALABRA_RESERVADA',
            'nombre': 'ATRIBUTO',
            'equipos': 'ATRIBUTO',
            'equipo': 'PALABRA_RESERVADA',
            'jugador': 'PALABRA_RESERVADA',
            'posicion': 'ATRIBUTO',
            'numero': 'ATRIBUTO',
            'edad': 'ATRIBUTO'
        };
    }

    analyze(input) {
        this.input = input;
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.tokens = [];
        this.errors = [];
        
        while (this.position < this.input.length) {
            this.processCharacter();
        }
        
        return {
            tokens: this.tokens,
            errors: this.errors
        };
    }

    processCharacter() {
        const char = this.input[this.position];
        
        if (this.isWhitespace(char)) {
            this.skipWhitespace();
        } else if (char === '{') {
            this.addToken('{', 'LLAVE_IZQUIERDA');
            this.advance();
        } else if (char === '}') {
            this.addToken('}', 'LLAVE_DERECHA');
            this.advance();
        } else if (char === '[') {
            this.addToken('[', 'CORCHETE_IZQUIERDO');
            this.advance();
        } else if (char === ']') {
            this.addToken(']', 'CORCHETE_DERECHO');
            this.advance();
        } else if (char === ':') {
            this.addToken(':', 'DOS_PUNTOS');
            this.advance();
        } else if (char === ',') {
            this.addToken(',', 'COMA');
            this.advance();
        } else if (char === '"') {
            this.readString();
        } else if (this.isLetter(char)) {
            this.readWord();
        } else if (this.isDigit(char)) {
            this.readNumber();
        } else {
            this.addError(char, 'TOKEN_INVALIDO', 'Carácter no reconocido');
            this.advance();
        }
    }

    readWord() {
        const start = this.position;
        const startColumn = this.column;
        
        while (this.position < this.input.length && 
               (this.isLetter(this.input[this.position]) || 
                this.isDigit(this.input[this.position]) || 
                this.input[this.position] === '_')) {
            this.advance();
        }
        
        const lexeme = this.input.substring(start, this.position);
        const tokenType = this.keywords[lexeme] || 'IDENTIFICADOR';
        this.addTokenWithPosition(lexeme, tokenType, startColumn);
    }

    readString() {
        const startColumn = this.column;
        this.advance(); // Saltar la comilla inicial
        const start = this.position;
        
        while (this.position < this.input.length && 
               this.input[this.position] !== '"' && 
               this.input[this.position] !== '\n') {
            this.advance();
        }
        
        if (this.position >= this.input.length || this.input[this.position] === '\n') {
            const lexeme = this.input.substring(start, this.position);
            this.addError(lexeme, 'CADENA_SIN_CERRAR', 'Comillas de cierre faltantes');
        } else {
            const lexeme = this.input.substring(start, this.position);
            this.addTokenWithPosition(lexeme, 'CADENA', startColumn);
            this.advance(); // Saltar la comilla final
        }
    }

    readNumber() {
        const start = this.position;
        const startColumn = this.column;
        
        while (this.position < this.input.length && this.isDigit(this.input[this.position])) {
            this.advance();
        }
        
        const lexeme = this.input.substring(start, this.position);
        this.addTokenWithPosition(lexeme, 'NUMERO', startColumn);
    }

    addToken(lexeme, type) {
        this.tokens.push({
            no: this.tokens.length + 1,
            lexeme: lexeme,
            type: type,
            line: this.line,
            column: this.column - lexeme.length
        });
    }

    addTokenWithPosition(lexeme, type, startColumn) {
        this.tokens.push({
            no: this.tokens.length + 1,
            lexeme: lexeme,
            type: type,
            line: this.line,
            column: startColumn
        });
    }

    addError(lexeme, type, description) {
        this.errors.push({
            no: this.errors.length + 1,
            lexeme: lexeme,
            type: type,
            description: description,
            line: this.line,
            column: this.column
        });
    }

    advance() {
        if (this.input[this.position] === '\n') {
            this.line++;
            this.column = 1;
        } else {
            this.column++;
        }
        this.position++;
    }

    skipWhitespace() {
        while (this.position < this.input.length && this.isWhitespace(this.input[this.position])) {
            this.advance();
        }
    }

    isWhitespace(char) {
        return /\s/.test(char);
    }

    isLetter(char) {
        return /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(char);
    }

    isDigit(char) {
        return /[0-9]/.test(char);
    }

    // Generar reporte HTML de tokens
    generateTokenReport() {
        if (this.tokens.length === 0) {
            return '<div class="alert alert-info">No se encontraron tokens válidos</div>';
        }

        let html = `
        <div class="report-container">
            <h3 class="report-title">Tabla de Tokens Extraídos</h3>
            <div class="table-responsive">
                <table class="tokens-table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Lexema</th>
                            <th>Tipo</th>
                            <th>Línea</th>
                            <th>Columna</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        this.tokens.forEach(token => {
            html += `
                <tr>
                    <td>${token.no}</td>
                    <td class="lexeme">"${token.lexeme}"</td>
                    <td class="token-type">${token.type}</td>
                    <td>${token.line}</td>
                    <td>${token.column}</td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
            <div class="summary">
                <p><strong>Total de tokens:</strong> ${this.tokens.length}</p>
            </div>
        </div>
        `;

        return html;
    }

    // Generar reporte HTML de errores
    generateErrorReport() {
        if (this.errors.length === 0) {
            return '<div class="alert alert-success">✓ No se encontraron errores léxicos</div>';
        }

        let html = `
        <div class="report-container">
            <h3 class="report-title">Tabla de Errores Léxicos</h3>
            <div class="table-responsive">
                <table class="errors-table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Lexema</th>
                            <th>Tipo de Error</th>
                            <th>Descripción</th>
                            <th>Línea</th>
                            <th>Columna</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        this.errors.forEach(error => {
            html += `
                <tr class="error-row">
                    <td>${error.no}</td>
                    <td class="lexeme">"${error.lexeme}"</td>
                    <td class="error-type">${error.type}</td>
                    <td class="error-description">${error.description}</td>
                    <td>${error.line}</td>
                    <td>${error.column}</td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
            <div class="summary error-summary">
                <p><strong>Total de errores:</strong> ${this.errors.length}</p>
            </div>
        </div>
        `;

        return html;
    }
}

module.exports = LexicalAnalyzer;