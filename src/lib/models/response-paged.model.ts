export class ResponsePaged {
  content?: any[];
  totalElements?: number;
  totalPages?: number;
  number?: number;
  size?: number;
  numberOfElements?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
  notEmpty?: boolean;

  constructor(list: any[]){
    this.content = list;
    this.totalElements = list?.length;
    this.empty = list == null || list?.length == 0;
    this.notEmpty = !this.empty;
  }
}
