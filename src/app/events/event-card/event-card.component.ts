import { ChangeDetectorRef, Component, DestroyRef, inject, input, output } from '@angular/core';
import { MyEvent } from 'src/app/shared/interfaces/my-event';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonImg,
  IonAvatar,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone'
import { EventsService } from '../services/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2';
import { IntlCurrencyPipe } from "../../shared/pipes/intl-currency.pipe";
@Component({
  selector: 'app-event-card',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonCard,
    IonCardContent,
    IonCardSubtitle,
    IonCardHeader,
    IonCardTitle,
    IonImg,
    IonAvatar,
    IonButton,
    IonIcon,
    IntlCurrencyPipe
  ],
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent {
  event = input.required<MyEvent>();
  #eventsService = inject(EventsService);
  #destroyRef = inject(DestroyRef);
  attend = output<void>();
  deleted = output<void>();
  #changeDetectorRef = inject(ChangeDetectorRef);

  toggleAttend() {
    const isAttending = this.event().attend;

    const service = isAttending
      ? this.#eventsService.deleteAttend(this.event().id)
      : this.#eventsService.postAttend(this.event().id);

    service
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.attend.emit();
        this.event().numAttend += isAttending ? -1 : 1;
        this.event().attend = !isAttending;
        this.#changeDetectorRef.markForCheck();
      });

  }

  deleteEvent() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.#eventsService
          .deleteEvent(this.event().id!)
          .pipe(takeUntilDestroyed(this.#destroyRef))
          .subscribe(() => {
            this.deleted.emit();
            Swal.fire('Deleted!', 'The event has been deleted.', 'success');
          });
      }
    });
  }

  // // The following function is necesary, as the url of the server is https and
  // // the url of the image is http, the browser detects it as malicious and wouldnt load it (or something like that)
  // getImageUrl(image: string | undefined): string {
  //   if (image) {
  //     if (image.startsWith('http://')) {
  //       return 'https://' + image.slice(7); // Change to https://
  //     }
  //     return image;
  //   }
  //   return 'assets/images/default-avatar.jpg';
  // }

}
