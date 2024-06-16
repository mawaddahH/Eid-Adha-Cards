document.addEventListener('DOMContentLoaded', (event) => {
  // Get the canvas element and its 2D rendering context
  const canvas = document.getElementById('imageCanvas');
  const ctx = canvas.getContext('2d');

  // Define the sources for the images based on their shapes
  const imageSources = {
    imageOne: {
      square: 'تهنئة-العيد1-مربع.png',
      rectangle: 'تهنئة-العيد1-طولي.png'
    },
    imageTwo: {
      square: 'تهنئة-العيد2-مربع.png',
      rectangle: 'تهنئة-العيد2-طولي.png'
    },
    imageThree: {
      square: 'تهنئة-العيد3-مربع.png',
      rectangle: 'تهنئة-العيد3-طولي.png'
    },
    imageFour: {
      square: 'تهنئة-العيد4-مربع.png',
      rectangle: 'تهنئة-العيد4-طولي.png'
    }
  };

  // Set initial values for various customization options
  let currentImageSrc = ''; // No initial image source
  let name = 'اكتب اسمك';
  let fontSize;
  let squareFontSize = 15;
  let rectangleFontSize = 10;
  let fontFamily = 'EidFont';
  let color = document.querySelector('input[name="textColor"]:checked').value;
  let textPosition = { x: 0, y: 0 };
  let hasSelectedImage = false;

  // Load the initial image
  const image = new Image();

  // Define default values for customization options
  const defaultCustomizationOptions = {
    imageShape: 'square',
    textColor: '#9A682C'
  };

  // Function to load an image
  function loadImage(src) {
    image.onload = function () {
      updateCanvasSize();
      setTextPosition(); // Ensure text position is set initially
      updateText(); // Ensure text is drawn initially
    };
    image.src = src;
  }

  // Function to update the size of the canvas based on the image dimensions and device width
  function updateCanvasSize() {
    const devicePixelRatio = window.devicePixelRatio || 1;
    let maxWidth = window.innerWidth - 20; // Set max width for mobile view

    // Set maxWidth to 400px for larger screens (laptops)
    if (window.innerWidth > 400) {
      maxWidth = 400;
    }

    let width, height;

    if (image.naturalWidth > image.naturalHeight) {
      width = maxWidth;
      height = (image.naturalHeight / image.naturalWidth) * maxWidth;
    } else {
      height = maxWidth;
      width = (image.naturalWidth / image.naturalHeight) * maxWidth;
    }

    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const selectedShape = document.querySelector('input[name="imageShape"]:checked')?.value || defaultCustomizationOptions.imageShape;

    if (selectedShape === 'square') {
      fontSize = squareFontSize;
    } else if (selectedShape === 'rectangle') {
      fontSize = rectangleFontSize;
    } else {
      fontSize = (width > height ? height : width) / 14;
    }

    setTextPosition(); // Update text position whenever canvas size changes
  }

  // Function to set the position of the text on the canvas
  function setTextPosition() {
    const relativeYPositionSquare = 0.82;     // Adjust this value for square images
    const relativeYPositionRectangle = 0.75; // Adjust this value for rectangle images

    textPosition.x = canvas.width / 2 / (window.devicePixelRatio || 1);

    // Check which radio button is checked for image shape
    const selectedShape = document.querySelector('input[name="imageShape"]:checked')?.value || defaultCustomizationOptions.imageShape;

    if (selectedShape === 'square') {
      textPosition.y = canvas.height * relativeYPositionSquare / (window.devicePixelRatio || 1);
    } else if (selectedShape === 'rectangle') {
      textPosition.y = canvas.height * relativeYPositionRectangle / (window.devicePixelRatio || 1);
    }

    console.log(`Text position set to: ${textPosition.x}, ${textPosition.y}`);
  }

  // Function to update the text on the canvas
  function updateText() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    if (currentImageSrc) {
      ctx.drawImage(image, 0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1)); // Draw the image if an image source is set
    }
    ctx.font = `${fontSize}px ${fontFamily}`; // Set the font style
    ctx.fillStyle = color; // Set the text color
    ctx.textAlign = 'center'; // Center the text horizontally
    ctx.textBaseline = 'middle'; // Center the text vertically
    ctx.fillText(name, textPosition.x, textPosition.y); // Draw the text
  }

  // Event listener for the name input field
  document.getElementById('nameInput').addEventListener('input', function () {
    name = this.value;
    updateText();
  });

  // Event listeners for the text color radio buttons
  document.querySelectorAll('input[name="textColor"]').forEach((radio) => {
    radio.addEventListener('change', function () {
      color = this.value;
      updateText();
      updateTickMarks();
      setTextPosition(); // Ensure text position is set initially
    });
  });

  // Event listeners for the image selection radio buttons
  document.querySelectorAll('input[name="selectedImage"]').forEach((radio) => {
    radio.addEventListener('change', function () {
      const [imageKey, size] = this.value.split('_');
      currentImageSrc = imageSources[imageKey][size];
      loadImage(currentImageSrc); // Load the new image source
      resetCustomizationOptions(false); // Pass false to avoid resetting the color
      updateRadioSelection();
      updateTickMarks();
      document.getElementById('customizationOptions').style.display = 'block';
      hasSelectedImage = true; // Mark that an image has been selected
      updateGrayscale(); // Update grayscale filtering
    });
  });

  // Event listeners for the image shape radio buttons
  document.querySelectorAll('input[name="imageShape"]').forEach((radio) => {
    radio.addEventListener('change', function () {
      const selectedImage = document.querySelector('input[name="selectedImage"]:checked')?.value.split('_')[0] || '';
      currentImageSrc = imageSources[selectedImage][this.value];
      loadImage(currentImageSrc); // Load the new image source
      updateRadioSelection();
    });
  });

  // Function to update the radio selection and apply styles
  function updateRadioSelection() {
    document.querySelectorAll('.image-choice').forEach(label => {
      const radio = label.querySelector('input[type="radio"]');
      if (radio.checked) {
        label.style.backgroundColor = '#e8e8e8';
        label.style.borderColor = '#ddd';
        label.querySelector('.tick-mark').style.display = 'inline';
      } else {
        label.style.backgroundColor = '#fff';
        label.style.borderColor = '#ddd';
        label.querySelector('.tick-mark').style.display = 'none';
      }
    });

    // Update grayscale effect on images based on selection
    if (hasSelectedImage) {
      updateGrayscale();
    }
  }

  // Function to apply grayscale filter to unselected images
  function updateGrayscale() {
    const selectedImage = document.querySelector('input[name="selectedImage"]:checked')?.value.split('_')[0] || '';
    const imageChoices = document.querySelectorAll('.image-choice img');
    imageChoices.forEach(image => {
      image.style.filter = 'grayscale(100%)'; // Apply grayscale to all images initially
      image.closest('.image-choice').style.border = '1px solid #ddd'; // Reset border for all images initially
    });

    if (selectedImage) {
      const selectedImageElement = document.querySelector(`input[value="${selectedImage}_square"]`).closest('.image-choice').querySelector('img');
      selectedImageElement.style.filter = 'none'; // Remove grayscale filter from the selected image
      selectedImageElement.closest('.image-choice').style.border = 'none'; // Remove border from the selected image
    }
  }

  // Function to update the tick marks for the text color selection
  function updateTickMarks() {
    document.querySelectorAll('input[name="textColor"]').forEach((radio) => {
      const tickMark = radio.parentElement.querySelector('.tick-mark');
      if (radio.checked) {
        tickMark.style.display = 'block';
      } else {
        tickMark.style.display = 'none';
      }
    });
  }

  // Function to reset the customization options to default values
  function resetCustomizationOptions(resetColor = true) {
    // Reset image shape to default
    document.querySelector(`input[name="imageShape"][value="${defaultCustomizationOptions.imageShape}"]`).checked = true;

    if (resetColor) {
      document.querySelector(`input[name="textColor"][value="${defaultCustomizationOptions.textColor}"]`).checked = true;
      color = defaultCustomizationOptions.textColor;
    }

    updateRadioSelection();
    updateText();
  }

  // Function to handle the download of the customized image
  function handleDownload() {
    let tempCanvas = document.createElement('canvas');
    let tempCtx = tempCanvas.getContext('2d');

    let originalImage = new Image();
    originalImage.onload = function () {
      tempCanvas.width = this.naturalWidth;
      tempCanvas.height = this.naturalHeight;

      tempCtx.drawImage(originalImage, 0, 0, tempCanvas.width, tempCanvas.height);

      let scaleX = tempCanvas.width / canvas.width;
      let scaleY = tempCanvas.height / canvas.height;
      let adjustedFontSize = fontSize * ((scaleX + scaleY) / 2);

      tempCtx.font = `${adjustedFontSize}px ${fontFamily}`;
      tempCtx.fillStyle = color;
      tempCtx.textAlign = 'center';
      tempCtx.textBaseline = 'middle';

      let scaledX = tempCanvas.width / 2;
      let scaledY = textPosition.y * scaleY;

      tempCtx.fillText(name, scaledX, scaledY);

      let imageName;
      const [imageKey, size] = currentImageSrc.split('_');
      if (size === 'square') {
        imageName = `EidCardByMWDH-${imageKey}-Square.png`;
      } else {
        imageName = `EidCardByMWDH-${imageKey}-Rectangle.png`;
      }

      let link = document.createElement('a');
      link.href = tempCanvas.toDataURL('image/png');
      link.download = imageName;
      link.click();

      // Show the download success modal after downloading the image
      showDownloadSuccessModal();
    };
    originalImage.src = currentImageSrc;
  }

  // Function to show the download success modal
  function showDownloadSuccessModal() {
    const modal = document.getElementById('downloadSuccessModal');
    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    document.querySelector('.close-button').onclick = function () {
      modal.style.display = "none";
    };

    // Also close the modal if the user clicks anywhere outside of it
    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  }

  // Event listener for the download button
  const downloadButton = document.getElementById('downloadBtn');
  downloadButton.addEventListener('click', handleDownload);

  // Initial setup: ensure all images are in real color and no image is selected
  document.querySelectorAll('.image-choice input[type="radio"]').forEach(radio => {
    radio.checked = false; // Ensure no image is selected initially
  });
  document.querySelectorAll('.image-choice img').forEach(image => {
    image.style.filter = 'none'; // Remove grayscale filter from all images initially
  });
  document.getElementById('customizationOptions').style.display = 'none'; // Hide customization options initially
});
