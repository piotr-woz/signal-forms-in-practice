import { Component, model, input, output } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-input',
  template: `
    <div class="mt-8">
      <input
        type="text"
        [value]="value()"
        (input)="value.set($event.target.value)"
        [disabled]="disabled()"
        [attr.name]="name()"
        (blur)="touch.emit()"
      />
    </div>
  `,
  styles: ``,
})
export class Input implements FormValueControl<string> {
  readonly value = model<string>('');

  readonly disabled = input(false);
  readonly name = input('');
  readonly invalid = input(false);
  readonly required = input(false);
  readonly readonly = input(false);

  readonly touched = input<boolean>(false);
  readonly touch = output<void>();
}
