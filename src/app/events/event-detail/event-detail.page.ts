import { Component, computed, effect, inject, input, NgModule, numberAttribute, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonLabel,
  IonAvatar,
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
  IonTabBar, IonTabButton, IonIcon,
  IonTabs
} from '@ionic/angular/standalone';
import { EventsService } from '../services/events.service';
import { User } from 'src/app/shared/interfaces/user';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EventComment } from 'src/app/shared/interfaces/comment';


import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
  standalone: true,
  imports: [IonHeader, CommonModule, FormsModule, IonLabel,
    IonToolbar, IonButtons, IonBackButton, IonTitle, IonTabBar, IonTabButton, IonIcon, IonTabs]
})
export class EventDetailPage {

  #title = inject(Title);
  #router = inject(Router);
  attend = signal<User[]>([]);
  #eventsService = inject(EventsService);



  id = input.required({ transform: numberAttribute });
  eventResource = rxResource({
    request: () => this.id(),
    loader: ({ request: id }) => this.#eventsService.getEvent(id),
  });
  event = computed(() => this.eventResource.value());


  constructor() {
    effect(() => {
      const event = this.event();
      if (event) {
        this.#title.setTitle(event.title + ' | SvTickets');
      }
    });

  }

  goBack() {
    this.#router.navigate(['/events']);
  }




}
