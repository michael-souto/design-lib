import { Injectable } from '@angular/core';
import { SearchField } from '../models/search-field';
import { UtilsService } from './utils/utils.service';
import { SearchFilter } from '../models/search-filter';

@Injectable({
  providedIn: 'root',
})
export class SearchService {

  constructor(protected utilsService: UtilsService) {}

  getColumns(baseUrl: string, searchId: string){
    return this.utilsService.http.get(`${baseUrl}/search/${searchId}/columns`);
  }

  search(baseUrl: string, searchId: string, paramns: any[]) {
    const paramsHttp = this.createQueryParams(paramns);
    return this.utilsService.http.get(`${baseUrl}/search/${searchId}?unpaged=true${paramsHttp}`);
  }

  searchPaged(baseUrl: string, searchId: string, paramns: any[], page: number, count: number) {
    const paramsHttp = this.createQueryParams(paramns);
    return this.utilsService.http.get(`${baseUrl}/search/${searchId}?page=${page}&size=${count}${paramsHttp}`);
  }

  private createQueryParams(searchFields: SearchFilter[]): string {
    if (!searchFields || searchFields.length === 0) {
      return '';
    }

    const queryParams = searchFields
      .map(field => `${encodeURIComponent(field.field)}=${encodeURIComponent(field.value)}`)
      .join('&');

    return `&${queryParams}`;
  }
}
