import { ChangeDetectorRef, Component, DestroyRef, inject, output, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, ToastController, IonLabel, IonItem, IonList, IonButton, IonIcon, IonCol, IonGrid, IonImg, IonTextarea, IonHeader, IonToolbar, IonTitle, IonRow, IonInput } from '@ionic/angular/standalone';
import { MyEventInsert } from 'src/app/shared/interfaces/my-event';
import { EventsService } from '../services/events.service';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.page.html',
  styleUrls: ['./new-event.page.scss'],
  standalone: true,
  imports: [IonHeader, ReactiveFormsModule, IonButton, IonList, IonContent, IonItem, IonTextarea, IonLabel, IonIcon, IonCol, IonGrid, IonInput, IonImg, IonToolbar, IonTitle, RouterLink, IonRow, FormsModule]
})
export class NewEventPage {

  added = output<MyEventInsert>();
  #eventsService = inject(EventsService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  today = new Date().toISOString().slice(0, 10);
  #toastCtrl = inject(ToastController)
  coords = signal<[number, number]>([-0.5, 38.5]);

  event: MyEventInsert = {
    title: '',
    description: '',
    price: 0,
    image: '',
    address: '',
    lat: 0,
    lng: 0,
    distance: 0,
    date: '',
    mine: true,
  };
  imageBase64 = '';
  saved = false;
  #changeDetectorRef = inject(ChangeDetectorRef);
  constructor() {



  }

  get submitButtonText() {
    return 'Create Event';
  }



  async getLocation() {
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true
    });

    this.coords.set([coordinates.coords.longitude, coordinates.coords.latitude])
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Optionally process the file here (e.g., convert to base64, upload, etc.)
      console.log('File selected:', file.name);
    }
  }

  addEvent() {
    this.#eventsService
      .addEvent({ ...this.event, image: this.imageBase64 })
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(async () => {
        (await this.#toastCtrl.create({
          duration: 3000,
          position: 'bottom',
          message: 'User registered!'
        })).present();
        this.saved = true;
        this.#router.navigate(['/events']);
      });
  }

  async pickFromGallery() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Photos,
      resultType: CameraResultType.DataUrl // Base64 (url encoded)
    });
    this.event.image = photo.dataUrl as string;
    this.#changeDetectorRef.markForCheck();
  }

}
