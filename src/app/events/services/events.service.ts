import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MyEventInsert, MyEvent } from 'src/app/shared/interfaces/my-event';
import { map, Observable } from 'rxjs';
import { EventsResponse, SingleEventResponse } from 'src/app/shared/interfaces/responses';
import { User } from '../../shared/interfaces/user';
import { EventComment } from 'src/app/shared/interfaces/comment';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  #http = inject(HttpClient);

  getEvents(page: number, search = '', order: 'date' | 'price' | 'distance' = 'date'): Observable<MyEvent[]> {
    return this.#http
      .get<EventsResponse>(`events?page=${page}&search=${search}&order=${order}`)
      .pipe(map((resp) => resp.events));
  }

  getEvent(id: number): Observable<MyEvent> {
    return this.#http
      .get<SingleEventResponse>(`events/${id}`)
      .pipe(map((resp) => resp.event));
  }

  updateEvent(id: number, event: MyEventInsert): Observable<MyEvent> {
    return this.#http
      .put<SingleEventResponse>(`events/${id}`, event)
      .pipe(map((resp) => resp.event));
  }

  addEvent(event: MyEventInsert): Observable<MyEvent> {
    return this.#http
      .post<SingleEventResponse>('events', event)
      .pipe(map((resp) => resp.event));
  }

  deleteEvent(id: number): Observable<void> {
    return this.#http.delete<void>(`events/${id}`);
  }

  postAttend(id: number) {
    return this.#http.post<void>(`events/${id}/attend`, {});
  }

  deleteAttend(id: number) {
    return this.#http.delete<void>(`events/${id}/attend`);
  }

  getAttendees(id: number): Observable<{ users: User[] }> {
    return this.#http.get<{ users: User[] }>(`events/${id}/attend`);
  }

  postComment(id: number, comment: string): Observable<EventComment> {
    return this.#http.post<EventComment>(`events/${id}/comments`, { comment });
  }

  getComments(id: number): Observable<{ comments: EventComment[] }> {
    return this.#http.get<{ comments: EventComment[] }>(`events/${id}/comments`);
  }


}
