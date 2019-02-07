window.onload = function() {};

window.onresize = function() {
  var main = document.querySelector(".main");
};

var isDown = false; // global state to check if an image is being dragged or not;
var images = []; // Array to store all image in images

function reOrganize() {
  var offsetLeft = 0;
  var offsetTop = 0;
  var main = document.querySelector(".main");
  images.forEach(image => {
    // Left tab is 10% of vw + it's padding
    var left = window.innerWidth * 0.1 + 19;
    // Top is height of heading + margin of heading + height of the buttons + 20px of margin
    var top = 100;
    image.style.left = left + offsetLeft + "px";
    image.style.top = top + offsetTop + "px";
    offsetLeft += image.width;
    if (offsetLeft + image.width > main.clientWidth) {
      offsetTop += image.height;
      offsetLeft = 0;
    }
  });
}

function previewFile() {
  var preview = document.getElementById("upload"); // Selects query with #upload
  var files = document.querySelector("input[type=file]").files; //sames as here

  function readAndPreview(file) {
    // Make sure `file.name` matches our extensions criteria
    if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
      var reader = new FileReader();

      reader.addEventListener(
        "load",
        function() {
          var image = makeImage(reader, preview, file);
          appendLeftTab(file, image);
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
function appendLeftTab(file, image) {
  var leftTab = document.getElementById("left");
  var delBtn = document.createElement("button");
  delBtn.textContent = "X";
  delBtn.className = "btn--del";
  // Add onclick event to the delete button
  delBtn.onclick = e => {
    var target = document.getElementById(image.id);
    // e.target is the button, to get to the paragraph, we have to get e.target.parentNode
    leftTab.removeChild(e.target.parentNode);
    // Next, we remove the target image
    target.parentNode.removeChild(target);
  };
  var fileNameParagraph = document.createElement("p");
  var fileName = document.createTextNode(file.name);
  fileNameParagraph.addEventListener("mouseover", function() {
    image.style.border = "10px solid #42f48c";
    image.style.zIndex = 100;
  });
  fileNameParagraph.addEventListener("mouseout", function() {
    image.style.border = "10px solid transparent";
    image.style.zIndex = 1;
  });
  fileNameParagraph.append(fileName);
  fileNameParagraph.append(delBtn);
  leftTab.append(fileNameParagraph);
}

function makeImage(reader, preview, file) {
  var image = new Image();
  var defaultHeight = 400;
  var defaultWidth = 400;
  image.style.position = "absolute";
  image.style.border = "10px solid transparent";
  image.width = defaultWidth;
  image.height = defaultHeight;
  image.title = file.name;
  image.src = reader.result;
  image.addEventListener(
    "mousedown",
    function(e) {
      // Click to start dragging, click again to stop
      isDown = !isDown;
    },
    true
  );
  // Disable default dragging motion
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
      }
    },
    true
  );
  image.addEventListener("mouseover", function() {
    image.style.zIndex = 100;
  });
  image.addEventListener("mouseout", function() {
    image.style.zIndex = 1;
  });
  image.id = images.length.toString();
  preview.appendChild(image);
  images.unshift(image);
  return image;
}
