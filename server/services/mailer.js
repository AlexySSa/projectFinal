import nodemailer from 'nodemailer'
import { logError } from './logger.js'
import { welcomeEmail, invoiceEmail, passwordResetEmail } from './emailTemplates.js'

export function mailerConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

let transporter = null
function getTransporter() {
  if (transporter) return transporter
  if (!mailerConfigured()) return null
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: String(process.env.SMTP_SECURE) === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
  return transporter
}

function fromAddress() {
  const name = process.env.MAIL_FROM_NAME || 'Bahn'
  const addr = process.env.MAIL_FROM || process.env.SMTP_USER
  return `"${name}" <${addr}>`
}

async function send({ to, subject, html, text, attachments }) {
  const tx = getTransporter()
  if (!tx) {
    logError('mailer', 'SMTP no configurado: correo omitido', { to, subject })
    return false
  }
  try {
    await tx.sendMail({ from: fromAddress(), to, subject, html, text, attachments })
    return true
  } catch (e) {
    logError('mailer', e, { to, subject })
    return false
  }
}

export async function sendWelcomeEmail({ to, nombre, email, fecha }) {
  const tpl = welcomeEmail({ nombre, email, fecha })
  return send({ to, ...tpl })
}

export async function sendInvoiceEmail({ to, datos, pdfBuffer }) {
  const tpl = invoiceEmail(datos)
  return send({
    to,
    ...tpl,
    attachments: [
      {
        filename: `factura-${datos.numero}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  })
}

export async function sendPasswordResetCodeEmail({ to, nombre, codigo, minutes }) {
  const tpl = passwordResetEmail({ nombre, codigo, minutes })
  return send({ to, ...tpl })
}
