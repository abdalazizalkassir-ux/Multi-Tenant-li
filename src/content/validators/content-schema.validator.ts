import { BadRequestException } from '@nestjs/common';

type FieldType = 'string' | 'number' | 'boolean';

interface SchemaField {
  type: FieldType;
  required: boolean;
}

type ContentSchema = Record<string, SchemaField>;

export function validateContentData(
  schema: ContentSchema,
  data: Record<string, any>,
): void {
  // 1. Check required fields
  for (const [fieldName, fieldDefinition] of Object.entries(schema)) {
    if (
      fieldDefinition.required &&
      !(fieldName in data)
    ) {
      throw new BadRequestException(
        `Field "${fieldName}" is required`,
      );
    }
  }

  // 2. Check for unknown fields
  for (const fieldName of Object.keys(data)) {
    if (!(fieldName in schema)) {
      throw new BadRequestException(
        `Unknown field "${fieldName}"`,
      );
    }
  }

  // 3. Check field types
  for (const [fieldName, fieldDefinition] of Object.entries(schema)) {
    if (!(fieldName in data)) {
      continue;
    }

    const value = data[fieldName];

    if (
      fieldDefinition.type === 'string' &&
      typeof value !== 'string'
    ) {
      throw new BadRequestException(
        `Field "${fieldName}" must be a string`,
      );
    }

    if (
      fieldDefinition.type === 'number' &&
      (
        typeof value !== 'number' ||
        Number.isNaN(value)
      )
    ) {
      throw new BadRequestException(
        `Field "${fieldName}" must be a number`,
      );
    }

    if (
      fieldDefinition.type === 'boolean' &&
      typeof value !== 'boolean'
    ) {
      throw new BadRequestException(
        `Field "${fieldName}" must be a boolean`,
      );
    }
  }
}