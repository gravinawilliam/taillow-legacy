import {
  FindEmailDomainsRepositoryDTO,
  IFindEmailDomainsRepository
} from '@domain/contracts/repositories/email/email-domains/find-email-domains.repository';
import { RepositoryError } from '@domain/entities/errors/shared/repository.error';

import { prisma } from '@infrastructure/database/prisma/prisma';

import { failure, success } from '@shared/utils/either.util';

export class EmailDomainsPrismaRepository implements IFindEmailDomainsRepository {
  public async find(parameters: FindEmailDomainsRepositoryDTO.Parameters): FindEmailDomainsRepositoryDTO.Result {
    try {
      const resultFind = await prisma.emailDomain.findFirst({
        where: {
          domain: parameters.domain
        }
      });

      if (resultFind === null) {
        return success({ emailDomain: undefined });
      }

      return success({
        emailDomain: {
          domain: resultFind.domain,
          requester: {
            id: resultFind.requesterId
          }
        }
      });
    } catch (error: any) {
      return failure(
        new RepositoryError({
          method: 'find',
          model: 'email template',
          error
        })
      );
    }
  }
}
