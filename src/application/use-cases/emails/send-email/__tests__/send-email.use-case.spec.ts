/* eslint-disable sonarjs/no-duplicate-string */
import { mock, MockProxy } from 'jest-mock-extended';

import { SendEmailUseCase } from '@application/use-cases/emails/send-email/send-email.use-case';

import { IAddVariablesInEmailTemplateProvider } from '@domain/contracts/providers/email-template/add-variables-in-email-template.provider';
import { ISendEmailProvider, SendEmailProviderDTO } from '@domain/contracts/providers/email/send.email-provider';
import { IGenerateUuidProvider } from '@domain/contracts/providers/uuid/generate-uuid.provider';
import {
  ISaveSentEmailsRepository,
  SaveSentEmailsRepositoryDTO
} from '@domain/contracts/repositories/email/sent-emails/save.sent-emails-repository';
import { EmailTemplateError } from '@domain/entities/errors/email/email-template.error';
import { ProviderError } from '@domain/entities/errors/shared/provider.error';
import { Email } from '@domain/entities/models/email/email.model';
import { ISendEmailUseCase, SendEmailUseCaseDTO } from '@domain/use-cases/emails/send-email/send-email.use-case';

import { failure, success } from '@shared/utils/either.util';

describe('Send email USE CASE', () => {
  let sut: ISendEmailUseCase;
  let emailProvider: MockProxy<ISendEmailProvider>;
  let sentEmailsRepository: MockProxy<ISaveSentEmailsRepository>;
  let emailFrom: Email | Error;
  let emailTo: Email | Error;
  let uuidProvider: MockProxy<IGenerateUuidProvider>;
  let uuid: string;
  let emailTemplateProvider: MockProxy<IAddVariablesInEmailTemplateProvider>;

  beforeAll(() => {
    emailProvider = mock();
    emailProvider.send.mockResolvedValue(success(undefined));

    sentEmailsRepository = mock();
    sentEmailsRepository.save.mockResolvedValue(success(undefined));

    emailFrom = Email.create({ email: 'any_email_from@example.com' }).value;
    emailTo = Email.create({ email: 'any_email_to@example.com' }).value;

    uuid = 'eb2026d8-2c58-435c-818e-dd8bd9f4d2ef';
    uuidProvider = mock();
    uuidProvider.generate.mockReturnValue(success({ uuid }));

    emailTemplateProvider = mock();
    emailTemplateProvider.addVariablesInEmailTemplate.mockResolvedValue(success({ html: 'any_html_with_variables' }));
  });

  beforeEach(() => {
    sut = new SendEmailUseCase(emailProvider, sentEmailsRepository, uuidProvider, emailTemplateProvider);
  });

  it('should call emailProvider.send with correct params', async () => {
    const parameters: SendEmailUseCaseDTO.Parameters = {
      emailData: {
        from: {
          email: emailFrom as Email,
          name: 'any_name_from'
        },
        status: 'active',
        html: 'any_html',
        subject: 'any_subject',
        to: {
          email: emailTo as Email,
          name: 'any_name_to'
        }
      },
      requester: {
        id: 'any_id'
      },
      variables: {
        any_variable: 'any_value'
      }
    };

    await sut.execute(parameters);

    expect(emailProvider.send).toHaveBeenCalledWith({
      from: {
        email: emailFrom as Email,
        name: 'any_name_from'
      },
      html: 'any_html_with_variables',
      subject: 'any_subject',
      to: {
        email: emailTo as Email,
        name: 'any_name_to'
      }
    } as SendEmailProviderDTO.Parameters);
    expect(emailProvider.send).toHaveBeenCalledTimes(1);
  });

  it('should call sentEmailsRepository.save with correct params', async () => {
    const parameters: SendEmailUseCaseDTO.Parameters = {
      emailData: {
        from: {
          email: emailFrom as Email,
          name: 'any_name_from'
        },
        status: 'active',
        html: 'any_html',
        subject: 'any_subject',
        to: {
          email: emailTo as Email,
          name: 'any_name_to'
        }
      },
      requester: {
        id: 'any_id'
      },
      variables: {
        any_variable: 'any_value'
      }
    };

    await sut.execute(parameters);

    expect(sentEmailsRepository.save).toHaveBeenCalledWith({
      requester: {
        id: parameters.requester.id
      },
      sentEmail: {
        from: {
          email: emailFrom as Email,
          name: 'any_name_from'
        },
        html: 'any_html_with_variables',
        subject: 'any_subject',
        to: {
          email: emailTo as Email,
          name: 'any_name_to'
        }
      },
      id: uuid
    } as SaveSentEmailsRepositoryDTO.Parameters);
    expect(sentEmailsRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should return an error when uuid provider return ProviderError', async () => {
    uuidProvider.generate.mockReturnValueOnce(
      failure(
        new ProviderError({
          method: 'generate',
          provider: 'uuid'
        })
      )
    );
    const parameters: SendEmailUseCaseDTO.Parameters = {
      emailData: {
        from: {
          email: emailFrom as Email,
          name: 'any_name_from'
        },
        status: 'active',
        html: 'any_html',
        subject: 'any_subject',
        to: {
          email: emailTo as Email,
          name: 'any_name_to'
        }
      },
      requester: {
        id: 'any_id'
      },
      variables: {
        any_variable: 'any_value'
      }
    };

    const result = await sut.execute(parameters);

    expect(result.value).toEqual(
      new ProviderError({
        method: 'generate',
        provider: 'uuid'
      })
    );
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should return an error when email template status is awaiting review return EmailTemplateError', async () => {
    const parameters: SendEmailUseCaseDTO.Parameters = {
      emailData: {
        from: {
          email: emailFrom as Email,
          name: 'any_name_from'
        },
        status: 'awaiting review',
        html: 'any_html',
        subject: 'any_subject',
        to: {
          email: emailTo as Email,
          name: 'any_name_to'
        }
      },
      requester: {
        id: 'any_id'
      },
      variables: {
        any_variable: 'any_value'
      }
    };

    const result = await sut.execute(parameters);

    expect(result.value).toEqual(
      new EmailTemplateError({
        motive: 'is not active'
      })
    );
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should return an error when email template status is inactive return EmailTemplateError', async () => {
    const parameters: SendEmailUseCaseDTO.Parameters = {
      emailData: {
        status: 'inactive',
        from: {
          email: emailFrom as Email,
          name: 'any_name_from'
        },
        html: 'any_html',
        subject: 'any_subject',
        to: {
          email: emailTo as Email,
          name: 'any_name_to'
        }
      },
      requester: {
        id: 'any_id'
      },
      variables: {
        any_variable: 'any_value'
      }
    };

    const result = await sut.execute(parameters);

    expect(result.value).toEqual(
      new EmailTemplateError({
        motive: 'is not active'
      })
    );
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should return an error when email template status is rejected return EmailTemplateError', async () => {
    const parameters: SendEmailUseCaseDTO.Parameters = {
      emailData: {
        status: 'rejected',
        from: {
          email: emailFrom as Email,
          name: 'any_name_from'
        },
        html: 'any_html',
        subject: 'any_subject',
        to: {
          email: emailTo as Email,
          name: 'any_name_to'
        }
      },
      requester: {
        id: 'any_id'
      },
      variables: {
        any_variable: 'any_value'
      }
    };

    const result = await sut.execute(parameters);

    expect(result.value).toEqual(
      new EmailTemplateError({
        motive: 'is not active'
      })
    );
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should return an error when email template provider return ProviderError', async () => {
    emailTemplateProvider.addVariablesInEmailTemplate.mockResolvedValueOnce(
      failure(
        new ProviderError({
          method: 'addVariablesInEmailTemplate',
          provider: 'email template'
        })
      )
    );
    const parameters: SendEmailUseCaseDTO.Parameters = {
      emailData: {
        from: {
          email: emailFrom as Email,
          name: 'any_name_from'
        },
        status: 'active',
        html: 'any_html',
        subject: 'any_subject',
        to: {
          email: emailTo as Email,
          name: 'any_name_to'
        }
      },
      requester: {
        id: 'any_id'
      },
      variables: {
        any_variable: 'any_value'
      }
    };

    const result = await sut.execute(parameters);

    expect(result.value).toEqual(
      new ProviderError({
        method: 'addVariablesInEmailTemplate',
        provider: 'email template'
      })
    );
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should return an error when email provider return ProviderError', async () => {
    emailProvider.send.mockResolvedValueOnce(
      failure(
        new ProviderError({
          method: 'send',
          provider: 'email'
        })
      )
    );
    const parameters: SendEmailUseCaseDTO.Parameters = {
      emailData: {
        from: {
          email: emailFrom as Email,
          name: 'any_name_from'
        },
        status: 'active',
        html: 'any_html',
        subject: 'any_subject',
        to: {
          email: emailTo as Email,
          name: 'any_name_to'
        }
      },
      requester: {
        id: 'any_id'
      },
      variables: {
        any_variable: 'any_value'
      }
    };

    const result = await sut.execute(parameters);

    expect(result.value).toEqual(
      new ProviderError({
        method: 'send',
        provider: 'email'
      })
    );
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });
});
