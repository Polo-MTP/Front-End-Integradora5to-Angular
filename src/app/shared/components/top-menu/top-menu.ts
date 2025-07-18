
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { Ripple } from 'primeng/ripple';
import { Menubar } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-top-menu',
  imports: [BadgeModule, AvatarModule, InputTextModule, CommonModule, Ripple, CommonModule, Menubar, ButtonModule],
  templateUrl: './top-menu.html',
  standalone:true,
  styleUrl: './top-menu.css'
})
export class TopMenu implements OnInit {

  items: MenuItem[] | undefined;

  ngOnInit(): void {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
      },
      {
        label: 'Proyects',
        icon: 'pi pi-briefcase',
        badge: '2',
        items: [
          {
            label: 'core',
            icon: 'pi pi-circle-on',
            shortcut: 'Ctrl+1'
          },
          {
            separator: true
          },
          {
            label: 'admin',
            icon: 'pi pi-circle-on',
            shortcut: 'Ctrl+2'
          },
        ]
      }
    ]
  }

  toggleDarkMode() {
  const className = 'my-app-dark';
  const element = document.documentElement;
  const hasDark = element.classList.contains(className);

  if (hasDark) {
    element.classList.remove(className);
    localStorage.setItem('theme', 'light');
  } else {
    element.classList.add(className);
    localStorage.setItem('theme', 'dark');
  }
}

}
