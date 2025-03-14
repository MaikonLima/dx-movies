import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    const credentials = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };

    this.http.post('http://localhost:3000/auth/login', credentials).subscribe(
      (response: any) => {
        this.loading = false;
        this.snackBar.open('Login realizado com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.router.navigate(['/users']);
      },
      (error) => {
        this.loading = false;
        this.snackBar.open(
          'Erro ao realizar login. Verifique suas credenciais.',
          'Fechar',
          {
            duration: 3000,
          }
        );
        console.error('Erro no login:', error);
      }
    );
  }
}
