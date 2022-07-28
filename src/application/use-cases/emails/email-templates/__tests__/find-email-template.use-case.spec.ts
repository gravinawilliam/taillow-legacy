import { mock, MockProxy } from 'jest-mock-extended';

import { FindEmailTemplateUseCase } from '@application/use-cases/emails/email-templates/find-email-template.use-case';

import { IFindEmailTemplatesRepository } from '@domain/contracts/repositories/email/email-templates/find-email-templates.repository';
import { EmailTemplateError } from '@domain/entities/errors/email/email-template.error';
import { RepositoryError } from '@domain/entities/errors/shared/repository.error';
import { Email } from '@domain/entities/models/email/email.model';
import {
  IFindEmailTemplateUseCase,
  FindEmailTemplateUseCaseDTO
} from '@domain/use-cases/emails/email-templates/find-email-template.use-case';

import { failure, success } from '@shared/utils/either.util';

describe('Find Email Template Use Case', () => {
  let sut: IFindEmailTemplateUseCase;
  let emailTemplatesRepository: MockProxy<IFindEmailTemplatesRepository>;
  let emailFrom: Email | Error;

  beforeAll(() => {
    emailFrom = Email.create({ email: 'any_email_from@example.com' }).value;

    emailTemplatesRepository = mock();
    emailTemplatesRepository.find.mockResolvedValue(
      success({
        emailTemplate: {
          description: 'any_description',
          fromEmailContact: {
            email: emailFrom as Email,
            id: 'any_from_email_contact_id',
            name: 'any_name'
          },
          html: 'any_html',
          id: 'any_id',
          name: 'any_name',
          subject: 'any_subject',
          requester: { id: 'any_requester_id' },
          status: 'active'
        }
      })
    );
  });

  beforeEach(() => {
    sut = new FindEmailTemplateUseCase(emailTemplatesRepository);
  });

  it('should be emailFrom to be instance of Email', () => {
    expect(emailFrom).toBeInstanceOf(Email);
  });

  it('should find the email template successfully', async () => {
    const result = await sut.execute({
      requester: {
        id: 'any_requester_id'
      },
      template: {
        id: 'any_id'
      }
    });

    expect(result.value).toEqual({
      emailTemplate: {
        description: 'any_description',
        fromEmailContact: {
          email: emailFrom as Email,
          name: 'any_name'
        },
        html: 'any_html',
        id: 'any_id',
        status: 'active',
        subject: 'any_subject'
      }
    } as FindEmailTemplateUseCaseDTO.ResultSuccess);
    expect(result.isFailure()).toBeFalsy();
    expect(result.isSuccess()).toBeTruthy();
  });

  it('should return an error when email templates repository return RepositoryError', async () => {
    emailTemplatesRepository.find.mockResolvedValueOnce(
      failure(
        new RepositoryError({
          method: 'find',
          model: 'email template'
        })
      )
    );

    const result = await sut.execute({
      requester: { id: 'any_requester_id' },
      template: {
        id: 'any_id'
      }
    });

    expect(result.value).toEqual(
      new RepositoryError({
        method: 'find',
        model: 'email template'
      })
    );
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should return an error when email templates repository return email template undefined', async () => {
    emailTemplatesRepository.find.mockResolvedValueOnce(success({ emailTemplate: undefined }));

    const result = await sut.execute({
      requester: { id: 'any_requester_id' },
      template: { id: 'any_id' }
    });

    expect(result.value).toEqual(new EmailTemplateError({ motive: 'is not exist' }));
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });
});
