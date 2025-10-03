import QRCode from "qrcode";

export async function generateQr(uuid) {
  // El valor del QR será la uuid
  const qrCode = uuid;
  // Genera la imagen en base64
  const qrImage = await QRCode.toDataURL(qrCode);
  return { qrCode, qrImage };
}
