import { Location } from "@angular/common";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UtilsService } from "./utils/utils.service";
import { EventBusService } from "./event-bus.service";

@Injectable({
  providedIn: "root"
})
export class FrameworkService {
  constructor(
    public location: Location,
    public router: Router,
    public utils: UtilsService,
    public eventBusService: EventBusService
  ) {}

  getLanguageMap() {
    return new Map<string, string>([
      ['pt', ''],
      ['en', ''],
      ['es', ''],
      ['fr', ''],
      ['de', ''],
      ['it', ''],
    ]);
  }

  defaultsPipeDateFormat = 'dd/MM/yyyy'
  defaultsComponentDateFormat = 'dd/mm/yy'
  language = 'pt';
}
