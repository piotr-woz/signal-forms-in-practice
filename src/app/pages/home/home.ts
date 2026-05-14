import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styles: `
    .entering {
      animation: fadeInUp 0.4s ease-in-out both;
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Home {
  protected readonly examples = [
    {
      id: 1,
      title: 'Basic Signal Form 1',
      description: 'Built-in and Custom Validation with Angular Material: A Complete Overview',
      origin: 'https://www.angularspace.com/signal-forms/',
    },
    {
      id: 2,
      title: 'Basic Signal Form 2',
      description: 'Basic implementation with Signal inputs.',
      origin: 'https://www.angularspace.com/signal-forms/',
    },
    {
      id: 3,
      title: 'Basic Signal Form 3',
      description: 'Basic implementation with Signal inputs.',
      origin: 'https://www.angularspace.com/signal-forms/',
    },
  ];

  private readonly _dataService = inject(DataService);

  protected onSendExampleData(title: string, origin: string): void {
    this._dataService.setPageData(title, origin);
  }
}
