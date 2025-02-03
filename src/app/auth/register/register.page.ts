import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonRouterLink, ToastController, NavController, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonIcon, IonImg, IonButton, IonGrid, IonRow, IonCol, IonLabel } from '@ionic/angular/standalone';
import { User } from '../../shared/interfaces/user';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AuthService } from '../services/auth.service';
import { ValueEqualsDirective } from '../../shared/validators/value-equals.directive';
import { GeolocationService } from '../services/geolocation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [FormsModule, RouterLink, IonRouterLink, ValueEqualsDirective, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonIcon, IonImg, IonButton, IonGrid, IonRow, IonCol, IonLabel],
})
export class RegisterPage {
  user: User = {
    name: '',
    password: '',
    email: '',
    avatar: '',
    lat: 0,
    lng: 0
  };
  password2 = '';

  #authService = inject(AuthService);
  #toastCtrl = inject(ToastController);
  #nav = inject(NavController);
  #changeDetector = inject(ChangeDetectorRef);
  constructor() {


    GeolocationService.getLocation()
      .then((coords) => {
        this.user.lat = coords.latitude;
        this.user.lng = coords.longitude;
      })
      .catch((err) => {
        console.log(err);
        this.user.lat = 0;
        this.user.lng = 0;
      });


  }

  register() {
    this.#authService.register(this.user).subscribe(
      async () => {
        (await this.#toastCtrl.create({
          duration: 3000,
          position: 'bottom',
          message: 'User registered!'
        })).present();
        this.#nav.navigateRoot(['/auth/login']);
      }
    );
  }

  async takePhoto() {
    ;
    const photo = await Camera.getPhoto({
      source: CameraSource.Camera,
      quality: 90,
      height: 200,
      width: 200,
      allowEditing: true,
      resultType: CameraResultType.DataUrl // Base64 (url encoded)
    });

    this.user.avatar = photo.dataUrl as string;
    this.#changeDetector.markForCheck();
  }

  async pickFromGallery() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Photos,
      height: 200,
      width: 200,
      allowEditing: true,
      resultType: CameraResultType.DataUrl // Base64 (url encoded)
    });

    this.user.avatar = photo.dataUrl as string;
    this.#changeDetector.markForCheck();
  }
}