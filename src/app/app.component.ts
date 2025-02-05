
import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonImg, Platform, IonApp, IonSplitPane, NavController, IonMenu, IonContent, IonList, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink, IonAvatar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp, arrowUndoCircle, camera, checkmarkCircle, logIn, documentText, images, thumbsDown, thumbsUp, closeCircle, chatboxEllipses, informationCircle, navigateCircleOutline, navigateOutline, exit, image, add, logoGoogle } from 'ionicons/icons';
import { User } from './shared/interfaces/user';
import { AuthService } from './auth/services/auth.service';
import { SocialLogin } from '@capgo/capacitor-social-login';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonAvatar, IonImg, RouterLink, RouterLinkActive, IonApp, IonSplitPane, IonMenu,
    IonContent, IonList, IonMenuToggle, IonItem, IonIcon, IonLabel,
    IonRouterLink, IonRouterOutlet],
})
export class AppComponent {

  user = signal<User | null>(null);
  #authService = inject(AuthService);
  #nav = inject(NavController)
  #platform = inject(Platform);
  public appPages = [
    { title: 'Home', url: '/events', icon: 'paper-plane' },
    { title: 'New event', url: '/events/new', icon: 'paper-plane' },

  ];

  constructor() {

    this.initializeApp();
    addIcons({
      arrowUndoCircle, camera, checkmarkCircle, mailSharp, logIn, documentText, paperPlaneSharp,
      images, thumbsDown, exit, thumbsUp, closeCircle, chatboxEllipses, informationCircle,
      navigateCircleOutline, navigateOutline, trashOutline, image, add, logoGoogle
    });
    effect(() => {
      if (this.#authService.isLogged()) {
        this.#authService.getUser().subscribe((user) => (this.user.set(user)));
      } else {
        this.user.set(null);
      }
    });



  }

  async logout() {
    await this.#authService.logout();
    this.#nav.navigateRoot(['/auth/login']);
    window.location.reload();
  }

  async initializeApp() {
    if (this.#platform.is('mobile')) {
      await this.#platform.ready();
      await SocialLogin.initialize({
        google: {
          webClientId: '807310250745-cbmittpejj8k45moascj72jeo30i7slj.apps.googleusercontent.com', // the web client id for Android and Web
          mode: 'offline' // replaces grantOfflineAccess
        },
        facebook: {
          appId: '639376935328081',
          clientToken: '220465b47c8d891de3c0fbcf25e5c1fe',
        },
      });
    }
  }


}
