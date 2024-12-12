import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-vervehiculo',
  templateUrl: './vervehiculo.page.html',
  styleUrls: ['./vervehiculo.page.scss'],
})
export class VervehiculoPage {
  
  vehiculos: any[] = [];

  constructor(public alertController: AlertController) {
    

    const vehiculosGuardados = localStorage.getItem('vehiculos');
    if (vehiculosGuardados) {
      this.vehiculos = JSON.parse(vehiculosGuardados);
    }
  }

  // Función para confirmar la eliminación de un vehículo
  async confirmarEliminarVehiculo(index: number) {
    const vehiculo = this.vehiculos[index];

    const alert = await this.alertController.create({
      header: 'Eliminar Vehículo',
      message: `¿Está seguro de que desea eliminar el vehículo con patente: ${vehiculo.patente}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.eliminarVehiculo(index);
          },
        },
      ],
    });

    await alert.present();
  }

  // Función para pedir un vehículo
  async pedirVehiculo(vehiculo: any) {
    // Mostrar una confirmación para asegurarse de que el usuario quiere pedir el vehículo
    const confirmacion = await this.mostrarConfirmacion();

    if (confirmacion) {
      // Si el usuario confirma, verifica los datos del vehículo
      this.verificarDatosVehiculo(vehiculo);
    } else {
      // Si el usuario cancela, muestra una notificación triste
      this.mostrarCaritaTriste();
    }
  }

  // Función para mostrar una confirmación al usuario
  async mostrarConfirmacion(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertController.create({
        header: '¿Está seguro?',
        message: '¿Está seguro de que desea pedir este vehículo?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              resolve(false);
            },
          },
          {
            text: 'OK',
            handler: () => {
              resolve(true);
            },
          },
        ],
      });

      await alert.present();
    });
  }

  // Función para verificar los datos del vehículo
  async verificarDatosVehiculo(vehiculo: any) {
    // Después de verificar los datos, muestra un mensaje con los detalles del vehículo
    const alert = await this.alertController.create({
      header: 'Verifica los Datos',
      subHeader: 'Al llegar tu chofer, por favor verifica los siguientes datos:',
      message: `Vehículo: ${vehiculo.patente}\nTipo: ${vehiculo.tipoVehiculo}\nConductor: ${vehiculo.conductor}`,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            
          },
        },
      ],
    });

    await alert.present();
  }

  // Función para mostrar una notificación triste
  async mostrarCaritaTriste() {
    const alert = await this.alertController.create({
      header: 'Cancelado',
      message: 'Has cancelado la solicitud del vehículo. 😢',
      buttons: ['OK'],
    });

    await alert.present();
  }

  // Función para eliminar un vehículo de la lista
  eliminarVehiculo(index: number) {
    // Elimina un vehículo de la lista por índice.
    this.vehiculos.splice(index, 1);
    // Actualiza los datos en localStorage después de eliminar un vehículo.
    localStorage.setItem('vehiculos', JSON.stringify(this.vehiculos));
  }

  


}





