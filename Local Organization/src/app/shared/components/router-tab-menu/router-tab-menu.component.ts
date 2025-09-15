import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationSkipped, Router } from '@angular/router';
import { TabMenu } from 'primeng/tabmenu';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { IMenuItem } from '../../model';

@Component({
    selector: 'pom-router-tab-menu',
    standalone: true,
    imports: [],
    template: 'This component support only extensions',
})
export class RouterTabMenuComponent implements OnInit, OnDestroy {
    @ViewChild('tabMenuRef', { static: false }) tabMenuRef?: TabMenu;
    items!: IMenuItem;
    activeItem!: IMenuItem;

    protected outlet = 'entitytabview';
    protected readonly regex = /\(entitytabview:([^)]+)\)/;
    protected readonly PARENT_ROUTE: string = '';

    private outletActiveIndex = 0;
    private readonly checkDefaultTabMenu$ = new Subject();
    protected readonly destroyed$ = new Subject();

    constructor(
        protected readonly router: Router,
        protected readonly route: ActivatedRoute,
    ) {
        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe(event => {
            if (event instanceof NavigationEnd) {
                if (event.url === this.PARENT_ROUTE) {
                    this.setInitialActiveTabMenu();
                } else if (event.url.indexOf(this.outlet) >= 0) {
                    this.setOutletActiveIndex(event.url);
                }
            } else if (event instanceof NavigationSkipped) {
                this.setOutletActiveIndex(event.url);
            }
        });

        this.checkDefaultTabMenu$
            .pipe(
                takeUntil(this.destroyed$),
                debounceTime(250),
                tap(() => this.setOutletActiveIndex(window.location.href, true)),
            )
            .subscribe();
    }

    ngOnInit(): void {
        this.setInitialActiveTabMenu(this.outletActiveIndex);
    }

    ngOnDestroy(): void {
        this.destroyed$.next(0);
        this.destroyed$.complete();
    }

    private setInitialActiveTabMenu(index = 0, force = false): void {
        if (!force && this.activeItem?.outletRouterLink === this.items[index].outletRouterLink) {
            this.checkDefaultTabMenu$.next(0);
            return;
        }
        if (!this.tabMenuRef) {
            this.activeItem = this.items[index];
            this.activeItem!.command!({});
        } else {
            this.tabMenuRef.itemClick({ preventDefault: () => {} } as any, this.items[index]);
        }
    }

    private setOutletActiveIndex(url: string, forceSetActiveTabMenu = false): void {
        const outletRouterLink = this.getOutletRouterLink(url);
        if (outletRouterLink) {
            this.outletActiveIndex = this.items.findIndex(
                (it: IMenuItem) => it.outletRouterLink === outletRouterLink,
            );
        } else if (forceSetActiveTabMenu) {
            this.outletActiveIndex = 0;
            this.setInitialActiveTabMenu(this.outletActiveIndex, true);
        }
    }

    private getOutletRouterLink(url: string): string {
        const match = this.regex.exec(url);
        return match?.[1]!;
    }
}
