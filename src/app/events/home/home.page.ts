import { ChangeDetectorRef, Component, computed, DestroyRef, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonImg, IonAvatar, IonCardSubtitle, IonCardHeader, IonContent,
  IonHeader, IonTitle, IonToolbar, IonRefresher, IonRefresherContent, IonCard,
  IonButton, IonIcon, IonCardContent, IonCardTitle
} from '@ionic/angular/standalone';
import { EventsService } from '../services/events.service';
import { MyEvent } from 'src/app/shared/interfaces/my-event';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, Subject } from 'rxjs';
import { IntlCurrencyPipe } from 'src/app/shared/pipes/intl-currency.pipe';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonCardTitle, RouterLink, IonImg, IonAvatar, IonCardSubtitle, IonCardHeader,
    IonCardContent, IntlCurrencyPipe, IonIcon, IonButton, IonContent, IonHeader, IonTitle,
    IonToolbar, CommonModule, FormsModule, IonRefresher, IonRefresherContent, IonCard]
})
export class HomePage {

  events = signal<MyEvent[]>([]);
  event = input.required<MyEvent>();
  attend = output<void>();
  #eventsService = inject(EventsService);
  search = signal('');
  page = signal(1);
  deleted = output<void>();
  orderBy = signal<'date' | 'price' | 'distance'>('date');
  #searchSubject = new Subject<string>();
  #destroyRef = inject(DestroyRef);
  #changeDetectorRef = inject(ChangeDetectorRef);
  searchDebounced = toSignal(
    this.#searchSubject.pipe(debounceTime(600)),
    { initialValue: '' }
  );


  constructor() {
    this.loadEvents();

    effect(() => {
      const searchValue = this.searchDebounced();
      const orderValue = this.orderBy();
      const pageValue = this.page();

      this.#eventsService
        .getEvents(pageValue, searchValue, orderValue)
        .subscribe((events) => {
          if (pageValue === 1) {
            this.events.set(events);
          } else {
            this.events.update((currentEvents) => [...currentEvents, ...events]);
          }
        });
    });
  }

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


  filteredEvents = computed(() => {
    const searchLower = this.search().toLowerCase();
    const orderBy = this.orderBy();

    const sortedEvents = this.events().slice().sort((e1, e2) => {
      if (orderBy === 'date') {
        return e1.date.localeCompare(e2.date);
      } else if (orderBy === 'price') {
        return e1.price - e2.price;
      }
      return 0;
    });

    return sortedEvents.filter(
      (e) =>
        e.title.toLowerCase().includes(searchLower) ||
        e.description.toLowerCase().includes(searchLower)
    );
  });

  reloadEvents(refresher?: IonRefresher) {
    this.#eventsService.getEvents(this.page(), this.searchDebounced(), this.orderBy()).subscribe((prods) => {
      this.events.set(prods);
      refresher?.complete();
    });
  }

  loadEvents() {
    this.#eventsService
      .getEvents(this.page(), this.searchDebounced(), this.orderBy())
      .subscribe((newEvents) => {
        this.events.update((current) => [...current, ...newEvents]);
      });
  }

  // The following function is necesary, as the url of the server is https and
  // the url of the image is http, the browser detects it as malicious and wouldnt load it (or something like that)
  getImageUrl(image: string | undefined): string {
    if (image) {
      if (image.startsWith('http://')) {
        return 'https://' + image.slice(7); // Change to https://
      }
      return image;
    }
    return 'assets/images/default-avatar.jpg';
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

}
