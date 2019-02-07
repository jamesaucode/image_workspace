window.onload = function() {
};

window.onresize = function() {
  var div = document.getElementById("body");
  var WIDTH = window.innerWidth;
  var HEIGHT = window.innerHeight;
  div.style.width = WIDTH + "px";
  div.style.height = HEIGHT + "px";
};

function startDrag(e) {
  var targ = e.target;
  console.log(e);
  if (!targ.style.top) {
    targ.style.top = "0px";
  }
  if (!targ.style.left) {
    targ.style.left = "0px";
  }
  drag = true;
  console.log("Dragging");
  var deltaX = e.movementX;
  var deltaY = e.movementY;
  console.log(deltaX);
  console.log(deltaY);
  return false;
}

var isDown = false;
var stopTime = 1500;

function previewFile() {
  var preview = document.getElementById("upload"); //selects the query named img
  var files = document.querySelector("input[type=file]").files; //sames as here

  function readAndPreview(file) {
    // Make sure `file.name` matches our extensions criteria
    if ( /\.(jpe?g|png|gif)$/i.test(file.name) ) {
    var reader = new FileReader();

    reader.addEventListener(
      "load",
      function() {
        var image = new Image();
        var defaultHeight =   window.innerHeight / 2;
        var defaultWidth = window.innerWidth / 4;
        image.style.position = 'absolute';
        image.width = defaultWidth;
        image.height = defaultHeight;
        image.title = file.name;
        image.src = this.result;
        image.addEventListener(
          "mousedown",
          function(e) {
            isDown = !isDown;
            console.log("DOWN");
          },
          true
        );
  
        function stop() {
          isDown = false;
          image.style.zIndex = 1;
          console.log("up");
        }
        image.ondragstart = function() {
          return false;
        };
        image.addEventListener(
          "mousemove",
          function(e) {
            e.preventDefault();
            if (isDown) {
              image.style.zIndex = 100;
              image.style.left = e.clientX - image.width / 2 + "px";
              image.style.top = e.clientY - image.height / 2 + "px";
              console.log("dragging");
            }
          },
          true
        );
        preview.appendChild(image);
      },
      false
    );

    reader.readAsDataURL(file);
    }
  }
  if (files) {
    [].forEach.call(files, readAndPreview);
  }
}

