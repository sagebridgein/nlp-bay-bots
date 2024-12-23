import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'chat-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {

  @Input() metadata: any;
  @Input() width: number;
  @Input() height: number;
  @Output() onElementRendered = new EventEmitter<{element: string, status: boolean}>();

  loading: boolean = true
  modal: any
  span: any

  constructor() { }

  ngOnInit() {
  }

  onLoaded(event) {
    this.loading = false
    this.onElementRendered.emit({element: "image", status:true})
  }

  _downloadImage(url: string, fileName: string) {
    // console.log('Image COMP - IMAGE URL ', url) 
    // console.log('Image COMP - IMAGE FILENAME ', fileName) 
    const a: any = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.style = 'display: none';
    a.click();
    a.remove();
  }

  openImageViewerModal(url: string, fileName: string) {
    this.modal = document.getElementById("image-viewer-modal");
    // console.log('has clicked open image-viewer modal ',  this.modal)
    this.modal.style.display = "block";
    var modalImg = <HTMLImageElement>document.getElementById("image-viewer-img");
    var captionText = document.getElementById("caption");
    modalImg.src = url
    if (captionText) {
   
      captionText.innerHTML = fileName ? fileName : decodeURIComponent(decodeURIComponent(url).split('/').pop());
      // console.log('XXXX ', decodeURIComponent(decodeURIComponent(url).split('/').pop()))
    }

  }


}


