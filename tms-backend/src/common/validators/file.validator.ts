import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { BadRequestException } from '@nestjs/common';

@ValidatorConstraint({ name: 'isPDF', async: false })
export class IsPDFValidator implements ValidatorConstraintInterface {
  validate(file: Express.Multer.File, args: ValidationArguments) {
    if (!file) {
      return true; // Let @IsNotEmpty() handle required validation
    }

    // Check file extension
    if (!file.originalname.toLowerCase().endsWith('.pdf')) {
      return false;
    }

    // Check MIME type
    if (file.mimetype !== 'application/pdf') {
      return false;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return false;
    }

    // Check magic bytes (PDF files start with %PDF)
    const buffer = file.buffer;
    if (buffer && buffer.length >= 4) {
      const header = buffer.toString('ascii', 0, 4);
      if (header !== '%PDF') {
        return false;
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'File must be a valid PDF (max 10MB)';
  }
}

// Custom decorator for easier use
export function IsPDF(validationOptions?: any) {
  return function (object: Object, propertyName: string) {
    // This is a placeholder - actual implementation would use registerDecorator
    // For now, we'll implement the validation logic in the service
  };
}

// Utility function to validate PDF files in services
export function validatePDFFile(file: Express.Multer.File): void {
  if (!file) {
    throw new BadRequestException('No file provided');
  }

  // Check file extension
  if (!file.originalname.toLowerCase().endsWith('.pdf')) {
    throw new BadRequestException('File must be a PDF file');
  }

  // Check MIME type
  if (file.mimetype !== 'application/pdf') {
    throw new BadRequestException('File must have application/pdf MIME type');
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    throw new BadRequestException('File size must be less than 10MB');
  }

  // Check magic bytes (PDF files start with %PDF)
  const buffer = file.buffer;
  if (buffer && buffer.length >= 4) {
    const header = buffer.toString('ascii', 0, 4);
    if (header !== '%PDF') {
      throw new BadRequestException('File is not a valid PDF (invalid magic bytes)');
    }
  }
}