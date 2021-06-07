localHost = "http://127.0.0.1:3000/" // for develop
EC2Host = "http://54.168.152.131:3000/" //for deploy

HostNow = localHost;

let api_url_spot_id = HostNow+"api/attraction/";



let id = null;
function processor(){
    let pathname = window.location.pathname
    let id = pathname.replace('/attraction/','')
    console.log("🚀 ~ file: attraction.html ~ line 48 ~ getID ~ id", id)

    loader(id);
}

let img_counter = 0;
let imgs_in_carousel;
let image_width;
function loader(id){
    let api_target_spot = api_url_spot_id + id
    fetch(api_target_spot).then( (res) => {return res.json();}).then( (result) =>{
        let api_init = result['data']
        let name = api_init['name']
        let address = api_init['address']
        let category = api_init['category']
        let description = api_init['description']
        let images = api_init['images']
        let mrt = api_init['mrt']
        let transport = api_init['transport']  

        let name_id = document.getElementById('name')
        name_id.append(name)

        let address_id = document.getElementById('address')
        address_id.append(address)
        
        let description_id = document.getElementById('description')
        description_id.append(description)
        
        
        let tranport_id = document.getElementById('transport')
        tranport_id.append(transport)
        
        let location_id = document.getElementById('location')
        location_id.append(category+" at "+mrt)
        
        let carousel_slide_id = document.getElementById('carousel_slide')
        
        
        let image_last = document.createElement('img')
        image_last.className = 'image'
        image_last.id = 'lastClone'
        image_last.src = images[images.length-1]
        carousel_slide_id.appendChild(image_last)                        
        
        while(images[img_counter]){
            let image = document.createElement('img')
            image.className = 'image'
            image.src = images[img_counter]
            carousel_slide_id.appendChild(image)
            img_counter++
            
        }

        let image_first = document.createElement('img')
        image_first.className = 'image'
        image_first.id = 'firstClone'
        image_first.src = images[0]
        carousel_slide_id.appendChild(image_first)  


        imgs_in_carousel = document.querySelectorAll("#carousel_slide img") 
        image_width = imgs_in_carousel[0].width
        carouselSlide.style.transform = 'translateX(' + (-image_width * slide_counter) + 'px)';
    })
}


const carouselSlide = document.querySelector('#carousel_slide')

const prevBtn = document.querySelector('#prevBtn')
const nextBtn = document.querySelector('#nextBtn')
let slide_counter = 1;
nextBtn.addEventListener('click', () =>{
    console.log("🚀 ~ file: attraction.html ~ line 154 ~ fetch ~ image_width", image_width)
    if(slide_counter >= imgs_in_carousel.length-1) return;
    carouselSlide.style.transition = 'transform 0.3s ease-in-out';
    slide_counter++;
    carouselSlide.style.transform = 'translateX(' + (-image_width * slide_counter) + 'px)';
})
prevBtn.addEventListener('click', () =>{
    if(slide_counter <= 0) return;
    carouselSlide.style.transition = 'transform 0.4s ease-in-out';
    slide_counter--;
    carouselSlide.style.transform = 'translateX(' + (-image_width * slide_counter) + 'px)';
})


carouselSlide.addEventListener('transitionend', ()=>{
    if(imgs_in_carousel[slide_counter].id === 'lastClone'){
        carouselSlide.style.transition = 'none';
        slide_counter = imgs_in_carousel.length -2;
        carouselSlide.style.transform = 'translateX(' + (-image_width * slide_counter) + 'px)';
    }       
    if(imgs_in_carousel[slide_counter].id === 'firstClone'){
        carouselSlide.style.transition = 'none';
        slide_counter = imgs_in_carousel.length - slide_counter;
        carouselSlide.style.transform = 'translateX(' + (-image_width * slide_counter) + 'px)';
    }       
})


let booking_price_id = document.getElementById("booking_price")
function getPrice(time){
    booking_price_id.innerHTML = ""
    if( time === "am"){
        let price = document.createTextNode("新台幣 2000 元")
        booking_price_id.append(price)
    }else if(time === "pm"){                        
        let price = document.createTextNode("新台幣 2500 元")
        booking_price_id.append(price)
    }
}



