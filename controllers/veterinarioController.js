import { emailOlvidePassword } from "../helpers/emailOlvidePassword.js";
import { emailRegistro } from "../helpers/emailRegistro.js";
import { generarId } from "../helpers/generarId.js";
import { generarJWT } from "../helpers/generarJWT.js";
import Veterinario from "../models/Veterinario.js";

export const registrar = async(req, res) => {
    const { email, name } = req.body;

    // Prevenir usuarios duplicados
    const exiteUsuario = await Veterinario.findOne({ email });

    if( exiteUsuario ) {
        const error = new Error("Usuario ya registrado");
        return( res.status(400).json({ msg: error.message }) );
    }

    try {
        // Guardar un nuevo veterinario
        const veterinario = new Veterinario( req.body );
        const veterinarioGuardado = await veterinario.save();

        // Enviar el email
        emailRegistro({
            email,
            name,
            token: veterinarioGuardado.token
        });
        
        res.json( veterinarioGuardado )
    } catch (error) {
        console.log("Error: ", error);
    }

}

export const perfil = (req, res) => {

    const { veterinario } = req;

    res.json( veterinario )
}

export const confirmar = async(req, res) => {
    const { token } = req.params;

    const usuarioConfirmar = await Veterinario.findOne({ token });

    if( !usuarioConfirmar ) {
        const error = new Error("Token no valido");
        return( res.status(404).json({ msg: error.message }) );
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();
        res.json({ msg: "Usuario confirmado correctamente" })
    } catch (error) {
        console.log( error );
    }

}

export const autenticar = async(req, res) => {
    const { email, password } = req.body;

    // Comprobar si el usuario existe
    const usuario = await Veterinario.findOne({ email });

    if( !usuario ) {
        const error = new Error("El usuario no existe");
        return( res.status(404).json({ msg: error.message }) );
    }

    // Comprobar si el usuario esta confirmado
    if( !usuario.confirmado ) {
        const error = new Error("Tu cuenta no ha sido confirmada");
        return( res.status(401).json({ msg: error.message }) );
    }

    // Revisar el password
    if( await usuario.comprobarPassword( password ) ) {
        // Autenticar
       
        res.json({
            _id: usuario._id,
            name : usuario.name,
            email: usuario.email,
            token: generarJWT(usuario.id)
        });
    } else {
        const error = new Error("El password es incorrecto");
        return( res.status(401).json({ msg: error.message }) );
    }

}

export const olvidePassword = async(req, res) => {
    const { email } = req.body;

    const existeVeterinario = await Veterinario.findOne({ email });

    if( !existeVeterinario ) {
        const error = new Error("El usuario no existe");
        return res.status(400).json({ msg: error.message });
    }

    // En caso de que el usuario exista, se genera un token,
    // se le envia por email, abre el enlace y se busca el token
    // en la base de datos

    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();

        // Enviar email con instrucciones
        emailOlvidePassword({
            email,
            name: existeVeterinario.name,
            token: existeVeterinario.token
        })
        res.json({ msg: "Hemos enviado un email con las instrucciones" });
    } catch (error) {
        
    }
}

export const comprobarToken = async(req, res) => {
    const { token } = req.params;

    const tokenValido = await Veterinario.findOne({ token });

    if(tokenValido) {
        // El token es valido el usuario existe
        res.json({ msg:  "Token valido y el usuario existe" })

    } else {
        const error = new Error("Token no valido");
        return res.status(400).json({ msg: error.message });
    }
}

export const nuevoPassword = async(req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({ token });
    if(!veterinario) {
        const error = new Error("Hubo un error");
        return res.status(400).json({ msg: error.message });
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({ msg:  "Password restablecido correctamente" })
    } catch (error) {
        console.log(error);
    }
}