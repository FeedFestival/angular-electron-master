import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MENU_ITEMS } from './navigation.constants';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit {

    menuItems = MENU_ITEMS.__list();

    constructor(
        private _router: Router
    ) {
    }

    ngOnInit() {
        // this.fs = this.electronService.remote.require('fs');


    }

    navigate(menuUrl) {
        this._router.navigateByUrl(menuUrl);
    }
}
