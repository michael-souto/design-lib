import { FunctionsService } from "../../services/functions.service";
import { ResponseNotification } from "../../models/response-notification";
import { Message, ValidationErrorResponse } from "../../models/message.model";

import {
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
  Input,
  Directive,
  ChangeDetectorRef,
  OnDestroy,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageWindowComponent } from "../message-window/message-window.component";
import { FrameworkService } from "../../services/framework.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ConfirmBoxComponent } from "../confirm-box/confirm-box.component";
import { CrudApiService } from "../../services/crud-api.service";
import { ValidatorModelService } from "../../services/validator-model.service";
import { GenericEntity } from "../../models/generic-entity.model";
import { ControllerService } from "../../services/controller.service";

import { Observable, Subscription } from "rxjs";
import { NavigationStart } from "@angular/router";
import { environment } from "src/environments/environment";

@Directive()
export abstract class RegisterComponent<T extends GenericEntity>
  implements OnInit, OnDestroy
{
  submitted: boolean = false;
  @Input() protected nameParamId: string = "id";
  private routerSubscription: Subscription;
  private currentUrl: string;
  private nextUrl: string;
  public initialObjectState: string;

  constructor() {}

  protected service: CrudApiService<T>;
  protected validator: ValidatorModelService<T>;
  protected controller: ControllerService<T>;
  protected framework: FrameworkService;
  protected activateRoute: ActivatedRoute;

  messages: Message[];

  @Output() onSaveEntity = new EventEmitter<any>();

  @ViewChild("messageWindow", { static: true })
  messageWindow: MessageWindowComponent;
  @ViewChild("confirmBox", { static: true }) confirmBox: ConfirmBoxComponent;

  ngOnInit() {
    if (!environment.production) {
      console.log('RegisterComponent-NgOnInit');
    }
    this.currentUrl = this.framework.router.url;
    this.routerSubscription = this.framework.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationStart) {
          this.nextUrl = event.url;
        }
      }
    );
    const id = this.activateRoute.snapshot.params[this.nameParamId];
    this.beforeInitRegister();
    if (FunctionsService.isEmpty(id)) {
      if (this.activateRoute.snapshot.queryParams["new"] == 'true') {
        this.framework.router.navigate([], {
          queryParams: { new: null },
          queryParamsHandling: "merge",
          replaceUrl: true,
        });
        this.currentUrl = this.currentUrl.replace("?new=true", '');
        return this.initializeEntity(this.controller.createObject());
      } else {
        this.initializeEntity(
          this.controller.object ?? this.controller.createObject()
        );
      }
    }
    if (this.controller.object) {
      return this.initializeEntity(this.controller.object);
    }
    if (this.activateRoute.snapshot.queryParams["load"] != 'false') {
      this.framework.router.navigate([], {
        queryParams: { load: null },
        queryParamsHandling: "merge",
        replaceUrl: true,
      });
      this.service.findById(id).subscribe({
        next: (response: T) => {
          this.initializeEntity(response);
        },
        error: () => {
          this.initializeEntity(this.controller.createObject());
        },
      });
    } else {
      this.framework.router.navigate([], {
        queryParams: { load: null },
        queryParamsHandling: "merge",
        replaceUrl: true,
      });
      this.currentUrl = this.currentUrl.replace("?load=false", '');
    }
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (!this.nextUrl || !this.nextUrl.startsWith(this.currentUrl + "/")) {
      this.controller.object = null;
      this.validator.object = null;
      this.controller.setInitialObjectState(null);
    }
  }

  private initializeEntity(entity: T): void {
    this.beforeInitializeEntity(entity);
    this.controller.object = entity;
    this.validator.object = entity;
    this.validator.loadTextMessages();
    if (!this.controller.getInitialObjectState()) {
      this.controller.setInitialObjectState(entity);
    }
    this.initialObjectState = this.controller.getInitialObjectState();
    this.afterInitRegister(entity.id);
  }

  protected hasUnsavedChanges(): boolean {
    return JSON.stringify(this.controller.object) !== this.initialObjectState;
  }

  canDeactivate(nextUrl?: string): Observable<boolean> | boolean {
    if (!environment.production) {
      console.log('canDeactivate', nextUrl, this.currentUrl);
    }
    if (nextUrl && nextUrl.startsWith(this.currentUrl + "/")) {
      return true;
    }
    if (this.hasUnsavedChanges()) {
      return new Observable<boolean>((observer) => {
        this.confirmBox.showConfirmBox(
          "Confirmação",
          "Você possui alterações não salvas. Deseja realmente sair?",
          () => {
            observer.next(true);
            observer.complete();
          },
          () => {
            observer.next(false);
            observer.complete();
          }
        );
      });
    }
    return true;
  }

  showMessage(routerExit: string, title: string, closeFunction?: () => void) {
    this.messageWindow.showTitle(this.messages, routerExit, title, closeFunction);
  }

  isUpdateMode(): boolean {
    return this.controller.object?.id != null;
  }
  protected isAdvancedMode(): boolean {
    return false;
  }

  isValid(): boolean {
    return this.validator.isValid;
  }

  beforeInitRegister() {}
  beforeInitializeEntity(entity: T) {}
  afterInitRegister(id: any) {}
  beforeSave() {}
  afterSave() {}
  afterSaveSucess(responseApi: ResponseNotification<T>) {}
  afterSaveError(responseApi: ResponseNotification<T>) {}

  save() {
    this.submitted = true;
    if (this.isValid()) {
      this.beforeSave();
      if (this.isUpdateMode()) {
        this.service.update(this.controller.object).subscribe({
          next: (response: ResponseNotification<T>) => {
            this.messages = response.messages;
            if (!FunctionsService.hasErrors(this.messages)) {
              if (!this.isAdvancedMode()) {
                this.controller.object = response.data;
                this.controller.setInitialObjectState(response.data);
                this.initialObjectState = this.controller.getInitialObjectState();
                this.showMessage('', response.title, () => this.back());
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
          },
        });
      } else {
        this.service.create(this.controller.object).subscribe({
          next: (response: ResponseNotification<T>) => {
            this.messages = response.messages;
            if (!FunctionsService.hasErrors(this.messages)) {
              if (!this.isAdvancedMode()) {
                this.controller.object = response.data;
                this.controller.setInitialObjectState(response.data);
                this.initialObjectState = this.controller.getInitialObjectState();
                this.showMessage('', response.title, () => this.back());
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
          },
        });
      }
    }
  }

  getId(): string {
    return this.activateRoute.snapshot.params[this.nameParamId];
  }

  afterDeleteSucess(responseApi: ResponseNotification<T>) {}
  afterDeleteError(responseApi: ResponseNotification<T>) {}

  delete() {
    const id: string = this.getId();
    if (id != undefined) {
      this.service.delete(id).subscribe(
        (response: ResponseNotification<T>) => {
          this.messages = response.messages;
          if (!FunctionsService.hasErrors(this.messages)) {
            if (!this.isAdvancedMode()) {
              this.showMessage('', response.title, () => this.back());
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

  abstract getRouterLink(): string;

  getRouterLinkRegister(): string {
    return "/" + this.getRouterLink() + "/register";
  }

  goList() {
    this.framework.router.navigate(["/" + this.getRouterLink()]);
  }

  back() {
    this.framework.location.back();
  }

  confirmDelete() {
    this.confirmBox.showConfirmBox(
      "Confirmação",
      "Tem certeza que deseja prosseguir?",
      () => this.delete(),
      () => {}
    );
  }

  get entity(): T {
    return this.controller.object;
  }

  set entity(entity: T) {
    this.controller.object = entity;
  }
}
