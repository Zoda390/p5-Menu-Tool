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
var boxSettingsDiv;
var txtSettingsDiv;


const leway = 10;
var objects = [];
var clickBegin = -1;
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
            <button onclick="objects.push(new Box(100, 100, 100, 100, 200,100,100)); itemList.addItem('box'+boxCount); boxCount++;">Add Box</button>
            <button onclick="objects.push(new Txt('bla', 100, 100, 0,0,0)); itemList.addItem('txt'+txtCount); txtCount++;">Add Text</button>
        </div>
    `);
    leftMenu.parent(rightDiv);
    leftMenu.style("background-color: #5A5888; border:1px solid black;");
    leftMenu.class("dropdown");
    
    rightMenu = createDiv(`
        <button>Menu</button>
        <div class="dropdown-content">
        <button onclick="createJS()">Save</button>
        <button onclick="alert('not implimented yet')">Open</button>
        <button onclick="setCanvasPercents(prompt('width,height'))">Set Canvas Size</button>
        <button onclick="alert('${fp.w*innerWidth},${fp.h*innerHeight}')">Get Canvas Size</button>
        </div>
    `);
    rightMenu.parent(rightDiv);
    rightMenu.style("background-color: #5A5888; border:1px solid black;");
    rightMenu.class("dropdown");
        
    bottomDiv = createDiv();
    bottomDiv.style("background-color: #665599; border:1px solid black;");
    bottomDiv.id("bottomDiv");

    boxSettingsDiv = createDiv(`
        <h1 style="margin: 5px;">Box Settings:</h1>
        <div>
        <label for="fillColor" style="margin-left: 10px; font-size: x-large;">Fill Color:</label>
        <input type="color" id="fillColor" name="fillColor" oninput="updateBoxColor(this.value)" style="background-color: #4c4c4c; color: white; font-size: x-large;">
        <label for="width" style="margin-left: 10px; font-size: x-large;">Box Width:</label>
        <input type="number" id="width" name="width" oninput="updateBoxWidth(this.value)" style="background-color: #4c4c4c; color: white; font-size: x-large;">
        <label for="height" style="margin-left: 10px; font-size: x-large;">Box Height:</label>
        <input type="number" id="height" name="height" oninput="updateBoxHeight(this.value)" style="background-color: #4c4c4c; color: white; font-size: x-large;">
        </div>
    `);
    boxSettingsDiv.style("color: white");
    boxSettingsDiv.parent(bottomDiv);
    boxSettingsDiv.position(0,0);
    boxSettingsDiv.hide();
    
    txtSettingsDiv = createDiv(`
        <h1 style="margin: 5px;">Text Settings:</h1>
        <div>
        <label for="innerTxt" style="margin-left: 10px; font-size: x-large;">Inner Text:</label>
        <input type="text" id="innerTxt" name="innerTxt" oninput="updateTxt(this.value)" style="background-color: #4c4c4c; color: white; font-size: x-large;">
        <label for="fillColor" style="margin-left: 10px; font-size: x-large;">Fill Color:</label>
        <input type="color" id="fillColor" name="fillColor" oninput="updateTxtColor(this.value)" style="background-color: #4c4c4c; color: white; font-size: x-large;">
        <label for="txtSize" style="margin-left: 10px; font-size: x-large;">Text Size:</label>
        <input type="number" id="txtSize" name="txtSize" oninput="updateTxtSize(this.value)" style="background-color: #4c4c4c; color: white; font-size: x-large;">
        </div>
        <div style="margin-top: 10px;">
        <label for="vAlign" style="margin-left: 10px; font-size: x-large;">Vertical Alignment:</label>
        <select id="vAlign" name="vAlign" oninput="updateTxtAlignV(this.value)" style="background-color: #4c4c4c; color: white; font-size: x-large;">
            <option value="top">Top</option>
            <option value="center">Center</option>
            <option value="bottom">Bottom</option>
        </select>
        <label for="hAlign" style="margin-left: 10px; font-size: x-large;">Horizontal Alignment:</label>
        <select id="hAlign" name="hAlign" oninput="updateTxtAlignH(this.value)" style="background-color: #4c4c4c; color: white; font-size: x-large;">
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
        </select>
        </div>
    `);
    txtSettingsDiv.style("color: white");
    txtSettingsDiv.parent(bottomDiv);
    txtSettingsDiv.position(0,0);
    txtSettingsDiv.hide();



    canvas = createCanvas(10,10);
    canvas.parent("mainDiv");

    resizeMain();
    addEventListener("resize", (event) => {resizeMain()});

    textWrap(WORD);

    //load pages
    //ps.show("Main Menu");
}

function draw(){
    background(100);
    for(let i=0; i<objects.length; i++){
        objects[i].render(itemList.sIDs.includes(objects[i].id));
        if(mouseIsPressed && itemList.sIDs.includes(objects[i].id)){
            if(mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) objects[i].update();
        }
    }

    //render selection box
    if(mouseIsPressed && clickBegin != -1){
        if(abs(mouseX-(fp.w*innerWidth)) < leway){
            fp.w = mouseX/innerWidth;
            resizeMain();
        }
        if(abs(mouseY-(fp.h*innerHeight)) < leway){
            fp.h = mouseY/innerHeight;
            resizeMain();
        }
        else{
            if(itemList.sIDs.length == 0){
                push();
                fill(0,255,255,50);
                stroke(0,255,255,100);
                rect(clickBegin.x, clickBegin.y, mouseX-clickBegin.x, mouseY-clickBegin.y);
                pop();
            }
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
    for(let i=0; i<objects.length; i++){
        objects[i].pos.x = round((objects[i].pos.x/width)*innerWidth*fp.w);
        objects[i].pos.y = round((objects[i].pos.y/height)*innerHeight*fp.h);
        objects[i].size.w = round((objects[i].size.w/width)*innerWidth*fp.w);
        objects[i].size.h = floor((objects[i].size.h/height)*innerHeight*fp.h);
        objects[i].regenHandles();
    }
    itemList.updatehtml();

    resizeCanvas((innerWidth*fp.w), (innerHeight*fp.h)-1);
}
  
function mousePressed(){
    if(clickBegin == -1){ //if you dont already have a clickBegin make one
        clickBegin = createVector(mouseX, mouseY);
    }

    if(itemList.sIDs.length == 0){
    }
    else{
        if(mouseX > width || mouseX < 0 || mouseY > height || mouseY < 0) return;
        let found = false;
        //loop through selected items
        for(let i=0; i<objects.length; i++){
            if(found) continue;
            if(itemList.sIDs.includes(objects[i].id)){
                if(objects[i].pointCollision(mouseX, mouseY)){
                    objects[i].selectHandle(mouseX, mouseY);
                    found = true;
                }
            }
        }
        
        //if mouse is outside all selected items, deselect items
        if(!found) itemList.sIDs = [];
        itemList.updatehtml();
    }
}
  
function mouseReleased(){
    //if mouse is outside canvas return early
    if(mouseX > width || mouseX < 0 || mouseY > height || mouseY < 0){
        clickBegin = -1; //reset clickBegin
        return;
    }

    let found = false;

    if(itemList.sIDs.length == 0){
        if(createVector(mouseX,mouseY).dist(clickBegin) < leway){ //simple click (mouse didnt move during click)
            //simple search to find a selected item
            for(let i=objects.length-1; i>=0; i--){
                if(found) continue;
                if(objects[i].pointCollision(mouseX,mouseY)){
                    if(!itemList.sIDs.includes(objects[i].id)) itemList.sIDs.push(objects[i].id);
                    found = true;
                }
            }
        }
        else{ //mouse was probably dragged?
            //check if 40% of an object is within the selection box
            for(let i=0; i<objects.length; i++){
                if(objects[i].boxCollision(clickBegin.x, clickBegin.y, mouseX-clickBegin.x, mouseY-clickBegin.y)){
                    if(!itemList.sIDs.includes(objects[i].id)) itemList.sIDs.push(objects[i].id);
                    found = true;
                }
            }
        }
    }
    else{ 
        //if you have selected items assume your mouse is still inside them
        found = true;

        //fix any negative sizes and release handles
        for(let i=0; i<objects.length; i++){
            if(itemList.sIDs.includes(objects[i].id)){
                if(objects[i].size.w < 0){
                    let temp = objects[i].pos.x;
                    objects[i].pos.x = objects[i].pos2.x;
                    objects[i].pos2.x = temp;
                    objects[i].size.w = objects[i].pos2.x-objects[i].pos.x;
                }
                if(objects[i].size.h < 0){
                    let temp = objects[i].pos.y;
                    objects[i].pos.y = objects[i].pos2.y;
                    objects[i].pos2.y = temp;
                    objects[i].size.h = objects[i].pos2.y-objects[i].pos.y;
                }
                objects[i].selectedHandle = -1;
            }
        }
    }
    
    if(!found) itemList.sIDs = [];
    itemList.updatehtml();

    //reset clickBegin
    clickBegin = -1;
}

function keyReleased(){

}

function updateBoxColor(val){
    let c = color(val);
    for(let i=0; i<objects.length; i++){
        if(objects[i].id.includes("box")){
            if(itemList.sIDs.includes(objects[i].id)){
                objects[i].c = c;
            }
        }
    }
}

function updateBoxWidth(val){
    for(let i=0; i<objects.length; i++){
        if(objects[i].id.includes("box")){
            if(itemList.sIDs.includes(objects[i].id)){
                objects[i].size.w = parseFloat(val);
                if(objects[i].size.w < 0){ //fix negative values
                    let temp = objects[i].pos.x;
                    objects[i].pos.x = objects[i].pos2.x;
                    objects[i].pos2.x = temp;
                    objects[i].size.w = objects[i].pos2.x-objects[i].pos.x;
                    boxSettingsDiv.elt.children[4].value = objects[i].size.w;
                }
                objects[i].regenHandles();
            }
        }
    }
}

function updateBoxHeight(val){
    for(let i=0; i<objects.length; i++){
        if(objects[i].id.includes("box")){
            if(itemList.sIDs.includes(objects[i].id)){
                objects[i].size.h = parseFloat(val);
                if(objects[i].size.h < 0){ //fix negative values
                    let temp = objects[i].pos.y;
                    objects[i].pos.y = objects[i].pos2.y;
                    objects[i].pos2.y = temp;
                    objects[i].size.h = objects[i].pos2.y-objects[i].pos.y;
                    boxSettingsDiv.elt.children[6].value = objects[i].size.h;
                }
                objects[i].regenHandles();
            }
        }
    }
}

function updateTxt(val){
    for(let i=0; i<objects.length; i++){
        if(objects[i].id.includes("txt")){
            if(itemList.sIDs.includes(objects[i].id)){
                objects[i].t = val;
            }
        }
    }
}

function updateTxtColor(val){
    let c = color(val);
    for(let i=0; i<objects.length; i++){
        if(objects[i].id.includes("txt")){
            if(itemList.sIDs.includes(objects[i].id)){
                objects[i].c = c;
            }
        }
    }
}

function updateTxtSize(val){
    for(let i=0; i<objects.length; i++){
        if(objects[i].id.includes("txt")){
            if(itemList.sIDs.includes(objects[i].id)){
                objects[i].textSize = parseInt(val);
            }
        }
    }
}

function updateTxtAlignV(val){
    for(let i=0; i<objects.length; i++){
        if(objects[i].id.includes("txt")){
            if(itemList.sIDs.includes(objects[i].id)){
                objects[i].align.y = val;
            }
        }
    }
}

function updateTxtAlignH(val){
    for(let i=0; i<objects.length; i++){
        if(objects[i].id.includes("txt")){
            if(itemList.sIDs.includes(objects[i].id)){
                objects[i].align.x = val;
            }
        }
    }
}

function findObjByID(id){
    for(let i=0; i<objects.length; i++){
        if(objects[i].id === id){
            return objects[i];
        }
    }
}

function setCanvasPercents(val){
    let temp = val.split(",");
    temp[0] = parseInt(temp[0]);
    temp[1] = parseInt(temp[1]);
    fp.w = temp[0]/innerWidth;
    fp.h = temp[1]/innerHeight;
    resizeMain();
}