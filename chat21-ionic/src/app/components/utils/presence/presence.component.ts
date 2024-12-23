import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-presence',
  templateUrl: './presence.component.html',
  styleUrls: ['./presence.component.scss'],
})
export class PresenceComponent implements OnInit {

  @Input() isOnline: boolean = false;
  @Input() translationMap: Map<string, string>;
  // @Input() fontColor: string;
  // @Input() borderColor: string;
  
  borderColor = '#ffffff';
  fontColor = '#949494';

  constructor() { }

  ngOnInit() {}

}
