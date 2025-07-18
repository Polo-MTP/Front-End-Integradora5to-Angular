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

@Component({
  selector: 'app-dashboard-layout',
  imports: [AvatarModule,RouterOutlet, BadgeModule, RippleModule, MenuModule, CommonModule, TopMenu],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css'
})
export class DashboardLayout {
  user: User | null = null;
  items: MenuItem[] | undefined;

  constructor(private authService: AuthService) { }


  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      console.log(user);
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
          },
          {
            label: 'search',
            icon: 'pi pi-search',
          },
          {
            label: 'Mis peceras',
            icon: 'pi pi-wrench',
          },
          {
            label: 'Mis pedidos',
            icon: 'pi pi-shopping-cart',
          },
          {
            label: 'configuracion',
            icon: 'pi pi-cog',
          }
        ]
      },
      {
        label: 'Account',
        items: [
          {
            label: 'Profile',
            icon: 'pi pi-user',
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

  logout() {
    this.authService.logout().subscribe();
  }
}
