import { Component, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonItem, IonLabel, IonNote, IonAvatar, IonIcon, IonList, IonText, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { User } from 'src/app/shared/interfaces/user';
import { ProfileService } from '../services/profile.service';
import { ActivatedRoute } from '@angular/router';
import { OlMapDirective } from 'src/app/shared/directives/ol-maps/ol-map.directive';
import { OlMarkerDirective } from 'src/app/shared/directives/ol-maps/ol-marker.directive';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.page.html',
  styleUrls: ['./profile-page.page.scss'],
  standalone: true,
  imports: [IonText, IonList, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonButton, IonInput, IonItem, IonLabel, IonNote, IonAvatar, OlMapDirective, OlMarkerDirective
  ]
})
export class ProfilePagePage {
  user = signal<User | null>(null); // Store user data
  #profileService = inject(ProfileService);
  showInfo = signal(true);
  ProfileForm = signal(false);
  PasswordForm = signal(false);
  #route = inject(ActivatedRoute);
  coords = signal<[number, number]>([-0.5, 38.5]);
  email = signal('');
  name = signal('');
  avatar = signal('');
  password = signal('');
  password2 = signal('');


  constructor() {
    const id = Number(this.#route.snapshot.paramMap.get('id')) || undefined; // ✅ Get the ID from the route
    this.loadUser(id);

  }

  loadUser(id?: number) {
    this.#profileService.getUser(id).subscribe((userData) => {
      this.user.set(userData);
      this.email.set(userData.email);
      this.name.set(userData.name);
      this.avatar.set(userData.avatar);
      this.coords.set([userData.lng, userData.lat]);
    });
  }

  editProfile() {
    this.showInfo.set(false);
    this.ProfileForm.set(true);
    this.PasswordForm.set(false);
  }

  editPassword() {
    this.showInfo.set(false);
    this.ProfileForm.set(false);
    this.PasswordForm.set(true);
  }

  cancelEdit() {
    this.showInfo.set(true);
    this.ProfileForm.set(false);
    this.PasswordForm.set(false);
  }

  changeProfile() {
    const updatedUser = { email: this.email(), name: this.name() };
    this.#profileService.updateProfile(updatedUser).subscribe(() => {
      this.user.set({ ...this.user()!, ...updatedUser });
      this.cancelEdit();
    });
  }

  changeAvatar(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.#profileService.updateAvatar({ avatar: base64 }).subscribe((avatarUrl) => {
          this.user.set({ ...this.user()!, avatar: avatarUrl });
          this.avatar.set(avatarUrl);
        });
      };
      reader.readAsDataURL(file);
    }
  }

  password2Validation = computed(() => this.password() === this.password2());

  changePassword() {
    if (this.password() !== this.password2()) {
      return;
    }

    this.#profileService.updatePassword({ password: this.password() }).subscribe(() => {
      this.cancelEdit();
    });
  }
}