import express from "express";
import { 
    actualizarPaciente, 
    agregarPaciente, 
    eliminarPaciente, 
    obtenerPaciente, 
    obtenerPacientes 
} from "../controllers/pacienteController.js";
import { checkAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route("/")
    .post(checkAuth, agregarPaciente) // Protejemos la ruta para poder agregar un paciente
    .get(checkAuth, obtenerPacientes)

router.route("/:id")
    .get(checkAuth, obtenerPaciente)
    .put(checkAuth, actualizarPaciente)
    .delete(checkAuth, eliminarPaciente)

export default router;