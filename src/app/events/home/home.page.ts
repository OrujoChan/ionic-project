import { ChangeDetectorRef, Component, computed, DestroyRef, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader, IonTitle, IonToolbar, IonRefresher, IonRefresherContent, IonFab, IonFabButton, IonIcon,
  IonButton, IonCol, IonGrid, IonRow, IonSearchbar, IonInfiniteScroll, IonInfiniteScrollContent
} from '@ionic/angular/standalone';
import { EventsService } from '../services/events.service';
import { MyEvent } from 'src/app/shared/interfaces/my-event';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, Subject } from 'rxjs';
import { EventCardComponent } from '../event-card/event-card.component';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonSearchbar, IonCol, IonButton, IonContent, IonHeader, IonTitle,
    IonToolbar, CommonModule, FormsModule, IonRefresher, IonRefresherContent,
    IonGrid, IonRow, EventCardComponent, IonInfiniteScroll, IonInfiniteScrollContent,
    IonFab, IonFabButton, IonIcon, RouterLink]
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

    this.search.set(query);  // Update search term
    this.page.set(1);  // Reset page to 1 when searching
    this.loadEvents(); // Reload events with the new search query

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
  // Lots of duplicating issues again, this is the only thing that seems to work.
  onIonInfinite(event: Event) {
    const infiniteScroll = event.target as HTMLIonInfiniteScrollElement;
    const currentPage = this.page();
    this.#eventsService.getEvents(currentPage, this.search(), this.orderBy()).subscribe((newEvents) => {

      if (newEvents.length === 0) {
        infiniteScroll.disabled = true;
      } else {
        this.events.update((current) => {
          const existingEventIds = new Set(current.map(event => event.id));

          const uniqueNewEvents = newEvents.filter(event => !existingEventIds.has(event.id));

          return [...current, ...uniqueNewEvents];
        });

        this.page.update((currentPage) => currentPage + 1);
      }

      infiniteScroll.complete();
    });
  }






}
