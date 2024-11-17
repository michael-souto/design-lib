import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';

export class MultiTranslateHttpLoader implements TranslateLoader {
  constructor(
    private http: HttpClient,
    public resources: { prefix: string; suffix: string }[]
  ) {}

  getTranslation(lang: string): Observable<any> {
    if (!this.resources || this.resources.length === 0) {
      console.log('Nenhum recurso de tradução configurado.');
      return of({});
    }

    console.log(`Carregando traduções para o idioma: ${lang}`);

    return forkJoin(
      this.resources.map(config => {
        const url = `${config.prefix}${lang}${config.suffix}`;
        console.log(`Requisitando tradução em: ${url}`);
        return this.http.get(url);
      })
    ).pipe(
      map(response => {
        console.log('Respostas de tradução recebidas:', response);
        return response.reduce((acc, res) => {
          return { ...acc, ...res };
        }, {});
      })
    );
  }

}
