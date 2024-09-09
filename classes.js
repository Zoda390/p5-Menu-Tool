class Page_Sorter{
    constructor(){
        this.pages = {};
    }

    new_page(name, color="#636167"){
        this.pages[name] = createDiv();
        this.pages[name].position(0, 50);
        this.pages[name].size(innerWidth, innerHeight-50);
        this.pages[name].style("background-color: " + color + ';');
        this.pages[name].id(name);
    }

    show(page){
        var pages_arr = Object.keys(this.pages);
        for(let i = 0; i<pages_arr.length; i++){
            if(pages_arr[i] == page){
                this.pages[page].show();
            }
            else{
                this.pages[pages_arr[i]].hide();
            }
        }
    }
}

class p5_Button{
    constructor(name, x, y, w, h, page){
        this.html = createButton(name);
        this.html.position(x, y);
        this.html.size(w, h);
        this.html.parent(ps.pages[page]);
    }

    hide(){
        this.html.hide();
    }

    show(){
        this.html.show();
    }

    delete(){
        this.html.remove();
    }
}

class p5_Text_Input{
    constructor(def, x, y, w, h, page){
        this.html = createInput('');
        this.html.attribute('placeholder', def);
        this.html.position(x, y);
        this.html.size(w, h);
        this.html.style("background-color: #BFB8B4;");
        this.html.parent(ps.pages[page]);
    }

    hide(){
        this.html.hide();
    }

    show(){
        this.html.show();
    }

    value(input){
        if(input == undefined){
            return this.html.value();
        }
        else{
            this.html.value(input);
        }
    }
}