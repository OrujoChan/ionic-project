import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  AlertController, IonButton, IonCol, IonContent, IonGrid, IonHeader,
  IonIcon, IonInput, IonItem, IonList, IonRouterLink, IonRow, IonTitle, IonToolbar
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';
import { GeolocationService } from '../services/geolocation.service';
import { FacebookLogin } from 'src/app/shared/interfaces/user';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FbLoginDirective } from '../fb-login/fb-login.directive';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [FormsModule, FbLoginDirective, FaIconComponent, RouterLink, IonRouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonGrid, IonRow, IonCol, IonButton, IonIcon]
})
export class LoginPage {
  email = '';
  password = '';
  #navCtrl = inject(NavController);
  fbIcon = faFacebook;
  #authService = inject(AuthService);
  #alertCtrl = inject(AlertController);
  #router = inject(Router);

  login() {
    this.#authService
      .login(this.email, this.password)
      .subscribe({
        next: () => this.#navCtrl.navigateRoot(['/events']),
        error: async (error) => {
          (
            await this.#alertCtrl.create({
              header: 'Login error',
              message: 'Incorrect email and/or password',
              buttons: ['Ok'],
            })
          ).present();
        },
      });
  }

  loggedFacebook(resp: fb.StatusResponse) {
    const facebookLogin: FacebookLogin = {
      token: resp.authResponse.accessToken,
      lat: 0,
      lng: 0,
    };

    GeolocationService.getLocation()
      .then((coords) => {
        facebookLogin.lat = coords.latitude;
        facebookLogin.lng = coords.longitude;
      })
      .catch((err) => {
        console.log(err);
      });

    this.#authService
      .facebookLogin(facebookLogin)
      .pipe()
      .subscribe(() => {
        this.#router.navigate(['/events']);
      });
  }

  showError(error: string) {
    console.error(error);
  }
}