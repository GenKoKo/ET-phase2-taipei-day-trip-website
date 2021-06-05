// get booking data from API
function get_booking_data(){
    let main = document.querySelector('main');
    let empty_state = document.querySelector('.empty_state');
    axios({
        method: "GET",
        url: api_url_booking
    })
        .then( res =>{
            let image = res['data']['data']['attraction']['image'];
            let tag_img = document.querySelector('img');
            tag_img.src = image;

            let spot_name = res['data']['data']['attraction']['name'];
            // let class_spot_name = document.querySelector('.spot_name');
            // class_spot_name.append(spot_name)
            let p_spot_name = document.createElement('p');
            p_spot_name.textContent = spot_name
            let class_title_spot = document.querySelector('.title_spot');
            class_title_spot.append(p_spot_name)



            let date = res['data']['data']['date'];
            let class_date = document.querySelector('.date');
            class_date.append(date)

            let time = res['data']['data']['time'];
            let class_time = document.querySelector('.time');
            if ( time == 'morning'){
                class_time.append('早上 9 點到下午 4 點')
            }else if( time == 'afternoon'){
                class_time.append('下午 2 點到晚上 9 點')
            }

            
            let price = res['data']['data']['price'];
            let class_price = document.querySelector('.price');
            class_price.append('新台幣 '+ price+' 元')
            
            let class_price_info = document.querySelector('.price_info');
            class_price_info.append('新台幣 '+ price+' 元')

            let address = res['data']['data']['attraction']['address'];
            let class_address = document.querySelector('.address');
            class_address.append(address)
            

            main.style.visibility = "visible";
            empty_state.style.display = "none";

            console.log("🚀 ~ file: login_register.js ~ line 242 ~ get_booking_data ~ res", res)
            
        })
        .catch( err => {

            empty_state.style.visibility='visible';
            main.style.display = "none";

            console.log("🚀 ~ file: login_register.js ~ line 245 ~ get_booking_data ~ err", err)            
        })
}


function get_user_data(){
    let email = localStorage.getItem('email');
    let username = localStorage.getItem('username');
    let class_username = document.querySelector('.username');
    class_username.append(username);

    let class_username_form = document.querySelector('input[name="username"]');
    class_username_form.value = username;
    let class_email_form = document.querySelector('input[name="email"]');
    class_email_form.value = email;

}

function booking_delete(){

    axios({
        method: "DELETE",
        url: api_url_booking
    })
        .then( res => {
        console.log("🚀 ~ file: booking.js ~ line 74 ~ booking_delete ~ res", res)
        location.reload();
        

        })
        .catch( err => {
        console.log("🚀 ~ file: booking.js ~ line 77 ~ booking_delete ~ err", err)
            
        })
}