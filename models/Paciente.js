import mongoose from "mongoose";

const pacienteSchema = mongoose.Schema({
    nombre: {
        type: String,
        require: true
    },
    propietario: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    fecha: {
        type: Date,
        require: true,
        default: Date.now()
    },
    sintomas: {
        type: String,
        require: true
    },
    // Vamos a hacer referencia al veterinario que pertenece
    veterinario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Veterinario" // Este es el nombre del modelo que hayamos definido
    }
}, {
    timestamps: true
});

const Paciente = mongoose.model("Paciente", pacienteSchema);
export default Paciente;