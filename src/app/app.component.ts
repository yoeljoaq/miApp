import { Component } from '@angular/core';
import { BackbuttonService } from './services/backbutton.service';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private backButtonService: BackbuttonService,
    private platform: Platform 
  ) {

    this.initializeApp();
    this.showSplash();
  }

  async showSplash(){
    await SplashScreen.show({
      autoHide: true,
      showDuration:2000
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.backButtonService.init(); 
    });
  }
}

