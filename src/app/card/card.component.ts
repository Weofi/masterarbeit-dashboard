import {Component, Input} from '@angular/core';
import {Person} from '../data-service/data.service';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input({required: true}) person!: Person;
  @Input() optimized: boolean = false;
}
