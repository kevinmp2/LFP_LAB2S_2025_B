const Lexer = require("./Lexer.js");
const fs = require("fs");

const input = fs.readFileSync("Input.java", "utf-8");
const lexer = new Lexer(input);
const result = lexer.analyze();

console.log("Tokens:");
result.tokens.forEach(token => {
    console.log(token.toString());
});