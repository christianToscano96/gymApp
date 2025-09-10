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
      <div style="padding:40px 0;font-family:'Segoe UI',Arial,sans-serif;">
        <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:18px;box-shadow:0 8px 32px rgba(0,0,0,0.18);overflow:hidden;">
          <div style="padding:32px 24px;text-align:center;border:4px solid #000;box-shadow:0 8px 32px rgba(0,0,0,0.5);background:linear-gradient(135deg,#000 0%,#1a1a1a 50%,#222 100%);">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy4iyiFMi5Z4IDPr61CgUfoAtcMIL6-tqM8g&s" alt="GymApp" width="56" style="margin-bottom:12px;filter:drop-shadow(0 2px 8px #000);border-radius:12px;" />
            <h1 style="color:#fff;margin:0;font-size:2.2rem;font-weight:800;letter-spacing:1px;text-shadow:0 2px 8px #000;">¡Bienvenido a GymApp!</h1>
          </div>
          <div style="padding:32px 24px;text-align:center;">
            <p style="font-size:1.15rem;color:#222;margin-bottom:18px;">Hola <b>${nombre}</b>,</p>
            <p style="font-size:1.05rem;color:#444;margin-bottom:24px;">Tu usuario ha sido creado correctamente.<br>Para acceder, tu contraseña son los <b>4 últimos dígitos de tu DNI:</b></p>
            <div style="display:inline-block;background:linear-gradient(90deg,#e0e7ff 0%,#c7d2fe 100%);color:#3730a3;font-size:1.6rem;font-weight:700;padding:14px 36px;border-radius:10px;letter-spacing:2px;margin-bottom:24px;box-shadow:0 2px 8px #c7d2fe;">${password}</div>
            <hr style="border:none;border-top:1.5px solid #e5e7eb;margin:32px 0;" />
            <a href="https://gymapp.com/login" style="display:inline-block;background:linear-gradient(135deg,#000 0%,#1a1a1a 50%,#222 100%);color:#fff;font-size:1.1rem;font-weight:600;padding:12px 32px;border-radius:8px;text-decoration:none;box-shadow:0 2px 8px #6366f1;transition:background 0.2s;">Acceder a GymApp</a>
            <p style="font-size:0.95rem;color:#666;margin-top:28px;">Por seguridad, te recomendamos cambiar tu contraseña después de tu primer acceso.</p>
          </div>
          <div style="background:linear-gradient(135deg,#000 0%,#1a1a1a 50%,#222 100%);padding:16px 24px;text-align:center;font-size:0.92rem;color:#888;">
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
