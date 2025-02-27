import { MessageType } from './../models/message-type.model';
import { Message } from './../models/message.model';
import { HostListener, Directive } from '@angular/core';
import { UtilsService } from './utils/utils.service';

@Directive()
export class FunctionsService {

  public static hasErrors(messages: Array<Message>): boolean {
    let resultado = false;

    messages.forEach(m => {
      if (m.type == MessageType.Error) {
        resultado = true;
      }
    });
    return resultado;
  }

  public static atribuirNullEmNovosIds(newsIds: number[], list: any[]) {
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

  public static atribbuirNullEmIdsString(ids: string[], list: any[]) {
    for (let i = 0; i < ids?.length; i++) {
      const newId = ids[i];
      for (let j = 0; j < list?.length; j++) {
        const entity = list[j];
        if (entity.id != null && entity.id == newId) {
          entity.id = null;
        }
      }
    }
  }

  public static recarregarIds(ids: number[], list: any[]) {
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

  public static recarregarIdsString(ids: string[], list: any[]) {
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

  public static addItemListGrid(entityEdit: any, list: any[], newsIds: number[]) {
    if (entityEdit?.id == null) {
      let maxId: number = 0;
      if (list?.length > 0) {
        for (let i = 0; i < list?.length; i++) {
          if (list[i].id > maxId) {
            maxId = list[i].id;
          }
        }
      }
      maxId++;
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

  public static addItemListGridString(entityEdit: any, list: any[], newsIds: string[]) {
    if (entityEdit?.id == null) {
      let newId: string = UtilsService.generateUUID();
      entityEdit.id = newId;
      newsIds?.push(newId);
    } else {
      for (let i = 0; i < list?.length; i++) {
        if (list[i].id == entityEdit?.id) {
          list?.splice(i, 1);
        }
      }
    }
    list?.push(entityEdit);
  }

  public static removeItemListGrid(entityEdit: any, list: any[], newsIds: number[]) {
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

  public static removeItemListGridString(entityEdit: any, list: any[], newsIds: string[]) {
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

  public static isEmpty(value): boolean {
    return value == undefined || value == null || value.toString() == "";
  }

  public static formatFieldComma(field: string): string {
    if (!this.isEmpty(field)) {
      return ', ' + field;
    }
    return field;
  }

  public static firstLetterUpercase(text: string): string {
    if (!this.isEmpty(text)) {
      const words = text.toLowerCase().split(' ');
      for (let a = 0; a < words.length; a++) {
        const w = words[a];
        if (w.length > 0) {
          words[a] = w[0].toUpperCase() + w.slice(1);
        }
      }
      return words.join(' ');
    } else {
      return text;
    }
  }

  public static getFirstDayOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  public static getLastDayOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  @HostListener('window:resize', ['$event'])
  public static getScreenWidthSize(event?) {
    return window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  public static getScreenHeightSize(event?) {
    return window.innerHeight;
  }
}
