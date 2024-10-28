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

class p5_Item_List{
    constructor(items = []){
        this.html = createDiv("<ul></ul>");
        this.html.style("overflow-y: auto");
        this.html.style("overflow-x: hidden");
        this.html.style("background-color: #5A5888;");
        this.html.style("color: white;");
        this.html.mousePressed((e) => { //if you click outside the items on the list it deselects them
            if(e.target.tagName == 'DIV'){
                itemList.sIDs=[]; 
                itemList.updatehtml();
            }
        });
        this.items = items;
        this.sIDs = [];
    }

    addItem(item){
        this.items.push(item);
        this.updatehtml();
    }

    updatehtml(){
        let str = "<ul>";
        for(let i=0; i<this.items.length; i++){
            if(this.sIDs.includes(this.items[i])){
                str += ("<li class='selected'>"+this.items[i]+"</li>");
            }
            else{
                str += ("<li onclick='itemList.selectItemByID(this.innerHTML);'>"+this.items[i]+"</li>");
            }
        }
        str += "</ul>"
        this.html.html(str);
        
        if(this.sIDs.length == 0){
            boxSettingsDiv.hide();
            txtSettingsDiv.hide();
            return;
        }
        if(this.sIDs[0].includes("box")){
            boxSettingsDiv.elt.children[1].children[1].value = findObjByID(this.sIDs[0]).c.toString("#rrggbb");
            boxSettingsDiv.elt.children[1].children[3].value = findObjByID(this.sIDs[0]).size.w;
            boxSettingsDiv.elt.children[1].children[5].value = findObjByID(this.sIDs[0]).size.h;
            boxSettingsDiv.show();
            txtSettingsDiv.hide();
        }
        if(this.sIDs[0].includes("txt")){
            txtSettingsDiv.elt.children[1].children[1].value = findObjByID(this.sIDs[0]).t;
            txtSettingsDiv.elt.children[1].children[3].value = findObjByID(this.sIDs[0]).c.toString("#rrggbb");
            txtSettingsDiv.elt.children[1].children[5].value = findObjByID(this.sIDs[0]).textSize;
            txtSettingsDiv.elt.children[2].children[1].value = findObjByID(this.sIDs[0]).align.y;
            txtSettingsDiv.elt.children[2].children[3].value = findObjByID(this.sIDs[0]).align.x;
            txtSettingsDiv.show();
            boxSettingsDiv.hide();
        }
    }

    selectItemByID(id){
        this.sIDs = [id];
        this.updatehtml();
    }
}