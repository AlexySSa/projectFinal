const BRAND = '#22395a'
const ORANGE = '#e8722d'

function layout(title, inner) {
  return `
  <div style="background:#f4f6fa;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#1c2430">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 6px 18px rgba(20,40,80,.08)">
      <div style="background:${BRAND};color:#fff;padding:22px 26px">
        <div style="font-size:26px;font-weight:800;letter-spacing:.5px">Bahn</div>
        <div style="opacity:.85;font-size:13px">${title}</div>
      </div>
      <div style="padding:26px">${inner}</div>
      <div style="padding:16px 26px;color:#8a93a3;font-size:12px;border-top:1px solid #eef0f4">
        Este es un correo automatico, por favor no respondas a este mensaje.
      </div>
    </div>
  </div>`
}

export function welcomeEmail({ nombre, email, fecha }) {
  const inner = `
    <h2 style="margin:0 0 12px;font-size:22px">Bienvenido/a, ${nombre}</h2>
    <p style="line-height:1.6;margin:0 0 16px">
      Tu cuenta en <strong>Bahn</strong> fue creada exitosamente. Ya puedes iniciar sesion y
      empezar a rentar autos, motocicletas y maquinaria.
    </p>
    <table style="width:100%;border-collapse:collapse;background:#f3f5f9;border-radius:10px;overflow:hidden">
      <tr><td style="padding:10px 14px;color:#5a6478">Nombre</td><td style="padding:10px 14px;font-weight:700;text-align:right">${nombre}</td></tr>
      <tr><td style="padding:10px 14px;color:#5a6478">Correo</td><td style="padding:10px 14px;font-weight:700;text-align:right">${email}</td></tr>
      <tr><td style="padding:10px 14px;color:#5a6478">Fecha de registro</td><td style="padding:10px 14px;font-weight:700;text-align:right">${fecha}</td></tr>
    </table>
    <p style="line-height:1.6;margin:18px 0 0;color:#5a6478">Gracias por unirte a Bahn.</p>`
  return {
    subject: 'Bienvenido a Bahn',
    html: layout('Confirmacion de registro', inner),
    text: `Bienvenido a Bahn, ${nombre}. Tu cuenta (${email}) fue creada exitosamente el ${fecha}.`,
  }
}

export function invoiceEmail({ nombre, numero, fecha, descripcion, total, metodoPago, moneda }) {
  const inner = `
    <h2 style="margin:0 0 12px;font-size:22px">Pago confirmado</h2>
    <p style="line-height:1.6;margin:0 0 16px">
      Hola ${nombre}, tu pago se proceso correctamente. Adjuntamos tu factura en PDF.
    </p>
    <table style="width:100%;border-collapse:collapse;background:#f3f5f9;border-radius:10px;overflow:hidden">
      <tr><td style="padding:10px 14px;color:#5a6478">Factura</td><td style="padding:10px 14px;font-weight:700;text-align:right">${numero}</td></tr>
      <tr><td style="padding:10px 14px;color:#5a6478">Fecha</td><td style="padding:10px 14px;font-weight:700;text-align:right">${fecha}</td></tr>
      <tr><td style="padding:10px 14px;color:#5a6478">Servicio</td><td style="padding:10px 14px;font-weight:700;text-align:right">${descripcion}</td></tr>
      <tr><td style="padding:10px 14px;color:#5a6478">Metodo de pago</td><td style="padding:10px 14px;font-weight:700;text-align:right">${metodoPago}</td></tr>
      <tr><td style="padding:12px 14px;color:#1c2430;font-size:16px;border-top:1px solid #e2e6ee">Total pagado</td>
          <td style="padding:12px 14px;font-weight:800;text-align:right;color:${ORANGE};font-size:16px;border-top:1px solid #e2e6ee">${moneda} ${total}</td></tr>
    </table>
    <p style="line-height:1.6;margin:18px 0 0;color:#5a6478">Gracias por tu compra.</p>`
  return {
    subject: `Tu factura ${numero} - Bahn`,
    html: layout('Confirmacion de pago', inner),
    text: `Pago confirmado. Factura ${numero} del ${fecha}. ${descripcion}. Total: ${moneda} ${total} (${metodoPago}).`,
  }
}

export function passwordResetEmail({ nombre, codigo, minutes }) {
  const inner = `
    <h2 style="margin:0 0 12px;font-size:22px">Recupera tu cuenta</h2>
    <p style="line-height:1.6;margin:0 0 16px">
      Hola ${nombre || 'usuario'}, recibimos una solicitud para cambiar tu contrasena en <strong>Bahn</strong>.
      Usa este codigo de 6 digitos para completar el cambio.
    </p>
    <div style="margin:18px 0;padding:18px;border-radius:12px;background:#f3f5f9;text-align:center">
      <div style="font-size:34px;font-weight:800;letter-spacing:8px;color:${ORANGE}">${codigo}</div>
    </div>
    <p style="line-height:1.6;margin:0;color:#5a6478">
      El codigo vence en ${minutes} minutos. Si no pediste este cambio, puedes ignorar este correo.
    </p>`
  return {
    subject: 'Codigo para recuperar tu contrasena - Bahn',
    html: layout('Recuperacion de contrasena', inner),
    text: `Tu codigo para recuperar tu contrasena en Bahn es ${codigo}. Vence en ${minutes} minutos.`,
  }
}
