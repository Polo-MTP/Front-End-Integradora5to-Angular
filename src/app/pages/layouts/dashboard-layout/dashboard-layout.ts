import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { RouterOutlet } from '@angular/router';
import { User } from '../../../core/types/auth.types';
import { AuthService } from '../../../core/services/auth.service';
import { TopMenu } from '../../../shared/components/top-menu/top-menu';
import { Router } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    AvatarModule,
    RouterOutlet,
    BadgeModule,
    RippleModule,
    MenuModule,
    CommonModule,
    TopMenu,
    DrawerModule,
    ButtonModule,
  ],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {
  user: User | null = null;
  items: MenuItem[] | undefined;
  isMobile: boolean = false;
  drawerVisible: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
    });

    this.items = [
      {
        separator: true,
      },
      {
        label: 'Home',
        items: [
          {
            label: 'Inicio',
            icon: 'pi pi-home',
            command: () => {
              this.goToPage('/dash/home');
            },
          },
          {
            label: 'Mis Peceras',
            icon: 'pi pi-box',
            command: () => {
              this.goToPage('/dash/Tanks');
            },
          },
          {
            label: 'Camera',
            icon: 'pi pi-camera',
            command: () => {
              this.goToPage('/dash/camera');
            },
          },
          {
            label: 'configuraciones',
            icon: 'pi pi-calendar-clock',
            command: () => {
              this.goToPage('/dash/configs');
            },
          },
        ],
      },
      {
        label: 'Account',
        items: [
          {
            label: 'Profile',
            icon: 'pi pi-user',
            command: () => {
              this.goToPage('/dash/account');
            },
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => {
              this.logout();
            },
          },
        ],
      },
      {
        separator: true,
      },
    ];

    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
        console.log('Breakpoint:', this.isMobile);
      });
  }

  onMenuItemClick(item: MenuItem, event: Event) {
    if (item.command) {
      item.command({ originalEvent: event, item });
    }

    if (this.isMobile) {
      this.drawerVisible = false;
    }
  }

  goToPage(url: string) {
    this.router.navigate([url]);
    if (this.isMobile) {
      this.drawerVisible = false;
    }
  }

  logout() {
    this.authService.logout().subscribe();
  }
}
