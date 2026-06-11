import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import {
  form,
  FormField,
  required,
  email,
  submit,
  provideSignalFormsConfig,
  SchemaPath,
  validate,
  minDate,
  maxDate,
} from '@angular/forms/signals';
import { JsonPipe, NgTemplateOutlet } from '@angular/common';

interface BookingDate {
  start: Date;
  end: Date;
}

interface BookingData {
  guestName: string;
  email: string;
  date: BookingDate;
}

const bookingDataInitialState: BookingData = {
  guestName: '',
  email: '',
  date: {
    start: new Date(),
    end: new Date(),
  },
};

export function startDateMustBeBeforeEndDate(path: SchemaPath<BookingDate>): void {
  validate(path, (ctx) => {
    const startDate = ctx.fieldTree.start().value();
    const endDate = ctx.fieldTree.end().value();

    if (!startDate || !endDate) {
      return null;
    }

    const start = new Date(startDate).setHours(0, 0, 0, 0);
    const end = new Date(endDate).setHours(0, 0, 0, 0);

    return end >= start
      ? null
      : {
          message: 'End date must be the same as or after the start date.',
          kind: 'invalid_date_range',
        };
  });
}

@Component({
  selector: 'app-example2',
  imports: [RouterLink, Header, FormField, JsonPipe, NgTemplateOutlet],
  templateUrl: './example2.html',
  styles: `
    .error-label-box {
      min-height: 20px;
      margin-top: 3px;
      overflow: hidden;
    }

    .error-label-start {
      transform: translateY(0);
      transition: transform 0.25s ease-in-out;
      @starting-style {
        transform: translateY(-100%);
      }
    }

    .error-label-leave {
      transform: translateY(-100%);
      transition: transform 0.25s ease-in-out;
    }

    .is-invalid {
      color: #ff5861 !important;
    }
  `,
  providers: [
    provideSignalFormsConfig({
      classes: {
        'is-invalid': (field) => field.state().invalid() && field.state().touched(),
      },
    }),
  ],
})
export default class Example2 {
  focused = signal(false);

  private readonly bookingModel = signal<BookingData>(bookingDataInitialState);

  protected readonly bookingForm = form(this.bookingModel, (path) => {
    required(path.guestName, { message: 'Required' });
    required(path.email, { message: 'Required' });
    email(path.email, { message: 'Invalid email' });
    startDateMustBeBeforeEndDate(path.date);
    minDate(path.date.start, new Date());
    maxDate(path.date.end, new Date('2026-12-31'));
  });

  protected readonly lastSubmission = signal<BookingData | null>(null);

  protected async onSubmit(event: SubmitEvent) {
    event.preventDefault();
    const success = await submit(this.bookingForm, async (form) => {
      console.log('Form is valid, submitting...', this.bookingModel());
      // simulate API call
      // const result = await fetch('https://api.example.com/booking', {
      //   method: 'PUT',
      //   body: JSON.stringify(form().value()),
      // });

      const result = { ok: true }; // simulate successful response
      // const result = { ok: false }; // simulate failed response
      this.lastSubmission.set(form().value());

      if (result.ok) return;
      return [
        {
          message: 'Failed to save',
          kind: 'serverError',
          fieldTree: form.guestName,
        },
      ];
    });
    if (success) {
      this.bookingForm().reset(bookingDataInitialState);
      this.focused.set(false);
    }
  }
}
