import { Routes } from '@angular/router';
import { Welcome } from './pages/welcome/welcome';
import { GuestGuard } from './core/guards/guest.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { ClientGuard } from './core/guards/client.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { DashboardLayout } from './pages/layouts/dashboard-layout/dashboard-layout';
import { Account } from './features/dashboard/account/account';
import { Home } from './features/dashboard/home/home';
import { AdminLayout } from './pages/layouts/admin-layout/admin-layout';
import { HomeAdmin } from './features/admin/home-admin/home-admin';
import { Users } from './features/admin/users/users';
import { Sensors } from './features/admin/sensors/sensors';
import { TanksPending } from './features/admin/tanks-pending/tanks-pending';
import { Camera } from './features/dashboard/camera/camera';

export const routes: Routes = [
    {
        path: '',
        component: Welcome,
        pathMatch: 'full',
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
        path: 'dash',
        component: DashboardLayout,
        children:[
            {
                path: 'home',
                component: Home
            },
            {
                path: 'account',
                component: Account
            },
            {
                path: 'camera',
                component: Camera
            }
        ],
        canActivate: [AuthGuard, ClientGuard],
    },
    {
        path: 'admin',
        component: AdminLayout,
        children:[
            {
                path: 'home',
                component: HomeAdmin
            },
            {
                path: 'users',
                component: Users
            },
            {
                path: 'sensors',
                component: Sensors
            },
            {
                path: 'pedidos',
                component: TanksPending
            },
        ],
        canActivate: [AuthGuard, AdminGuard]
    }
];
