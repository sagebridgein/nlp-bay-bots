import { ToastController } from '@ionic/angular';

export class Toast {

  public toastController: ToastController = new ToastController()

  constructor() {}

  async presentToast(message: string, color: string, cssClass: string, duration: number = 2000, position: 'top' | 'bottom' | 'middle'= 'bottom') {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      color: color,
      position: position,
      cssClass: cssClass
    });
    toast.present();
  }

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      header: 'Toast header',
      message: 'Click to Close',
      position: 'top',
      buttons: [
        {
          side: 'start',
          icon: 'star',
          text: 'Favorite',
          handler: () => {
            console.log('Favorite clicked');
          },
        },
        {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await toast.present();

    const { role } = await toast.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
