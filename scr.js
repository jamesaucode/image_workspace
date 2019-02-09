/*** Global variables ***/

var isDown = false; // global state to check if an image is being dragged or not;
var isResizing = false;
var currentTarget = null;
var currentResizer = null;
var images = []; // Array to store all image in images, used in reOrganize function
var initialWidth = 0;
var initialHeight = 0;
var initialMouseX = 0;
var initialMouseY = 0;
var initialX = 0;
var initialY = 0;

/************************/

function appendLeftTab(file, imageWrapper) {
  const leftTab = document.getElementById("left");
  const delBtn = document.createElement("button");
  delBtn.textContent = "X";
  delBtn.className = "btn--del";
  // Add onclick event to the delete button
  delBtn.onclick = (e) => {
    const target = imageWrapper;
    // Update the local images array for the re-organize function
    images = images.filter(
      img => img.lastChild.id !== imageWrapper.lastChild.id
    );
    // e.target is the button, to get to the paragraph, we have to get e.target.parentNode
    leftTab.removeChild(e.target.parentNode);
    // Next, we remove the target image's wrapper (so the image is gone too)
    target.parentNode.removeChild(target);
  };
  const fileNameParagraph = document.createElement("p");
  const fileName = document.createTextNode(file.name);
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

function createResizer(resizer, imageWrapper, resizeFunction) {
  resizer.addEventListener("mousedown", e => {
    e.preventDefault();
    isDown = false;
    isResizing = true;
    currentTarget = imageWrapper;
    currentResizer = e.target;
    initialWidth = parseFloat(
      getComputedStyle(currentTarget, null)
        .getPropertyValue("width")
        .replace("px", "")
    );
    initialHeight = parseFloat(
      getComputedStyle(currentTarget, null)
        .getPropertyValue("height")
        .replace("px", "")
    );
    initialX = currentTarget.getBoundingClientRect().left;
    initialY = currentTarget.getBoundingClientRect().top;
    initialMouseX = e.pageX;
    initialMouseY = e.pageY;
    window.addEventListener("mousemove", resizeFunction);
    window.addEventListener("mouseup", stopResize);
  });
}

function bottomRightResize(e) {
  /* Note: e.pageX = X of the current cursor.
          e. pageY = Y of the current cursor.
          initialMouseX = original X of the cursor, stored when resizer is clicked
          initialMouseY = original Y of the cursor, stored when resizer is clicked
          initialWidth = original boundingX
          initialHeight = original boundingY
  */
  if (isResizing && currentResizer.classList.contains("bottom-right")) {
    currentTarget.style.width = initialWidth + (e.pageX - initialMouseX) + "px";
    currentTarget.style.height =
      initialHeight + (e.pageY - initialMouseY) + "px";
  }
}

function bottomLeftResize(e) {
  if (isResizing && currentResizer.classList.contains("bottom-left")) {
    currentTarget.style.width = initialWidth - (e.pageX - initialMouseX) + "px";
    currentTarget.style.height =
      initialHeight + (e.pageY - initialMouseY) + "px";
    currentTarget.style.left = initialX + (e.pageX - initialMouseX) + "px";
  }
}

function topLeftResize(e) {
  if (isResizing && currentResizer.classList.contains("top-left")) {
    currentTarget.style.width = initialWidth - (e.pageX - initialMouseX) + "px";
    currentTarget.style.height =
      initialHeight - (e.pageY - initialMouseY) + "px";
    currentTarget.style.left = initialX + (e.pageX - initialMouseX) + "px";
    currentTarget.style.top = initialY + (e.pageY - initialMouseY) + "px";
  }
}

function topRightResize(e) {
  if (isResizing && currentResizer.classList.contains("top-right")) {
    currentTarget.style.width = initialWidth + (e.pageX - initialMouseX) + "px";
    currentTarget.style.height =
      initialHeight - (e.pageY - initialMouseY) + "px";
    currentTarget.style.top = initialY + (e.pageY - initialMouseY) + "px";
  }
}

function stopResize(e) {
  isResizing = false;
  window.removeEventListener("mousemove", bottomRightResize);
  window.removeEventListener("mousemove", bottomLeftResize);
}

function makeImage(reader, preview, file) {
  const image = new Image();
  const imageWrapper = document.createElement("div");
  imageWrapper.className = "wrapper-image";
  const main = document.querySelector(".main");
  const upload = document.getElementById("upload");
  // Default width is the main workspace's width divided by 4 (aka can fit 4 images)
  const defaultWidth = main.clientWidth / 4;
  const defaultHeight = main.clientHeight / 3;
  const resizers = document.createElement("div");
  const topLeftResizer = document.createElement("div");
  const topRightResizer = document.createElement("div");
  const bottomLeftResizer = document.createElement("div");
  const bottomRightResizer = document.createElement("div");
  resizers.className = "resizers";
  topLeftResizer.className = "resizer top-left";
  topRightResizer.className = "resizer top-right";
  bottomLeftResizer.className = "resizer bottom-left";
  bottomRightResizer.className = "resizer bottom-right";
  createResizer(bottomRightResizer, imageWrapper, bottomRightResize);
  createResizer(bottomLeftResizer, imageWrapper, bottomLeftResize);
  createResizer(topRightResizer, imageWrapper, topRightResize);
  createResizer(topLeftResizer, imageWrapper, topLeftResize);
  resizers.appendChild(topLeftResizer);
  resizers.appendChild(topRightResizer);
  resizers.appendChild(bottomLeftResizer);
  resizers.appendChild(bottomRightResizer);
  imageWrapper.append(resizers);
  image.className = "image";
  resizers.width = defaultWidth;
  resizers.height = defaultHeight;
  image.width = defaultWidth;
  image.height = defaultHeight;
  image.title = file.name;
  imageWrapper.style.width = image.width + "px";
  imageWrapper.style.height = image.height + "px";
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
  image.ondragstart = function() {
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
  // Create an id for imagewrapper as an identifier later
  imageWrapper.id = images.length.toString();
  // Add image into the image wrapper
  imageWrapper.appendChild(image);
  // Add the whole imageWrapper div into the preview div
  preview.appendChild(imageWrapper);
  // Add image wrapper into the local images array
  images.unshift(imageWrapper);
  return imageWrapper;
}

function previewFile() {
  const preview = document.getElementById("upload"); // Selects query with #upload
  const files = document.querySelector("input[type=file]").files; //sames as here

  function readAndPreview(file) {
    // Make sure `file.name` matches our extensions criteria
    if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
      const reader = new FileReader();

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
  let offsetLeft = 0;
  let offsetTop = 0;
  const main = document.querySelector(".main");
  images.forEach(imageWrapper => {
    // Left tab is 10% of vw + it's padding
    let left = window.innerWidth * 0.1 - 10;
    // Top is height of the margin-bottom-20px div
    let top = 100;
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
