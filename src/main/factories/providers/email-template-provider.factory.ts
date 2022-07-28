import { IAddVariablesInEmailTemplateProvider } from '@domain/contracts/providers/email-template/add-variables-in-email-template.provider';

import { HandlebarsEmailTemplateProvider } from '@infrastructure/providers/email-template/handlebars.email-template-provider';

export const makeEmailTemplateProvider = (): IAddVariablesInEmailTemplateProvider => {
  return new HandlebarsEmailTemplateProvider();
};
