import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { Network } from '@capacitor/network';
import { PluginListenerHandle } from '@capacitor/core';
import { HelperService } from '../services/helper.service';
import { WeatherService } from '../weather.service';
import { AlertController, ToastController } from '@ionic/angular';

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
  startPoint: L.LatLng | null = null;
  endPoint: L.LatLng | null = null;
  passengerData: { name: string; contact: string; note: string } | null = null;
  hasActiveTrip: boolean = false; // Para verificar si ya hay un viaje en curso
  weatherData: any;
  city = 'Santiago';

  constructor(
    public authService: AuthenticationService,
    public route: Router,
    public helper: HelperService,
    private ngZone: NgZone,
    private weatherService: WeatherService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) this.username = storedUsername;

    setTimeout(() => (this.loaded = true), 3000);

    this.networkListener = await Network.addListener('networkStatusChange', (status) =>
      this.ngZone.run(() => this.changeStatus(status))
    );
    const status = await Network.getStatus();
    this.changeStatus(status);

    this.initializeMap();
    this.getWeather();
  }

  initializeMap() {
    this.map = L.map('map').setView([-33.4489, -70.6693], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
  }

  async startTrip() {
    if (this.hasActiveTrip) {
      const alert = await this.alertCtrl.create({
        header: 'Ya tienes un viaje en curso',
        message: '¿Deseas cancelar el viaje actual?',
        buttons: [
          {
            text: 'Cancelar viaje',
            handler: () => {
              this.cancelTrip();
            },
          },
          {
            text: 'OK',
            role: 'cancel',
          },
        ],
      });
      await alert.present();
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Selecciona el punto de partida',
      message: 'Haz clic en el mapa para elegir el punto de partida.',
      buttons: ['OK'],
    });
    await alert.present();

    this.map.once('click', (e: L.LeafletMouseEvent) => {
      this.startPoint = e.latlng;
      L.marker(this.startPoint).addTo(this.map).bindPopup('Punto de partida').openPopup();
      this.selectEndPoint();
    });
  }

  async selectEndPoint() {
    const alert = await this.alertCtrl.create({
      header: 'Selecciona el punto de llegada',
      message: 'Haz clic en el mapa para elegir el punto de llegada.',
      buttons: ['OK'],
    });
    await alert.present();

    this.map.once('click', (e: L.LeafletMouseEvent) => {
      this.endPoint = e.latlng;
      L.marker(this.endPoint).addTo(this.map).bindPopup('Punto de llegada').openPopup();
      this.showPassengerForm();
    });
  }

  async showPassengerForm() {
    const alert = await this.alertCtrl.create({
      header: 'Datos del pasajero',
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Nombre' },
        { name: 'contact', type: 'tel', placeholder: 'Número de contacto' },
        { name: 'note', type: 'text', placeholder: 'Nota para el conductor' },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: (data) => {
            this.passengerData = data;
            this.confirmTrip();
          },
        },
      ],
    });
    await alert.present();
  }

  async confirmTrip() {
    this.hasActiveTrip = true;
    const toast = await this.toastCtrl.create({
      message: 'Viaje confirmado',
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }

  cancelTrip() {
    this.startPoint = null;
    this.endPoint = null;
    this.passengerData = null;
    this.hasActiveTrip = false;
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });
  }

  changeStatus(status) {
    this.status = status?.connected;
  }
  getWeather() {
    this.weatherService.getWeather(this.city).subscribe({
      next: (data) => {
        if (data) {
          this.weatherData = data;
          console.log('Datos del clima:', this.weatherData); // Para depuración
        }
      },
      error: (error) => {
        console.error('Error al obtener el clima', error);
        this.weatherData = null; // Asegúrate de que weatherData esté en un estado seguro
      },
    });
  }
  
  getCapitalizedDescription(): string {
    const description = this.weatherData?.weather?.[0]?.description || '';
    return description ? description.charAt(0).toUpperCase() + description.slice(1).toLowerCase() : 'Sin descripción';
  }



  ngOnDestroy(): void {
    if (this.networkListener) this.networkListener.remove();
  }

  async logout() {
    const confirmar = await this.helper.showConfirm('¿Desea cerrar la sesión actual?', 'Confirmar', 'Cancelar');
    if (confirmar) {
      await this.authService.signOut();
      this.route.navigate(['/landing']);
    }
  }
}
