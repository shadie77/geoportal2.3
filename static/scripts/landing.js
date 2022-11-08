var banner = document.getElementsByClassName('banner')[0]
var carousel = document.getElementById('imageCarousel')

var i = 0;
var images = [];
var text = [];
var slideTime = 15000; // 30 seconds

images[0] = droneMapping;
images[1] = bathy;
images[2] = terminals;
images[3] = routeAnalysis

text[0] = "Drone Mapping"
text[1] = 'Bathymetry Survey'
text[2] = "Terminal Needs Assessment"
text[3] = "Route Analysis"

function changePicture() {
    banner.style.backgroundImage ="linear-gradient(rgba(0,0,0,0.7), rgba(0, 0, 0, 0.7)),url(" + images[i] + ")";
    banner.style.transition= "background-image 0.2s ease-in-out";
    carousel.innerHTML = text[i]

    if (i < images.length - 1) {
        i++;
    } else {
        i = 0;
    }
    setTimeout(changePicture, slideTime);
}

window.onload = changePicture;