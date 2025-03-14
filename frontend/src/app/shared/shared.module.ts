import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { InputComponent } from './components/input/input.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ButtonComponent } from './components/button/button.component';
import { SelectComponent } from './components/select/select.component';
import { MatSelectModule } from '@angular/material/select';
import { CardComponent } from './components/card/card.component';
import { RouterModule } from '@angular/router';
import { ModalTrailerComponent } from './components/modal-trailer/modal-trailer.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
  declarations: [
    NavBarComponent,
    InputComponent,
    ButtonComponent,
    LoadingComponent,
    SelectComponent,
    CardComponent,
    ModalTrailerComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatIconModule,
    MatSidenavModule,
  ],
  exports: [
    NavBarComponent,
    InputComponent,
    ButtonComponent,
    SelectComponent,
    CardComponent,
    ModalTrailerComponent,
    FooterComponent,
    LoadingComponent,
  ],
})
export class SharedModule {}
