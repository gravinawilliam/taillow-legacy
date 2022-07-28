import Handlebars from 'handlebars';

import {
  AddVariablesInEmailTemplateProviderDTO,
  IAddVariablesInEmailTemplateProvider
} from '@domain/contracts/providers/email-template/add-variables-in-email-template.provider';
import { ProviderError } from '@domain/entities/errors/shared/provider.error';

import { failure, success } from '@shared/utils/either.util';

export class HandlebarsEmailTemplateProvider implements IAddVariablesInEmailTemplateProvider {
  public async addVariablesInEmailTemplate(
    parameters: AddVariablesInEmailTemplateProviderDTO.Parameters
  ): AddVariablesInEmailTemplateProviderDTO.Result {
    try {
      const htmlCompiled = this.compileStringForHandlebars(parameters.htmlEmailTemplate);
      const htmlWithVariables = htmlCompiled(parameters.variables);
      return success({ html: htmlWithVariables });
    } catch (error: any) {
      return failure(
        new ProviderError({
          method: 'addVariablesInEmailTemplate',
          provider: 'email template',
          error
        })
      );
    }
  }

  private compileStringForHandlebars(htmlString: string): Handlebars.TemplateDelegate<any> {
    return Handlebars.compile(htmlString);
  }
}
