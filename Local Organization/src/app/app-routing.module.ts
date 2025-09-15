import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

import { MAIN_MENU_ITEM, SUB_MENU_ITEM, SUB_MENU_ITEMS } from './app.constants';
import { HomeRoutingModule } from './home/home-routing.module';

const routes: Routes = [
    {
        path: '',
        redirectTo: MAIN_MENU_ITEM.HOME,
        pathMatch: 'full',
    },
    {
        path: MAIN_MENU_ITEM.MAIN_OP,
        loadComponent: () => import('./main-op').then(m => m.MainOpComponent),
        children: [
            {
                path: SUB_MENU_ITEMS[SUB_MENU_ITEM.BLENDER_FILES].url,
                outlet: 'mainoptabview',
                loadComponent: () => import('./main-op').then(m => m.BlenderFilesComponent),
            },
            {
                path: SUB_MENU_ITEMS[SUB_MENU_ITEM.CITY_LOADER].url,
                outlet: 'mainoptabview',
                loadComponent: () => import('./main-op').then(m => m.CityLoaderComponent),
            },
        ],
    },
    {
        path: '**',
        component: PageNotFoundComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: false }), HomeRoutingModule],
    exports: [RouterModule],
})
export class AppRoutingModule {}
