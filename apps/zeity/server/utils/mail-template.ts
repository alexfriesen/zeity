import { type ExtractComponentProps, render } from '@vue-email/render';
import type { Component } from 'vue';

import MailWelcome from '../mail/MailWelcome.vue';

async function renderVueMail<T extends Component>(
  component: T,
  props?: ExtractComponentProps<T>
) {
  const [html, text] = await Promise.all([
    render(component, props, { pretty: import.meta.dev ?? false }),
    render(component, props, { plainText: true }),
  ]);

  return {
    html,
    text,
  };
}

function renderWelcomeMail(props: ExtractComponentProps<typeof MailWelcome>) {
  return renderVueMail(MailWelcome, props);
}

export function useMailTemplate() {
  return {
    renderVueMail,
    renderWelcomeMail,
  };
}
