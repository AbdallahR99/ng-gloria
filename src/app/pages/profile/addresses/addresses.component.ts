import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-addresses',
  imports: [],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressesComponent { }
