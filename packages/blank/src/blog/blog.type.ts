import { Prisma } from '@prisma/client';
import { Types, ExtArgs } from '../type';
import { FileBO } from '../file/file.type';

type FafindUnique = {
  include: {
    avatar: true;
    pics: {
      include: {
        file: true;
      };
    };
  };
};

type BlogInfo = Prisma.Prisma__ProjectClient<
  Types.Result.GetResult<
    Prisma.$ProjectPayload<ExtArgs>,
    FafindUnique,
    'findUnique'
  > | null,
  null,
  ExtArgs
>;

export type BlogVO = Omit<NonNullable<Awaited<BlogInfo>>, 'pics'> & {
  pics: FileBO[];
};

export type BlogBO = Omit<Prisma.ProjectCreateInput, 'avatar' | 'pics'> & {
  avatarFileId: number;
  picIds: number[];
};
