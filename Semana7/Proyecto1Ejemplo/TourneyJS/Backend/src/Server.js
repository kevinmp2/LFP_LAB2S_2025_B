// server.js - Servidor Backend con Express
const express = require('express');
const cors = require('cors');
const LexicalAnalyzer = require('./LexicalAnalyzar');

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Ruta principal
app.get('/', (req, res) => {
    res.json({ 
        message: 'TourneyJS Backend API', 
    });
});

// Endpoint para analizar código
app.post('/api/analyze', (req, res) => {
    try {
        const { code } = req.body;
        
        if (!code) {
            return res.status(400).json({
                success: false,
                error: 'El campo "code" es requerido'
            });
        }

        // Crear instancia del analizador
        const analyzer = new LexicalAnalyzer();
        
        // Analizar el código
        const result = analyzer.analyze(code);
        
        // Generar reportes HTML
        const tokenReport = analyzer.generateTokenReport();
        const errorReport = analyzer.generateErrorReport();
        
        res.json({
            success: true,
            data: {
                tokens: result.tokens,
                errors: result.errors,
                reports: {
                    tokenReport,
                    errorReport
                },
                analysis: {
                    totalTokens: result.tokens.length,
                    totalErrors: result.errors.length,
                    hasErrors: result.errors.length > 0
                }
            }
        });

    } catch (error) {
        console.error('Error en análisis:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            details: error.message
        });
    }
});


// Manejo de errores 404
app.use('/', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint no encontrado'
    });
});

// Manejo global de errores
app.use((error, req, res, next) => {
    console.error('Error global:', error);
    res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor backend iniciado en http://localhost:${PORT}`);
    console.log(`API disponible en http://localhost:${PORT}/api`);
    console.log(`Endpoint:`);
    console.log(`   POST /api/analyze - Analizar código`);
});

module.exports = app;