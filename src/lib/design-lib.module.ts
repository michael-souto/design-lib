import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageWindowComponent } from './components/message-window/message-window.component';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';


import { ModalBoxComponent } from './components/modal-box/modal-box.component';
import { ConfirmBoxComponent } from './components/confirm-box/confirm-box.component';
import { ButtonComponent } from './components/button/button.component';
import { FrameworkService } from './services/framework.service';
import { LocaleInterceptor } from './services/interceptors/locale.interceptor';


@NgModule({
  declarations: [
    ButtonComponent,
    ModalBoxComponent,
    ConfirmBoxComponent,
    MessageWindowComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  exports: [
    ButtonComponent,
    ModalBoxComponent,
    ConfirmBoxComponent,
    MessageWindowComponent,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    FrameworkService,
    { provide: HTTP_INTERCEPTORS, useClass: LocaleInterceptor, multi: true }
  ]
})
export class DesignLibModule { }
