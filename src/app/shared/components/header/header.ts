import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
})
export class Header {
  private readonly dataService = inject(DataService);

  protected readonly pageTitle = this.dataService.pageTitle;
  protected readonly originLink = this.dataService.originLink;
}
