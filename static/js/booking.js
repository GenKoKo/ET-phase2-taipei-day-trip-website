
let api_url_orders = HostNow + "/api/orders"

// 
TPDirect.setupSDK(20607, 'app_D2N3i5RDnFQu7TsSLLmPYq50HpeeWqlvXUtZOSwBSCAyBfQOwPidq5oDykHt', 'sandbox')
TPDirect.card.setup('#cardview-container')

function confirm_payment(){
                
    // alert("pay!")
    TPDirect.card.getPrime(function (result) {
        if (result.status !== 0) {
            console.log('getPrime 錯誤: '+result.msg)
            
            return
        }

        let prime = result.card.prime
        console.log('getPrime 成功: ' + prime)
        
        axios({
            method: "POST",
            url: api_url_orders,
            data:{
                    "prime": prime,
                    "order": {
                        "price": price,
                        "trip": {
                                "attraction": {
                                            "id": spot_id,
                                            "name": spot_name,
                                            "address": address,
                                            "image": image
                                        },
                                "date": date,
                                "time": time
                                },
                        "contact": {
                            // "name": form.elements.username.value ,
                            // "email": form.elements.email.value ,
                            // "phone": form.elements.phone_no.value
                        }
                    }
                }
            }).then( res => {
                console.log(res)
    
                let booking_no =  res['data']['data']['number'];
                let booking_message =  res['data']['data']['payment']['message'];
                console.log("🚀 ~ file: booking.js ~ line 50 ~ booking_message", booking_message)
    
                location.replace('/thankyou?number='+ booking_no)
    
            }).catch( res => {
                console.log(res)
                let booking_no =  res['data']['data']['number'];
                console.log("🚀 ~ file: booking.js ~ line 57 ~ booking_no", booking_no)
                let booking_message =  res['data']['data']['payment']['message'];
                console.log("🚀 ~ file: booking.js ~ line 59 ~ booking_message", booking_message)
                
            })

        })
                
    }

let price, image, spot_name, date, time, address,spot_id = null;
// get booking data from API
function get_booking_data(){
    let main = document.querySelector('main');
    let empty_state = document.querySelector('.empty_state');
    axios({
        method: "GET",
        url: api_url_booking
    })
        .then( res =>{
            console.log("🚀 ~ file: booking.js ~ line 77 ~ get_booking_data ~ res", res)
            spot_id = res['data']['data']['attraction']['id'];
            image = res['data']['data']['attraction']['image'];
            let tag_img = document.querySelector('img');
            tag_img.src = image;

            spot_name = res['data']['data']['attraction']['name'];
            // let class_spot_name = document.querySelector('.spot_name');
            // class_spot_name.append(spot_name)
            let p_spot_name = document.createElement('p');
            p_spot_name.textContent = spot_name
            let class_title_spot = document.querySelector('.title_spot');
            class_title_spot.append(p_spot_name)



            date = res['data']['data']['date'];
            let class_date = document.querySelector('.date');
            class_date.append(date)

            time = res['data']['data']['time'];
            let class_time = document.querySelector('.time');
            if ( time == 'morning'){
                class_time.append('早上 9 點到下午 4 點')
            }else if( time == 'afternoon'){
                class_time.append('下午 2 點到晚上 9 點')
            }

            
            price = res['data']['data']['price'];
            let class_price = document.querySelector('.price');
            class_price.append('新台幣 '+ price+' 元')
            
            let class_price_info = document.querySelector('.price_info');
            class_price_info.append('新台幣 '+ price+' 元')

            address = res['data']['data']['attraction']['address'];
            let class_address = document.querySelector('.address');
            class_address.append(address)
            

            main.style.visibility = "visible";
            empty_state.style.display = "none";

            
        })
        .catch( err => {
            console.log("🚀 ~ file: booking.js ~ line 124 ~ get_booking_data ~ err", err)

            empty_state.style.visibility='visible';
            main.style.display = "none";

        })
}


function get_user_data(){
    // let email = localStorage.getItem('email');
    // let username = localStorage.getItem('username');
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


