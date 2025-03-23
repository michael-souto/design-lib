import { Injectable } from '@angular/core';
import {
  CanDeactivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface CanComponentDeactivate {
  canDeactivate: (nextUrl?: string) => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PendingChangesGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(
    component: CanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!environment.production) {
      console.log('canDeactivate', nextState, currentState);
    }
    if (component.canDeactivate) {
      const nextUrl = nextState ? nextState.url : null;
      return component.canDeactivate(nextUrl);
    }
    if (component['crudScreen'] && component['crudScreen'].canDeactivate) {
      const nextUrl = nextState ? nextState.url : null;
      return component['crudScreen'].canDeactivate(nextUrl);
    }
    return true;
  }
}
