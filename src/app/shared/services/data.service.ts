import { Service, signal, effect } from '@angular/core';

@Service()
export class DataService {
  public readonly pageTitle = signal('');
  public readonly originLink = signal('');

  constructor() {
    const savedTitle = sessionStorage.getItem('pageTitle');
    const savedOrigin = sessionStorage.getItem('originLink');

    if (savedTitle) this.pageTitle.set(savedTitle);
    if (savedOrigin) this.originLink.set(savedOrigin);

    effect(() => {
      sessionStorage.setItem('pageTitle', this.pageTitle());
      sessionStorage.setItem('originLink', this.originLink());
    });
  }

  setPageData(title: string, origin: string): void {
    this.pageTitle.set(title);
    this.originLink.set(origin);
  }
}
