import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { filter } from 'rxjs';
import { MENU_ITEMS } from '../../app.constants';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [NgFor, ButtonModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
    activeRoute: string = '';

    items = Object.values(MENU_ITEMS);

    constructor(private router: Router) {
        // Listen for routing events
        this.router.events
            .pipe(
                // tap(event => console.log('event: ', event)),
                filter(event => event instanceof NavigationEnd),
            )
            .subscribe((event: any) => {
                this.items.forEach(it => {
                    if (it.url === event.urlAfterRedirects) it.class = 'active';
                    else it.class = '';
                });

                this.activeRoute = event.urlAfterRedirects; // Get the current route
            });
    }

    goToUrl(itemUrl: string): void {
        this.router.navigateByUrl(itemUrl);
    }
}
