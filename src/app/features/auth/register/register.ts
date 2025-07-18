import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';

@Component({
  selector: 'app-register',
  imports: [
    FloatLabelModule, 
    CommonModule,
    CardModule, 
    ButtonModule, 
    ReactiveFormsModule, 
    InputTextModule, 
    RouterModule, 
    FileUploadModule,
    StepperModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  loginForm: FormGroup;
  aquariumForm: FormGroup;
  loading = false;
  canAccessNextSteps = false; 
  error: string = '';
  profileImage: File | null = null;
  currentStep = 1;
  userRegistered = false;

  constructor(
    private form: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.form.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.aquariumForm = this.form.group({
      aquariumName: [''],
      aquariumSize: [''],
      aquariumType: [''],
      fishCount: [''],
      description: ['']
    });
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.profileImage = file;
    }
  }

  onSubmitUser() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';

      const formData = new FormData();
      formData.append('fullName', this.loginForm.value.fullName);
      formData.append('email', this.loginForm.value.email);
      formData.append('password', this.loginForm.value.password);

      if (this.profileImage) {
        formData.append('profileImage', this.profileImage);
      }

      this.authService.register(formData).subscribe({
        next: () => {
          this.loading = false;
          this.userRegistered = true;
          this.canAccessNextSteps = true;
          this.currentStep = 2;
        },
        error: (error) => {
          this.loading = false;
          this.error = error.message;
        }
      });
    }
  }

  onSubmitAquarium() {
    if (this.aquariumForm.valid) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      }, 1000);
    }
  }

  skipAquarium() {
    this.router.navigate(['/dashboard']);
  }

  goToStep(step: number) {
    this.currentStep = step;
  }
}