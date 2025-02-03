import { Routes } from "@angular/router";

export const eventsRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./home/home.page').then(
                (m) => m.HomePage
            ),
    },
];