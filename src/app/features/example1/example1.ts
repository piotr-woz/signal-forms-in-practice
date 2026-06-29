import { Component, signal, computed, effect } from '@angular/core';
import {
  form,
  FormField,
  required,
  email,
  minLength,
  apply,
  validate,
  submit,
  validateTree,
  hidden,
  provideSignalFormsConfig,
  debounce,
} from '@angular/forms/signals';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { FormError } from './form-error/form-error';

import {
  UserProfile,
  userProfileInitialState,
  userProfileSchema,
  numericOnly,
} from './user-profile';

@Component({
  selector: 'app-example1',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckbox,
    MatButton,
    FormField,
    RouterLink,
    Header,
    FormError,
  ],
  templateUrl: './example1.html',
  styles: `
    input.is-invalid.is-touched {
      color: #ba1a1a;
    }
  `,
  providers: [
    provideSignalFormsConfig({
      classes: {
        'is-invalid': (field) => field.state().invalid(),
        'is-touched': (field) => field.state().touched(),
      },
    }),
  ],
})
export default class Example1 {
  private readonly userModel = signal<UserProfile>(userProfileInitialState);

  protected readonly userForm = form(this.userModel, (path) => {
    /* First name and Last name validation with schema */
    (apply(path.firstName, userProfileSchema),
      apply(path.lastName, userProfileSchema),
      debounce(path.firstName, 'blur'), // we can implement debounce() for all form fields: debounce(path, 'blur')
      debounce(path.lastName, 'blur'),
      /* --------------------------------------------------------------------------- */

      /* Phone validation with custom validator function */
      // phone number must contain only numbers
      numericOnly(path.phone, 'phone', { message: 'The phone number must contain only numbers.' }),
      /* --------------------------------------------------------------------------- */

      /* Email validation */
      // email is required only if email marketing is checked
      required(path.email, {
        when: ({ valueOf }) => valueOf(path.emailMarketing),
        message: 'This is a required field.',
      }),
      email(path.email, { message: 'The email address is not valid.' }),
      /* --------------------------------------------------------------------------- */

      /* Password validation */
      // password must contain at least one number, one special character and one uppercase letter (custom validator)
      validate(path.password, ({ value }): { message: string; kind: string } | null => {
        const password = value();
        if (!password) return null;

        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasUpper = /[A-Z]/.test(password);

        if (!hasNumber) {
          return {
            message: 'Password must contain at least one number.',
            kind: 'password_with_no_number',
          };
        }
        if (!hasSpecial) {
          return {
            message: 'Password must contain at least one special character.',
            kind: 'password_with_no_special_character',
          };
        }
        if (!hasUpper) {
          return {
            message: 'Password must contain at least one uppercase letter.',
            kind: 'password_with_no_uppercase_letter',
          };
        }

        return null;
      }),
      // password must be at least 8 characters long
      minLength(path.password, 8, {
        message: (password) =>
          `Password should have at least 8 characters but has only ${password.value().length}`,
      }),
      /* --------------------------------------------------------------------------- */

      /* Confirm password validation */
      // confirm password field is hidden if password is empty
      hidden(path.confirmPassword, { when: ({ valueOf }) => valueOf(path.password) === '' }),
      // confirm password must match password (custom validator)
      validate(
        path.confirmPassword,
        ({ value, valueOf }): { message: string; kind: string } | null => {
          return value() === valueOf(path.password)
            ? null
            : { message: 'Passwords do not match.', kind: 'confirmPassword' };
        },
      ));

    // validateTree(path, ({ value, fieldTreeOf }) => {
    //   return value().confirmPassword === value().password
    //     ? null
    //     : [
    //         {
    //           message: 'Passwords do not match.',
    //           kind: 'confirmPassword',
    //           fieldTree: fieldTreeOf(path.confirmPassword),
    //         },
    //         {
    //           message: 'Passwords do not match.',
    //           kind: 'confirmPassword',
    //           fieldTree: fieldTreeOf(path.password),
    //         },
    //       ];
    // })
  });

  constructor() {
    // this.userForm.firstName().value.set('Peter');
    // effect(() => {
    //   console.log(this.userForm.firstName().value());
    // });
  }

  protected readonly fullName = computed(
    () => `${this.userModel().firstName} ${this.userModel().lastName}`,
  );

  /* Submit Handler */
  protected async onSubmit(event: SubmitEvent) {
    event.preventDefault();
    console.log(this.userForm().value());
    // async logic that returns either undefined (success) or array of errors
    await submit(this.userForm, async (form) => {
      try {
        // await this.userService.saveForm(form().value()); // call to API to save our form data (example1)

        // const { email, password } = form().value(); // destructuring of the form value to get the email and password for authentication after saving the form data (example2)
        // return this.userService.authenticate(email, password);

        form().reset(userProfileInitialState);
        return undefined;
      } catch (error) {
        // simulate server error for first name field
        return [
          {
            message: (error as Error).message,
            kind: 'serverError',
            fieldTree: form.firstName,
          },
        ];
      }
    });

    // 👇 automatically focus the first field with an error
    const firstError = this.userForm().errorSummary()[0];
    if (firstError?.fieldTree) {
      firstError.fieldTree().focusBoundControl();
    }

    // const errors = this.userForm().errorSummary();
    // if (errors.length > 0) {
    //   errors[0].fieldTree().focusBoundControl();
    // }
  }

  /* With fetch */
  // protected async onSubmit(event: SubmitEvent) {
  //   event.preventDefault();
  //   await submit(this.userForm, async (form) => {
  //     try {
  //       await fetch('https://api.example.com/user-profile', {
  //         method: 'PUT',
  //         body: JSON.stringify(form().value()),
  //       });
  //       form().reset(userProfileInitialState);
  //       return undefined;
  //     }
  //   });
  // }
}

/* --------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------- */
/*
1. Built-in validators include:
  required(path) - a signal indicating whether the field is required
  min(path, minValue) - for numbers, a signal indicating the field's minimum value, if applicable (numeric/date inputs & custom controls)
  max(path, maxValue) - a signal indicating the field's maximum value, if applicable (numeric/date inputs & custom controls)
  minLength(path, length) - for strings and arrays, a signal indicating the field's minimum string length, if applicable (<input>, <textarea>, custom controls)
  maxLength(path, length) - a signal indicating the field's maximum string length, if applicable (<input>, <textarea>, custom controls)
  pattern(path, regex) ...for example pattern(path.zip, /[0-9]{5}/), a signal indicating patterns the field must match (array of RegExp)
  email(path)
  minDate(path, minDate) ...for example minDate(path.birthDate, new Date('1900-01-01'))
  maxDate(path, maxDate) ...for example maxDate(path.birthDate, new Date())

  debounce(path, time) ...for example debounce(path.email, 400) - delays validation by specified time in milliseconds, useful for validations that require async operations such as API calls to check if email is already taken
  debounce(path, 'blur') - delays validation until the field is blurred, useful for validations that require async operations such as API calls to check if email is already taken
 */

/*
2. In custom validation, ctx object gives access to:
  ctx.value() - current field value
  ctx.valueOf(path) - value of another field
  ctx.state() - touched/dirty state
  ctx.stateOf(path) - state of another field
 */

/*
3a. We can access all individual fields from our form:
  this.userForm.firstName().value.set("Peter");
  this.userForm.firstName().value();

3b. We can access the state of individual fields, such as:
touched() - a signal indicating whether the field has been touched by the user
dirty() - a signal indicating whether field value has been changed by user
valid() / invalid() / pending() - a signal indicating whether the field is valid or invalid and whether there are any validators still pending for this field
name() -	a signal containing the field's unique name, typically based on its parent field name
value() -	a writable signal containing the field’s value; updates sync with the bound data model

errors() - a signal containing the current errors for the field (if any)
errorSummary() - a signal containing the errors of the field and its descendants - sub-fields (if any)
disabled() - a signal indicating whether the field is currently disabled
disabledReasons() - a signal containing the reasons why the field is currently disabled
hidden() - a signal indicating whether a field is hidden
readonly() - a signal indicating whether the field is currently readonly - field is not editable but its value is still included in the form value, field is not taken into account when calculating form validity
submitting() - a signal indicating whether the field is currently in the process of being submitted
markAsTouched() / markAsDirty() - to mark the field as touched/dirty

Based on the logic we have defined using the Schema and the state derived from user actions (touched, dirty), we get the FieldState for every node in the FieldTree. To retrieve the FieldState, navigate to a node in the FieldTree and invoke it as a function.

  this.userForm.phone(); - returns the `FieldState` object for the `phone` field
  this.userForm.phone().dirty(); - reads the value of the `dirty` signal

3c. And we can also acccess that information on the entire form
  this.userForm().value(); // returns the entire form value
  this.userForm().valid(); // returns true or false
 */

/*
4. markAsTouched() - marks a field and all its descendants as touched, instead of only the field itself. This behavior can be overridden by passing { skipDescendants: true } as an argument to the method (v22).
 */

/*
5. validateAsync() and validateHttp() - asynchronous validators of a field that return a Promise. The field is marked as pending until the Promise is resolved. If the Promise resolves to undefined, the field is valid. If it resolves to an error object or an array of error objects, the field is invalid and the errors are set on the field.

...for example:
validateHttp(path.email, {
  // httpResource is triggered when the email signal changes
  request: email => `/api/users/check?email=${email.value()}`,
  // specify a debounce duration to avoid sending a request on every keystroke
  debounce: 400,
  // ...
});

reloadValidation() - method added to allow to easily re-run the asynchronous validators of a field. When called on a field, it will re-run the asynchronous validators of this field and all its descendants, by calling the reload() method of the underlying resources. This matches what we could do in legacy forms with updateValueAndValidity().
 */

/*
There are now three variations of debouncing in Angular:
    - you can debounce a form field value on input with: debounce(field, delay)
    - you can debounce an asynchronous validator with: validateHttp(field, { debounce: delay })
    - or you can debounce any signal value with: debounced(signal, delay)
 */
