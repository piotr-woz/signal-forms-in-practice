import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { form, FormField, required, email, submit } from '@angular/forms/signals';
import { JsonPipe } from '@angular/common';

interface LoginData {
  username: string;
  email: string;
}

@Component({
  selector: 'app-example2',
  imports: [RouterLink, Header, FormField, JsonPipe],
  templateUrl: './example2.html',
  styles: `
    .label-box {
      min-height: 21px;
      margin-top: 4px;
      overflow: hidden;
    }

    .label-start {
      transform: translateY(0);
      transition: all 0.25s ease-in-out;
      @starting-style {
        transform: translateY(-100%);
      }
    }

    .label-leave {
      transform: translateY(-100%);
      transition: all 0.25s ease-in-out;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Example2 {
  focused = signal(false);

  signalUser = signal<LoginData>({
    username: '',
    email: '',
  });

  signalForm = form(this.signalUser, (schemaPath) => {
    required(schemaPath.username, { message: 'Required' });
    required(schemaPath.email, { message: 'Required' });
    email(schemaPath.email, { message: 'Invalid email' });
  });

  lastSubmission = signal<LoginData | null>(null);

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.signalForm, async (form) => {
      console.log('Form is valid, submitting...', this.signalUser());
      this.lastSubmission.set({ ...form().value() });
    });
  }
}
