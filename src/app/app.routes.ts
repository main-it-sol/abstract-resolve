import { Routes } from '@angular/router';
import { BaseComponent } from '../components/base-component/base-component';
import { HomeResolver } from '../services/home-resolver';
import { UsersResolver } from '../services/users-resolver';

export const routes: Routes = [
    { 
        path: 'home', 
        component: BaseComponent,
        resolve: {
            concreteClass: HomeResolver
        }
     },
     { 
        path: 'users', 
        component: BaseComponent,
        resolve: {
            concreteClass: UsersResolver
        }
     },
    { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
