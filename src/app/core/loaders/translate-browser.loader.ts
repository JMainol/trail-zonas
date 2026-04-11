import { makeStateKey, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

export class TranslateBrowserLoader implements TranslateLoader {
    constructor(
        private transferState: TransferState,
        private http: HttpClient,
        private prefix: string = './assets/i18n/',
        private suffix: string = '.json'
    ) { }

    public getTranslation(lang: string): Observable<any> {
        const key = makeStateKey<any>('translate-' + lang);

        // Si ya está en TransferState (transferido desde el servidor)
        if (this.transferState.hasKey(key)) {
            const translations = this.transferState.get(key, {});
            // Limpiar la clave del estado después de consumirla para evitar fugas de memoria
            this.transferState.remove(key);
            return of(translations);
        }

        // Si no está, hacer petición HTTP normal
        return this.http.get<any>(`${this.prefix}${lang}${this.suffix}`);
    }
}
