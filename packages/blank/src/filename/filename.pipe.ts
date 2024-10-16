import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FilenamePipe implements PipeTransform {
  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!/[^\u0000-\u00ff]/.test(value.originalname)) {
      value.originalname = Buffer.from(value.originalname, 'latin1').toString(
        'utf8',
      );
    }
    return value;
  }
}
