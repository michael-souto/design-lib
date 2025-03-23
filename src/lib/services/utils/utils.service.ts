import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { AsyncFunctionQueueService } from '../async-function-queue.service';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {

  constructor(
    public router: Router,
    public asyncFunctionQueueService: AsyncFunctionQueueService,
    public http: HttpClient,
    protected translate: TranslateService,
  ) {
    this.loadScreenSize();
    translate.setDefaultLang('pt');
    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
        this.translate.use('pt'); // Set your language here
    }
  }

  ipAddress: any;

  SCREEN_HEIGHT?: number;
  SCREEN_WIDTH?: number;
  NUMBER_OF_RECORDS = 8;
  COLOR_COMMENT? = '#fff72b';

  @HostListener('window:resize', ['$event'])
  loadScreenSize() {
    this.SCREEN_HEIGHT = window.innerHeight;
    this.SCREEN_WIDTH = window.innerWidth;
    this.NUMBER_OF_RECORDS = Math.round(this.SCREEN_HEIGHT / 50);
  }

  isDesktop() {
    return window.innerWidth > 991;
  }

  isMobile() {
      return !this.isDesktop();
  }

  getArrayTags(tags?: string) {
    let array = tags?.split(';');
    array?.pop();
    return array;
  }

  removeTagsHTML(html: any) {
    return html.replace(/<[^>]*>/g, '') ?? '';
  }

  getDefautRouteAbove() {
    return this.router.url.substring(0, this.router.url.lastIndexOf('/'));
  }

  async getTextTranslated(alias: string, interpolateParams?: Object) {
    const createAPI$ = this.translate.get(alias, interpolateParams);
    return lastValueFrom(createAPI$)
  }

  setNullInNewIds(newsIds: string[], list: any[]) {
    for (let i = 0; i < newsIds?.length; i++) {
      const newId = newsIds[i];
      for (let j = 0; j < list?.length; j++) {
        const entity = list[j];
        if (entity.id != null && entity.id == newId) {
          entity.id = null;
        }
      }
    }
  }

  reloadIds(ids: string[], list: any[]) {
    for (let index = 0; index < ids?.length; index++) {
      const elementId = ids[index];
      for (let j = 0; j < list?.length; j++) {
        const entity = list[j];
        if (entity.id == null) {
          entity.id = elementId;
          break;
        }
      }
    }
  }

  addItemListGrid(entityEdit: any, list: any[], newsIds: string[]) {
    if (entityEdit?.id == null) {
      let maxId: string = "";
      if (list?.length > 0) {
        for (let i = 0; i < list?.length; i++) {
          if (list[i].id > maxId) {
            maxId = list[i].id;
          }
        }
      }
      //maxId++;
      entityEdit.id = maxId;
      newsIds?.push(maxId);
    } else {
      for (let i = 0; i < list?.length; i++) {
        if (list[i].id == entityEdit?.id) {
          list?.splice(i, 1);
        }
      }
    }
    list?.push(entityEdit);
  }

  removeItemListGrid(entityEdit: any, list: any[], newsIds: string[]) {
    for (let i = 0; i < newsIds?.length; i++) {
      if (newsIds[i] == entityEdit?.id) {
        newsIds?.splice(i, 1);
      }
    }

    for (let i = 0; i < list?.length; i++) {
      if (list[i].id == entityEdit?.id) {
        list?.splice(i, 1);
      }
    }
  }

  backMyBaseRoute(complement: string = '') {
    if (complement != ''){
      this.router.navigate([this.getDefautRouteAbove(), complement]);
    } else {
      this.router.navigate([this.getDefautRouteAbove()]);
    }
  }

  navigate(url: string){
    this.router.navigate([url]);
  }

  public static isEmpty(value: any): boolean {
    return value == undefined || value == null || value.toString() == '';
  }

  static generateUUID(): string {
    return uuidv4();
  }

  static isValidUUID(uuid: string): boolean {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidPattern.test(uuid);
  }

  async getOptionsFromEnum(
    enumObj: any,
    translationPrefix: string
  ): Promise<{ label: string; value: string }[]> {
    const keys = Object.keys(enumObj).filter(key => isNaN(Number(key)));

    const options = await Promise.all(
      keys.map(async key => {
        const translatedLabel = await this.getTextTranslated(`${translationPrefix}.${key}`);
        return {
          label: translatedLabel,
          value: enumObj[key]
        };
      })
    );
    return options;
  }
}

export const SAVED_SUCCESSFULLY = 'savedSuccessfully';
export const UPDATED_SUCCESSFULLY = 'updatedSuccessfully';
export const DELETED_SUCCESSFULLY = 'deletedSuccessfully';
export const ERROR_WHEN_SAVING = 'errorWhenSaving';
export const ERROR_WHEN_UPDATING = 'errorWhenUpdating';
export const ERROR_WHEN_DELETING = 'errorWhenDeleting';
export const FIELD_MANDATORY = 'fieldMandatory';
export const OPERATION_SUCCESSFULLY = 'operationSuccessfully';


