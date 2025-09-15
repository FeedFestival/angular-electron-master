import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FieldsetModule } from 'primeng/fieldset';
import { TabMenu, TabMenuModule } from 'primeng/tabmenu';
import { BOT_ENGINE_PARENT_ROUTE, SUB_MENU_ITEM, SUB_MENU_ITEMS } from '../app.constants';
import { RouterTabMenuComponent } from '../shared/components/router-tab-menu';
import { IMenuItem } from '../shared/model';

@Component({
    selector: 'app-main-op',
    standalone: true,
    imports: [FieldsetModule, TabMenuModule],
    templateUrl: './main-op.component.html',
    styleUrls: ['./main-op.component.scss'],
})
export class MainOpComponent extends RouterTabMenuComponent {
    @ViewChild('tabMenuRef', { static: false }) tabMenuRef?: TabMenu;
    items: IMenuItem[] = [
        {
            label: SUB_MENU_ITEMS[SUB_MENU_ITEM.BLENDER_FILES].name,
            outletRouterLink: SUB_MENU_ITEMS[SUB_MENU_ITEM.BLENDER_FILES].url,
            command: () => {
                this.router.navigate(
                    [{ outlets: { mainoptabview: [SUB_MENU_ITEMS[SUB_MENU_ITEM.BLENDER_FILES].url] } }],
                    {
                        relativeTo: this.route,
                    },
                );
            },
        },
        {
            label: SUB_MENU_ITEMS[SUB_MENU_ITEM.CITY_LOADER].name,
            outletRouterLink: SUB_MENU_ITEMS[SUB_MENU_ITEM.CITY_LOADER].url,
            command: () => {
                console.log('this.route: ', this.route);
                this.router.navigate(
                    [{ outlets: { mainoptabview: [SUB_MENU_ITEMS[SUB_MENU_ITEM.CITY_LOADER].url] } }],
                    {
                        relativeTo: this.route,
                    },
                );
            },
        },
    ];

    protected override readonly outlet = 'mainoptabview';
    protected readonly regex = /\(mainoptabview:([^)]+)\)/;
    protected override readonly PARENT_ROUTE = BOT_ENGINE_PARENT_ROUTE;

    constructor(
        protected readonly router: Router,
        protected readonly route: ActivatedRoute,
    ) {
        super(router, route);
    }
}
