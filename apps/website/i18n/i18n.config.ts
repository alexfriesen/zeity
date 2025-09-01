export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      actions: {
        back: 'Go Back',
      },
      home: {
        title: 'zeity',
        description: 'Next Generation time tracking',
        openDocs: 'Open Documentation',
        features: {
          title: 'Features',
          description: 'Discover the powerful features of zeity.',
        },
      },
      docs: {
        title: 'Documentation',
        description: 'Comprehensive guides and documentation for zeity.',
        read: 'Read',
      },
      contact: {
        title: 'Contact',
        description: 'Feel free to reach out to me.',
        email: 'Email',
        message: 'Message',
        messagePlaceholder: 'Your message...',
        send: 'Send',
        sending: 'Sending...',
        success:
          'Thank you for your message! I will get back to you as soon as possible.',
        error: 'Sorry! Something went wrong.',
      },
      '404': {
        title: 'Page not found',
        description: 'The page could not be found.',
      },
      error: {
        title: 'An error occurred',
        description: 'An error occurred while processing your request.',
      },
    },
    de: {
      actions: {
        back: 'Zurück',
      },
      home: {
        title: 'zeity',
        description: 'Nächste Generation der Zeiterfassung',
        openDocs: 'Dokumentation öffnen',
        features: {
          title: 'Funktionen',
          description: 'Entdecken Sie die leistungsstarken Funktionen von zeity.',
        },
      },
      docs: {
        title: 'Dokumentation',
        description: 'Umfassende Anleitungen und Dokumentation für zeity.',
        read: 'Lesen',
      },
      contact: {
        title: 'Kontakt',
        description: 'Fühle dich frei, mich zu kontaktieren.',
        email: 'Email',
        message: 'Nachricht',
        messagePlaceholder: 'Deine Nachricht...',
        send: 'Senden',
        sending: 'Senden...',
        success:
          'Vielen Dank für deine Nachricht! Ich werde mich so schnell wie möglich bei dir melden.',
        error: 'Sorry! Etwas ist schief gelaufen.',
      },
      '404': {
        title: 'Seite nicht gefunden',
        description: 'Die Seite konnte nicht gefunden werden.',
      },
      error: {
        title: 'Ein Fehler ist aufgetreten',
        description:
          'Ein Fehler ist aufgetreten, während deine Anfrage bearbeitet wurde.',
      },
    },
  },
}));
