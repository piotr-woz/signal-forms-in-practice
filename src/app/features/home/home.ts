import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styles: `
    .entering {
      animation: fadeInUp 0.4s ease-in-out;
    }

    @keyframes fadeInUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `,
})
export default class Home {
  private readonly _examples = [
    {
      id: 1,
      title: 'Signal Form 1',
      description: 'Built-in and Custom Validation with Angular Material: A Complete Overview',
      origin: 'https://www.angularspace.com/signal-forms/',
    },
    {
      id: 2,
      title: 'Signal Form 2',
      description: 'Built-in and Custom Validation with daisyUI: Dates Overview',
      origin: 'https://blog.ninja-squad.com/2026/06/03/what-is-new-angular-22.0',
    },
    {
      id: 3,
      title: 'Signal Form 3',
      description: 'Basic implementation with Signal inputs.',
      origin: 'https://www.youtube.com/watch?v=u2Ij-fAyqs4&list=WL&index=3',
    },
  ];

  get examples() {
    return this._examples;
  }

  private readonly dataService = inject(DataService);

  protected onSendExampleData(title: string, origin: string): void {
    this.dataService.setPageData(title, origin);
  }
}
