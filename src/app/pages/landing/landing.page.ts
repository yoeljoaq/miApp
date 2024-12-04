import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage {
  constructor(
    private loadingCtrl: LoadingController,
    private router: Router
  ) {}

  async performAction() {
    
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      spinner: 'circles', 
    });
    
    await loading.present();

    
    setTimeout(async () => {
      await loading.dismiss(); 
      console.log('Proceso completado');
      
      
      this.router.navigate(['/login']);
    }, 1500); 
}
}
