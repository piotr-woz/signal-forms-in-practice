import { Component, model, input, output } from '@angular/core';
import { FormValueControl, WithOptionalFieldTree, ValidationError } from '@angular/forms/signals';

@Component({
  selector: 'app-input',
  template: `
    <div class="form-control max-w-xs mt-8">
      <input
        class="input input-bordered w-full"
        type="text"
        [value]="value()"
        (input)="value.set($event.target.value)"
        [disabled]="disabled()"
        [readonly]="readonly()"
        [attr.name]="name()"
        (blur)="touch.emit()"
      />

      <div class="error-label-box">
        @if (invalid() && touched()) {
          <div class="label" role="alert">
            @for (error of errors(); track error.kind) {
              <span class="label-text-alt text-xs text-error">{{ error.message }}</span>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .error-label-box {
      min-height: 20px;
      margin-top: 3px;
      overflow: hidden;
    }
  `,
})
export class Input implements FormValueControl<string> {
  readonly value = model<string>('');

  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly name = input('');

  readonly required = input(false);
  readonly invalid = input(false);
  readonly touched = input<boolean>(false);
  readonly touch = output<void>();

  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
}
