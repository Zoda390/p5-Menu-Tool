var socket; //connection to save and edit files
var ps; //Page Sorter
var fp = {w: 0.8, h: 0.7}; //framePercent: the percent of window that the main frame takes up
var mainDiv;
var bottomDiv;
var rightDiv;
var leftMenu;
var rightMenu;
var canvas;
var itemList;

const leway = 10;
var boxes = [];
var txts = [];
var sBox = -1;
var sTxt = -1;
var clickBegin = -1;
var typing = false;
var flashTimer = 0;
var flash = false;
var boxCount = 0;
var txtCount = 0;

function setup(){
    //socket = io.connect("http://localhost:3001");
    ps = new Page_Sorter();

    mainDiv = createDiv();
    mainDiv.style("background-color: #555555;");
    mainDiv.id("mainDiv");
    
    rightDiv = createDiv();
    rightDiv.style("background-color: #665599; border:1px solid black;");
    rightDiv.id("rightDiv");
    
    itemList = new p5_Item_List();
    itemList.html.parent(rightDiv);
    leftMenu = createDiv(`
        <button style="">Add</button>
        <div class="dropdown-content">
            <button onclick="">Add Page</button>
            <button onclick="boxes.push(new Box(100, 100, 100, 100, 200,100,100)); itemList.addItem('box'+boxCount); boxCount++;">Add Box</button>
            <button onclick="txts.push(new Txt('bla', 100, 100, 0,0,0)); itemList.addItem('txt'+txtCount); txtCount++;">Add Text</button>
        </div>
    `);
    leftMenu.parent(rightDiv);
    leftMenu.style("background-color: #5A5888; border:1px solid black;");
    leftMenu.class("dropdown");
    
    rightMenu = createDiv(`
        <button>Menu</button>
        <div class="dropdown-content">
        <button onclick="createJS()">Save</button>
        <button onclick="console.log('not implimented yet')">Open</button>
        </div>
    `);
    rightMenu.parent(rightDiv);
    rightMenu.style("background-color: #5A5888; border:1px solid black;");
    rightMenu.class("dropdown");
        
    bottomDiv = createDiv();
    bottomDiv.style("background-color: #665599; border:1px solid black;");
    bottomDiv.id("bottomDiv");



    canvas = createCanvas(10,10);
    canvas.parent("mainDiv");

    resizeMain();
    addEventListener("resize", (event) => {resizeMain()});

    //load pages
    //ps.show("Main Menu");
}

function draw(){
    background(100);
    for(let i=0; i<boxes.length; i++){
        boxes[i].render((sBox==i));
        if(mouseIsPressed & i==sBox){
            boxes[i].update();
        }
    }
    for(let i=0; i<txts.length; i++){
        txts[i].render((sTxt==i));
        if(mouseIsPressed & i==sTxt){
            txts[i].update();
        }
    }
}

function resizeMain(){
    mainDiv.position(0, 0);
    mainDiv.size((innerWidth*fp.w), (innerHeight*fp.h)-1);
    
    rightDiv.position(innerWidth*fp.w, 0);
    rightDiv.size((innerWidth*(1-fp.w))-2, (innerHeight*fp.h)-2);
    
    leftMenu.position(0, 0);
    leftMenu.size(((innerWidth*(1-fp.w))-3)/2, 50);
    
    rightMenu.position((((innerWidth*(1-fp.w))-3)/2), 0);
    rightMenu.size(((innerWidth*(1-fp.w))-3)/2, 50);
    
    itemList.html.position(10, 60);
    itemList.html.size((innerWidth*(1-fp.w))-23, (innerHeight*fp.h)-72);
    
    bottomDiv.position(0, innerHeight*fp.h);
    bottomDiv.size(innerWidth-2, (innerHeight*(1-fp.h))-2);
    resizeCanvas((innerWidth*fp.w), (innerHeight*fp.h)-1);
}

function selectItemByID(id){
    if(id.includes("box")){
        sBox = id.split("box").pop();
        itemList.sID = id;
    }
    if(id.includes("txt")){
        sBox = id.split("txt").pop();
        itemList.sID = id;
    }
    itemList.updatehtml();
}

class Box{
    constructor(x,y,w,h,r,g,b){
        this.sPos = createVector(x,y);
        this.pos = createVector(x,y);
        this.pos2 = createVector(x+w,y+h);
        this.size = {w:w,h:h};
        this.c = color(r,g,b);
        this.img = null;
        this.handles = [];
        this.selectedHandle = -1;
        this.regenHandles();
    }
    
    toStr(){
        let arr = [];
        arr.push("fill("+this.c.levels[0]+","+this.c.levels[1]+","+this.c.levels[2]+");");
        arr.push("rect("+this.pos.x+","+this.pos.y+","+this.size.w+","+this.size.h+");");
        return arr;
    }
    
    setImg(img){
        this.img = img;
    }
    
    regenHandles(){
        this.handles = [];
        this.handles.push(createVector(this.pos.x, this.pos.y));
        this.handles.push(createVector(this.pos.x+(this.size.w/2), this.pos.y));
        this.handles.push(createVector(this.pos.x+this.size.w, this.pos.y));
        this.handles.push(createVector(this.pos.x, this.pos.y+(this.size.h/2)));
        this.handles.push(createVector(this.pos.x+this.size.w, this.pos.y+(this.size.h/2)));
        this.handles.push(createVector(this.pos.x, this.pos.y+this.size.h));
        this.handles.push(createVector(this.pos.x+(this.size.w/2), this.pos.y+this.size.h));
        this.handles.push(createVector(this.pos.x+this.size.w, this.pos.y+this.size.h));
    }
    
    render(selected){
        push();
        fill(this.c)
        rect(this.pos.x, this.pos.y, this.size.w, this.size.h);
      
        if(selected){
            if(this.selectedHandle != -1){
                fill(0,255,0);
                rect(this.handles[this.selectedHandle].x-2.5,this.handles[this.selectedHandle].y-2.5, 5,5);
            }
            else{
                //render handles
                for(let i = 0; i<this.handles.length; i++){
                    if(createVector(mouseX, mouseY).dist(this.handles[i]) < leway){fill(0,255,0);}
                    else{fill(255);}
                    rect(this.handles[i].x-2.5,this.handles[i].y-2.5, 5,5);
                }
            }
        }
        pop();
    }
    
    update(){
        if(this.selectedHandle != -1){
            if(this.selectedHandle == 0){
                this.pos.x = mouseX;
                this.pos.y = mouseY;
            }
            if(this.selectedHandle == 1){
                this.pos.y = mouseY;
            }
            if(this.selectedHandle == 2){
                this.pos2.x = mouseX;
                this.pos.y = mouseY;
            }
            if(this.selectedHandle == 3){
                this.pos.x = mouseX;
            }
            if(this.selectedHandle == 4){
                this.pos2.x = mouseX;
            }
            if(this.selectedHandle == 5){
                this.pos.x = mouseX;
                this.pos2.y = mouseY;
            }
            if(this.selectedHandle == 6){
                this.pos2.y = mouseY;
            }
            if(this.selectedHandle == 7){
                this.pos2.x = mouseX;
                this.pos2.y = mouseY;
            }
            this.size.w = this.pos2.x-this.pos.x;
            this.size.h = this.pos2.y-this.pos.y;
        }
        else{
            if(mouseX>this.pos.x-leway && mouseX<this.pos.x+this.size.w+leway){
                if(mouseY>this.pos.y-leway && mouseY<this.pos.y+this.size.h+leway){
                    this.pos.x += mouseX-pmouseX;
                    this.pos.y += mouseY-pmouseY;
                }
            }
        }
        this.regenHandles();
    }
}

class Txt{
    constructor(t, x, y, r,g,b){
        this.t = t;
        this.pos = createVector(x,y);
        this.align = {x: LEFT, y: TOP};
        this.c = color(r,g,b);
        this.textSize = 12;
        this.handles = [];
        this.selectedHandle = -1;
        this.regenHandles();
    }

    toStr(){
        let arr = [];
        arr.push("fill("+this.c.levels[0]+","+this.c.levels[1]+","+this.c.levels[2]+");");
        arr.push("text("+this.t+","+this.pos.x+","+this.pos.y+");");
        return arr;
    }

    regenHandles(){
        this.handles = [];
        this.handles.push(createVector(this.pos.x, this.pos.y));
    }

    render(selected){
        push();
        if(typing){
            flashTimer ++;
            if(flashTimer == 80){
            flashTimer = 0;
            flash = !flash;
            }
        }
        textAlign(this.align.x, this.align.y);
        fill(0);
        text(this.t + ((flash&&selected&&typing)? "|":""), this.pos.x, this.pos.y);

        if(selected){
            if(this.selectedHandle != -1){
                fill(0,255,0);
                rect(this.handles[this.selectedHandle].x-2.5,this.handles[this.selectedHandle].y-2.5, 5,5);
            }
            else{
                //render handles
                for(let i = 0; i<this.handles.length; i++){
                    if(createVector(mouseX, mouseY).dist(this.handles[i]) < leway){fill(0,255,0);}
                    else{fill(255);}
                    rect(this.handles[i].x-2.5,this.handles[i].y-2.5, 5,5);
                }
            }
        }
        pop();
    }

    update(){
        if(this.selectedHandle != -1){
            if(this.selectedHandle == 0){
                this.pos.x = mouseX;
                this.pos.y = mouseY;
            }
        }
    }
}
  
function createJS(){
    let arr = [];
    
    arr.push("var boxes = [];");
    arr.push("function setup(){");
    arr.push("createCanvas(400, 400);");
    arr.push("}");
    arr.push("");
    arr.push("function draw(){");
    arr.push("background(100);");
    arr.push("drawBoxes();");
    arr.push("}");
    arr.push("");
    arr.push("function drawBoxes(){");
    arr.push("push();");
    arr.push("textAlign(CENTER, CENTER);");
    for(let i=0; i<boxes.length; i++){
        arr = arr.concat(boxes[i].toStr());
    }
    for(let i=0; i<txts.length; i++){
        arr = arr.concat(txts[i].toStr());
    }
    arr.push("pop();");
    arr.push("}");
    console.log(arr);
    //saveStrings(arr,"test","js",true);
}
  
function mousePressed(){
    if(clickBegin == -1){
        clickBegin = createVector(mouseX, mouseY);
    }
    for(let i=0; i<boxes.length; i++){
        if(sBox == -1){
            if(mouseX>boxes[i].pos.x-leway && mouseX<boxes[i].pos.x+boxes[i].size.w+leway){
                if(mouseY>boxes[i].pos.y-leway && mouseY<boxes[i].pos.y+boxes[i].size.h+leway){
                    sBox = i;
                    itemList.sID = "box"+i;
                    itemList.updatehtml();
                }
            }
        }
        else{
            for(let j=0; j<boxes[i].handles.length; j++){
                if(createVector(mouseX,mouseY).dist(boxes[i].handles[j]) < leway){
                    boxes[i].selectedHandle = j;
                }
            }
            boxes[i].regenHandles();
        }
    }

    for(let i=0; i<txts.length; i++){
        if(sTxt == -1){
            if(mouseX>txts[i].pos.x-leway && mouseX<txts[i].pos.x+leway){
                if(mouseY>txts[i].pos.y-leway && mouseY<txts[i].pos.y+leway){
                    sTxt = i;
                    itemList.sID = "txt"+i;
                    itemList.updatehtml();
                }
            }
        }
        else{
            for(let j=0; j<txts[i].handles.length; j++){
                if(createVector(mouseX,mouseY).dist(txts[i].handles[j]) < leway){
                    txts[i].selectedHandle = j;
                }
            }
            txts[i].regenHandles();
        }
    }
}
  
function mouseReleased(){
    let found = false;

    if(sBox != -1){
        if(boxes[sBox].size.w < 0){
            let temp = boxes[sBox].pos.x;
            boxes[sBox].pos.x = boxes[sBox].pos2.x;
            boxes[sBox].pos2.x = temp;
            boxes[sBox].size.w = boxes[sBox].pos2.x-boxes[sBox].pos.x;
        }
        if(boxes[sBox].size.h < 0){
            let temp = boxes[sBox].pos.y;
            boxes[sBox].pos.y = boxes[sBox].pos2.y;
            boxes[sBox].pos2.y = temp;
            boxes[sBox].size.h = boxes[sBox].pos2.y-boxes[sBox].pos.y;
        }
        if(mouseX>boxes[sBox].pos.x-leway && mouseX<boxes[sBox].pos.x+boxes[sBox].size.w+leway){
            if(mouseY>boxes[sBox].pos.y-leway && mouseY<boxes[sBox].pos.y+boxes[sBox].size.h+leway){
                found = true;
            }
        }
        boxes[sBox].selectedHandle = -1;
    }

    if(sTxt != -1){
        if(mouseX>txts[sTxt].pos.x-leway && mouseX<txts[sTxt].pos.x+leway){
            if(mouseY>txts[sTxt].pos.y-leway && mouseY<txts[sTxt].pos.y+leway){
                found = true;
                typing = true;
            }
        }
        txts[sTxt].selectedHandle = -1;
    }
    
    if(!found){
        sBox = -1;
        sTxt = -1;
        itemList.sID = -1;
        itemList.updatehtml();
    }
    clickBegin = -1;
}

function keyReleased(){

}