import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonButton, AlertController, IonCard, IonCardContent, IonItem, IonLabel, IonAvatar, IonCardHeader, IonList, IonCardTitle } from '@ionic/angular/standalone';
import { EventDetailPage } from '../event-detail.page';
import { EventsService } from '../../services/events.service';
import { EventComment } from 'src/app/shared/interfaces/comment';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-event-comments',
  templateUrl: './event-comments.page.html',
  styleUrls: ['./event-comments.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, CommonModule, FormsModule, RouterLink, IonButton, IonCard, IonCardContent, IonItem, IonLabel, IonAvatar, IonCardHeader, IonList, IonCardTitle]
})
export class EventCommentsPage {

  constructor() {
    effect(() => {

      this.setComments(this.event()!.id);
    })
  }

  event = inject(EventDetailPage).event;
  #eventsService = inject(EventsService);
  comment = signal<EventComment[]>([]);
  commentText = signal<string>('');
  #alertController = inject(AlertController);
  getComments() {
    const event = this.event();
    if (event) {
      this.setComments(event.id);
    }
  }

  setComments(id: number) {
    this.#eventsService.getComments(id).pipe().subscribe((result) => {
      this.comment.set(result.comments);
    });
  }

  addComment() {
    const comment = this.commentText();
    this.#eventsService
      .postComment(this.event()!.id, comment)

      .subscribe(() => {
        this.commentText.set('');
        this.getComments();
      }
      );
  }

  async showCommentPopup() {
    const alert = await this.#alertController.create({
      header: 'Add a Comment',
      inputs: [
        {
          name: 'comment',
          type: 'textarea',
          placeholder: 'Write your comment here...',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Post',
          handler: async (data) => {
            if (data.comment.trim()) {
              this.commentText.set(data.comment);
              this.addComment();
            } else {
              const errorAlert = await this.#alertController.create({
                header: "You cannot post an empty comment!",
                buttons: [{ text: 'Okay', role: 'cancel' }],
              });
              await errorAlert.present();
            }
          },
        },
      ],
    });

    await alert.present();
  }

}
