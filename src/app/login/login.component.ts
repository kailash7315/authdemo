import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthResponseData, LoginService } from './login.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'login',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    form: FormGroup;
    isLoginMode = true
    isLoading = false
    constructor(private fb: FormBuilder,
        private authService: LoginService,
        private router: Router) {

        this.form = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode
    }

    signup() {

        if (this.form.valid) {
            this.isLoading = true;
            const val = this.form.value;
            let obs: Observable<AuthResponseData>;
            if (this.isLoginMode) {
                obs = this.authService.login(val.email, val.password);
            } else {
                obs = this.authService.signup(val.email, val.password);
            }
            obs.subscribe({
                next: (data: AuthResponseData) => {
                    this.isLoading = false;
                    this.router.navigate(['/dashboard']);
                },
                error: (error: any) => console.log(error),
                complete: () => console.log()
            });
        }
    }
}
