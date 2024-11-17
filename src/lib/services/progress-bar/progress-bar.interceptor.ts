import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ProgressBarService } from './progress-bar.service';

@Injectable()
export class ProgressBarInterceptor implements HttpInterceptor {

  constructor(private progressBarService: ProgressBarService) {}

  private requests: HttpRequest<any>[] = [];

  removeRequest(req: HttpRequest<any>) {
      const i = this.requests.indexOf(req);
      if (i >= 0) {
          this.requests.splice(i, 1);
      }
      this.progressBarService.isLoading.next(this.requests.length > 0);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      this.requests.push(req);
      this.progressBarService.isLoading.next(true);
      return Observable.create(observer => {
          const subscription = next.handle(req)
              .subscribe(
                  event => {
                      if (event instanceof HttpResponse) {
                          this.removeRequest(req);
                          observer.next(event);
                      }
                  },
                  err => {
                      this.removeRequest(req);
                      observer.error(err);
                  },
                  () => {
                      this.removeRequest(req);
                      observer.complete();
                  });
          // remove request from queue when cancelled
          return () => {
              this.removeRequest(req);
              subscription.unsubscribe();
          };
      });
  }
}
