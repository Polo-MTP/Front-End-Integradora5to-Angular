// 2. COMPONENTE ACCOUNT CORREGIDO (account.component.ts)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { Avatar } from 'primeng/avatar';
import { User } from '../../../core/types/auth.types';
import { AuthService } from '../../../core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-account',
  imports: [
    CommonModule,
    CardModule,
    FloatLabelModule,
    DividerModule,
    Avatar,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    ToastModule
  ],
  templateUrl: './account.html',
  styleUrl: './account.css',
  providers: [NotificationService]
})
export class Account implements OnInit {
  user: User | null = null;
  form!: FormGroup;
  errors: string[] = [];
  error: string = '';
  uploading = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;

      this.form = this.formBuilder.group({
        fullName: [
          user?.fullName,
          [Validators.required, Validators.minLength(3)],
        ],
        email: [user?.email, [Validators.required, Validators.email]],
      });
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const updateUser = this.form.value;

    this.authService.updateUser(updateUser).subscribe({
      next: () => {
        this.notificationService.success('Perfil actualizado correctamente');
      },
      error: (error) => {
        this.notificationService.error(error);
      },
    });
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    console.log('Archivo seleccionado:', file); 
    
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        this.notificationService.error('Solo se permiten imágenes (JPG, PNG, WEBP)');
        return;
      }

      if (file.size > 2 * 1024 * 1024) { 
        this.notificationService.error('La imagen debe ser menor a 2MB');
        return;
      }

      this.uploadProfileImage(file);
    }
  }

  private uploadProfileImage(file: File) {
    this.uploading = true;
    this.error = ''; 

    this.authService.updateProfileImage(file).subscribe({
      next: (response) => {
        this.uploading = false;
        const currentUser = this.authService.getCurrentUser();
        if (currentUser && response.user) {
          const updatedUser = { ...currentUser, profileImage: response.user.profileImage };
          this.authService.updateUserInfo(updatedUser);
        }

        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        this.notificationService.success('Imagen de perfil actualizada correctamente');

        this.uploading = false;
      },
      error: (error) => {
        console.error('Error en upload:', error); 
        this.uploading = false;
        this.error = error.error?.message || 'Error al subir la imagen';
        
        this.notificationService.error(error);
      },
    });
  }
}