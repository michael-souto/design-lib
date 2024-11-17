import { FunctionsService } from '../../services/functions.service';
import { ResponseNotification } from '../../models/response-notification';
import { Message, ValidationErrorResponse } from '../../models/message.model';

import { OnInit, ViewChild, EventEmitter, Output, Input, Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageWindowComponent } from '../message-window/message-window.component';
import { FrameworkService } from '../../services/framework.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';
import { CrudApiService } from '../../services/crud-api.service';
import { ValidatorModelService } from '../../services/validator-model.service';
import { GenericEntity } from '../../models/generic-entity.model';
import { ControllerService } from '../../services/controller.service';

@Directive()
export abstract class RegisterComponent<T extends GenericEntity> implements OnInit {

  @Input() entity: T;
  submitted: boolean = false;

  constructor(
    protected service: CrudApiService<T>,
    protected validator: ValidatorModelService<T>,
    protected controller: ControllerService<T>,
    protected framework: FrameworkService,
    protected activateRoute: ActivatedRoute,

  ) { }

  messages: Message[];

  @Output() onSaveEntity = new EventEmitter<any>();

  @ViewChild('messageWindow', { static: true }) messageWindow: MessageWindowComponent;
  @ViewChild('confirmBox', { static: true }) confirmBox: ConfirmBoxComponent;

  ngOnInit() {
    if (this.controller.object == null) {
      this.goList();
    } else {
      this.entity = this.controller.object;
      this.validator.object = this.entity;
      this.beforeInitRegister();
    }
  }

  showMessage(routerExit: string, title: string) {
    this.messageWindow.showTitle(this.messages, routerExit, title);
  }

  isUpdateMode(): boolean {
    return this.entity.id != null;
  }
  protected isAdvancedMode(): boolean { return false; }

  isValid(): boolean {
    return this.validator.isValid;
  }

  beforeInitRegister() { }
  afterInitRegister(id: any) { }
  beforeSave() { };
  afterSave() { };
  afterSaveSucess(responseApi: ResponseNotification<T>) { };
  afterSaveError(responseApi: ResponseNotification<T>) { };

  save() {
    this.submitted = true;
    if (this.isValid()) {
      this.beforeSave();
      if (this.isUpdateMode()) {
        this.service
          .update(this.entity)
          .subscribe({
            next: (response: ResponseNotification<T>) => {
              this.messages = response.messages;
              if (!FunctionsService.hasErrors(this.messages)) {
                if (!this.isAdvancedMode()) {
                  this.showMessage('/' + this.getRouterLink(), response.title);
                }
                this.afterSaveSucess(response);
              } else {
                this.showMessage('', response.title);
                this.afterSaveError(response);
              }
              this.afterSave();
            },
            error: (response: HttpErrorResponse) => {
              this.messageWindow.showValidationError(response.error, null);
              this.afterSave();
            }
          });
      } else {
        this.service
          .create(this.entity)
          .subscribe( {
            next: (response: ResponseNotification<T>) => {
            this.messages = response.messages;
            if (!FunctionsService.hasErrors(this.messages)) {
              if (!this.isAdvancedMode()) {
                this.showMessage('/' + this.getRouterLink(), response.title);
              }
              this.afterSaveSucess(response);
            } else {
              this.showMessage('', response.title);
              this.afterSaveError(response);
            }
            this.afterSave();
          },
          error: (response: HttpErrorResponse) => {
              this.messageWindow.showValidationError(response.error, null);
              this.afterSave();
            }
          }
        );
      }
    }
  }

  getId(): string {
    return this.activateRoute.snapshot.params['id'];
  }

  afterDeleteSucess(responseApi: ResponseNotification<T>) { };
  afterDeleteError(responseApi: ResponseNotification<T>) { };

  delete() {
    const id: string = this.getId();
    if (id != undefined) {
      this.service
        .delete(id)
        .subscribe(
          (response: ResponseNotification<T>) => {
          this.messages = response.messages;
          if (!FunctionsService.hasErrors(this.messages)) {
            if (!this.isAdvancedMode()) {
              this.showMessage('/' + this.getRouterLink(), response.title);
            }
            this.afterDeleteSucess(response);
          } else {
            this.showMessage('', response.title);
            this.afterDeleteError(response);
          }
        },
          (response: HttpErrorResponse) => {
            this.messageWindow.showValidationError(response.error, null);
          }

        );
    }
  }

  // findById(id: string) {
  //   this.service.findById(id).subscribe({
  //     next: (response: T) => {
  //       this.entity = response;
  //       this.validator.object = this.entity;
  //       this.afterFindById(this.entity);
  //     },
  //     error: () => {},
  //     complete: () => {}
  //   });
  // }

  // afterFindById(entity: T) { }

  abstract getRouterLink(): string;

  getRouterLinkRegister(): string {
    return '/' + this.getRouterLink() + '/register';
  }

  goList() {
    console.log()
    this.framework.router.navigate(['/' + this.getRouterLink()]);
  }

  confirmDelete() {
    this.confirmBox.showConfirmBox(
      'Confirmação',
      'Tem certeza que deseja prosseguir?',
      () => this.delete(),
      () => {}
    );
  }
}
