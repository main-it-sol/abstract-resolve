import { Routes } from '@angular/router';
import { HomePage } from '../pages/home-page';
import { UsersPage } from '../pages/users-page';
import { HomeResolver } from '../services/home-resolver';
import { UsersResolver } from '../services/users-resolver';

export const routes: Routes = [
    { 
        path: 'home', 
        component: HomePage,
        resolve: {
            tableSource: HomeResolver
        }
     },
     { 
        path: 'users', 
        component: UsersPage,
        resolve: {
            tableSource: UsersResolver
        }
     },
    { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
