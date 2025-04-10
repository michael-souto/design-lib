import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EventBusService {
  private events$ = new Subject<{ type: string; payload?: any }>();

  emit(event: { type: string; payload?: any }) {
    this.events$.next(event);
  }

  on(type: string) {
    return this.events$.asObservable().pipe(
      filter((event) => event.type === type),
      map((event) => event.payload)
    );
  }
}
