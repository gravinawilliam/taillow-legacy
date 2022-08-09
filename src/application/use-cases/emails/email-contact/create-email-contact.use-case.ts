import { IGenerateUuidProvider } from '@domain/contracts/providers/uuid/generate-uuid.provider';
import { IFindEmailDomainsRepository } from '@domain/contracts/repositories/email/email-domains/find-email-domains.repository';
import { ISaveEmailRegisteredInProvidersRepository } from '@domain/contracts/repositories/email/email-registered-in-providers/save-email-registered-in-providers.repository';
import { EmailDomainError } from '@domain/entities/errors/email/email-domain.error';
import { NotExistModelError } from '@domain/entities/errors/shared/not-exist-model.error';
import { Email } from '@domain/entities/models/email/email.model';
import {
  CreateEmailContactUseCaseDTO,
  ICreateEmailContactUseCase
} from '@domain/use-cases/emails/email-contacts/create-email-contact.use-case';

import { failure, success } from '@shared/utils/either.util';

export class CreateEmailContactUseCase implements ICreateEmailContactUseCase {
  constructor(
    private readonly emailDomainsRepository: IFindEmailDomainsRepository,
    private readonly emailRegisteredInProvidersRepository: ISaveEmailRegisteredInProvidersRepository,
    private readonly uuidProvider: IGenerateUuidProvider
  ) {}

  public async execute(parameters: CreateEmailContactUseCaseDTO.Parameters): CreateEmailContactUseCaseDTO.Result {
    const resultCreatedEmail = Email.create({ email: parameters.emailContact.email });
    if (resultCreatedEmail.isFailure()) {
      return failure(resultCreatedEmail.value);
    }

    const email = resultCreatedEmail.value;

    const [, domainEmail] = email.value.split('@');
    const resultFindDomain = await this.emailDomainsRepository.find({
      domain: domainEmail
    });
    if (resultFindDomain.isFailure()) {
      return failure(resultFindDomain.value);
    }
    if (resultFindDomain.value.emailDomain === undefined) {
      return failure(
        new NotExistModelError({
          model: 'Email domain'
        })
      );
    }
    if (resultFindDomain.value.emailDomain.requester.id !== parameters.requester.id) {
      return failure(
        new EmailDomainError({
          motive: 'does not belong to the requester'
        })
      );
    }

    const resultGenerateUuid = this.uuidProvider.generate();
    if (resultGenerateUuid.isFailure()) return failure(resultGenerateUuid.value);

    const resultSaveEmailRegisteredInProvider = await this.emailRegisteredInProvidersRepository.save({
      emailRegisteredInProvider: {
        id: resultGenerateUuid.value.uuid,
        email,
        provider: {
          aws: {
            status: 'pending'
          }
        }
      }
    });
    if (resultSaveEmailRegisteredInProvider.isFailure()) {
      return failure(resultSaveEmailRegisteredInProvider.value);
    }

    return success({
      emailContact: {
        id: resultGenerateUuid.value.uuid
      }
    });
  }
}
