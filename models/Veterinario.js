import mongoose from "mongoose";
import { generarId } from "../helpers/generarId.js";
import bcrypt from "bcrypt"

const veterniarioSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarId()
    },
    confirmado: {
        type: Boolean,
        default: false
    }
});

// Antes de almacenar el registro, vamos a hachear la contase;a
veterniarioSchema.pre("save", async function(next) {
    // Para que un password que ya esta hacheado no lo vuelva a hacer
    if(!this.isModified("password")) next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

veterniarioSchema.methods.comprobarPassword = async function(
    passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password);
}

const Veterinario = mongoose.model("Veterinario", veterniarioSchema);
export default Veterinario;