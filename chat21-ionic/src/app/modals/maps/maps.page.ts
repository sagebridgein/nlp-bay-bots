import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppConfigProvider } from 'src/app/services/app-config';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {

  selected_place: any;

  constructor(
    public viewCtrl: ModalController,
    private appConfigProvider: AppConfigProvider
  ) { }

  ngOnInit() {
    
  }

  loadScript(){
    const that = this;
    const apiKey = this.appConfigProvider.getConfig().googleMapsApiKey
    const url = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly'`
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    node.defer = true
    document.getElementsByTagName('head')[0].appendChild(node);

    node.onload= function(){
      that.initMap();
    }
  }

  ionViewWillEnter() {
    this.loadScript();
  }


  initMap(): void {
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        center: { lat: 40.1740762, lng: 18.164999 },
        zoom: 18,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false
      }
    );
    console.log("*** MAPS *** ", map);
    const card = document.getElementById("pac-card") as HTMLElement;
    const input = document.getElementById("pac-input") as HTMLInputElement;
    
    // const biasInputElement = document.getElementById(
    //   "use-location-bias"
    // ) as HTMLInputElement;
    // const strictBoundsInputElement = document.getElementById(
    //   "use-strict-bounds"
    // ) as HTMLInputElement;

    const options = {
      fields: ["formatted_address", "geometry", "name"],
      strictBounds: false,
      types: ["establishment"],
      cache: true
    };
  
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);
  
    const autocomplete = new google.maps.places.Autocomplete(input, options);
  
    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo("bounds", map);
  
    const infowindow = new google.maps.InfoWindow();
    const infowindowContent = document.getElementById(
      "infowindow-content"
    ) as HTMLElement;
  
    infowindow.setContent(infowindowContent);
  
    const marker = new google.maps.Marker({
      map,
      anchorPoint: new google.maps.Point(0, -29),
    });

  
    autocomplete.addListener("place_changed", () => {
      infowindow.close();
      marker.setVisible(false);
  
      const place = autocomplete.getPlace();

      console.log("*** MAP *** place: ", place)

      this.selected_place = {
        name: place.name,
        address: place.formatted_address,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng()
      }
  
      if (!place.geometry || !place.geometry.location) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }
  
      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }
  
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);
  
      // infowindowContent.children["place-name"].textContent = place.name;
      // infowindowContent.children["place-address"].textContent = place.formatted_address;
      // infowindow.open(map, marker);
    });
  
    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    function setupClickListener(id, types) {
      const radioButton = document.getElementById(id) as HTMLInputElement;
  
      radioButton.addEventListener("click", () => {
        autocomplete.setTypes(types);
        input.value = "";
      });
    }
  
    setupClickListener("changetype-all", []);
    setupClickListener("changetype-address", ["address"]);
    setupClickListener("changetype-establishment", ["establishment"]);
    setupClickListener("changetype-geocode", ["geocode"]);
    setupClickListener("changetype-cities", ["(cities)"]);
    setupClickListener("changetype-regions", ["(regions)"]);
  
    // biasInputElement.addEventListener("change", () => {
    //   if (biasInputElement.checked) {
    //     autocomplete.bindTo("bounds", map);
    //   } else {
    //     // User wants to turn off location bias, so three things need to happen:
    //     // 1. Unbind from map
    //     // 2. Reset the bounds to whole world
    //     // 3. Uncheck the strict bounds checkbox UI (which also disables strict bounds)
    //     autocomplete.unbind("bounds");
    //     autocomplete.setBounds({ east: 180, west: -180, north: 90, south: -90 });
    //     strictBoundsInputElement.checked = biasInputElement.checked;
    //   }
  
    //   input.value = "";
    // });
  
    // strictBoundsInputElement.addEventListener("change", () => {
    //   autocomplete.setOptions({
    //     strictBounds: strictBoundsInputElement.checked,
    //   });
  
    //   if (strictBoundsInputElement.checked) {
    //     biasInputElement.checked = strictBoundsInputElement.checked;
    //     autocomplete.bindTo("bounds", map);
    //   }
  
    //   input.value = "";
    // });
  }

  shareLocation() {
    console.log("share location called")
    this.viewCtrl.dismiss(this.selected_place);
  }

  async onClose() {
    this.viewCtrl.dismiss()
  }

}
