import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  form!: FormGroup;
  langue: 'fr' | 'ar' = 'fr';

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private auth: AuthService) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    const q = this.route.snapshot.queryParamMap.get('lang');
    if (q === 'ar') {
      this.langue = 'ar';
    }
  }

  submitting = false;

  submit() {
    if (this.form.invalid) return;
    this.submitting = true;
    const { username, password } = this.form.value as { username: string; password: string };
    // Simple in-memory auth
    const ok = this.auth.login(username, password);
    this.submitting = false;
    if (ok) {
      this.router.navigateByUrl('/dashboard');
    }
  }
}
