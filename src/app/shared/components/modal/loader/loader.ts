import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';


@Component({
  selector: 'app-loader',
  imports: [NzSpinModule,CommonModule],
  templateUrl: './loader.html',
  styleUrl: './loader.css'
})
export class Loader {
}
