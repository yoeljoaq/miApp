import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregarvehiculo',
  templateUrl: './agregarvehiculo.page.html',
  styleUrls: ['./agregarvehiculo.page.scss'],
})
export class AgregarvehiculoPage {

  patente: string = '';
  tipoVehiculo: string = '';
  conductor: string = '';
  vehiculos: any[] = [];

  
  constructor(public alertController: AlertController, private router: Router) {
    const vehiculosGuardados = localStorage.getItem('vehiculos');
    if (vehiculosGuardados) {
      this.vehiculos = JSON.parse(vehiculosGuardados);
    }
  }

  
  capitalizarPrimeraLetra(cadena: string): string {
    return cadena.replace(/\b\w/g, (letra) => letra.toLocaleUpperCase());
  }

  
  async agregarVehiculo() {
    
    if (!this.patente || !this.tipoVehiculo || !this.conductor) {
      this.mostrarAlert('Por favor, complete todos los campos.');
      return;
    }

    const conductorCapitalizado = this.capitalizarPrimeraLetra(this.conductor);

    // Verificar si la patente ya existe en la lista de vehículos.
    const vehiculoExistente = this.vehiculos.find((v) => v.patente === this.patente);
    if (vehiculoExistente) {
      this.mostrarAlert('La patente ya existe.');
      return;
    }

    // Si pasa todas las validaciones, agrega el vehículo a la lista.
    this.vehiculos.push({
      patente: this.patente,
      tipoVehiculo: this.tipoVehiculo,
      conductor: conductorCapitalizado,
    });

    // Guardar la lista de vehículos en localStorage
    localStorage.setItem('vehiculos', JSON.stringify(this.vehiculos));

    // Limpia los campos después de agregar el vehículo.
    this.patente = '';
    this.tipoVehiculo = '';
    this.conductor = '';

    
    const alert = await this.alertController.create({
      header: 'Vehículo agregado exitosamente',
      message: '',
      buttons: [
        {
          text: 'Continuar Agregando',
          handler: () => {
            // Opción 1: Continuar agregando vehículos
          },
        },
        {
          text: 'Visualizar Vehículos',
          handler: () => {
            // Opción 2: Visualizar vehículos agregados
            this.visualizarVehiculos();
          },
        },
        {
          text: 'Volver a Inicio',
          handler: () => {
            // Opción 3: Volver a home
            this.volverAHome();
          },
        },
      ],
    });

    await alert.present();
  }

  // Función para eliminar un vehículo de la lista por índice
  eliminarVehiculo(index: number) {
    this.vehiculos.splice(index, 1); // Elimina un vehículo de la lista
    localStorage.setItem('vehiculos', JSON.stringify(this.vehiculos)); // Actualiza los datos en localStorage
    this.mostrarAlert('Vehículo eliminado.');
  }

  // Función para visualizar vehículos agregados
  visualizarVehiculos() {
    this.router.navigate(['/vervehiculo']);
  }

  // Función para volver a home
  volverAHome() {
    this.router.navigate(['/home']);
  }

  
  async mostrarAlert(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK'],
    });

    await alert.present();
  }

  
}





