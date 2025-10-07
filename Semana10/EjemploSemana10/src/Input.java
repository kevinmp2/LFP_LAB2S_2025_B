public class Calculadora {
    public static void main(String[] args) {
        // Declaraciones de variables
        int numero = 42;
        double pi = 3.14;
        char letra = 'A';
        String mensaje = "Hola Mundo";
        boolean activo = true;
        
        /* Este es un comentario
           de múltiples líneas */
        
        // Operaciones aritméticas
        int suma = 10 + 20;
        int resta = 50 - 30;
        int multiplicacion = 5 * 6;
        int division = 100 / 5;
        
        // Operaciones de comparación
        boolean mayor = numero > 30;
        boolean menor = numero < 50;
        boolean igual = numero == 42;
        boolean diferente = numero != 0;
        
        // Incremento y decremento
        numero++;
        numero--;
        
        // Estructuras de control
        if (numero >= 40) {
            System.out.println(mensaje);
        } else {
            System.out.println("Número menor");
        }
        
        for (int i = 0; i < 10; i++) {
            System.out.println(i);
        }
        
        while (activo) {
            System.out.println("Ciclo while");
        }
    }
}