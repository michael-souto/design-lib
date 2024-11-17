import { Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { Directive } from "@angular/core";

@Directive()
export abstract class ListProcessComponent<T> {

  constructor(
    protected service: SearchService<T>,
    protected router: Router
  ) { }

  ngOnInit() {
  }

  open(object: T) {
    this.router.navigate(['/'+this.getRouterLink()+'/process', this.getIdObject(object)]);
  }

  new() {
    this.router.navigate(['/'+this.getRouterLink()+'/process']);
  }

  abstract getRouterLink(): string;
  abstract getIdObject(object:T):any;
}
