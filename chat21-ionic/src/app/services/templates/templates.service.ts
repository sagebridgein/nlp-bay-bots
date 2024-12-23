import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigProvider } from '../app-config';
import { LoggerService } from 'src/chat21-core/providers/abstract/logger.service';
import { LoggerInstance } from 'src/chat21-core/providers/logger/loggerInstance';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {

  private apiUrl: string;
  private logger: LoggerService = LoggerInstance.getInstance();

  constructor(
    public http: HttpClient,
    public appConfigProvider: AppConfigProvider
  ) { 
    // johnny
    this.apiUrl = appConfigProvider.getConfig().whatsappTemplatesBaseUrl;
    this.logger.log("[TEMPLATE SERVICE] apiUrl: ", this.apiUrl);
  }

  // ---------------------------------------------
  // @ GET templates list by project id
  // ---------------------------------------------
  getTemplatesList(project_id: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }

    const url = this.apiUrl + "ext/templates/" + project_id;
    this.logger.log('[TEMPLATES SERVICE] - getTemplatesList URL ', url);
    return this.http.get(url, httpOptions).pipe(map((res: any) => {
      this.logger.log('[TEMPLATES SERVICE] - getTemplatesList RES ', res);
      return res;
    }))
  }
}
