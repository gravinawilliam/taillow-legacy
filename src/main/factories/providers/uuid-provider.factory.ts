import { IGenerateUuidProvider } from '@domain/contracts/providers/uuid/generate-uuid.provider';

import { UuidProvider } from '@infrastructure/providers/uuid/uuid.provider';

export const makeUuidProvider = (): IGenerateUuidProvider => {
  return new UuidProvider();
};
