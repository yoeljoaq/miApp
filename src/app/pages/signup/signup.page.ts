import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HelperService } from 'src/app/services/helper.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  regForm: FormGroup

  showPassword = false;
  passwordToggleIcon = 'eye';

  constructor(
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public authService: AuthenticationService,
    public router: Router,
    public helperService: HelperService
  ) {}

  ngOnInit() {
    this.regForm = this.formBuilder.group({
      fullname: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern("[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern("^(?=.*[A-Z0-9])(?=.*[0-9])(?=.*[A-Z]).{8,}$"),
        ],
      ],
    });
  }

  get errorControl() {
    return this.regForm?.controls;
  }

  async signUp() {
    const loading = await this.helperService.showLoading("Cargando...");

    try {
      if (this.regForm?.valid) {
        const user = await this.authService.registerUser(
          this.regForm.value.email,
          this.regForm.value.password
        );
        if (user) {
          await this.helperService.showToast("Usuario registrado exitosamente");
          loading.dismiss();
          // Redirigir al usuario a su perfil de datos después de registrarse
          this.router.navigate(['/home']);
        }
      } else {
        await this.helperService.showAlert("Formulario inválido", "Error");
        loading.dismiss();
      }
    } catch (error: any) {
      if (error.code == 'auth/invalid-email') {
        await loading.dismiss();
        await this.helperService.showAlert("Error en el formato del correo", "Error");
      } else {
        console.error(error);
        await loading.dismiss();
        await this.helperService.showAlert("El correo ya está registrado", "Error");
      }
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;

    if (this.passwordToggleIcon == 'eye') {
      this.passwordToggleIcon = 'eye-off';
    } else {
      this.passwordToggleIcon = 'eye';
    }
  }
}

