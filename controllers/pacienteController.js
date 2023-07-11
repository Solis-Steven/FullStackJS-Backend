import Paciente from "../models/Paciente.js"

export const agregarPaciente = async(req, res) => {
    const paciente = new Paciente( req.body );
    paciente.veterinario = req.veterinario._id; // Id del veterinario actual, com oprimero estamos usando authMiddleware para verificar, en req.veterinario encontramos la informacion del veterniario actual
    
    try {
        const pacienteAlmacenado = await paciente.save();
        res.json( pacienteAlmacenado );
    } catch (error) {
        
    }
}

export const obtenerPacientes = async(req, res) => {
    // veterinario es el nombre de la columna que queremos filtrar
    const pacientes = await Paciente.find().where("veterinario").equals(req.veterinario);

    res.json(pacientes);
}

export const obtenerPaciente = async(req, res) => {
    const { id } = req.params.id;
    const paciente = await Paciente.findById( id );

    if(!paciente) {
        return res.status(404).json({ msg: "No encontrado" }) 
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({ msg: "Accion no valida" })
    }

    res.json(paciente)
}

export const actualizarPaciente = async(req, res) => {

    const paciente = await Paciente.findById( req.params.id );
    if(!paciente) {
        return res.status(404).json({ msg: "Paciente no encontrado" })
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({ msg: "Accion no valida" })
    }

    // Actualizar paciente
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;
    
    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);
    } catch (error) {
        console.log(error);
    }
     
}

export const eliminarPaciente = async(req, res) => {
    const paciente = await Paciente.findById( req.params.id );
    if(!paciente) {
        return res.status(404).json({ msg: "Paciente no encontrado" })
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({ msg: "Accion no valida" })
    }

    // Eliminar paciente
    try {
        await paciente.deleteOne();
        res.json({ msg: "Paciente eliminado" })
    } catch (error) {
        console.log(error);
    }
}