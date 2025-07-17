import { Routes } from '@angular/router';
import { Welcome } from './pages/welcome/welcome';
import { GuestGuard } from './core/guards/guest.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { ClientGuard } from './core/guards/client.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { DashboardLayout } from './pages/layouts/dashboard-layout/dashboard-layout';

export const routes: Routes = [
    {
        path: '',
        component: Welcome,
        canActivate: [GuestGuard]
    },
    {
        path: 'login',
        component: Login,
        canActivate: [GuestGuard]
    },
    {
        path: 'register',
        component: Register,
        canActivate: [GuestGuard]
    },
    {
        path: 'dashboard',
        component: DashboardLayout,
        children:[
            {
                path: 'prueba',
                component: Login
            },
        ],
        canActivate: [AuthGuard, ClientGuard],
    },
    {
        path: 'admin-dashboard',
        component: Welcome,
        canActivate: [AuthGuard, AdminGuard]
    }
];
