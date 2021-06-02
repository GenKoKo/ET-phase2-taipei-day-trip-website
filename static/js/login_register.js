// alert('test login')

let localHost = "http://127.0.0.1:3000" // for develop
let EC2Host = "http://54.168.152.131:3000" //for deploy

//user api link
let api_url_user = EC2Host+'/api/user'
//spot api link
let api_url_spot = EC2Host+"/api/attractions?";
// //spot id api link
// let api_url_spot_id = localHost+"api/attraction/";


let login_button = document.querySelector('#login');
let logout_button = document.querySelector('#logout'); 
function detect_login_status(){
    axios({
        method: 'GET', 
        url: api_url_user,
    }).then( (res) => {
        logout_button.append('登出系統');
        console.log(res)    
    }).catch( (err) => {
        login_button.append('登入/註冊');
        console.log(err)
    })
}

let modal = document.querySelector('.modal')
let error_message_login = document.querySelector('.modal .error_message');
function user_login(){
    let form = document.forms['login']
    let login_name, login_email, login_password = '';
    login_email = form.elements.email.value;
    console.log("🚀 ~ file: index.html ~ line 164 ~ user_register ~ login_email", login_email)
    login_password = form.elements.password.value;
    console.log("🚀 ~ file: index.html ~ line 166 ~ user_register ~ login_password", login_password)
    success_message.innerHTML = '';
    error_message.innerHTML = '';
    axios({
        method: 'PATCH',
        url: api_url_user,
        data:{
            email: login_email,
            password: login_password
        }
    })
    .then( (res) => {
        modal_bg.classList.remove('bg_popup'); 
        logout_button.append('登出系統');
        success_message.innerHTML = '';
        error_message.innerHTML = '';
        login_button.innerHTML = '';
        console.log(res);})
        .catch( (err) => {
        error_message_login.innerHTML = '';
        modal.style['height'] = '285px';
        error_message_login.append('Email或密碼錯誤')

        console.log(err);})
}

let modal_register = document.querySelector('.modal_register')
let success_message = document.querySelector('.modal_register .success_message');
let error_message = document.querySelector('.modal_register .error_message');


function user_register(){
    // document.querySelector()
    let form = document.forms['register']
    let new_name, new_email, new_password = '';
    new_name = form.elements.name.value;
    new_email = form.elements.email.value;
    new_password = form.elements.password.value;
    success_message.innerHTML = '';
    error_message.innerHTML = '';
    axios({
        method: 'POST',
        url: api_url_user,
        data:{
            name: new_name,
            email: new_email,
            password: new_password
        }
    })
        .then( (res) => {
        // modal_bg_register.classList.remove('bg_popup'); 
        modal_register.style['height'] = '345px';
        success_message.append('註冊成功！請點擊下方登入');
        
        console.log(res);})
        .catch( (err) => {
            modal_register.style['height'] = '345px';
        error_message.append('該Email已被註冊')
        
        console.log(err);})
}

logout_button.addEventListener('click', () =>{
    
    axios({
        method: 'DELETE', 
        url: api_url_user
    })
    .then( (res) =>{
        logout_button.innerHTML = '';
        login_button.append('登入/註冊');
        console.log(res);})
    .catch( (err) => {console.log(err);})

})



//popup login
let modal_bg = document.querySelector('.modal_bg')

login_button.addEventListener('click', ()=>{
    console.log('clicked')
    error_message_login.innerHTML = '';
    success_message.innerHTML = '';
    error_message.innerHTML = '';
    modal.style['height'] = '275px';
    modal_bg.classList.add('bg_popup')
})

let login_button_popup = document.querySelector('.toLogin')
login_button_popup.addEventListener('click', ()=>{
    console.log('clicked')
    error_message_login.innerHTML = '';
    success_message.innerHTML = '';
    error_message.innerHTML = '';
    modal.style['height'] = '275px';
    modal_bg_register.classList.remove('bg_popup')
    modal_bg.classList.add('bg_popup')
})

//popup register
let register_button = document.querySelector('.toRegister')
let modal_bg_register = document.querySelector('.modal_bg_register')
register_button.addEventListener('click', ()=>{
    console.log('clicked')
    error_message_login.innerHTML = '';
    success_message.innerHTML = '';
    error_message.innerHTML = '';
    modal_register.style['height'] = '332px';
    modal_bg.classList.remove('bg_popup')
    modal_bg_register.classList.add('bg_popup')
})

//popup close
let popup_close_register = document.querySelector('.modal_bg_register .popup_close')
popup_close_register.addEventListener('click', ()=>{
    console.log('close');
    modal_bg.classList.remove('bg_popup')
    modal_bg_register.classList.remove('bg_popup')
})

let popup_close = document.querySelector('.modal_bg .popup_close')
popup_close.addEventListener('click', ()=>{
    console.log('close');
    modal_bg.classList.remove('bg_popup')
    modal_bg_register.classList.remove('bg_popup')
})
