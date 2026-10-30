import { BadRequestException } from '@nestjs/common';

const allowedTypes = [
  'string',
  'number',
  'boolean',
] as const;

export function validateContentTypeSchema(
  schema: Record<string, any>,
): void {
  for (const [fieldName, fieldDefinition] of Object.entries(schema)) {
    if (
      typeof fieldDefinition !== 'object' ||
      fieldDefinition === null
    ) {
      throw new BadRequestException(
        `Invalid definition for field "${fieldName}"`,
      );
    }

    if (
      !allowedTypes.includes(fieldDefinition.type)
    ) {
      throw new BadRequestException(
        `Invalid type for field "${fieldName}"`,
      );
    }

    if (
      typeof fieldDefinition.required !== 'boolean'
    ) {
      throw new BadRequestException(
        `"required" for field "${fieldName}" must be boolean`,
      );
    }
  }
  
}