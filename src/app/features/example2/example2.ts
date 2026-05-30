import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import {
  form,
  FormField,
  required,
  email,
  submit,
  provideSignalFormsConfig,
} from '@angular/forms/signals';
import { JsonPipe } from '@angular/common';
import { NgTemplateOutlet } from '@angular/common';

interface UserLoginData {
  username: string;
  email: string;
}

const userLoginDataInitialState: UserLoginData = {
  username: '',
  email: '',
};

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Example2 {
  focused = signal(false);

  protected readonly userLoginData = signal<UserLoginData>(userLoginDataInitialState);

  protected readonly userLoginForm = form(this.userLoginData, (path) => {
    required(path.username, { message: 'Required' });
    required(path.email, { message: 'Required' });
    email(path.email, { message: 'Invalid email' });
  });

  protected readonly lastSubmission = signal<UserLoginData | null>(null);

  protected async onSubmit(event: SubmitEvent) {
    event.preventDefault();
    await submit(this.userLoginForm, async (form) => {
      console.log('Form is valid, submitting...', this.userLoginData());
      this.lastSubmission.set(form().value());
      form().reset(userLoginDataInitialState);
      this.focused.set(false);
      return undefined;
    });
  }
}
