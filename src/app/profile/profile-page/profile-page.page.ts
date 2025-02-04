import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonItem, IonLabel, IonNote, IonAvatar, IonIcon, IonList, IonText } from '@ionic/angular/standalone';
import { User } from 'src/app/shared/interfaces/user';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.page.html',
  styleUrls: ['./profile-page.page.scss'],
  standalone: true,
  imports: [
    IonText, IonList, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonButton, IonInput, IonItem, IonLabel, IonNote, IonAvatar
  ]
})
export class ProfilePagePage {
  user = signal<User | null>(null); // Store user data
  #profileService = inject(ProfileService);
  showInfo = signal(true);
  ProfileForm = signal(false);
  PasswordForm = signal(false);

  email = signal('');
  name = signal('');
  avatar = signal('');

  constructor() {
    this.loadUser();
  }

  loadUser() {
    this.#profileService.getUser().subscribe((userData) => {
      this.user.set(userData);
      this.email.set(userData.email);
      this.name.set(userData.name);
      this.avatar.set(userData.avatar);
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
}