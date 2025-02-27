import { Injectable, makeStateKey } from '@angular/core';
import { UtilsService } from './utils/utils.service';
import { ResponseNotification } from './../models/response-notification';
import { ResponseList } from '../models/response-list';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export abstract class CrudApiService<T> {
  constructor(protected utilsService: UtilsService) {
    if (!environment.production) {
      console.log('CrudApiService-constructor');
    }
  }

  getAdressAPI(masterId: string = null): string { return null}

  getAdressAPIReplaced(masterId: string = null): string {
    return this.getAdressAPI(masterId).replace(
      ':masterId',
      masterId.toString()
    );
  }

  create(entity: T, masterId: string = null) {
    if (masterId == null) {
      return this.utilsService.http.post<ResponseNotification<T>>(`${this.getAdressAPI()}`, entity);
    } else {
      return this.utilsService.http.post<ResponseNotification<T>>(
        `${this.getAdressAPIReplaced(masterId)}`,
        entity
      );
    }
  }

  createList(entities: Array<T>, masterId: string = null) {
    if (masterId == null) {
      return this.utilsService.http.post<ResponseNotification<T>>(
        `${this.getAdressAPI()}/list`,
        entities
      );
    } else {
      return this.utilsService.http.post<ResponseNotification<T>>(
        `${this.getAdressAPIReplaced(masterId)}/list`,
        entities
      );
    }
  }

  update(entity: T, masterId: string = null) {
    if (masterId == null) {
      return this.utilsService.http.put<ResponseNotification<T>>(
        `${this.getAdressAPI()}/${entity['id']}`,
        entity
      );
    } else {
      return this.utilsService.http.put<ResponseNotification<T>>(
        `${this.getAdressAPIReplaced(masterId)}/${entity['id']}`,
        entity
      );
    }
  }

  updateList(entities: Array<T>, masterId: string = null) {
    if (masterId == null) {
      return this.utilsService.http.put<ResponseNotification<T>>(
        `${this.getAdressAPI()}/list`,
        entities
      );
    } else {
      return this.utilsService.http.put<ResponseNotification<T>>(
        `${this.getAdressAPIReplaced(masterId)}/list`,
        entities
      );
    }
  }

  findAllPaged(page: number, count: number, masterId: string = null) {
    if (masterId == null) {
      return this.utilsService.http.get<ResponseList<T>>(
        `${this.getAdressAPI()}?page=${page}&size=${count}`
      );
    } else {
      return this.utilsService.http.get<ResponseList<T>>(
        `${this.getAdressAPIReplaced(masterId)}?page=${page}&size=${count}`
      );
    }
  }

  findAll(masterId: string = null) {
    if (masterId == null) {
      return this.utilsService.http.get<ResponseList<T>>(`${this.getAdressAPI()}`);
    } else {
      return this.utilsService.http.get<ResponseList<T>>(`${this.getAdressAPIReplaced(masterId)}`);
    }
  }

  findById(id?: string, masterId: string = null) {
    if (masterId == null) {
      return this.utilsService.http.get<T>(`${this.getAdressAPI()}/${id}`);
    } else {
      return this.utilsService.http.get<T>(
        `${this.getAdressAPIReplaced(masterId)}/${id}`
      );
    }
  }

  findByListId(ids: string[], masterId: string = null) {
    if (masterId == null) {
      return this.utilsService.http.post<T[]>(
        `${this.getAdressAPI()}/find-list-id`,
        ids
      );
    } else {
      return this.utilsService.http.post<T[]>(
        `${this.getAdressAPIReplaced(masterId)}/find-list-id`,
        ids
      );
    }
  }

  delete(id?: string, masterId: string = null) {
    if (masterId == null) {
      return this.utilsService.http.delete<ResponseNotification<T>>(`${this.getAdressAPI()}/${id}`);
    } else {
      return this.utilsService.http.delete<ResponseNotification<T>>(
        `${this.getAdressAPIReplaced(masterId)}/${id}`
      );
    }
  }

  patch(id?: string, entity?: any, masterId: string = null) {
    if (masterId == null) {
      return this.utilsService.http.patch<ResponseNotification<T>>(
        `${this.getAdressAPI()}/${id}`,
        entity
      );
    } else {
      return this.utilsService.http.patch<ResponseNotification<T>>(
        `${this.getAdressAPIReplaced(masterId)}/${id}`,
        entity
      );
    }
  }

  patchList(entities: Array<any>, masterId: string = null) {
    if (masterId == null) {
      return this.utilsService.http.patch<ResponseNotification<T>>(
        `${this.getAdressAPI()}/list`,
        entities
      );
    } else {
      return this.utilsService.http.patch<ResponseNotification<T>>(
        `${this.getAdressAPIReplaced(masterId)}/list`,
        entities
      );
    }
  }
}
