const express = require('express');
const { Ollama } = require('ollama');

const app = express();
const ollama = new Ollama();

app.use(express.json());

// --- BASE DE DATOS CON TODOS LOS ESTUDIANTES LISTOS ---
let cursos = [
    { 
        id: 1, 
        nombre: "Desarrollo Web con Node.js", 
        descripcionIA: "Aprende a crear servidores escalables y APIs profesionales utilizando el entorno de ejecución JavaScript.",
        participantes: [
            { id: 1, nombre: "Roberto Pimentel", estado: "activo" },
            { id: 2, nombre: "María García", estado: "activo" }
        ] 
    },
    { 
        id: 2, 
        nombre: "Ciberseguridad Básica", 
        descripcionIA: "Protege sistemas y redes contra ataques digitales y aprende fundamentos de criptografía.",
        participantes: [
            { id: 1, nombre: "Carlos Rodriguez", estado: "activo" },
            { id: 2, nombre: "Lic. Ana Martínez", estado: "activo" }
        ] 
    },
    { 
        id: 3, 
        nombre: "Excel Avanzado para Negocios", 
        descripcionIA: "Domina tablas dinámicas, macros y análisis de datos para optimizar procesos empresariales.",
        participantes: [
            { id: 1, nombre: "Carmen Luz", estado: "graduado" }
        ] 
    },
    { 
        id: 4, 
        nombre: "Manejo de Agentes de IA", 
        descripcionIA: "Curso especializado en la creación y despliegue de agentes autónomos inteligentes con modelos locales.",
        participantes: [
            { id: 1, nombre: "Ingeniero Roberto Pimentel", estado: "activo" },
            { id: 2, nombre: "Sra. Carmen Luz", estado: "activo" }
        ] 
    }
];

// --- RUTA VER TODO (GET) ---
app.get('/curso', (req, res) => {
    res.json(cursos);
});

// --- RUTA CREAR CON IA (POST) ---
app.post('/curso', async (req, res) => {
    const { nombre } = req.body;
    try {
        const respuesta = await ollama.chat({
            model: 'llama3.2:1b',
            messages: [{ role: 'user', content: `Responde en una frase corta: ¿Qué se aprende en un curso de ${nombre}?` }],
        });

        const nuevoCurso = {
            id: cursos.length + 1,
            nombre: nombre,
            descripcionIA: respuesta.message.content.trim(),
            participantes: []
        };
        cursos.push(nuevoCurso);
        res.status(201).json(nuevoCurso);
    } catch (error) {
        res.status(500).json({ error: "La IA no pudo procesar la solicitud." });
    }
});

// --- RUTA INSCRIBIR (POST) ---
app.post('/curso/:id/participantes', (req, res) => {
    const cursoId = parseInt(req.params.id);
    const curso = cursos.find(c => c.id === cursoId);

    if (!curso) return res.status(404).json({ error: "Curso no encontrado" });

    const nuevoParticipante = {
        id: curso.participantes.length + 1,
        nombre: req.body.nombre,
        estado: "activo"
    };
    curso.participantes.push(nuevoParticipante);
    res.status(201).json({ 
        mensaje: "¡Inscripción exitosa!", 
        curso: curso.nombre, 
        estudiante: nuevoParticipante.nombre 
    });
});

app.listen(3000, () => {
    console.log("--------------------------------------------------");
    console.log("✅ TAREA INFOTEP LISTA - DATOS CARGADOS");
    console.log("--------------------------------------------------");
});