import { Component, OnInit } from "@angular/core";
import { MenuItem } from "primeng/api";
import { MenuModule } from "primeng/menu";
import { BadgeModule } from "primeng/badge";
import { CommonModule } from "@angular/common";
import { RippleModule } from "primeng/ripple";
import { AvatarModule } from "primeng/avatar";
import { RouterOutlet } from "@angular/router";
import { User } from "../../../core/types/auth.types";
import { AuthService } from "../../../core/services/auth.service";
import { TopMenu } from "../../../shared/components/top-menu/top-menu";
import { Router } from "@angular/router";

@Component({
  selector: 'app-admin-layout',
  imports: [AvatarModule,RouterOutlet, BadgeModule, RippleModule, MenuModule, CommonModule, TopMenu],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {
  user: User | null = null;
  items: MenuItem[] | undefined;

  constructor(private authService: AuthService, private router: Router) {}

   ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
    
    this.items = [
      {
        separator: true
      },
      {
        label: 'Home',
        items: [
          {
            label: 'Inicio',
            icon: 'pi pi-home',
            command: () => {
              this.goToPage('/admin/home');
            }
          },
          {
            label: 'Users',
            icon: 'pi pi-users',
            command: () => {
              this.goToPage('/admin/users');
            }
          },
          {
            label: 'Sensors',
            icon: 'pi pi-chart-scatter',
          },
          {
            label: 'Pedidos', 
            icon: 'pi pi-truck',
          },
          {
            label: 'configuracion',
            icon: 'pi pi-cog',
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => {
              this.logout();
            }
          }
        ]
      },
      {
        separator: true
      }
    ]
  }

  goToPage(url: string) {
    this.router.navigate([url]);
  }

  logout() {
    this.authService.logout().subscribe();
  }
}
