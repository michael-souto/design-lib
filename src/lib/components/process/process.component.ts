import { OnInit, ViewChild, Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FrameworkService } from 'projects/framework-lib/src/lib/services/framework.service';
import { ResponseApi } from 'projects/framework-lib/src/lib/models/response-api';
import { MessageWindowComponent } from 'projects/framework-lib/src/lib/components/message-window/message-window.component';
import { Message } from 'projects/framework-lib/src/lib/models/message.model';
import { FunctionsService } from 'projects/framework-lib/src/lib/services/functions.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProcessService } from '../../services/process.service';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';

@Directive()
export abstract class ProcessComponent<VOP> implements OnInit {

  constructor(
    protected service: ProcessService<VOP>,
    protected route: ActivatedRoute,
    protected router: Router,
    protected frameworkService: FrameworkService
  ) { }

  object: VOP;

  messages: Message[];
  @ViewChild('messageWindow', { static: true }) messageWindow: MessageWindowComponent;
  @ViewChild('confirmBox', { static: true }) confirmBox: ConfirmBoxComponent;

  isProcessing = false;

  ngOnInit() {
    this.createMessageList();
    this.object = this.createObject();
    const id: any = this.route.snapshot.params['id'];
    this.beforeInitProcess(id);
    if (id != undefined) {
      this.openProcess(id);
    }
    this.afterInitProcess(id);
  }

  protected createObject(): VOP {
    return this.service.getNewClass();
  }

  openProcess(id: any) {
    this.service.openProcess(id).subscribe((responseApi: ResponseApi) => {
      this.object = responseApi.data;
      this.afterOpenProcess(this.object);
    });
  }

  showMessage(routerExit: string) {
    this.messageWindow.showDialog(this.messages, routerExit);
  }

  process() {
    this.isProcessing = true;
    this.beforeProcess();
    this.service
      .process(this.object)
      .subscribe(
        (responseApi: ResponseApi) => {
          this.isProcessing = false;
          this.messages = responseApi.messages;
          if (!FunctionsService.hasErrors(this.messages)) {
            this.afterProcessSuccess(responseApi);
            this.showMessage('/' + this.getRouterLink());
          } else {
            this.afterProcessError(responseApi);
            this.showMessage('');
          }
          this.afterProcess();
        },
        (response: HttpErrorResponse) => {
          this.isProcessing = false;
          this.messages = response.error.messages;
          this.showMessage('');
          this.afterProcess();
        });

  }

  revertProcess() {
    this.isProcessing = true;
    this.beforeRevertProcess();
    if (this.isUpdateMode()) {
      this.service
        .revertProcess(this.getIdObject())
        .subscribe((responseApi: ResponseApi) => {
          this.isProcessing = false;
          this.messages = responseApi.messages;
          if (!FunctionsService.hasErrors(this.messages)) {
            this.object = this.createObject();
            this.afterRevertProcessSuccess(responseApi);
            this.showMessage('/' + this.getRouterLink());
          } else {
            this.afterRevertProcessError(responseApi);
            this.showMessage('');
          }
          this.afterRevertProcess();
        },
          (response: HttpErrorResponse) => {
            this.isProcessing = false;
            this.messages = response.error.messages;
            this.showMessage('');
            this.afterRevertProcess();
          });
    }
  }

  goList() {
    this.frameworkService.location.back();
  }

  confirmDelete() {
    this.confirmBox.showConfirmBox(
      'Confirmação',
      'Tem certeza que deseja prosseguir?',
      () => this.revertProcess(),
      () => { }
    );
  }

  createMessageList() {
    this.messages = new Array<Message>();
  }

  abstract getRouterLink(): string;
  abstract isUpdateMode(): boolean;
  abstract getIdObject(): any;

  beforeInitProcess(id: any) {}
  afterInitProcess(id: any) { }
  beforeProcess() { }
  afterProcess() { }
  afterOpenProcess(object: VOP) { }
  afterProcessSuccess(responseApi: ResponseApi) { }
  afterProcessError(responseApi: ResponseApi) { }

  beforeRevertProcess() { }
  afterRevertProcess() { }
  afterRevertProcessSuccess(responseApi: ResponseApi) { }
  afterRevertProcessError(responseApi: ResponseApi) { }

  back() {
    this.frameworkService.location.back();
  }
}


