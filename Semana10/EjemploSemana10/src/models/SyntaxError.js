class SyntaxError {
    constructor(token, line, column, description) {
        this.token = token;
        this.line = line;
        this.column = column;
        this.description = description;
    }

    toString() {    
        return `Syntax Error: '${this.token}' line ${this.line}, column ${this.column}. Description: ${this.description}`;
    }


}


module.exports = SyntaxError;