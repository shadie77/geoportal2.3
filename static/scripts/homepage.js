// Declare variables 
let form = document.getElementsByClassName('formDetails')[0];
var profileButton = document.getElementById('profileButton');
var jettyButton = document.getElementById('addJettyButton');
var kmlButton = document.getElementById('kmlButton');
var edit = document.getElementById('editButton');
let saveButton = document.getElementById('addData');
let cancel = document.getElementById('cancelEdit');
var layerGroup = L.layerGroup();
let upload = document.getElementById('uploadButton');
let jettyForm = document.getElementsByClassName('formDiv')[0]
let otherContent = document.getElementsByClassName('inner-content')[0]
let listDropdown = document.getElementById("dataOption")
let forDiv= document.getElementById('forDiv')

/*-------------------------------------------------------------------
SET THE SLIDEOUT COLOR TO BE BLUE WHEN INACTIVE AND WHITE WHEN ACTIVE
----------------------------------------------------------------------*/
function show(openclose) {
    var slideOut = document.getElementsByClassName('mini-info')[0];
    var slideArrow = document.getElementById('slidearrow');
    if (openclose == 'open') {
        if (slideOut.classList.contains('active')) {
            pass
        } else {
            slideOut.classList.toggle('active')
        }

    } else if (openclose == 'close') {
        if (slideOut.classList.contains('active')) {
            slideOut.classList.toggle('active')
        } else {
        }
    } else {
        slideOut.classList.toggle('active');
    }
    document.getElementsByClassName('jtitle')[0].classList.toggle('active');
    document.getElementsByClassName('content')[0].classList.toggle('active');

    if (slideOut.classList.contains('active')) {
        slideArrow.innerHTML = '»';
        slideArrow.style.color = '#007ee6';
    } else {
        slideArrow.innerHTML = "«";
        slideArrow.style.color = 'white'
    }
}

/* END OF FUNCTION
------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------
FUNCTION TO ADD JETTY TO DASHBOARD
----------------------------------------------------------------------------------------------*/

addPoint = (e) => {
    // Declare variables
    map.off('click');
    document.getElementById('map').style.cursor = 'crosshair';
    var long = document.getElementById('formLongitude');
    var lat = document.getElementById('formLatitude');
    var jettyName = document.getElementById('jName');
    
    

    kmlButton.disabled = true;
    //profileButton.disabled = true;
    jettyButton.disabled = true;
    edit.disabled =false;
    saveButton.disabled = false;
    cancel.disabled = false;

    map.on('click', function(e){
        try {
            form.reset();
        } catch {

        }
    console.log(e.latlng.lat);
    long.value = e.latlng.lng;
    lat.value = e.latlng.lat;
    newMarker = new Drift_Marker(e.latlng,{
        draggable: true,
        title: "Resource location",
        alt: "Resource Location",
        riseOnHover: true
    }).bindTooltip('NEW JETTY', {pane: 'tooltipPane', offset: [-3,-12], permanent:true, direction: 'top',  opacity:0.7, className: 'jettylabels'}).openTooltip().addTo(map);
    jettyName.addEventListener('input', updateLabel)
    function updateLabel(){
        newMarker.bindTooltip(this.value);
     }
     newMarker.on("dragend", function (ev) {
        var chagedPos = ev.target.getLatLng();
        long.value = chagedPos.lng;
        lat.value = chagedPos.lat;
      });
     
    // Set the longitude and latitude
    jettyForm.style.display = "block";
    otherContent.style.display= "none";
    show('open');

    // Keep a record of the form details
    
                      
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        form = document.getElementsByClassName('formDetails')[0];

        myFormData = new FormData(e.target);

        const formDataObj = Object.fromEntries(myFormData.entries());
        newMarker.feature = { 
            type: 'Point', 
            properties: formDataObj, 
            geometry: undefined 
          };
          newMarker.addTo(layerGroup);
          layerGroup.addTo(map);
          console.log(layerGroup);
          // Set the form back to null
          

    });
 
    });
}

function cancelEdit() {
    form.reset()
    map.off('click');
    document.getElementById('map').style.cursor = 'grab';
    kmlButton.disabled = false;
    //profileButton.disabled = false;
    jettyButton.disabled = false;
    edit.disabled =true;
    saveButton.disabled = true;
    cancel.disabled = true;
    //remove all layers from FeatureGroup
    try {
        map.removeLayer(newMarker);
        map.removeLayer(layerGroup);
    } catch {

    }
    
    show('close');
    layerGroup.clearLayers()
    var bathymetryLayer = new L.TileLayer.WMS('http://localhost:8080/geoserver/wms', {
      layers: 'laswa:waterraster',
      format: 'image/png',
      transparent: true,
      version: '1.3.0',
      crs: L.CRS.EPSG4326
    }).addTo(map);

    var popup = L.popup()

    map.on('click', function(e) {
        bathymetryLayer.getFeatureInfo({
          latlng: e.latlng,
          done: function(featureCollection) {
          var eachdepth =`<h3>${featureCollection["features"][0]['properties']["GRAY_INDEX"].toFixed(2)}</h3>` 
          popup.setLatLng(e.latlng)
          .setContent(eachdepth)
          .openOn(map);
        },
        fail: function(errorThrown) {
          console.log('getFeatureInfo failed: ', errorThrown);
        }
        });
      });
      // Hide the form and show the other content
      jettyForm.style.display = 'none';
      otherContent.style.display = 'block';


}

function convertToLayer(CSV) {
    var geoLayer = L.geoCsv(CSV, {
        longitudeTitle: 'X',
        latitudeTitle: 'Y',
        firstLineTitles: true,
        fieldSeparator: ',',
        pointToLayer: function (feature, latlng) {
            console.log(feature.properties)
            return L.marker(latlng).bindTooltip(feature.properties.name, {pane: 'tooltipPane', offset: [-3,-12], permanent:true, direction: 'top',  opacity:0.7, className: 'jettylabels'}).openTooltip();
    }
    });
    geoLayer.addTo(map);
}

function test(){
    var fileUpload = document.getElementById('myFile');
    if (fileUpload.files.length > 0) {
        var file = fileUpload.files[0];
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
        convertToLayer(evt.target.result);
        saveButton.disabled = false;
        cancel.disabled = false;
        //saveButton.addEventListener('click', saveData('csv', evt.target.result));
        }

    }
}

function saveData2() {
    var newObj = []
    for (let i = 0; i< layerGroup.getLayers().length; i++){
        newObj.push(
        {
            Name : layerGroup.getLayers()[i].feature.properties.name,
            Terminal : layerGroup.getLayers()[i].feature.properties.terminal,
            Type : layerGroup.getLayers()[i].feature.properties['landing type'],
            Long : layerGroup.getLayers()[i].feature.properties.longitude,
            Lat : layerGroup.getLayers()[i].feature.properties.latitude

        });
    }

    //Convert object to CSV format
    const array = [Object.keys(newObj[0])].concat(newObj)
    var csvObj =  array.map(it => {
        return Object.values(it).toString()
      }).join('\n')

    // Send to backend in a form
    const form = document.createElement('form');
    form.method = 'post';
    form.action = dashboardLink;

    var inputElem = document.createElement('input');
    inputElem.type = 'hidden';
    inputElem.name = 'csrfmiddlewaretoken';
    inputElem.value = csrf;

    const jettyname = document.createElement('textarea');
    jettyname.name = 'csvtext';
    jettyname.value = csvObj;

    form.appendChild(inputElem)
    form.appendChild(jettyname);

    document.body.appendChild(form);
    form.submit();
}

//To delete
function saveData() {
    for (let i = 0; i < layerGroup.getLayers().length; i++) {
        console.log(layerGroup.getLayers()[i].feature.properties.name)
      

        // The rest of this code assumes you are not using a library.
        // It can be made less verbose if you use one.
    
        const form = document.createElement('form');
        form.method = 'post';
        form.action = dashboardLink;

        var inputElem = document.createElement('input');
        inputElem.type = 'hidden';
        inputElem.name = 'csrfmiddlewaretoken';
        inputElem.value = csrf;

        const jettyname = document.createElement('input');
        jettyname.type = 'text';
        jettyname.name = 'name';
        jettyname.value = layerGroup.getLayers()[i].feature.properties.name;

        const terminal = document.createElement('input');
        terminal.type = 'text';
        terminal.name = 'terminalType';
        terminal.value = layerGroup.getLayers()[i].feature.properties.terminal

        const landingType = document.createElement('input');
        landingType.type = 'text';
        landingType.name= 'landingType';
        landingType.value = layerGroup.getLayers()[i].feature.properties['landing type']

        const long= document.createElement('input');
        long.type = 'text'
        long.name = 'Longitude'
        long.value = layerGroup.getLayers()[i].feature.properties.longitude;

        const lat = document.createElement('input');
        lat.type = 'text';
        lat.name = 'Latitude'
        lat.value = layerGroup.getLayers()[i].feature.properties.latitude;
        

        form.appendChild(inputElem)
        form.appendChild(jettyname);
    
        document.body.appendChild(form);
        form.submit();
    }
  }



function importKML(){
    // Load kml file
    fetch(testkml)
    .then(res => res.text())
    .then(kmltext => {
        // Create new kml overlay
        const parser = new DOMParser();
        const kml = parser.parseFromString(kmltext, 'text/xml');
        const track = new L.KML(kml);
        map.addLayer(track);
        console.log(kml)

    });

}

/*-----------------------------------------------------------------------------------
BOTTOM SLIDER TRIGER
-------------------------------------------------------------------------------------------*/
// Toggle bottom slider when clicked
function bottomSlider() {
    document.getElementsByClassName('footer')[0].classList.toggle('close');
  };

// Function to set the  The date to today
document.getElementById('datePicker').valueAsDate= new Date();

//Function to set the daily information to today
document.getElementsByClassName("routeToday")[0].innerHTML = "("+todayDateFormat()+")"
document.getElementById("dailyDate").innerHTML= "("+todayDateFormat()+")"
// Function to set the number range to 2 by default
document.getElementById('quantity').value = 2;
document.getElementsByClassName('firstDropdown')[0].style.display = 'block';

// Function to set number of jetty dropdown based on value picked
const radioButtons = document.querySelectorAll('input[name="radio"]')
for (const radio of radioButtons) {
    radio.onclick = function(){
    if (radio.checked) {
        if (radio.value =='one') {
            document.getElementsByClassName('multipleJettyOption')[0].style.display = 'none'
            document.getElementsByClassName('secondDropdown')[0].style.display = 'none'
            document.getElementsByClassName('thirdDropdown')[0].style.display = 'none'
            document.getElementsByClassName('fourthDropdown')[0].style.display = 'none'
        } else {
            document.getElementsByClassName('multipleJettyOption')[0].style.display = 'block';
            document.getElementsByClassName('secondDropdown')[0].style.display = 'block';
            document.getElementById('quantity').value = 2;
            let numberOfDropdown = document.getElementById('quantity')
            numberOfDropdown.addEventListener('change', function(){
                if (numberOfDropdown.value == '2') {
                    document.getElementsByClassName('secondDropdown')[0].style.display = 'block';
                    document.getElementsByClassName('thirdDropdown')[0].style.display = 'none';
                    document.getElementsByClassName('fourthDropdown')[0].style.display = 'none';
                } else if (numberOfDropdown.value == '3') {
                    document.getElementsByClassName('secondDropdown')[0].style.display = 'block';
                    document.getElementsByClassName('thirdDropdown')[0].style.display = 'block';
                    document.getElementsByClassName('fourthDropdown')[0].style.display = 'none';
                } else if (numberOfDropdown.value == '4') {
                    document.getElementsByClassName('secondDropdown')[0].style.display = 'block';
                    document.getElementsByClassName('thirdDropdown')[0].style.display = 'block';
                    document.getElementsByClassName('fourthDropdown')[0].style.display = 'block';
                }
                else {
                    document.getElementsByClassName('secondDropdown')[0].style.display = 'block';
                    document.getElementsByClassName('thirdDropdown')[0].style.display = 'none';
                    document.getElementsByClassName('fourthDropdown')[0].style.display = 'none';
                }
            })
        }
      }
    }
}



/*--------------------------------------------------------------------------------------
DOWNLOAD SLIDER TRIGGER
--------------------------------------------------------------------------------------------*/
function downloadSlider() {
    document.getElementsByClassName('downloadData')[0].classList.toggle('close')
};

let onBetwwenDiv = document.getElementById('onBetwwenDiv')
let dateDiv = document.getElementById("dateDiv")
let atWithinDiv = document.getElementById("atWithinDiv");
let timeDiv = document.getElementById("timeDiv");

listDropdown.addEventListener('change', function(){
    if (listDropdown.value == 'jetty' || listDropdown.value== 'route') {
        forDiv.style.display = 'none';
        onBetwwenDiv.style.display = "none";
        dateDiv.style.display = 'none';
        atWithinDiv.style.display = "none";
        timeDiv.style.display = "none";
    } else if (listDropdown.value =='bathymetry') {
        forDiv.style.display = 'block';
        onBetwwenDiv.style.display = "none";
        dateDiv.style.display = 'none';
        atWithinDiv.style.display = "none";
        timeDiv.style.display = "none";
    } else if (listDropdown.value == 'accident') {
        forDiv.style.display = 'none';
        onBetwwenDiv.style.display = "block";
        dateDiv.style.display = 'block';
        atWithinDiv.style.display = "block";
        timeDiv.style.display = "block";

    } else {
        forDiv.style.display = 'block';
        onBetwwenDiv.style.display = "block";
        dateDiv.style.display = 'block';
        atWithinDiv.style.display = "block";
        timeDiv.style.display = "block";
    }
})