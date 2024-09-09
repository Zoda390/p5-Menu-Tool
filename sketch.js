var socket; //connection to save and edit files
var ps; //Page Sorter
var fp = {w: 0.8, h: 0.7}; //framePercent: the percent of window that the main frame takes up
var mainDiv;
var bottomDiv;
var rightDiv;
var newPageButton;

function setup(){
    socket = io.connect("http://localhost:3001");
    ps = new Page_Sorter();

    mainDiv = createDiv();
    mainDiv.style("background-color: #555555;");
    mainDiv.id("mainDiv");
    rightDiv = createDiv();
    rightDiv.style("background-color: #665599; border:1px solid black;");
    rightDiv.id("rightDiv");
    newPageButton = new p5_Button("New Page", 0, 0, 0, 0, null);
    newPageButton.html.parent(rightDiv);
    bottomDiv = createDiv();
    bottomDiv.style("background-color: #665599; border:1px solid black;");
    bottomDiv.id("bottomDiv");

    resizeMain();
    addEventListener("resize", (event) => {resizeMain()});

    //load pages
    //ps.show("Main Menu");
}

function draw(){

}

function resizeMain(){
    mainDiv.position(0, 0);
    mainDiv.size((innerWidth*fp.w), (innerHeight*fp.h)-1);
    rightDiv.position(innerWidth*fp.w, 0);
    rightDiv.size((innerWidth*(1-fp.w))-2, (innerHeight*fp.h)-2);
    newPageButton.html.position((((innerWidth*(1-fp.w))-2)/2)-((innerWidth*(1-fp.w))/4), 20);
    newPageButton.html.size(((innerWidth*(1-fp.w))-2)/2, 50)
    bottomDiv.position(0, innerHeight*fp.h);
    bottomDiv.size(innerWidth-2, (innerHeight*(1-fp.h))-2);
}
