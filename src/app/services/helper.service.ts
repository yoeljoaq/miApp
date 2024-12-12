import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    private alertService: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private modalController: ModalController
  ) {}

  async showAlert(msg: string, title: string, buttons: any[] = ['Aceptar']): Promise<void> {
    const alert = await this.alertService.create({
      cssClass: "alertClass",
      header: title,
      message: msg,
      buttons: buttons
    });
    await alert.present();
  }

  async showConfirm(msg: string, btn_confirmar: string, btn_cancelar: string): Promise<boolean> {
    const promise = new Promise<boolean>(async (resolve) => {
      const alert = await this.alertService.create({
        cssClass: "confirmarCss",
        message: msg,
        buttons: [
          {
            text: btn_confirmar,
            handler: () => {
              resolve(true);
            }
          },
          {
            text: btn_cancelar,
            handler: () => {
              resolve(false);
            }
          }
        ]
      });
      await alert.present();
    });
    return promise;
  }

  async showLoading(msg: string): Promise<HTMLIonLoadingElement> {
    const loader = await this.loadingController.create({
      cssClass: "loaderCss",
      message: msg,
      translucent: true
    });
    await loader.present();
    return loader;
  }

  async showToast(msg: string, duracion: number = 3000, color: string = 'dark'): Promise<void> {
    const toast = await this.toastController.create({
      cssClass: "toastCss",
      position: 'bottom',
      color: color,
      message: msg,
      duration: duracion
    });
    await toast.present();
  }

  async showModal(componente: any, props: any = {}, dismiss = false): Promise<void> {
    const modal = await this.modalController.create({
      cssClass: "cssModal",
      component: componente,
      componentProps: props,
      backdropDismiss: dismiss
    });
    await modal.present();
  }

  /**
   * Muestra una alerta con inputs personalizables.
   * @param header Título de la alerta.
   * @param message Mensaje de la alerta.
   * @param inputs Lista de inputs para el formulario.
   * @param buttons Botones personalizados para la alerta.
   */
  async showAlertWithInputs(header: string, message: string, inputs: any[], buttons: any[]): Promise<void> {
    const alert = await this.alertService.create({
      header,
      message,
      inputs,
      buttons
    });
    await alert.present();
  }
}
