import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,],
  templateUrl: './app.html',
  providers: [MessageService],
  styleUrl: './app.scss'
})
export class App {
  protected title = 'Integradora-Front-Pecera';
}
