import { SchemaPath, validate } from '@angular/forms/signals';

interface BookingDate {
  start: Date;
  end: Date;
}

export interface BookingData {
  guestName: string;
  email: string;
  dateOfBirth: Date;
  date: BookingDate;
}

export const bookingDataInitialState: BookingData = {
  guestName: '',
  email: '',
  dateOfBirth: getEighteenYearsAgo(),
  date: {
    start: new Date(),
    end: new Date(),
  },
};
/* --------------------------------------------------------------------------- */

// custom validator to ensure the user is at least 18 years old
export function getEighteenYearsAgo(): Date {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  return date;
}

// custom validator to ensure start date is before end date
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
