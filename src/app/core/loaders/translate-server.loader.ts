import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';

export class TranslateServerLoader implements TranslateLoader {
    constructor(
        private prefix: string = 'dist/trail-zonas/browser/assets/i18n/',
        private suffix: string = '.json'
    ) { }

    public getTranslation(lang: string): Observable<any> {
        // In Angular build process, the assets are in public folder or src/assets
        // During prerendering, it might need to look in src/assets if it's running from root
        let assetsPath = path.join(process.cwd(), 'src', 'assets', 'i18n', `${lang}${this.suffix}`);

        // Check if it exists in src/assets (for development/prerendering from source)
        if (!fs.existsSync(assetsPath)) {
            // Try public folder (if using Angular 18+ public folder)
            assetsPath = path.join(process.cwd(), 'public', 'assets', 'i18n', `${lang}${this.suffix}`);
        }

        if (fs.existsSync(assetsPath)) {
            const data = fs.readFileSync(assetsPath, 'utf8');
            return of(JSON.parse(data));
        }

        console.error(`Could not find translation file: ${assetsPath}`);
        return of({});
    }
}
