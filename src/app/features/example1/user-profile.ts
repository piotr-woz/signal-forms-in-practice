import { Schema, schema, required, minLength, SchemaPath, validate } from '@angular/forms/signals';

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  emailMarketing: boolean;
  password: string;
  confirmPassword: string;
}

export const userProfileInitialState: UserProfile = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  emailMarketing: false,
  password: '',
  confirmPassword: '',
};
/* --------------------------------------------------------------------------- */

// reusable schema for first name and last name fields
export const userProfileSchema: Schema<string> = schema<string>((path: SchemaPath<string>) => {
  required(path, { message: 'This is a required field.' });
  minLength(path, 3, {
    message: (input) =>
      `This needs to be more than three characters but has only ${input.value().length}`,
  });
});

// In the Schema we declaretively define the logic of our form.
// You can think the Schema as a function that accepts a SchemaPath and defines the logic for it.
// SchemaPath is an object that represents a location in the FieldTree structure. It is used within a Schema to bind logic (such as validation or disabled rules) to that location.

// custom validator to allow only numeric input
export function numericOnly(
  path: SchemaPath<string>,
  kind: string,
  options?: { message: string },
): void {
  validate(path, ({ value }): { message: string; kind: string } | null => {
    const val = value();
    if (!val) return null;

    const isValid = /^\d+$/.test(val);
    return isValid
      ? null
      : {
          message: options?.message || 'This input must contain only numbers.',
          kind: kind,
        };
  });
}
