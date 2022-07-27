export type EmailTemplateStatus = 'awaiting review' | 'active' | 'inactive' | 'rejected';

export type EmailTemplate = {
  id: string;
  html: string;
  name: string;
  description: string;
  subject: string;
  fromEmailContact: {
    id: string;
  };
  status: EmailTemplateStatus;
  requester: {
    id: string;
  };
};
