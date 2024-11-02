class UIobject{
    constructor(x,y,w,h){
        this.pos = createVector(x,y);
        this.pos2 = createVector(x+w,y+h);
        this.size = {w:w,h:h};
        this.handles = [];
        this.regenHandles();
        this.selectedHandle = -1;
        this.id = "object";
    }

    toStr(){
        console.error(`${this.id} has not defined toStr()`);
    }

    selectHandle(x,y){
        let vec = createVector(x,y);
        for(let i=0; i<this.handles.length; i++){
            if(vec.dist(this.handles[i]) < leway){
                this.selectedHandle = i;
                return;
            }
        }
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

    render(){
        console.error(`${this.id} has not defined render()`);
    }

    renderHandles(){
        if(this.selectedHandle != -1){
            fill(0,255,255);
            rect(this.handles[this.selectedHandle].x-2.5,this.handles[this.selectedHandle].y-2.5, 5,5);
        }
        else{
            for(let i = 0; i<this.handles.length; i++){
                if(createVector(mouseX, mouseY).dist(this.handles[i]) < leway) fill(0,255,255);
                else fill(255);
                rect(this.handles[i].x-2.5,this.handles[i].y-2.5, 5,5);
            }
        }
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
            this.pos.x = round(this.pos.x);
            this.pos.y = round(this.pos.y);
            this.pos2.x = round(this.pos2.x);
            this.pos2.y = round(this.pos2.y);
            this.size.w = this.pos2.x-this.pos.x;
            this.size.h = this.pos2.y-this.pos.y;
        }
        else{
            this.pos.x += mouseX-pmouseX;
            this.pos.y += mouseY-pmouseY;
        }
        this.regenHandles();
    }

    pointCollision(x,y){
        if(x>this.pos.x-leway && x<this.pos.x+this.size.w+leway){
            if(y>this.pos.y-leway && y<this.pos.y+this.size.h+leway){
                return true;
            }
        }
        return false;
    }

    boxCollision(x,y,w,h){ //returns true if input box covers at least 40% of this object
        let b1 = {x1: x, x2: x+w, y1: y, y2: y+h, s: w*h};
        let b2 = {x1: this.pos.x, x2: this.pos.x+this.size.w, y1: this.pos.y, y2: this.pos.y+this.size.h, s: this.size.w*this.size.h};

        let areaIntersection = (max(0, (min(b1.x2, b2.x2)-max(b1.x1, b2.x1)))*max(0, (min(b1.y2, b2.y2)-max(b1.y1, b2.y1))));
        //console.log(areaIntersection/b2.s);
        if(areaIntersection/b2.s > 0.4) return true;
        return false;
    }
}

class Box extends UIobject{
    constructor(x,y,w,h,r,g,b){
        super(x,y,w,h);
        this.c = color(r,g,b);
        this.img = null;
        this.id = "box"+boxCount;
        boxCount++;
        itemList.addItem(this.id);
    }
    
    toStr(){
        let arr = [];
        arr.push("fill("+this.c.levels[0]+","+this.c.levels[1]+","+this.c.levels[2]+");");
        arr.push("rect("+(this.pos.x/width)+"*width,"+(this.pos.y/height)+"*height,"+(this.size.w/width)+"*width,"+(this.size.h/height)+"*height);");
        return arr;
    }
    
    setImg(img){
        this.img = img;
    }
    
    render(selected){
        push();
        fill(this.c);
        rect(this.pos.x, this.pos.y, this.size.w, this.size.h);
        if(selected) this.renderHandles();
        pop();
    }
}

class Txt extends UIobject{
    constructor(t, x, y, r,g,b){
        super(x,y,50,25);
        this.t = t;
        this.align = {x: CENTER, y: CENTER};
        this.c = color(r,g,b);
        this.textSize = 20;
        this.id = "txt"+txtCount;
        txtCount++;
        itemList.addItem(this.id);
    }

    toStr(){
        let arr = [];
        arr.push("textSize("+this.textSize/(width/height)+"*(width/height));");
        arr.push("textAlign('"+this.align.x+"','"+this.align.y+"');");
        arr.push("fill("+this.c.levels[0]+","+this.c.levels[1]+","+this.c.levels[2]+");");
        arr.push("text('"+this.t+"',"+(this.pos.x/width)+"*width,"+(this.pos.y/height)+"*height,"+(this.size.w/width)+"*width,"+(this.size.h/height)+"*height);");
        return arr;
    }

    render(selected){
        push();
        textAlign(this.align.x, this.align.y);
        fill(this.c);
        textSize(this.textSize);
        text(this.t + ((flash&&selected&&typing)? "|":""), this.pos.x, this.pos.y, this.size.w, this.size.h);
        if(selected){
            fill(0,255,255,50);
            stroke(0,255,255);
            rect(this.pos.x, this.pos.y, this.size.w, this.size.h);
            stroke(0);
            this.renderHandles();
        }
        pop();
    }
}

class Img extends UIobject{
    constructor(picIndex, x, y, w, h){
        super(x,y,w,h);
        this.picIndex = picIndex;
        this.id = "img"+txtCount;
        imgCount++;
        itemList.addItem(this.id);
    }

    toStr(){
        let arr = [];
        arr.push("image(loadedUiImgs["+this.picIndex+"],"+this.pos.x+","+this.pos.y+","+this.size.w+","+this.size.h+");");
        return arr;
    }

    render(selected){
        push();
        image(loadedUiImgs[this.picIndex], this.pos.x, this.pos.y, this.size.w, this.size.h);
        if(selected) this.renderHandles();
        pop();
    }
}
  
function createJS(){
    let arr = [];
    arr.push("function drawUI(){");
    arr.push("push();");
    arr.push("textWrap(WORD);");
    for(let i=0; i<objects.length; i++){
        arr = arr.concat(objects[i].toStr());
    }
    arr.push("pop();");
    arr.push("}");
    console.log(arr);
    saveStrings(arr,"test","js",true);
}