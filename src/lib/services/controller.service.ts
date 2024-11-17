import { Injectable, OnInit } from '@angular/core';
import { FrameworkService } from './framework.service';

@Injectable({
  providedIn: 'root'
})
export class ControllerService<T> {
  constructor(protected framework: FrameworkService) {}
  async init() {}
  id: string;
  object: T;
  listObject: T[];
}
