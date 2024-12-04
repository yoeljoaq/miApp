import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet'; // Importar Leaflet
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { Network } from '@capacitor/network';
import { PluginListenerHandle } from '@capacitor/core';
import { HelperService } from '../services/helper.service';
import { WeatherService } from '../weather.service'; 
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  username: string = 'guest';
  networkListener: PluginListenerHandle;
  status: boolean = true; 
  loaded: boolean = false;
  map: L.Map;
  weatherData: any; 
  city = 'Santiago'; 

  constructor(
    public authService: AuthenticationService,
    public route: Router,
    public helper: HelperService,
    private ngZone: NgZone,
    private weatherService: WeatherService 
  ) {}

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
    this.getWeather();
  }
  getCapitalizedDescription(): string {
    const description = this.weatherData?.weather[0]?.description || '';
    return description.charAt(0).toUpperCase() + description.slice(1).toLowerCase();
  }

  initializeMap() {
    this.map = L.map('map').setView([-33.4489, -70.6693], 13); // Centro en Santiago

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

   
    const startMarker = L.marker([-33.4489, -70.6693]).addTo(this.map).bindPopup('Inicio').openPopup();
    const endMarker = L.marker([-33.4500, -70.6700]).addTo(this.map).bindPopup('Destino').openPopup();
  }

  changeStatus(status) {
    this.status = status?.connected;
  }

  getWeather() {
    this.weatherService.getWeather(this.city).subscribe(
      data => {
        this.weatherData = data;
        console.log(this.weatherData); 
      },
      error => {
        console.error('Error al obtener el clima', error);
      }
    );
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
