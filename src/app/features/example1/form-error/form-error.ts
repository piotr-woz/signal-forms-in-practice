import { Component, input } from '@angular/core';
import { FieldState } from '@angular/forms/signals';

@Component({
  selector: '[app-form-error]',
  template: `
    @for (error of field().errors(); track error.kind) {
      <span>{{ error.message }}</span>
    }
  `,
})
export class FormError {
  public readonly field = input.required<FieldState<any, any>>();
}
