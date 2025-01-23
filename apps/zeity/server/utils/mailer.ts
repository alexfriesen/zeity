import { SMTPClient } from 'emailjs';
import consola from 'consola';

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

const logger = consola.create({}).withTag('mailer');
let client: SMTPClient;

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
    .sendAsync({
      from,
      to: to,
      cc: parseMailTo(options.cc),
      bcc: parseMailTo(options.bcc),
      subject: options.subject,
      text: options.text || '',
      attachment: {
        data: options.html,
        alternative: true,
      },
    })
    .catch((e) => {
      logger.error(e);
    });

  logger.debug('Message sent: %s', info);
}

async function sendWelcomeMail(
  to: string,
  name: string,
  verificationLink?: string
) {
  const { html, text } = await useMailTemplate().renderWelcomeMail({
    name,
    verificationLink,
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
  link?: { text: string; url: string }
) {
  const { html, text } = await useMailTemplate().renderMessageMail({
    subject,
    messages,
    link,
  });

  return sendMail({
    to,
    subject,
    html,
    text,
  });
}

export function useMailer() {
  client ??= new SMTPClient(useRuntimeConfig().mailer.smtp);

  return {
    sendMail,
    sendMessageMail,
    sendWelcomeMail,
  };
}
