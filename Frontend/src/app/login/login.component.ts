import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  form!: FormGroup;
  langue: 'fr' | 'ar' = 'fr';
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private notification: NotificationService
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    const q = this.route.snapshot.queryParamMap.get('lang');
    if (q === 'ar') {
      this.langue = 'ar';
    }
  }

  submit() {
    if (this.form.invalid) return;

    this.submitting = true;
    const { username, password } = this.form.value as { username: string; password: string };

    this.auth.login(username, password).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.submitting = false;
        console.error('Erreur login', err);
        this.notification.error('Identifiants incorrects ou compte non autorisé');
      },
    });
  }
}