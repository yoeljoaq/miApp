import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PluginListenerHandle } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HelperService } from 'src/app/services/helper.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  networkListener: PluginListenerHandle;
  status:boolean;
  loginForm: FormGroup;
  showPassword = false;
  passwordToggleIcon = 'eye';

  constructor(
    public route: Router,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public authService: AuthenticationService,
    public helperService: HelperService,
    public alertService: AlertController,
    public ngZone: NgZone
  ) {}

  async ngOnInit() {
    this.loginForm = this.formBuilder.group({
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
    this.networkListener = await Network.addListener('networkStatusChange', status => {
      console.log('Network status changed', status);
      this.ngZone.run(() =>{
      this.changeStatus(status)
      });
    });
    const status = await Network.getStatus();
    console.log('Network status',status);
  
    this.changeStatus(status);
    console.log('Network status',this.status);
    
  }
  changeStatus(status){
    this.status = status?.connected;
  }

  ngOnDestroy(): void {
    if(this.networkListener) this.networkListener.remove();
    
  

  
  }
  get errorControl() {
    return this.loginForm?.controls;
  }

  async login() {
    const loading = await this.helperService.showLoading("Cargando...");
  
    // Validar si el email y la contraseña han sido ingresados
    if (!this.loginForm.value.email || !this.loginForm.value.password) {
      await loading.dismiss();
      await this.helperService.showAlert("Debes ingresar un email y una contraseña", "Error");
      return;
    }
  
    if (this.loginForm.valid) {
      try {
        // Intenta iniciar sesión con Firebase
        const user = await this.authService.loginUser(this.loginForm.value.email, this.loginForm.value.password);
        
        if (user) {
          // Guardar datos de inicio de sesión en Local Storage
          localStorage.setItem('userEmail', this.loginForm.value.email);
          localStorage.setItem('userPassword', this.loginForm.value.password);
  
          // Navega a la página de inicio
          await loading.dismiss();
          this.route.navigate(['/home']);
        } else {
          // Si no hay usuario, muestra un mensaje de error genérico
          await loading.dismiss();
          this.helperService.showAlert("Credenciales incorrectas. Inténtalo de nuevo.", "Error");
        }
      } catch (error) {
        // En caso de error, asegurarse de detener el loading
        await loading.dismiss();
        console.log(error);
  
        // Verificar si el error proviene de un usuario no encontrado o contraseña incorrecta
        if (error.code === 'auth/user-not-found') {
          this.helperService.showAlert("El correo no está registrado", "Error");
        } else if (error.code === 'auth/wrong-password') {
          this.helperService.showAlert("Contraseña incorrecta", "Error");
        } else if (error.code === 'auth/invalid-email') {
          this.helperService.showAlert("El correo ingresado no es válido", "Error");
        } else {
          // Otro error inesperado
          this.helperService.showAlert("Ocurrió un error inesperado. Inténtalo de nuevo.", "Error");
        }
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
