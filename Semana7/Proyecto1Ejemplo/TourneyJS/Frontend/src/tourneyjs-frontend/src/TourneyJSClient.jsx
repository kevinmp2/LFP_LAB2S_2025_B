import React, { useState } from 'react';

const API_BASE_URL = 'http://localhost:3001/api';

export default function TourneyJSClient() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);
    const [activeView, setActiveView] = useState('input');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Función para analizar código
    const analyzeCode = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`${API_BASE_URL}/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: input })
            });

            const data = await response.json();

            if (data.success) {
                setResult(data.data);
                setActiveView('tokens');
            } else {
                setError(data.error || 'Error desconocido');
            }
        } catch (err) {
            setError(`Error de conexión: ${err.message}`);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const TokensTable = ({ tokens }) => (
        <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Tokens Extraídos</h3>
            {tokens.length === 0 ? (
                <p className="text-gray-500">No se encontraron tokens válidos</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2 text-left">No.</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Lexema</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Tipo</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Línea</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Columna</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tokens.map((token) => (
                                <tr key={token.no} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-2">{token.no}</td>
                                    <td className="border border-gray-300 px-4 py-2 font-mono">"{token.lexeme}"</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                            {token.type}
                                        </span>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">{token.line}</td>
                                    <td className="border border-gray-300 px-4 py-2">{token.column}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-2 text-sm text-gray-600">
                        Total de tokens: {tokens.length}
                    </div>
                </div>
            )}
        </div>
    );

    const ErrorsTable = ({ errors }) => (
        <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Errores Léxicos</h3>
            {errors.length === 0 ? (
                <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                    No se encontraron errores léxicos
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead className="bg-red-100">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2 text-left">No.</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Lexema</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Tipo</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Descripción</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Línea</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Columna</th>
                            </tr>
                        </thead>
                        <tbody>
                            {errors.map((error) => (
                                <tr key={error.no} className="bg-red-50 hover:bg-red-100">
                                    <td className="border border-gray-300 px-4 py-2">{error.no}</td>
                                    <td className="border border-gray-300 px-4 py-2 font-mono">"{error.lexeme}"</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <span className="px-2 py-1 bg-red-200 text-red-800 rounded text-sm">
                                            {error.type}
                                        </span>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">{error.description}</td>
                                    <td className="border border-gray-300 px-4 py-2">{error.line}</td>
                                    <td className="border border-gray-300 px-4 py-2">{error.column}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-2 text-sm text-red-600">
                        Total de errores: {errors.length}
                    </div>
                </div>
            )}
        </div>
    );

    const ConnectionStatus = () => (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                <span className="text-xs text-blue-600 ml-2">
                    {loading ? 'Procesando...' : 'Listo'}
                </span>
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white">
            <h1 className="text-3xl font-bold text-center mb-2">TourneyJS - Cliente Web</h1>
            <p className="text-gray-600 text-center mb-6">Interfaz React que consume API del backend</p>

            <ConnectionStatus />

            {/* Error display */}
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {/* Navegación */}
            <div className="flex flex-wrap gap-2 mb-4">
                <button 
                    onClick={() => setActiveView('input')}
                    className={`px-4 py-2 rounded ${activeView === 'input' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Entrada
                </button>
                <button 
                    onClick={() => setActiveView('tokens')}
                    className={`px-4 py-2 rounded ${activeView === 'tokens' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    disabled={!result}
                >
                    Tokens {result && `(${result.tokens?.length || 0})`}
                </button>
                <button 
                    onClick={() => setActiveView('errors')}
                    className={`px-4 py-2 rounded ${activeView === 'errors' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    disabled={!result}
                >
                    Errores {result && `(${result.errors?.length || 0})`}
                </button>
            </div>

            {/* Vista de entrada */}
            {activeView === 'input' && (
                <div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Código de entrada:</label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full h-64 p-3 border border-gray-300 rounded font-mono text-sm"
                            placeholder="Pega aquí el código que deseas analizar..."
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <button
                            onClick={analyzeCode}
                            disabled={loading || !input.trim()}
                            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded"
                        >
                            {loading ? 'Analizando...' : 'Analizar Código'}
                        </button>
                    </div>
                </div>
            )}

            {/* Vista de tokens */}
            {activeView === 'tokens' && result && (
                <div>
                    <TokensTable tokens={result.tokens || []} />
                    
                    {/* Estadísticas */}
                    {result.analysis && (
                        <div className="mt-4 p-4 bg-gray-50 rounded">
                            <h4 className="font-semibold mb-2">Estadísticas del Análisis:</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Total Tokens:</span>
                                    <span className="ml-2 font-mono">{result.analysis.totalTokens}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Total Errores:</span>
                                    <span className="ml-2 font-mono">{result.analysis.totalErrors}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Estado:</span>
                                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                                        result.analysis.hasErrors ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                        {result.analysis.hasErrors ? 'Con Errores' : 'Válido'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Vista de errores */}
            {activeView === 'errors' && result && (
                <ErrorsTable errors={result.errors || []} />
            )}

            {/* Elementos soportados */}
            <div className="mt-4 p-4 bg-blue-50 rounded">
                <h3 className="font-semibold mb-2">Elementos Soportados (Ejemplo Básico)</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h4 className="font-medium mb-1">Palabras Reservadas:</h4>
                        <ul className="space-y-1 text-gray-700">
                            <li>• TORNEO, EQUIPOS</li>
                            <li>• equipo, jugador</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium mb-1">Atributos:</h4>
                        <ul className="space-y-1 text-gray-700">
                            <li>• nombre, equipos</li>
                            <li>• posicion, numero, edad</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium mb-1">Símbolos:</h4>
                        <ul className="space-y-1 text-gray-700">
                            <li>• Llaves</li>
                            <li>• Corchetes</li>
                            <li>• Dos puntos</li>
                            <li>• Coma</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium mb-1">Tipos de Datos:</h4>
                        <ul className="space-y-1 text-gray-700">
                            <li>• Cadenas: "texto"</li>
                            <li>• Números: 0-9</li>
                            <li>• Identificadores</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-4 p-3 bg-amber-100 rounded">
                    <p className="text-sm text-amber-800">
                        <strong>Nota para Estudiantes:</strong> Este ejemplo cubre solo TORNEO y EQUIPOS. 
                        Para el proyecto completo deben implementar ELIMINACION, reportes de estadísticas, 
                        brackets, y toda la funcionalidad requerida.
                    </p>
                </div>
            </div>
        </div>
    );
}
