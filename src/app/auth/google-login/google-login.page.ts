import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonIcon, IonLabel, IonAvatar, IonImg, IonList, IonItem } from '@ionic/angular/standalone';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { GoogleUser } from 'src/app/shared/interfaces/user';

@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.page.html',
  styleUrls: ['./google-login.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonButton, IonIcon, IonLabel, IonAvatar, IonImg, IonList, IonItem]
})
export class GoogleLoginPage {
  user = signal<GoogleUser | null>(null);

  async login() {
    try {
      await SocialLogin.initialize({
        google: {
          webClientId: '807310250745-cbmittpejj8k45moascj72jeo30i7slj.apps.googleusercontent.com',
          mode: 'offline',
        },
      });

      const resp = await SocialLogin.login({
        provider: 'google',
        options: {
          scopes: ['email', 'profile'],
        },
      });

      if (resp.result.responseType === 'online') {
        this.user.set(resp.result.profile);
        console.log(resp.result.idToken);
      }
    } catch (err) {
      console.error(err);
    }
  }
}
