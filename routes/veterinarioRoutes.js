import express from "express";
import { 
    autenticar, 
    comprobarToken, 
    confirmar, 
    nuevoPassword, 
    olvidePassword, 
    perfil, 
    registrar 
} from "../controllers/veterinarioController.js";
import { checkAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Estas son rutas publicas
router.post("/", registrar);
router.get("/confirmar/:token", confirmar);
router.post("/login", autenticar);
router.post("/olvide-password", olvidePassword);
router.get("/olvide-password/:token", comprobarToken);
router.post("/olvide-password/:token", nuevoPassword);

// Rutas privadas
router.get("/perfil", checkAuth, perfil); // Primero ejecuta checkAuth

export default router;