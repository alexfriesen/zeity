import type { H3Event } from 'h3';
import { createConsola } from 'consola';
import { createEmailService, type EmailService } from 'unemail';
import type { EmailAddress } from 'unemail/types';
import smtpProvider from 'unemail/providers/smtp';

import type { MailSection } from '~~/types/mail';
import { useMailTemplate } from './mail-template';

type MailTo = EmailAddress | EmailAddress[];
type MailContent =
  | { html?: string; text: string }
  | { html: string; text?: string };

type SendMailOptions = {
  to: MailTo;
  cc?: MailTo;
  bcc?: MailTo;
  subject: string;
} & MailContent;

const logger = createConsola({}).withTag('mailer');
let client: EmailService | undefined;

async function sendMail(options: SendMailOptions) {
  if (!options.to) {
    logger.warn('Could not send mail: No recipient specified', options.subject);
    throw new Error('No recipient specified');
  }

  const from = useRuntimeConfig().mailer.from;
  const info = await client
    ?.sendEmail({
      from,
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      subject: options.subject,
      text: options.text || '',
      html: options.html,
    })
    .catch((e) => {
      logger.error('Sending mail failed', e);
    });

  if (info?.error) {
    logger.error('Sending mail failed', info.error);
  }

  logger.debug('Message sent: %s', info);
}

async function sendWelcomeMail(to: EmailAddress, otp?: string) {
  const { html, text } = await useMailTemplate().renderWelcomeMail({
    name: to.name ?? to.email,
    otp,
  });

  return sendMail({
    to,
    subject: 'Welcome to zeity',
    html,
    text,
  });
}

async function sendMessageMail(
  to: MailTo,
  subject: string,
  messages: string[],
  sections: MailSection[] = []
) {
  const { html, text } = await useMailTemplate().renderMessageMail({
    subject,
    messages,
    sections,
  });

  return sendMail({
    to,
    subject,
    html,
    text,
  });
}

export function useMailer(event: H3Event) {
  try {
    const smtp = useRuntimeConfig(event).mailer.smtp;
    client ??= createEmailService({
      provider: smtpProvider(smtp),
    });
  } catch (e) {
    logger.error('Failed to create mailer client', e);
  }

  return {
    sendMail,
    sendMessageMail,
    sendWelcomeMail,
  };
}
