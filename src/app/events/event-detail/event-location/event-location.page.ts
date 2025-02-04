import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { OlMarkerDirective } from 'src/app/shared/directives/ol-maps/ol-marker.directive';
import { OlMapDirective } from 'src/app/shared/directives/ol-maps/ol-map.directive';
import { EventDetailPage } from '../event-detail.page';

@Component({
  selector: 'app-event-location',
  templateUrl: './event-location.page.html',
  styleUrls: ['./event-location.page.scss'],
  standalone: true,
  imports: [IonFab, IonContent, IonHeader, IonToolbar, CommonModule, FormsModule, OlMapDirective, OlMarkerDirective, IonTitle, IonFabButton, IonIcon]
})
export class EventLocationPage {

  event = inject(EventDetailPage).event;

  openNavigation() {
    const eventData = this.event();
    if (!eventData) return;

    const { lat, lng } = eventData;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(mapsUrl, '_system');
  }

}
