import { Location } from "@angular/common";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UtilsService } from "./utils/utils.service";
import { EventBusService } from "./event-bus.service";
import { MessageType } from "../models/message-type.model";

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

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    this.eventBusService.emit({
      type: "show-messages-toast",
      payload: [
        {
          code: "success",
          type: MessageType.Success,
          description: this.utils.findTextTranslated("COPIED_TO_CLIPBOARD"),
        },
      ],
    });
  }

  defaultsComponentDateFormat = 'dd/mm/yy';
  defaultsPipeDateFormat = 'dd/MM/yyyy';
  defaultsPipeDateTimeFormat = 'dd/MM/yyyy HH:mm';
  language = 'pt';

  getFormattedDate(date: Date): string {
    return new Intl.DateTimeFormat(this.language, {
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  getDurationFromNow(date: Date): string {
    const now = new Date();
    const diffMs = Math.abs(now.getTime() - date.getTime());

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diffMs / (1000 * 60)) % 60);

    const translations = {
      en: { days: 'days', hours: 'hrs', mins: 'mins' },
      pt: { days: 'dias', hours: 'hrs', mins: 'min' },
      es: { days: 'días', hours: 'hrs', mins: 'min' },
      fr: { days: 'jours', hours: 'heures', mins: 'minutes' },
      de: { days: 'Tage', hours: 'Stunden', mins: 'Minuten' },
      it: { days: 'giorni', hours: 'ore', mins: 'minuti' },
    };

    const t = translations[this.language];

    let parts = [];
    if (days > 0) parts.push(`${days} ${t.days}`);
    if (hours > 0) parts.push(`${hours} ${t.hours}`);
    if (mins > 0) parts.push(`${mins} ${t.mins}`);

    return parts.join(' ');
  }

  scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  }
}
