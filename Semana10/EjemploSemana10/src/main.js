const Lexer = require("./Lexer.js");
const Parser = require("./Parser.js");
const fs = require("fs");

const input = fs.readFileSync("Input.java", "utf-8");
const lexer = new Lexer(input);
const result = lexer.analyze();

console.log("Tokens:");
result.tokens.forEach(token => {
    console.log(token.toString());
});

// Análisis Sintáctico
const parser = new Parser(result.tokens);
const parseResult = parser.parse();

console.log("\nErrores de Análisis Sintáctico:");
parseResult.errors.forEach(err => {
    console.error(err.toString());
});
console.log("\nAnálisis Sintáctico completado.");
if (parseResult.errors.length === 0) {
    console.log("El análisis sintáctico no encontró errores.");
}
else {
    console.log(`El análisis sintáctico encontró ${parseResult.errors.length} error(es).`);
}