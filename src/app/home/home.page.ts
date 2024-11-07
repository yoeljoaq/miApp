import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet'; // Importar Leaflet
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { Network } from '@capacitor/network';
import { PluginListenerHandle } from '@capacitor/core';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit, OnDestroy {
  username: string = 'guest';
  networkListener: PluginListenerHandle;
  status: boolean = true; 
  loaded: boolean = false;
  map: L.Map;

  constructor(public authService: AuthenticationService, public route: Router, public helper: HelperService, private ngZone: NgZone) {}

  async ngOnInit() {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
    }

    setTimeout(() => {
      this.loaded = true; 
    }, 3000); 

    this.networkListener = await Network.addListener('networkStatusChange', status => {
      this.ngZone.run(() => {
        this.changeStatus(status);
      });
    });
    const status = await Network.getStatus();
    this.changeStatus(status);

    
    this.initializeMap();
  }

  initializeMap() {
    this.map = L.map('map').setView([-33.4489, -70.6693], 13); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    const startMarker = L.marker([-33.4489, -70.6693]).addTo(this.map).bindPopup('Inicio').openPopup();
    const endMarker = L.marker([-33.4500, -70.6700]).addTo(this.map).bindPopup('Destino').openPopup();
  }

  changeStatus(status) {
    this.status = status?.connected;
  }

  ngOnDestroy(): void {
    if (this.networkListener) this.networkListener.remove();
  }

  async logout() {
    const confirmar = await this.helper.showConfirm("Desea cerrar la sesión actual?", "Confirmar", "Cancelar");
    if (confirmar == true) {
      await this.authService.signOut();
      this.route.navigate(['/landing']);
    }
  }
}

