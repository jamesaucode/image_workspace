var isDown = false; // global state to check if an image is being dragged or not;
var isResizing = false;
var images = []; // Array to store all image in images, used in reOrganize function
var initialWidth = 0;
var intialHeight = 0;
var initialMouseX = 0;
var initialMouseY = 0;
var initialX = 0;
var initialY = 0;

function appendLeftTab(file, imageWrapper) {
  var leftTab = document.getElementById("left");
  var delBtn = document.createElement("button");
  delBtn.textContent = "X";
  delBtn.className = "btn--del";
  // Add onclick event to the delete button
  delBtn.onclick = e => {
    var target = document.getElementById(imageWrapper.lastChild.id);
    // Update the local images array for the re-organize function
    images = images.filter(
      img => img.lastChild.id !== imageWrapper.lastChild.id
    );
    // e.target is the button, to get to the paragraph, we have to get e.target.parentNode
    leftTab.removeChild(e.target.parentNode);
    // Next, we remove the target image's wrapper (so the image is gone too)
    target.parentNode.parentNode.removeChild(target.parentNode);
  };
  var fileNameParagraph = document.createElement("p");
  var fileName = document.createTextNode(file.name);
  fileNameParagraph.addEventListener("mouseover", function() {
    imageWrapper.style.border = "10px solid #42f48c";
    imageWrapper.style.zIndex = 100;
  });
  fileNameParagraph.addEventListener("mouseout", function() {
    imageWrapper.style.border = "10px solid transparent";
    imageWrapper.style.zIndex = 1;
  });
  fileNameParagraph.append(fileName);
  fileNameParagraph.append(delBtn);
  leftTab.append(fileNameParagraph);
}

function createResizer(resizer, imageWrapper) {
  resizer.addEventListener("mousedown", e => {
    e.preventDefault();
    initialWidth = parseFloat(getComputedStyle(imageWrapper, null).getPropertyValue('width').replace('px', ''));
    initialHeight = parseFloat(getComputedStyle(imageWrapper, null).getPropertyValue('height').replace('px', ''));
    initialX = imageWrapper.getBoundingClientRect().left;
    initialY = imageWrapper.getBoundingClientRect().top;
    initialMouseX = e.pageX;
    initialMouseY = e.pageY;
    window.addEventListener("mousemove", resize(e), true);
    window.addEventListener("mouseup", stopResize);
  });
}

function resize(e) {
  // if (bottomRightResizer.classList.contains("bottom-right")) {
  //   // imageWrapper.style.width = e.pageX - imageWrapper.getBoundingClientRect().left + "px";
  // } else 
  var imageWrapper = document.querySelector('.wrapper-image');
  console.log(imageWrapper);
  if (bottomLeftResizer.classList.contains("bottom-left")) {
    imageWrapper.style.width = initialWidth - (e.pageX - initialMouseX) + 'px';
    imageWrapper.style.left = initialX + (e.pageX - initialMouseX) + 'px';
  }
}

function stopResize(e) {
  initialWidth = 0;
  initialHeight = 0;
  initialMouseX = 0;
  initialMouseY = 0;
  window.removeEventListener("mousemove", resize);
}

function makeImage(reader, preview, file) {
  var image = new Image();
  var imageWrapper = document.createElement("div");
  imageWrapper.className = "wrapper-image";
  var main = document.querySelector(".main");
  var upload = document.getElementById("upload");
  // Default width is the main workspace's width divided by 4 (aka can fit 4 images)
  var defaultWidth = main.clientWidth / 4;
  var resizers = document.createElement("div");
  var topLeftResizer = document.createElement("div");
  var topRightResizer = document.createElement("div");
  var bottomLeftResizer = document.createElement("div");
  var bottomRightResizer = document.createElement("div");
  resizers.className = "resizers";
  topLeftResizer.className = "resizer top-left";
  topRightResizer.className = "resizer top-right";
  bottomLeftResizer.className = "resizer bottom-left";
  bottomRightResizer.className = "resizer bottom-right";
  createResizer(bottomRightResizer, imageWrapper);
  createResizer(bottomLeftResizer, imageWrapper)
  resizers.appendChild(topLeftResizer);
  resizers.appendChild(topRightResizer);
  resizers.appendChild(bottomLeftResizer);
  resizers.appendChild(bottomRightResizer);
  imageWrapper.append(resizers);
  image.className = "image";
  image.width = defaultWidth;
  image.title = file.name;
  imageWrapper.style.width = image.width + "px";
  // The resulting file data
  image.src = reader.result;
  imageWrapper.addEventListener(
    "mousedown",
    function(e) {
      // Click to start dragging, click again to stop
      isDown = true;
    },
    true
  );
  // Disable default dragging motion
  imageWrapper.ondragstart = function() {
    return false;
  };
  imageWrapper.addEventListener(
    "mousemove",
    function(e) {
      e.preventDefault();
      if (isDown) {
        imageWrapper.style.height = image.height + "px";
        imageWrapper.style.left = e.clientX - image.width / 2 + "px";
        imageWrapper.style.top = e.clientY - image.height / 2 + "px";
      }
    },
    true
  );
  imageWrapper.addEventListener(
    "mouseup",
    function(e) {
      // Click to start dragging, click again to stop
      isDown = false;
    },
    true
  );
  imageWrapper.addEventListener("mouseover", function() {
    imageWrapper.style.zIndex = 100;
  });
  imageWrapper.addEventListener("mouseout", function() {
    imageWrapper.style.zIndex = 1;
  });
  image.id = images.length.toString();
  // Add image into the image wrapper
  imageWrapper.appendChild(image);
  // Add the whole imageWrapper div into the preview div
  preview.appendChild(imageWrapper);
  // Add image wrapper into the local images array
  images.unshift(imageWrapper);
  return imageWrapper;
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
          var imageWrapper = makeImage(reader, preview, file);
          appendLeftTab(file, imageWrapper);
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

function reOrganize() {
  var offsetLeft = 0;
  var offsetTop = 0;
  var main = document.querySelector(".main");
  images.forEach(imageWrapper => {
    // Left tab is 10% of vw + it's padding
    var left = window.innerWidth * 0.1 - 10;
    // Top is height of the margin-bottom-20px div
    var top = 100;
    console.log(imageWrapper);
    // Increment offset each time an image is added, so that images will not overlap
    imageWrapper.style.left = left + offsetLeft + "px";
    imageWrapper.style.top = top + offsetTop + "px";
    offsetLeft += imageWrapper.clientWidth;
    // After each row is filled, increment offsetTop so that function will start filling the next row
    if (offsetLeft + imageWrapper.clientWidth > main.clientWidth) {
      offsetTop += imageWrapper.clientHeight;
      offsetLeft = 0;
    }
  });
}
