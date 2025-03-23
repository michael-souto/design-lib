import { Injectable, OnInit } from '@angular/core';
import { UtilsService } from 'projects/design-lib/src/lib/services/utils/utils.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export abstract class ValidatorModelService<T> implements OnInit {

  constructor(protected utilsService: UtilsService) {
    if (!environment.production) {
      console.log('ValidatorModelService');
    }
  }

  async ngOnInit() {
    await this.loadTextMessages();
  }

  protected abstract _fields;

  public object: T;

  get fields() {
    this.validate();
    this._valid = this.areAllFieldsValid();
    return this._fields;
  }

  areAllFieldsValid(): boolean {
    return Object.values(this._fields).every((field) => field['isValid']);
  }

  protected _valid: boolean = false;
  get valid() : boolean {return this._valid}
  get isValid() : boolean {
    this.validate();
    return this._valid
  }

  protected _validForDelete: boolean = false;
  get validForDelete() : boolean {return this._valid}

  protected abstract validate();
  protected abstract validateForDelete();
  public abstract loadTextMessages();
}
export class FieldValidator {
  isValid: boolean;
  invalidMessage: string;
}
