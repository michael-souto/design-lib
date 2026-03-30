import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface EventData {
  type?: string;
  name?: string;
  value?: any;
}

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private subject$ = new Subject<EventData>();

  emit(event: EventData) {
    this.subject$.next(event);
  }

  on(eventType: string | string[]): Observable<EventData> {
    return this.subject$.pipe(
      filter((e: EventData) => {
        if (Array.isArray(eventType)) {
            return eventType.includes(e.type || '') || eventType.includes(e.name || '');
        }
        return e.type === eventType || e.name === eventType;
      })
    );
  }
}
