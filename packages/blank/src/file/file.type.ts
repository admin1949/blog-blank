import { Prisma } from '@prisma/client';
import { Types, ExtArgs } from '../type';

type FileInfo = Prisma.Prisma__ProjectClient<
  Types.Result.GetResult<Prisma.$FilePayload<ExtArgs>, {}, 'findUnique'> | null,
  null,
  ExtArgs
>;

export type FileBO = NonNullable<Awaited<FileInfo>>;
