import { Injectable } from '@angular/core';
import { UserModel } from 'src/chat21-core/models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export abstract class NotificationsService {
  
  private _tenant: string;
  public BUILD_VERSION = environment.version

  public setTenant(tenant): void {
    this._tenant = tenant;
  }
  public getTenant(): string {
    if (this._tenant) {
      return this._tenant;
    } 
  }

  abstract initialize(tenant: string, vapidKey: string, platform: string): void;
  abstract getNotificationPermissionAndSaveToken(currentUserUid: string): void;
  abstract removeNotificationsInstance(callback: (string) => void): void;

  constructor( ) { 
      
  }


}
