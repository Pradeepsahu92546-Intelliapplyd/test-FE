import { Component } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { ProfileForm } from '../profile-form/profile-form';
import { Address } from '../address/address';
import { Company } from '../company/company';
//uplaod
import { ImageCard } from '../image-card/image-card';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NzTabsModule,
    NzCardModule,
    ProfileForm,
    Address,
    Company,
    ImageCard
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {

}
