import { Injectable, OnInit } from "@angular/core";
import { FrameworkService } from "./framework.service";

@Injectable({
  providedIn: "root",
})
export class ControllerService<T> {
  id: string;
  object: T;
  private initialObjectState: string;
  listObject: T[];

  constructor(protected framework: FrameworkService, protected objectConstructor: new () => T) {
  }

  createObject(): T {
    this.object = new this.objectConstructor();
    return this.object;
  }

  async init() {}

  setInitialObjectState(object: T) {
    if (object) {
      this.initialObjectState = JSON.stringify(object);
    } else {
      this.initialObjectState = null;
    }
  }

  getInitialObjectState(): string {
    return this.initialObjectState;
  }
}
