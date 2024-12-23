import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Project } from 'src/chat21-core/models/projects';
import { LoggerService } from 'src/chat21-core/providers/abstract/logger.service';
import { LoggerInstance } from 'src/chat21-core/providers/logger/loggerInstance';
import { AppConfigProvider } from '../app-config';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private apiUrl: string;
  private logger: LoggerService = LoggerInstance.getInstance();

  constructor(
    public http: HttpClient,
    public appConfigProvider: AppConfigProvider
  ) {
   
    this.logger.log('[PROJECTS-SERVICE] HELLO !');
    this.apiUrl = appConfigProvider.getConfig().apiUrl;
    this.logger.log('[PROJECTS-SERVICE] apiUrl ', this.apiUrl);
  }

  public getProjects(token: string) {
    const url = this.apiUrl  + "projects/";
    this.logger.log('[PROJECTS-SERVICE] getProjects - URL ', url);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token
      })
    };
    
    return this.http.get(url, httpOptions).pipe(map((res: Project[]) => {
        this.logger.log('[PROJECTS-SERVICE] getProjects - RES ', res);
        return res
    }))
  }
}
