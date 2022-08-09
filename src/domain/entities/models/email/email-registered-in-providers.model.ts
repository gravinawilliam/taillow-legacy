import { Email } from './email.model';

export type EmailSendingProvider = {
  aws: {
    status: 'registered' | 'not registered' | 'refused' | 'pending';
  };
};

export type ProvidersSendEmail = 'aws-ses';

export type EmailRegisteredInProvider = {
  email: Email;
  provider: EmailSendingProvider;
};
