export interface MailText {
  text: string;
  class?: string;
}

export interface MailSection {
  class?: string;
  children?: MailText[];
}
