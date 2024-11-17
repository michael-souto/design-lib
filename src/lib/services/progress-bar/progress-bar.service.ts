import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {
  private loading: any;
  private requestCount = 0;

  constructor(private loadingController: LoadingController) {}

  public isLoading = new BehaviorSubject(false);

  async showProgressBar() {
    if (this.requestCount === 0) {
      this.loading = await this.loadingController.create({
        message: 'Carregando...'
      });
      await this.loading.present();
    }
    this.requestCount++;
  }

  hideProgressBar() {
    if (this.requestCount > 0) {
      this.requestCount--;
    }
    if (this.requestCount === 0 && this.loading) {
      this.loading.dismiss();
    }
  }
}
