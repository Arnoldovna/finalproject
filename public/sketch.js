var movie;
var canvas;

var playPressed = false;
var recordPressed = false;
var playingInThisMoment = false;
var webcamOn = true;

var x = 0;
var y = 0;
var yMobile;
var xMobile;

var dropzone;
var inputName;

var movieWidth = 750;
var movieHeight = 422;
var movieEvent;

var submitButton;
var verticalStripesButton;
var horizontalStripesButton;
var verticalMeltButton;
var horizontalMeltButton;
var clearCanvasButton;
var saveCanvasButton;
var playButton;

var widthSliderD;
var heightSliderD;
var yPixelSliderD;
var xPixelSliderS;
var yPixelSliderS;
var fileName;
var stepSliderM;

var widthSliderValueD;
var heightSliderValueD;
var yPixelSliderValueD;

var xPixelSliderValueS;
var yPixelSliderValueS;

var sliderContainer;
var containerButtons;

//-------------------------------SETUP------------------------------------
function setup() {
    divName = createDiv("").addClass("divName");
    fileName = createDiv("").addClass("fileName");
    document.querySelector(".fileName").style.display = "none";

    document.getElementById("defaultCanvas0").style.display = "none";

    createP("TRANS|MEDIA")
        .addClass("title")
        .parent(divName)
        .mousePressed(refresh);

    createP("a generative digital art tool")
        .addClass("underTitle")
        .parent(divName);

    createdragZone();

    document.getElementById("webcam").addEventListener("click", function() {
        console.log("click");
        startWebcam();
    });
}

//------------------------------DRAW LOOP-----------------------------------

function draw() {
    if (playingInThisMoment) {
        movie.loadPixels();
        desiredEffect();
    } else if (!playingInThisMoment) {
        return;
    }
}

//------------------------DRAG AND DROP BOX--------------------------------
function createdragZone() {
    createP("drag your mp4 file here").id("dropzone");
    dropzone = select("#dropzone");
    dropzone.dragOver(highlight);
    dropzone.dragLeave(unhighlight);
    dropzone.drop(getFile, unhighlight);
}
//---------------------------GET FILE--------------------------------------
function getFile(file) {
    pixelDensity(1);
    dropzone.hide();
    inputName = createDiv(file.name)
        .addClass("inputName")
        .parent(fileName);
    document.querySelector(".fileName").style.display = "table";
    document.getElementById("webcam").style.display = "none";
    movie = createVideo(file.data).id("video");
    movie.size(movieWidth, movieHeight);
    document.getElementById("video").controls = true;

    videoEvents();

    document.getElementById("defaultCanvas0").style.display = "inline";

    canvas = createCanvas(movieWidth, movieHeight);
    canvas.background(255);

    containerButtons = createDiv("").addClass("containerButtons");
    sliderContainer = createDiv("").addClass("sliderContainer");
    createPlayButton();
    createEffectButtons();
    createSaveCanvasButton();
    createFullScreenButton();

    createXPixelSliderS();
    createYPixelSliderD();
    // createWidthSliderS();

    createYPixelSliderS();
    createWidthSliderD();

    // numberHSD = createP(heightSliderValueD).parent(sliderContainer);

    createStepSliderM();
    createHeightSliderD();
}
//----------------------------WEBCAM---------------------------------------
function startWebcam() {
    document.querySelector("#dropzone").style.display = "none";
    document.getElementById("webcam").style.display = "none";
    pixelDensity(1);

    inputName = createP("webcam")
        .addClass("inputName")
        .parent(fileName);
    document.querySelector(".fileName").style.display = "table";

    movie = createCapture(VIDEO).id("video");
    movie.size(movieWidth, movieHeight);

    videoEvents();

    document.getElementById("defaultCanvas0").style.display = "inline";

    canvas = createCanvas(movieWidth, movieHeight);
    canvas.background(255);

    containerButtons = createDiv("").addClass("containerButtons");
    sliderContainer = createDiv("").addClass("sliderContainer");

    createStartWebcamButton();

    createEffectButtons();
    createSaveCanvasButton();
    createFullScreenButton();

    createXPixelSliderS();
    createYPixelSliderD();
    createYPixelSliderS();
    createWidthSliderD();
    createStepSliderM();
    createHeightSliderD();
}

//----------------------DESIRED EFFECT LOGIC-------------------------------

function desiredEffect() {
    document.getElementById("verticalS").onclick = function() {
        // console.log("verticalS clicked");
        movieEvent.ontimeupdate = function() {
            verticalStripes();
            // console.log("ontimeupdate");
        };
    };

    document.getElementById("horizontalS").onclick = function() {
        // console.log("horizontalS clicked");
        movieEvent.ontimeupdate = function() {
            horizontalStripes();
            // console.log("ontimeupdate");
        };
    };

    document.getElementById("verticalM").onclick = function() {
        // console.log("verticalM clicked");
        movieEvent.ontimeupdate = function() {
            verticalMelt();
        };
    };

    document.getElementById("horizontalM").onclick = function() {
        // console.log("horizontalM clicked");
        movieEvent.ontimeupdate = function() {
            horizontalMelt();
        };
    };
}

//----------------------------PLAY VIDEO-----------------------------------
function playVideo() {
    if (playPressed) {
        movie.pause();
        playingInThisMoment = false;
    } else if (!playPressed) {
        playingInThisMoment = true;
        movie.loop();
    }
    playPressed = !playPressed;
}

function playWebcam() {
    if (webcamOn) {
        movie.pause();
        playingInThisMoment = false;
        playButton.html("START");
    } else if (!webcamOn) {
        playingInThisMoment = true;
        movie.loop();
        playButton.html("STOP");
    }
    webcamOn = !webcamOn;
}

//-------------------------DRAG AND DROP STYLING--------------------------
function highlight() {
    dropzone.style("background-color", "#fafafa");
}

function unhighlight() {
    dropzone.style("background-color", "#ffffff");
}

//------------------------FEW VIDEO EVENTS -------------------------------
function videoEvents() {
    movieEvent = document.getElementById("video");

    movieEvent.onprogress = function() {
        console.log("Downloading video");
    };
    movieEvent.onloadstart = function() {
        console.log("Starting to load video");
    };
    movieEvent.oncanplaythrough = function() {
        console.log("Can play through video without stopping");
    };

    movieEvent.onplaying = function() {
        console.log("The audio is now playing");
        playingInThisMoment = true;
    };
    // console.log(movieEvent.error.code);

    movieEvent.onwaiting = function() {
        console.log("Wait! I need to buffer the next frame");
    };

    console.log("movie paused?", movieEvent.paused);
    console.log("playing?:", playingInThisMoment);
}

//---------------------------BUTTONS--------------------------------------
function createPlayButton() {
    playButton = createButton("LOOP")
        .addClass("button playButton")
        .parent(containerButtons);
    playButton.mouseClicked(playVideo);
}

function createStartWebcamButton() {
    playButton = createButton("STOP")
        .addClass("button playButton")
        .parent(containerButtons);
    playButton.mouseClicked(playWebcam);
}

function clearCanvas() {
    clear();
    x = 0;
    y = 0;
}

function createEffectButtons() {
    verticalStripesButton = createButton("VERTICAL STRIPES")
        .addClass("button")
        .id("verticalS")
        .parent(containerButtons);
    verticalStripesButton.mousePressed(desiredEffect);

    horizontalMeltButton = createButton("HORIZONTAL STRIPES")
        .addClass("button")
        .id("horizontalS")
        .parent(containerButtons);
    horizontalMeltButton.mousePressed(desiredEffect);

    verticalMeltButton = createButton("VERTICAL MELT")
        .addClass("button")
        .id("verticalM")
        .parent(containerButtons);
    verticalMeltButton.mousePressed(desiredEffect);

    horizontalMeltButton = createButton("HORIZONTAL MELT")
        .addClass("button")
        .id("horizontalM")
        .parent(containerButtons);
    horizontalMeltButton.mousePressed(desiredEffect);

    clearCanvasButton = createButton("CLEAR CANVAS")
        .addClass("button")
        .parent(containerButtons);
    clearCanvasButton.mousePressed(clearCanvas);
}

function createFullScreenButton() {
    fullScreenButton = createButton("FULL SCREEN")
        .addClass("button fullscreen")
        .parent(containerButtons);

    fullScreenButton.mousePressed(toggleFullscreen);
}

function toggleFullscreen() {
    let elem = document.getElementById("defaultCanvas0");

    if (!document.webkitFullscreenElement) {
        elem.webkitRequestFullscreen()
            .then({})
            .catch(err => {
                alert(
                    `Error attempting to enable full-screen mode: ${
                        err.message
                    } (${err.name})`
                );
            });
    } else {
        document.webkitExitFullscreen();
    }
}

function createSaveCanvasButton() {
    saveCanvasButton = createButton("SNAPSHOT")
        .addClass("button saveCanvasButton")
        .parent(containerButtons);
    saveCanvasButton.mouseClicked(makeSnapshot);
}

function makeSnapshot() {
    saveCanvas("TransMedia", "jpg");
}

//-----------------------------REFRESH-----------------------------------
function refresh() {
    setTimeout(function() {
        location.reload();
    }, 100);
}
//---------------------------EFFECT FUNCTIONS----------------------------

function verticalStripes() {
    giveSliderValue();
    copy(
        movie,
        xPixelSliderValueS,
        yPixelSliderValueS,
        1,
        1,
        x,
        yPixelSliderValueD,
        widthSliderValueD,
        heightSliderValueD
    );

    x = x + 1;

    if (x > movieWidth) {
        x = 0;
    }
    // console.log("x:", x);
}

function horizontalStripes() {
    giveSliderValue();
    copy(
        movie,
        xPixelSliderValueS,
        yPixelSliderValueS,
        1,
        1,
        yPixelSliderValueD,
        y,
        widthSliderValueD,
        heightSliderValueD
    );

    y = y + 1;

    if (y > movieHeight) {
        y = 0;
    }
}

function verticalMelt() {
    giveSliderValue();
    copy(
        movie,
        xPixelSliderValueS,
        widthSliderValueD,
        stepSliderValueM,
        movieHeight,
        xMobile,
        0,
        yPixelSliderValueS,
        heightSliderValueD
    );

    if (xMobile > movieWidth) {
        x = 1;
    }
    x = x + 1;
}

function horizontalMelt() {
    giveSliderValue();
    copy(
        movie,
        xPixelSliderValueS,
        yPixelSliderValueD,
        movieWidth,
        stepSliderValueM,
        0,
        yMobile,
        widthSliderValueD,
        heightSliderValueD
    );

    if (yMobile > movieHeight) {
        y = 1;
    }
    y = y + 1;
}

//---------------------------CREATE SLIDER-------------------------------

function createYPixelSliderD() {
    var yPixelSliderDivD = createDiv(" Y coordinate of the Destination:")
        .addClass("sliderDiv yPixelSliderD")
        .parent(sliderContainer);

    yPixelSliderD = createSlider(0, height, 1).parent(yPixelSliderDivD);
}

function createXPixelSliderS() {
    var xPixelSliderDivS = createDiv(" X coordinate of the Source:")
        .addClass("sliderDiv xPixelSliderS")
        .parent(sliderContainer);

    xPixelSliderS = createSlider(0, width, width / 2).parent(xPixelSliderDivS);
}

function createYPixelSliderS() {
    var yPixelSliderDivS = createDiv(" Y coordinate of the Source:")
        .addClass("sliderDiv yPixelSliderS")
        .parent(sliderContainer);

    yPixelSliderS = createSlider(0, height, height / 2).parent(
        yPixelSliderDivS
    );
}

function createWidthSliderS() {
    var widthSliderDivS = createDiv("Source input Width:")
        .addClass("sliderDiv WidthSliderS")
        .parent(sliderContainer);

    widthSliderS = createSlider(1, width, 1).parent(widthSliderDivS);
}

function createStepSliderM() {
    var stepSliderDivM = createDiv("Steps only for Melt effect:")
        .addClass("sliderDiv stepSliderM")
        .parent(sliderContainer);

    stepSliderM = createSlider(1, 10, 4).parent(stepSliderDivM);
}

function createWidthSliderD() {
    var widthSliderDiv = createDiv("Destination output Width:")
        .addClass("sliderDiv widthSliderD")
        .parent(sliderContainer);
    widthSliderD = createSlider(0, width, 1).parent(widthSliderDiv);
}

function createHeightSliderD() {
    var heightSliderDiv = createDiv("destination output height:")
        .addClass("sliderDiv heightSliderD")
        .parent(sliderContainer);

    heightSliderD = createSlider(0, height, height).parent(heightSliderDiv);

    //---------------------------SLIDER VALUES------------------------------------
    function giveSliderValue() {
        widthSliderValueD = widthSliderD.value();
        heightSliderValueD = heightSliderD.value();
        yPixelSliderValueD = yPixelSliderD.value();
        xPixelSliderValueS = xPixelSliderS.value();
        yPixelSliderValueS = yPixelSliderS.value();
        stepSliderValueM = stepSliderM.value();
        xMobile = x * stepSliderValueM;
        yMobile = y * stepSliderValueM;
    }

    // function createAllSlider(){
    function createYPixelSliderD() {
        var yPixelSliderDivD = createDiv(" Y coordinate of the Destination:")
            .addClass("sliderDiv yPixelSliderD")
            .parent(sliderContainer);

        yPixelSliderD = createSlider(0, height, 1).parent(yPixelSliderDivD);
    }

    function createXPixelSliderS() {
        var xPixelSliderDivS = createDiv(" X coordinate of the Source:")
            .addClass("sliderDiv xPixelSliderS")
            .parent(sliderContainer);

        xPixelSliderS = createSlider(0, width, width / 2).parent(
            xPixelSliderDivS
        );
    }

    function createYPixelSliderS() {
        var yPixelSliderDivS = createDiv(" Y coordinate of the Source:")
            .addClass("sliderDiv yPixelSliderS")
            .parent(sliderContainer);

        yPixelSliderS = createSlider(0, height, height / 2).parent(
            yPixelSliderDivS
        );
    }

    function createWidthSliderS() {
        var widthSliderDivS = createDiv("Source input Width:")
            .addClass("sliderDiv WidthSliderS")
            .parent(sliderContainer);

        widthSliderS = createSlider(1, width, 1).parent(widthSliderDivS);
    }

    function createStepSliderM() {
        var stepSliderDivM = createDiv("Steps only for Melt effect:")
            .addClass("sliderDiv stepSliderM")
            .parent(sliderContainer);

        stepSliderM = createSlider(1, 10, 4).parent(stepSliderDivM);
    }

    function createWidthSliderD() {
        var widthSliderDiv = createDiv("Destination output Width:")
            .addClass("sliderDiv widthSliderD")
            .parent(sliderContainer);
        widthSliderD = createSlider(0, width, 1).parent(widthSliderDiv);
    }

    function createHeightSliderD() {
        var heightSliderDiv = createDiv("destination output height:")
            .addClass("sliderDiv heightSliderD")
            .parent(sliderContainer);

        heightSliderD = createSlider(0, height, height).parent(heightSliderDiv);
    }
}

function giveSliderValue() {
    widthSliderValueD = widthSliderD.value();
    heightSliderValueD = heightSliderD.value();
    yPixelSliderValueD = yPixelSliderD.value();
    xPixelSliderValueS = xPixelSliderS.value();
    yPixelSliderValueS = yPixelSliderS.value();
    stepSliderValueM = stepSliderM.value();
    xMobile = x * stepSliderValueM;
    yMobile = y * stepSliderValueM;
}
