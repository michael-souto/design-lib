import { Location } from "@angular/common";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UtilsService } from "./utils/utils.service";

@Injectable({
  providedIn: "root"
})
export class FrameworkService {
  constructor(
    public location: Location,
    public router: Router,
    public utils: UtilsService
  ) {}
}
