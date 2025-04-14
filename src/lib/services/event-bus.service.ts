import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EventBusService {
  private events$ = new Subject<Event>();

  emit(event: Event) {
    this.events$.next(event);
  }

  on(type: string) {
    return this.events$.asObservable().pipe(
      filter((event) => event.type === type),
      map((event) => event),
    );
  }
}

export interface Event {
  type: string;
  payload?: any;
  callback?: (payload: any) => void;
  valid?: (payload: any) => void;
}
