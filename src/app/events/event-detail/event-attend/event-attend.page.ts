import { ChangeDetectorRef, Component, DestroyRef, effect, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonList, IonToolbar, IonItem, IonAvatar,
  IonLabel, IonCard, IonCardTitle, IonCardHeader, IonFab, IonFabButton, IonIcon
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { User } from 'src/app/shared/interfaces/user';
import { EventDetailPage } from '../event-detail.page';
import { EventsService } from '../../services/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-event-attend',
  templateUrl: './event-attend.page.html',
  styleUrls: ['./event-attend.page.scss'],
  standalone: true,
  imports: [RouterLink, IonList, IonContent, IonHeader, IonToolbar, CommonModule, FormsModule, IonItem,
    IonAvatar, IonLabel, IonCard, IonCardTitle, IonCardHeader, IonFab, IonFabButton, IonIcon]
})
export class EventAttendPage {

  event = inject(EventDetailPage).event;
  #eventsService = inject(EventsService);
  attend = signal<User[]>([]);
  #destroyRef = inject(DestroyRef);
  #changeDetectorRef = inject(ChangeDetectorRef);
  constructor() {
    effect(() => {
      this.setAttend(this.event()!.id);

    })


  }
  placeAttend() {
    const event = this.event();
    if (event) {
      this.setAttend(event.id);
    }
  }

  setAttend(id: number) {
    this.#eventsService.getAttendees(id).pipe().subscribe((result) => {
      this.attend.set(result.users);
    });
  }

  toggleAttend() {
    const event = this.event();
    if (!event) return;

    const isAttending = event.attend;
    const service = isAttending
      ? this.#eventsService.deleteAttend(event.id)
      : this.#eventsService.postAttend(event.id);

    service.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
      event.numAttend += isAttending ? -1 : 1;
      event.attend = !isAttending;

      this.setAttend(event.id);

      this.#changeDetectorRef.markForCheck();
    });
  }
}
