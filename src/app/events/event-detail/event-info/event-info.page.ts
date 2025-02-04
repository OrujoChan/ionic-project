import { Component, inject } from '@angular/core';
import {
  AlertController, NavController, IonHeader, IonToolbar, IonContent,
  IonCard, IonCardContent, IonCardTitle, IonCardSubtitle, IonButton,
  IonIcon, IonLabel, IonItem, IonAvatar
} from '@ionic/angular/standalone';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { EventsService } from '../../services/events.service';
import { EventDetailPage } from '../event-detail.page';
import { EventCardComponent } from '../../event-card/event-card.component';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.page.html',
  styleUrls: ['./event-info.page.scss'],
  standalone: true,
  imports: [EventCardComponent, IonHeader, IonToolbar, IonContent, CommonModule]
})
export class EventInfoPage {

  event = inject(EventDetailPage).event;

  #alertCtrl = inject(AlertController);
  #eventsService = inject(EventsService);
  #nav = inject(NavController);

  async delete() {
    const alert = await this.#alertCtrl.create({
      header: 'Delete event',
      message: 'Are you sure you want to delete this event?',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.#eventsService
              .deleteEvent(this.event()!.id!)
              .subscribe(() => this.#nav.navigateBack(['/events']));
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    alert.present();
  }

}
