import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'node:fs';
import { join, extname } from 'node:path';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = join(process.cwd(), 'uploads', 'players');
const PUBLIC_PREFIX = '/uploads/players';

interface UploadedFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class LocalPhotoUploader {
  private readonly logger = new Logger('LocalPhotoUploader');

  async save(userId: string, file: UploadedFile): Promise<string> {
    if (!file?.buffer) {
      throw new BadRequestException('No se recibió archivo');
    }
    if (!ALLOWED_MIME.has(file.mimetype)) {
      throw new BadRequestException(
        `Tipo no permitido. Usa: ${[...ALLOWED_MIME].join(', ')}`,
      );
    }
    if (file.size > MAX_BYTES) {
      throw new BadRequestException('Imagen demasiado grande (máximo 5 MB)');
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const ext = pickExt(file);
    const filename = `${userId}-${uuidv4()}${ext}`;
    const absolutePath = join(UPLOAD_DIR, filename);
    await fs.writeFile(absolutePath, file.buffer);

    this.logger.log(`✅ Foto guardada: ${filename}`);
    return `${PUBLIC_PREFIX}/${filename}`;
  }
}

function pickExt(file: UploadedFile): string {
  const original = extname(file.originalname).toLowerCase();
  if (original === '.jpg' || original === '.jpeg') return '.jpg';
  if (original === '.png') return '.png';
  if (original === '.webp') return '.webp';
  if (file.mimetype === 'image/jpeg') return '.jpg';
  if (file.mimetype === 'image/png') return '.png';
  if (file.mimetype === 'image/webp') return '.webp';
  return '.bin';
}
