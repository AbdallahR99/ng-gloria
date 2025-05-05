import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DomElementDirective } from '@app/core/directives/domElement.directive';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

const SHARED_MATERIAL_MODULES = [MatIconModule];

export const SHARED_MODULES = [
  ...SHARED_MATERIAL_MODULES,
  RouterModule,
  TranslateModule,
  CommonModule,
  FormsModule,
  DomElementDirective,
];
