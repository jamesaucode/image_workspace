window.onload = function() {
};

window.onresize = function() {
  var div = document.getElementById("body");
  var WIDTH = window.innerWidth;
  var HEIGHT = window.innerHeight;
  div.style.width = WIDTH + "px";
  div.style.height = HEIGHT + "px";
}

var isDown = false;

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
        var leftTab = document.getElementById('left');
        var fileNameParagraph = document.createElement('p');
        var defaultHeight = 400;
        var defaultWidth = 400;
        image.style.position = 'absolute';
        image.style.border = '10px solid transparent';
        image.width = defaultWidth;
        image.height = defaultHeight;
        image.title = file.name;
        var fileName = document.createTextNode(file.name);
        fileNameParagraph.addEventListener('mouseover', function() {
          image.style.border = '10px solid #42f48c';
        });
        fileNameParagraph.addEventListener('mouseout', function () {
          image.style.border = '10px solid transparent';
        })
        fileNameParagraph.append(fileName);
        leftTab.append(fileNameParagraph);
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
              image.style.left = e.clientX - image.width / 2 + "px";
              image.style.top = e.clientY - image.height / 2 + "px";
              console.log("dragging");
            }
          },
          true
        );
        image.addEventListener("mouseover", function() {
          image.style.zIndex = 100;
        })
        image.addEventListener("mouseout", function() {
          image.style.zIndex = 1;
        })
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

