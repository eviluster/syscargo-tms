import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import logger from '../common/logging/winston.config';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        html,
      });
      logger.info('Email sent successfully', { to, subject });
    } catch (error) {
      logger.error('Failed to send email', { to, subject, error });
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = `
      <h2>Restablecimiento de Contraseña</h2>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetUrl}">Restablecer Contraseña</a>
      <p>Este enlace expirará en 1 hora.</p>
      <p>Si no solicitaste este cambio, ignora este correo.</p>
    `;
    await this.sendEmail(email, 'Restablecimiento de Contraseña', html);
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const html = `
      <h2>Bienvenido a TMS</h2>
      <p>Hola ${name},</p>
      <p>Bienvenido al Sistema de Gestión de Transporte y Logística.</p>
      <p>Tu cuenta ha sido creada exitosamente.</p>
      <p>Para comenzar, inicia sesión en tu cuenta.</p>
    `;
    await this.sendEmail(email, 'Bienvenido a TMS', html);
  }

  async sendAccountLockedEmail(email: string): Promise<void> {
    const html = `
      <h2>Cuenta Bloqueada</h2>
      <p>Tu cuenta ha sido bloqueada temporalmente debido a múltiples intentos fallidos de inicio de sesión.</p>
      <p>Por seguridad, hemos bloqueado tu cuenta durante 30 minutos.</p>
      <p>Si no intentaste iniciar sesión, contacta a soporte inmediatamente.</p>
    `;
    await this.sendEmail(email, 'Cuenta Bloqueada por Seguridad', html);
  }
}