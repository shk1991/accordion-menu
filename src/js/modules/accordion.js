class Accordion{
    constructor(){}
    hasClass(ele,cls) {
        return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
    }
    addClass(ele,cls) {
        if (!this.hasClass(ele,cls)) ele.className += " "+cls;
    }
    removeClass(ele,cls) {
        if (this.hasClass(ele,cls)) {
            var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
            ele.className=ele.className.replace(reg,'');
        }
    }
    getNextNode(e){
        return e && e.nodeType == 3 ? this.getNextNode(e.nextSibling) : e;
    }
    init(id){
        var that = this, ele, title;
        ele = document.getElementById(id);
        if(ele){
            title = ele.querySelectorAll(".a-title")
        }else{
            return console.warn("dom为空");
        }
        for(let t of title){
            t.addEventListener("click",function(){
                let _this = this;
                let next = that.getNextNode(_this.nextSibling);
                if(next && that.hasClass(next,"a-content")){
                    if(that.hasClass(next,"a-active")){
                        that.removeClass(this,"a-active");
                        that.removeClass(next,"a-active");                        
                    }else{
                        that.addClass(next,"a-active");
                        that.addClass(this,"a-active");
                    }
                }
            })
        }
    }
} 

const accordion = new Accordion();

export default accordion;