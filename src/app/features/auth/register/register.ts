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

@Component({
  selector: 'app-login',
  imports: [FloatLabelModule, CommonModule,CardModule, ButtonModule, ReactiveFormsModule, InputTextModule, RouterModule, FileUploadModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})

export class Register {
  loginForm: FormGroup;
  loading = false;
  error: string = '';
  profileImage: File | null = null;

  constructor(
    private form:FormBuilder,
    private authService: AuthService,
    private router: Router
  ){
    this.loginForm = this.form.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.profileImage = file;
    }
  }

  onSubmit(){
    if(this.loginForm.valid){
      this.loading = true;
      this.error = '';

      const formData = new FormData();
      formData.append('fullName', this.loginForm.value.fullName);
      formData.append('email', this.loginForm.value.email);
      formData.append('password', this.loginForm.value.password);

      if(this.profileImage){
        formData.append('profileImage', this.profileImage);
      }

      this.authService.register(formData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.message;
        }
      })
    }
  }
}
