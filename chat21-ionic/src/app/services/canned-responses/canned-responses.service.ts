import { Injectable } from '@angular/core';
import { AppConfigProvider } from '../app-config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Logger
import { LoggerService } from 'src/chat21-core/providers/abstract/logger.service';
import { LoggerInstance } from 'src/chat21-core/providers/logger/loggerInstance';

@Injectable({
  providedIn: 'root'
})
export class CannedResponsesService {

  private apiUrl: string;
  private logger: LoggerService = LoggerInstance.getInstance();

  constructor(
    public http: HttpClient,
    public appConfigProvider: AppConfigProvider
  ) {
   
    this.logger.log('[CANNED-RESPONSES-SERVICE] HELLO !');
    this.apiUrl = appConfigProvider.getConfig().apiUrl;
    this.logger.log('[CANNED-RESPONSES-SERVICE] apiUrl ', this.apiUrl);
  }


  public getAll(token: string, projectid: string) {
    const cannedResponsesURL = this.apiUrl + projectid + "/canned/";
    this.logger.log('[CANNED-RESPONSES-SERVICE] getCannedResponses - URL ', cannedResponsesURL);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token
      })
    };
    
    return this.http.get(cannedResponsesURL, httpOptions).pipe(map((res: any) => {
        this.logger.log('[CANNED-RESPONSES-SERVICE] getCannedResponses - RES ', res);
        return res
    }))
  }

  // -------------------------------------------------------------------------------------
  // @ Create - Save (POST) new canned response
  // -------------------------------------------------------------------------------------
  public add(token: string, projectid: string, title: string, message: string) {
    const url =  this.apiUrl  + projectid + '/canned/'
    this.logger.log('[TILEDESK-SERVICE] - CREATE CANNED-RES - URL', url); 
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token
      })
    };

    const body = {
      title: title,
      text: message
    }

    return this.http.post(url, JSON.stringify(body), httpOptions).pipe(map((res: any) => {
      this.logger.log('[TILEDESK-SERVICE] - CREATE CANNED-RES - RES ', res);
      return res
    }))
      
  }

  public edit(token: string, projectid: string, canned: any){
    const cannedResponsesURL = this.apiUrl + projectid + "/canned/"+ canned._id;
    this.logger.log('[CANNED-RESPONSES-SERVICE] editCannedResponses - URL ', cannedResponsesURL);
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token
      })
    };

    const body = {
      title: canned.title,
      text: canned.text
    }

    return this.http.put(cannedResponsesURL, body, httpOptions).pipe(map((res: any) => {
        this.logger.log('[CANNED-RESPONSES-SERVICE] editCannedResponses - RES ', res);
        return res
    }))
  }

  public delete(token: string, projectid: string, cannedID: string){
    const cannedResponsesURL = this.apiUrl + projectid + "/canned/"+cannedID;
    this.logger.log('[CANNED-RESPONSES-SERVICE] deleteCannedResponses - URL ', cannedResponsesURL);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token
      })
    };

    return this.http.delete(cannedResponsesURL, httpOptions).pipe(map((res: any) => {
        this.logger.log('[CANNED-RESPONSES-SERVICE] deleteCannedResponses - RES ', res);
        return res
    }))
  }

}
