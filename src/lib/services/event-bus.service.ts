import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface Event {
  type?: string;
  name?: string;
  payload?: any;
}

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private subject$ = new Subject<Event>();

  emit(event: Event) {
    this.subject$.next(event);
  }

  emitEvent(name: string, payload?: any) {
    this.subject$.next({ name, payload });
  }

  on(eventType: string | string[]): Observable<Event> {
    return this.subject$.pipe(
      filter((e: Event) => {
        if (Array.isArray(eventType)) {
            return eventType.includes(e.type || '') || eventType.includes(e.name || '');
        }
        return e.type === eventType || e.name === eventType;
      })
    );
  }
}