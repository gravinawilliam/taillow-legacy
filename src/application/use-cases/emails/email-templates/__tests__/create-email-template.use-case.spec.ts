import { mock, MockProxy } from 'jest-mock-extended';

import { CreateEmailTemplateUseCase } from '@application/use-cases/emails/email-templates/create-email-template.use-case';

import { IGenerateUuidProvider } from '@domain/contracts/providers/uuid/generate-uuid.provider';
import { ISaveEmailTemplatesRepository } from '@domain/contracts/repositories/email/email-templates/save-email-templates.repository';
import { InvalidContentParameterError } from '@domain/entities/errors/shared/invalid-content-parameter.error';
import { ProviderError } from '@domain/entities/errors/shared/provider.error';
import { RepositoryError } from '@domain/entities/errors/shared/repository.error';
import {
  CreateEmailTemplateUseCaseDTO,
  ICreateEmailTemplateUseCase
} from '@domain/use-cases/emails/email-templates/create-email-template.use-case';

import { failure, success } from '@shared/utils/either.util';

describe('Create Email Template Use Case', () => {
  let sut: ICreateEmailTemplateUseCase;

  let emailTemplatesRepository: MockProxy<ISaveEmailTemplatesRepository>;

  let uuidProvider: MockProxy<IGenerateUuidProvider>;

  beforeAll(() => {
    emailTemplatesRepository = mock();
    emailTemplatesRepository.save.mockResolvedValue(success(undefined));

    uuidProvider = mock();
    uuidProvider.generate.mockReturnValue(success({ uuid: 'eb2026d8-2c58-435c-818e-dd8bd9f4d2ef' }));
  });

  beforeEach(() => {
    sut = new CreateEmailTemplateUseCase(emailTemplatesRepository, uuidProvider);
  });

  it('should return an error when the model name is less than 5 characters', async () => {
    const result = await sut.execute({
      requester: { id: 'any_requester_id' },
      template: {
        name: 'test',
        description: 'any_description',
        subject: 'any_subject',
        html: 'any_html',
        fromEmailContact: {
          id: 'any_from_email_contact_id'
        }
      }
    });

    expect(result.value).toEqual(
      new InvalidContentParameterError({
        customMessage: 'The email template name must be at least 5 characters long.'
      })
    );
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should return an error when the model description is less than 0 characters', async () => {
    const result = await sut.execute({
      requester: { id: 'any_requester_id' },
      template: {
        name: 'any_name',
        html: 'any_html',
        description: '',
        subject: 'any_subject',
        fromEmailContact: {
          id: 'any_from_email_contact_id'
        }
      }
    });

    expect(result.value).toEqual(
      new InvalidContentParameterError({
        customMessage: 'The email template description must be at least 0 characters long.'
      })
    );
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should return an error when the model subject is less than 0 characters', async () => {
    const result = await sut.execute({
      requester: { id: 'any_requester_id' },
      template: {
        name: 'any_name',
        html: 'any_html',
        description: 'any_description',
        subject: '',
        fromEmailContact: {
          id: 'any_from_email_contact_id'
        }
      }
    });

    expect(result.value).toEqual(
      new InvalidContentParameterError({
        customMessage: 'The email template subject must be at least 0 characters long.'
      })
    );
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
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

    const result = await sut.execute({
      requester: { id: 'any_requester_id' },
      template: {
        name: 'any_name',
        html: 'any_html',
        description: 'any_description',
        subject: 'any_subject',
        fromEmailContact: {
          id: 'any_from_email_contact_id'
        }
      }
    });

    expect(result.value).toEqual(
      new ProviderError({
        method: 'generate',
        provider: 'uuid'
      })
    );
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should return an error when email templates repository return RepositoryError', async () => {
    emailTemplatesRepository.save.mockResolvedValueOnce(
      failure(
        new RepositoryError({
          method: 'save',
          model: 'email template'
        })
      )
    );

    const result = await sut.execute({
      requester: { id: 'any_requester_id' },
      template: {
        name: 'any_name',
        html: 'any_html',
        description: 'any_description',
        subject: 'any_subject',
        fromEmailContact: {
          id: 'any_from_email_contact_id'
        }
      }
    });

    expect(result.value).toEqual(
      new RepositoryError({
        method: 'save',
        model: 'email template'
      })
    );
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should create the email template successfully', async () => {
    const result = await sut.execute({
      requester: { id: 'any_requester_id' },
      template: {
        name: 'Forgot password',
        html: 'any_html',
        description: 'Forgot password email template',
        subject: 'Forgot password',
        fromEmailContact: {
          id: 'any_from_email_contact_id'
        }
      }
    });

    expect(result.value).toEqual({
      template: {
        id: 'eb2026d8-2c58-435c-818e-dd8bd9f4d2ef'
      }
    } as CreateEmailTemplateUseCaseDTO.ResultSuccess);
    expect(result.isFailure()).toBeFalsy();
    expect(result.isSuccess()).toBeTruthy();
  });
});
