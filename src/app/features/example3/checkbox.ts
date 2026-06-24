import { Component, model } from '@angular/core';
import { FormCheckboxControl } from '@angular/forms/signals';

@Component({
  selector: 'app-checkbox',
  template: `
    <div class="form-control mt-3">
      <label class="label">
        <input
          type="checkbox"
          [checked]="checked()"
          (change)="checked.set($event.target.checked)"
          class="checkbox checkbox-md"
        />
        <ng-content></ng-content>
      </label>
    </div>
  `,
  styles: ``,
})
export class Checkbox implements FormCheckboxControl {
  readonly checked = model(false);
}
