// alert('test')


class MyHeader extends HTMLElement {
    connectedCallback(){
        this.innerHTML = '<div class="nav"><div class="nav-content"><div id="taipei"> <a href="/">台北一日遊</a> </div><div class="blank"></div><div class="nav_button"><div id="booking">預定行程</div> <div id="login"></div> <div id="logout"></div></div></div></div>'
    }
}

window.customElements.define('my-header', MyHeader)

class MyFooter extends HTMLElement {
    connectedCallback(){
        this.innerHTML = '<div class="footer"><div>COPYRIGHT © 2021 台北一日遊</div></div>'
    }
}

window.customElements.define('my-footer', MyFooter)

class MyModal_bg extends HTMLElement{
    connectedCallback(){
        this.innerHTML = '<div class="modal_bg"><div class="modal"><div class="deco_bar"></div><div class="popup_close"></div><div class="title_popup">登入會員帳號</div><form name="login"><input type="email" name="email" placeholder="輸入電子信箱" required/><input type="password" name="password" placeholder="輸入密碼" required/><button onclick="user_login()" type="button"> 登入帳戶 </button></form><div class="messsage"><div class="success_message"></div><div class="error_message"></div></div><div class="popup_question">還沒有帳戶？<div class="toRegister">點此註冊</div></div></div></div> '
    }
}

window.customElements.define('my-modal_bg', MyModal_bg)