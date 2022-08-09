import {
  FindEmailTemplatesRepositoryDTO,
  IFindEmailTemplatesRepository
} from '@domain/contracts/repositories/email/email-templates/find-email-templates.repository';
import {
  ISaveEmailTemplatesRepository,
  SaveEmailTemplatesRepositoryDTO
} from '@domain/contracts/repositories/email/email-templates/save-email-templates.repository';
import { RepositoryError } from '@domain/entities/errors/shared/repository.error';
import { EmailTemplateStatus } from '@domain/entities/models/email/email-template.model';
import { Email } from '@domain/entities/models/email/email.model';

import { prisma } from '@infrastructure/database/prisma/prisma';

import { failure, success } from '@shared/utils/either.util';

export class EmailTemplatesPrismaRepository implements IFindEmailTemplatesRepository, ISaveEmailTemplatesRepository {
  public async find(parameters: FindEmailTemplatesRepositoryDTO.Parameters): FindEmailTemplatesRepositoryDTO.Result {
    try {
      const result = await prisma.emailTemplate.findFirst({
        where: {
          id: parameters.template.id,
          requesterId: parameters.template.requester.id
        },
        include: { fromEmailContact: true }
      });

      if (result === null) {
        return success({ emailTemplate: undefined });
      }

      const createdFromEmail = Email.create({
        email: result.fromEmailContact.email
      });
      if (createdFromEmail.isFailure()) {
        return failure(
          new RepositoryError({
            method: 'find',
            // eslint-disable-next-line sonarjs/no-duplicate-string
            model: 'email template',
            error: {
              message: `Could not create email from email template ${result.fromEmailContact.email}`,
              name: 'EmailError'
            }
          })
        );
      }

      return success({
        emailTemplate: {
          description: result.description,
          fromEmailContact: {
            id: result.fromEmailContactId,
            email: createdFromEmail.value,
            name: result.fromEmailContact.name
          },
          html: result.html,
          id: result.id,
          subject: result.subject,
          name: result.name,
          requester: {
            id: result.requesterId
          },
          status: result.status as EmailTemplateStatus
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

  public async save(parameters: SaveEmailTemplatesRepositoryDTO.Parameters): SaveEmailTemplatesRepositoryDTO.Result {
    try {
      await prisma.emailTemplate.create({
        data: {
          description: parameters.emailTemplate.description,
          html: parameters.emailTemplate.html,
          id: parameters.emailTemplate.id,
          name: parameters.emailTemplate.name,
          status: parameters.emailTemplate.status,
          subject: parameters.emailTemplate.subject,
          fromEmailContactId: parameters.emailTemplate.fromEmailContact.id,
          requesterId: parameters.emailTemplate.requester.id
        }
      });

      return success(undefined);
    } catch (error: any) {
      return failure(
        new RepositoryError({
          method: 'save',
          model: 'email template',
          error
        })
      );
    }
  }
}
