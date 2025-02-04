import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SingleUserResponse } from 'src/app/shared/interfaces/userResponses';
import { map, Observable } from 'rxjs';
import { User, changeAvatar, changePassword, changeProfile } from 'src/app/shared/interfaces/user';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  #http = inject(HttpClient);

  getUser(id?: number): Observable<User> {
    return this.#http
      .get<SingleUserResponse>(id ? `users/${id}` : "users/me")
      .pipe(map((resp: SingleUserResponse) => resp.user));
  }

  updateProfile(user: changeProfile): Observable<void> {
    return this.#http
      .put<void>("users/me", user);
  }

  updatePassword(pass: changePassword): Observable<void> {
    return this.#http
      .put<void>("users/me/password", pass);
  }

  updateAvatar(data: changeAvatar): Observable<string> {
    return this.#http
      .put<changeAvatar>("users/me/photo", data)
      .pipe(map((resp: changeAvatar) => resp.avatar));
  }
}