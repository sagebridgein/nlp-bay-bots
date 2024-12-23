import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

// import  brand  from "../../assets/brand/brand.json";
import * as brand from 'assets/brand/brand.json';
import { TranslateService } from '@ngx-translate/core';
import { LoggerService } from '../services/logger/logger.service';

const swal = require('sweetalert');

@Injectable()
export class BrandService {



  // "brandSrc":"https://tiledeskbrand.nicolan74.repl.co/mybrand",

  public brand: any;

  _brand = brand

  public assetBrand: any;
  // public brand = brand
  // local_url = '/assets/brand/brand.json';
  warning: string;
  loadBrandError: string;

  constructor(
    private httpClient: HttpClient,
    private translate: TranslateService,
    private logger: LoggerService
  ) {
    this.getTranslations()
    // console.log('[BRAND-SERV] HELLO !!!!!!! ');
  }

  getTranslations() {
    this.translate.get('Warning')
      .subscribe((text: string) => {
        this.warning = text;
      });

    this.translate.get('RelatedKnowledgeBase')
      .subscribe((text: string) => {
        this.loadBrandError = text;
      });
  }

  isEmpty(url: string) {
    return (url === undefined || url == null || url.length <= 0) ? true : false;
  }

  // getData() {
  //   return this.httpClient.get('/assets/brand/brand.json');
  // }


  async loadBrand() {

    // this.getData()
    //   .subscribe(data => {
    //     this.assetBrand = data
    //     this.logger.log('[BRAND-SERV] BRAND RETIEVED FROM ASSET assetBrand ', this.assetBrand);
    //   });

    let url = ''
    if (environment.remoteConfig === false) {

      if (environment.hasOwnProperty("brandSrc")) {

      //  console.log('[BRAND-SERV] loadBrand remoteConfig is false - env has Property brandSrc');
        const remoteBrandUrl = this.isEmpty(environment['brandSrc']);

        if (!remoteBrandUrl) {
          this.logger.log('[BRAND-SERV] loadBrand remoteConfig is false - env brandSrc is empty ? ', remoteBrandUrl);
          url = environment['brandSrc']
        } else {
          this.logger.log('[BRAND-SERV] loadBrand remoteConfig is false - env brandSrc is empty ? ', remoteBrandUrl, ' -> load from assets')
          this.brand = this._brand;
        }
      } else {
        this.logger.log('[BRAND-SERV] loadBrand remoteConfig is false - env NOT has Property brandSrc -> load from assets');
        this.brand = this._brand;
      }
    } else {
      const res = await this.httpClient.get(environment['remoteConfigUrl']).toPromise();
      // console.log('[BRAND-SERV] loadBrand - remoteConfig -> true get remoteConfig response ', res);


      const remoteConfigData = res
      // this.logger.log('BrandService loadBrand - remoteConfig is true - get remoteConfigData  res ', remoteConfigData);

      if (remoteConfigData.hasOwnProperty("brandSrc")) {
        this.logger.log('[BRAND-SERV] loadBrand remoteConfig is true - remoteConfigData has Property brandSrc');

        const remoteBrandUrl = this.isEmpty(remoteConfigData['brandSrc']);
        if (!remoteBrandUrl) {
          this.logger.log('[BRAND-SERV] loadBrand remoteConfig is true - remoteConfigData brandSrc is empty ?', remoteBrandUrl);

          url = remoteConfigData['brandSrc']


        } else {
          // console.log('[BRAND-SERV] loadBrand remoteConfig is true - remoteConfigData brandSrc is empty ?', remoteBrandUrl, ' -> load from assets');

          this.brand = this._brand;
          // console.log('[BRAND-SERV] this.brand', this.brand )
        }

      } else {
        this.logger.log('[BRAND-SERV] loadBrand remoteConfig is true - remoteConfigData NOT has Property brandSrc -> load from assets');
        // this.setBrand(this.local_url)
        // url = this.local_url
        this.brand = this._brand;
      }
    }

    try {
      if (url) {
        const data = await this.httpClient.get(url).toPromise();

        this.logger.log('[BRAND-SERV] **** GET BRAND FROM URL ****', url);

        // this.brand = JSON.parse(data['_body'])
        this.brand = data

        this.logger.log('[BRAND-SERV] loadBrand - brand: ', this.brand);
      }
    } catch (err) {
      this.logger.error('[BRAND-SERV] loadBrand error : ', err);

      this.brand = this._brand;
      // this.notify.showNotificationChangeProject('ops', 2, 'done');
      this.displaySwalAlert(err)
    }
  }

  displaySwalAlert(err) {
    swal({
      title: this.warning,
      text: 'An error occurred while uploading your brand. Error code: ' + err.status,
      icon: "warning",
      button: true,
      dangerMode: false,
    })
  }

  // getBrand() {
  //   // this.logger.log('BrandService getBrand has been called - brand: ', this.brand);
  //   return this.brand;
  // }
  getBrand() {
    this.logger.log('BrandService getBrand has been called - brand: ', this.brand);
    return { ...this.brand['DASHBOARD'], ...this.brand['COMMON'], ...{WIDGET: this.brand['WIDGET']} };

  }


}
