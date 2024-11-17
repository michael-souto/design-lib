import { Directive } from "@angular/core";
import { CrudApiService } from '../../services/crud-api.service';
import { FrameworkService } from '../../services/framework.service';
import { ControllerService } from '../../services/controller.service';

@Directive()
export abstract class ListRegisterComponent<T> {

  loading: boolean;
  rows: number = 8;
  totalRecords: number;

  constructor(
    protected service: CrudApiService<T>,
    protected controller: ControllerService<T>,
    public framework: FrameworkService,
    private entityConstructor: new () => T
  ) { }

  createEntity(): T {
    return new this.entityConstructor();
  }

  edit(object: any) {
    this.service.findById(object.id).subscribe({
      next: (response: T) => {
        this.controller.object = response;
        this.controller.id = object.id;
        this.afterFindById(this.controller.object);
        this.framework.router.navigate(['/' + this.getRouterLink() + '/' + object.id ]);
      },
      error: () => {},
      complete: () => {}
    });

  }

  new() {
    this.controller.id = null;
    this.controller.object = this.createEntity();
    this.afterNewCreateEntity(this.controller.object);
    this.framework.router.navigate(['/' + this.getRouterLink() + '/create']);
  }

  back() {
    this.framework.location.back();
  }

  afterFindById(entity: T) { }
  afterNewCreateEntity(entity: T) { }

  abstract getRouterLink(): string;
}
