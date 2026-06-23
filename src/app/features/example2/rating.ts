import { Component, model, input, output } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-rating',
  template: `
    <div class="mt-8">
      @let v = value();
      @for (pickableValue of pickableValues; track pickableValue) {
        <button
          class="me-2 px-2 py-1 rounded-md cursor-pointer"
          [class.selected]="v != null && pickableValue <= v"
          type="button"
          (click)="value.set(pickableValue)"
          [disabled]="disabled()"
          (blur)="touch.emit()"
        >
          {{ pickableValue }}
        </button>
      }
    </div>
  `,
  styles: `
    .selected {
      background-color: #ff31ce;
    }
  `,
})
export class Rating implements FormValueControl<number | null> {
  readonly value = model<number | null>(null);
  readonly disabled = input(false);

  readonly touched = input<boolean>(false);
  readonly touch = output<void>();

  protected readonly pickableValues = [0, 1, 2, 3, 4, 5];
}
