import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

import { Network} from '@capacitor/network'
import { PluginListenerHandle } from '@capacitor/core';
import { HelperService } from '../services/helper.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage implements OnInit, OnDestroy{
  
  username: string = 'guest';

  networkListener: PluginListenerHandle;
  status:boolean;
  loaded: boolean = false;

  

  constructor(public authService:AuthenticationService,public route:Router,public helper:HelperService,
    private ngZone: NgZone) {

  }
  async ngOnInit(){
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
    }

    setTimeout(() => {
      this.loaded = true; 
    }, 3000); 
    
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



  async logout(){
    var confirmar = await this.helper.showConfirm("Desea cerrar la sesión actual?","Confirmar","Cancelar");
    if (confirmar == true) {
      await this.authService.signOut();
    
      this.route.navigate(['/landing'])
    }
  }

}

