import { ChangeDetectorRef, Component, computed, DestroyRef, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader, IonTitle, IonToolbar, IonRefresher, IonRefresherContent, IonCard,
  IonButton, IonCol, IonGrid, IonRow, IonSearchbar
} from '@ionic/angular/standalone';
import { EventsService } from '../services/events.service';
import { MyEvent } from 'src/app/shared/interfaces/my-event';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, Subject } from 'rxjs';
import { EventCardComponent } from '../event-card/event-card.component';




@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonSearchbar, IonCol, IonButton, IonContent, IonHeader, IonTitle,
    IonToolbar, CommonModule, FormsModule, IonRefresher, IonRefresherContent,
    IonGrid, IonRow, EventCardComponent]
})
export class HomePage {

  events = signal<MyEvent[]>([]);

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

  handleInput(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || '';

    if (query === '') {
      this.loadEvents();
    } else {
      this.events.update((currentEvents) =>
        currentEvents.filter(
          (d) =>
            d.title.toLowerCase().includes(query) ||
            d.description.toLowerCase().includes(query)
        )
      );
    }
    this.#changeDetectorRef.markForCheck();
  }

  loadEvents() {
    this.#eventsService
      .getEvents(this.page(), this.searchDebounced(), this.orderBy())
      .subscribe((newEvents) => {
        this.events.set(newEvents);
        this.#changeDetectorRef.markForCheck();
      });
  }

  deleteEvent(event: MyEvent) {
    this.events.update((events) => events.filter((e) => e !== event));

  }





}
