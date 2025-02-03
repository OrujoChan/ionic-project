import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Observable, catchError, from, map, of, switchMap } from 'rxjs';
import { User } from '../../shared/interfaces/user';
import { TokenResponse, UserResponse } from '../../shared/interfaces/responses';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #logged = signal(false);

  #http = inject(HttpClient)



  login(
    email: string,
    password: string,
    firebaseToken?: string
  ): Observable<void> {
    return this.#http
      .post<TokenResponse>('auth/login', {
        email,
        password,
        firebaseToken,
      })
      .pipe(

        switchMap(async (r) => {
          try {
            await Preferences.set({ key: 'fs-token', value: r.accessToken });
            this.#logged.set(true);
          } catch (e) {
            throw new Error('Can\'t save authentication token in storage!');
          }
        })
      );
  }

  register(user: User): Observable<void> {
    return this.#http.post<void>('auth/register', user);
  }

  async logout(): Promise<void> {
    await Preferences.remove({ key: 'fs-token' });
    this.#logged.set(false);
  }

  isLogged(): Observable<boolean> {
    if (this.#logged()) {
      return of(true);
    }

    return from(Preferences.get({ key: 'fs-token' })).pipe(
      switchMap((token) => {
        if (!token.value) {
          return of(false);
        }

        return this.#http.get('auth/validate').pipe(
          map(() => {
            this.#logged.set(true);
            return true;
          }),
          catchError(() => of(false))
        );
      }),
    );
  }

  get logged() {
    return this.#logged.asReadonly();
  }


  getProfile(): Observable<User> {
    return this.#http
      .get<UserResponse>('auth/profile')
      .pipe(map((r) => r.user));
  }
}