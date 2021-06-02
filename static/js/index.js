// // //spot api link
// let api_url_spot = localHost+"/api/attractions?";


// spot keyword click search
let spots = document.getElementById("spots");
let next_page_now = 0;
let processKeyword=""; //若沒有設定此變數 在搜尋時load第2頁開始會出現偏離
let next_page, search_keyword, next_page_before;
function processSearch(){
    document.getElementById("spots").innerHTML = "";
    document.getElementById("error").innerHTML = "";
    next_page_now = 0;
    next_page_before = null;
    let form = document.forms['form_input'];
    let search_keyword = form.elements.search_keyword.value;
    processKeyword = search_keyword
    processor(next_page_now, processKeyword);
}



//detect throttle
let detector_throttle = throttle(500,500)
window.addEventListener("scroll", detector_throttle)
function throttle( delay,mustRunDelay ){
    let startTime, timestamp , timer;
    return function(){
        timestamp = +new Date();
        clearTimeout(timer)
        if (!startTime){
            startTime = timestamp
        }
        if (timestamp - startTime >= mustRunDelay){
            detector()
            startTime = timestamp;
        }else{
            timer = setTimeout(function(){detector()},delay)
        }
    }
}

function detector(){
    let triggerDistance = 500;
    let distance = spots.getBoundingClientRect().bottom - window.innerHeight;
    if ( distance < triggerDistance ) { 
        processor(next_page_now, processKeyword);
    }
    
}


function processor(next_page=0,search_keyword="") {
    // 判斷是否有重覆load同頁面
    if (next_page_before !== next_page_now){
        let page = "page="+next_page_now
        let keyword = "&keyword="+search_keyword
        let url = api_url_spot+page+keyword
        loader(url)
        next_page_before = next_page_now;
    }
}



function loader(api){
    
    fetch(api).then( (response) => {
        return response.json();
        }).then( (result) => {

            if(result['error']){
                let error = document.getElementById('error');
                let error_infro = document.createTextNode('抱歉，查無結果。');
                error.appendChild(error_infro);
            }

            for(let i = 0; i < 12; i++){
            let proto_name = result["data"][i]["name"];
            let proto_image = result["data"][i]["images"][0]
            let proto_mrt = result["data"][i]["mrt"];
            let proto_category = result["data"][i]["category"];
            let proto_id = result["data"][i]["id"];
            
            let link_a = document.createElement("a");
            link_a.href = "/attraction/" + proto_id;

            let picture_div = document.createElement("div");
            picture_div.className = "picture";
            
            let spot_image_img = document.createElement("img");
            spot_image_img.className = "spot_image"
            spot_image_img.src = proto_image;
            link_a.appendChild(spot_image_img)

            picture_div.appendChild(link_a);

            let spot_name_div = document.createElement("div");
            spot_name_div.className = "spot_name"
            picture_div.appendChild(spot_name_div);
            
            let spot_name = document.createTextNode(proto_name);
            spot_name_div.appendChild(spot_name);

            let detail_div = document.createElement("div");
            detail_div.className = "detail";

            let mrt_div = document.createElement("div");
            mrt_div.className = "mrt";
            detail_div.appendChild(mrt_div);

            let mrt = document.createTextNode(proto_mrt);
            mrt_div.appendChild(mrt);

            let category_div = document.createElement("div");
            category_div.className = "category";
            detail_div.appendChild(category_div);

            let category = document.createTextNode(proto_category);
            category_div.appendChild(category);

            let spot_div = document.createElement("div");
            spot_div.className = "spot"

            
            spot_div.appendChild(picture_div);
            spot_div.appendChild(detail_div);
            
            spots.appendChild(spot_div);
            }

            next_page_now = result["nextPage"]

        }
        )
    
}


// 未完成 enter search
// let search_keyword_id = document.getElementById('search_keyword_id')
// search_keyword_id.addEventListener('keyup', function(event) {
    //         if (event.keyCode === 13) {
        //                 let form = document.forms['form_input'];
        //         console.log("🚀 ~ file: index.html ~ line 63 ~ search_keyword_id.addEventListener ~ form", form)
        //         let search_keyword = form.elements.search_keyword.value;
        //         console.log("🚀 ~ file: index.html ~ line 65 ~ search_keyword_id.addEventListener ~ search_keyword", search_keyword)
//         processKeyword = search_keyword

//         processor(0,search_keyword)
//     }
// })



// 未完成 enter search
// function detectEnterKeyword(e){
    //     console.log(e.value);
    //     if (event.keyCode == 13 ){
        //         console.log('entered')
        //         processor(0, e.value)
//     }
// }




// MVC model
// let models = {getData:function(api){
//     data = null;
//     fetch(api).then( (response) => {return response.json();}).then( (result) => {this.data = result}).then(() => {return this.data});
//     }};

// let views = {renderData:function(data){
//     for(let i = 0; i < 12; i++){
//         let spot_name = data["data"][i]["name"];
//         let spot_image = "http://" + models.data["data"][i]["images"].split("http://")[1]
//         let mrt = data["data"][i]["mrt"];
//         let type = data["data"][i]["category"];
        
//         let picture_div = document.createElement("div");
//         picture_div.className = "picture";
        
//         let spot_image_img = document.createElement("img");
//         spot_image_img.src = spot_image;
//         picture_div.appendChild(spot_image_img);

//         let spot_name_div = document.createElement("div");
//         spot_name_div.className = "spot_name"
//         picture_div.appendChild(spot_name_div);

//         let detail_div = document.createElement("div");
//         detail_div.className = "detail";

//         let mrt_div = document.createElement("div");
//         mrt_div.className = "mrt";
//         detail_div.appendChild(mrt_div);

//         let category_div = document.createElement("div");
//         category_div.className = "category";
//         detail_div.appendChild(category_div);

//         sopts.appendChild(picture_div);
//         spots.appendChild(detail_div);


//         }
//     }};


// let controllers = {init:function(){
//     models.getData(api_url_spot).then((data)=>{ views.renderData(data);})
//     // spots.appendChild("lorem")
//     }};