import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
