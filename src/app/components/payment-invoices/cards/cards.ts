import { Component, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { CardDialog } from '../../../shared/components/modal/dialog/card-dialog/card-dialog';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { ChangeDetectorRef } from '@angular/core';


//  getAllCards() {
//     console.log("Returning mock comments!");
//     return of(savedCards); // returns Observable of mock comments
//   }

//   getCardsById(id: string) {
//     const result = savedCards.find(c => c.id === id);
//     return of(result);
//   }
   
//   postCards(payload: { 
//      id: string,
//      type:string,
//      card_number: string ,
//      expiry:string,
//       isDefault:boolean,
//     }) {
//     savedCards.push(payload); 
//     return of(payload);
//   }

const savedCards = [
  {
    id: '1',
    type: 'Visa',
    card_number: '**** **** **** 1234',
    expiry: '12/24',
    isDefault: true,
  },
  {
    id: '2',
    type: 'MasterCard',
    card_number: '**** **** **** 5678',
    expiry: '11/23',
    isDefault: false,
  },
];

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzCardModule,
    NzDividerModule,
    NzIconModule,
    NzTagModule,
    CardDialog,
    NzModalModule,
  ],
  templateUrl: './cards.html',
  styleUrls: ['./cards.css'],
})
export class Cards {
  savedCards: any[] = [];

  @ViewChild(CardDialog) cardDialog!: CardDialog;

  constructor(
    private modal: NzModalService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
  ) {}

  ngOnInit(): void {
      this.savedCards = savedCards;
      console.log('Cards from service:', this.savedCards);
  }

  setDefault(cnumber: string) {
    this.savedCards.forEach((c) => (c.isDefault = c.card_number === cnumber));
  }

  addNewCard() {
    this.cardDialog.showModal();
  }

  handelOnCardData(data: any) {
    console.log('Data from card-dialog:', data);
    this.savedCards.push(data);
  }

  showDeleteConfirm(cnumber: string): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this Card?',
      nzContent: '<b style="color: red;">This action cannot be undone</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        setTimeout(() => {
          this.savedCards = this.savedCards.filter(
            (c) => c.card_number !== cnumber,
          );
          console.log('saved card after delete:', this.savedCards);
        });
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel'),
    });
  }
}
