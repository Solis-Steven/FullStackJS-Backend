import nodemailer from 'nodemailer';

export const emailOlvidePassword = async datos => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS 
        }
    });

    const { email, name, token } = datos;

    // Enviar el email
    const info = await transporter.sendMail({
        from: "APV - Administrador de Pac ientes de Veterinaria",
        to: email,
        subject: "Reestablece tu Password",
        text: "Reestablece tu Password",
        html: `<p>Hola: ${ name }, has solicitado reestablecer tu password.</p>
          <p>Sigue el siguiente enlace para generar un nuevo password:
          <a href="${ process.env.FRONTEND_URL }/forgort-password/${ token }">Reestablecer password</a> </p>
  
          <p>Si tu no create esta cuenta, puedes ignorar este mensaje</p>
        `
      });
}