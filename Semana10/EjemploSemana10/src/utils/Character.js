class Character {
    static isAlpha(char) {
        // Retorna true si el caracter es una letra (a-z, A-Z)
        return ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z'));
    }

    static isDigit(char) {
        // Retorna true si el caracter es un dígito (0-9)
        return (char >= '0' && char <= '9');
    }

    static isAlphanumeric(char) {
        // Retorna true si el caracter es una letra o un dígito
        return (this.isAlpha(char) || this.isDigit(char));
    }

    static isWhitespace(char) {
        // Retorna true si el caracter es un espacio en blanco (espacio, tabulación, nueva línea)
        return char === ' ' || char === '\t' || char === '\n' || char === '\r';
    }
}

module.exports = Character;

