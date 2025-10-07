class LexicalError {
    constructor(char, line, column, description) {
        this.char = char;
        this.line = line;
        this.column = column;
        this.description = description;
    }

    toString() {    
        return `Lexical Error: '${this.char}' line ${this.line}, column ${this.column}. Description: ${this.description}`;
    }
}

module.exports = LexicalError;
