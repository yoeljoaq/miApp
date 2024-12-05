import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class BackbuttonService {
  private lastTimeBackButtonWasPressed = 0;
  private timePeriod = 2000; 

  constructor(
    private platform: Platform,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  init() {
    this.platform.backButton.subscribeWithPriority(10, async () => {
      const currentUrl = this.router.url;

      if (currentUrl === '/landing') {
        
        this.withDoublePress('Toca de nuevo para salir', () => {
          navigator['app'].exitApp(); 
        });
      }
    });
  }

  private async withDoublePress(message: string, action: () => void) {
    const currentTime = new Date().getTime();

    if (currentTime - this.lastTimeBackButtonWasPressed < this.timePeriod) {
      action(); 
    } else {
      
      const toast = await this.toastController.create({
        message: message,
        duration: this.timePeriod, 
        position: 'bottom',
      });

      await toast.present();
      this.lastTimeBackButtonWasPressed = currentTime;
    }
  }
}
