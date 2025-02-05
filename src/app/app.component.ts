
import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonImg, IonApp, IonSplitPane, NavController, IonMenu, IonContent, IonList, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink, IonAvatar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp, arrowUndoCircle, camera, checkmarkCircle, logIn, documentText, images, thumbsDown, thumbsUp, closeCircle, chatboxEllipses, informationCircle, navigateCircleOutline, navigateOutline, exit, image, add } from 'ionicons/icons';
import { User } from './shared/interfaces/user';
import { AuthService } from './auth/services/auth.service';

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
  public appPages = [
    { title: 'Home', url: '/events', icon: 'paper-plane' },
    { title: 'New event', url: '/events/new', icon: 'paper-plane' },

  ];

  constructor() {

    addIcons({
      arrowUndoCircle, camera, checkmarkCircle, mailSharp, logIn, documentText, paperPlaneSharp,
      images, thumbsDown, exit, thumbsUp, closeCircle, chatboxEllipses, informationCircle,
      navigateCircleOutline, navigateOutline, trashOutline, image, add
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
}
