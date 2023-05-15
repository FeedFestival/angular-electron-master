import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IMenuItems, MENU_ITEMS } from './navigation.constants';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

    menuItems: IMenuItems[] = MENU_ITEMS.__list();

    constructor(
        private _router: Router
    ) {
    }

    ngOnInit() {
        // this.fs = this.electronService.remote.require('fs');


    }

    navigate(menuItem: IMenuItems) {
        this.menuItems.forEach(m => {
            if (m.code === menuItem.code) {
                m.active = true;
            } else {
                m.active = false;
            }
        })
        this._router.navigateByUrl(menuItem.url);
    }
}
