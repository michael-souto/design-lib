import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import {
  filter,
  map,
  tap,
} from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class EventBusService {
  private events$ =
    new Subject<Event>();

  emit(event: Event) {
    this.events$.next(event);
  }

  emitEvent(
    type: string,
    payload?: any,
    callback?: (payload: any) => void,
    valid?: (payload: any) => void
  ) {
    this.events$.next({
      type,
      payload,
      callback,
      valid,
    });
  }

  on(types: string | string[]) {
    const typeArray = Array.isArray(
      types
    )
      ? types
      : [types];

    return this.events$
      .asObservable()
      .pipe(
        filter((event) =>
          typeArray.includes(event.type)
        ),
        map((event) => event)
      );
  }
}

export interface Event {
  type: string;
  payload?: any;
  callback?: (payload: any) => void;
  valid?: (payload: any) => void;
}
