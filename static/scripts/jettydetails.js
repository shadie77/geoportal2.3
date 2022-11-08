let imageContainer = document.getElementsByClassName('pictureDiv')[0]

async function fetchData(url){
  let response = await fetch(url);
  let data = await response.json()
  return data;
}
async function main() {
  imagelinks = await fetchData("http://shadie77.pythonanywhere.com/api/jetty_images/pic_list?jetty_id=38")
  if (imagelinks.pictures.length==0){
    imagelinks.pictures.forEach(element => {
      var imag = document.createElement('img');
      imag.setAttribute('src', "http://shadie77.pythonanywhere.com/Documents/laswa/backend/media/"+element)
      imag.classList.add('pictures')
      imageContainer.appendChild(imag)
      
    });
    let imgs = document.getElementsByClassName("pictures");
let currentIndex = 0;
let time = 10000; // default time for auto slideshow

const defClass = (startPos, index) => {
  for (let i = startPos; i < imgs.length; i++) {
    imgs[i].style.display = "none";
  }
  imgs[index].style.display = "block";
};

defClass(1, 0);

const startAutoSlide = () => {
    setInterval(() => {
      currentIndex >= imgs.length-1 ? currentIndex = 0 : currentIndex++;
      defClass(0, currentIndex);
    }, time);
  };

startAutoSlide(); // Start the slideshow
  } else{

  }
  
}
main()
