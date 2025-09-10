import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

// Configuración del transporter para Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Tu email Gmail
    pass: process.env.EMAIL_PASS, // Tu contraseña o App Password
  },
});

/**
 * Envía un email de alta de usuario
 * @param {string} to - Email del destinatario
 * @param {string} nombre - Nombre del usuario
 * @param {string} dni - DNI del usuario
 */
export async function sendUserCreatedEmail(to, nombre, dni) {
  const password = dni.slice(-4);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "¡Bienvenido a GymApp!",
    html: `
      <div style="background:#f6f8fa;padding:40px 0;font-family:'Segoe UI',Arial,sans-serif;">
        <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.08);overflow:hidden;">
          <div style="ßpadding:32px 24px;text-align:center;border:4px solid #000;box-shadow:0 8px 32px rgba(0,0,0,0.5);background:linear-gradient(135deg,#000 0%,#1a1a1a 50%,#222 100%);">
            <h1 style="color:#fff;margin:0;font-size:2rem;font-weight:700;letter-spacing:1px;text-shadow:0 2px 8px #000;">¡Bienvenido a GymApp!</h1>
          </div>
          <div style="padding:32px 24px;text-align:center;">
            <p style="font-size:1.1rem;color:#222;margin-bottom:16px;">Hola <b>${nombre}</b></p>
            <p style="font-size:1rem;color:#444;margin-bottom:24px;">Tu usuario ha sido creado correctamente.<br>Para acceder, tu contraseña son los <b>4 últimos dígitos de tu DNI:</b></p>
            <div style="display:inline-block;background:#e0e7ff;color:#3730a3;font-size:1.5rem;font-weight:700;padding:12px 32px;border-radius:8px;letter-spacing:2px;margin-bottom:24px;">${password}</div>
          </div>
          <div style="background:#f3f4f6;padding:16px 24px;text-align:center;font-size:0.9rem;color:#888;">
            © ${new Date().getFullYear()} GymApp. Todos los derechos reservados.
          </div>
        </div>
      </div>
    `,
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error enviando email:", error);
    return false;
  }
}
