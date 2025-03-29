import type { H3Event } from 'h3';
import { createTransport, type Transporter } from 'nodemailer';
import { createConsola } from 'consola';

import type { MailSection } from '~~/types/mail';
import { useMailTemplate } from './mail-template';

type MailTo = string | string[];
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
let client: Transporter;

function parseMailTo(to?: MailTo) {
  if (typeof to === 'string') {
    return to;
  }

  if (Array.isArray(to) && to.length > 0) {
    return to.join(', ');
  }

  return undefined;
}

async function sendMail(options: SendMailOptions) {
  const to = parseMailTo(options.to);

  if (!to) {
    logger.warn('Could not wend mail: No recipient specified', options.subject);
    throw new Error('No recipient specified');
  }

  const from = useRuntimeConfig().mailer.from;
  const info = await client
    .sendMail({
      from,
      to: to,
      cc: parseMailTo(options.cc),
      bcc: parseMailTo(options.bcc),
      subject: options.subject,
      text: options.text || '',
      html: options.html,
    })
    .catch((e) => {
      logger.error(e);
    });

  logger.debug('Message sent: %s', info);
}

async function sendWelcomeMail(to: string, name: string, otp?: string) {
  const { html, text } = await useMailTemplate().renderWelcomeMail({
    name,
    otp,
  });

  return sendMail({
    to: `${name} <${to}>`,
    subject: 'Welcome to zeity',
    html,
    text,
  });
}

async function sendMessageMail(
  to: string,
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
  client ??= createTransport(useRuntimeConfig(event).mailer.smtp);

  return {
    sendMail,
    sendMessageMail,
    sendWelcomeMail,
  };
}
