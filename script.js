document.addEventListener('DOMContentLoaded', (event) => {
  const canvas = document.getElementById('imageCanvas');
  const ctx = canvas.getContext('2d');

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

  let currentImageSrc = '';
  let name = 'اكتب اسمك';
  let fontSize;
  const squareFontSize =16;
  const rectangleFontSize = 10;
  const fontFamily = 'EidFont';
  let color = document.querySelector('input[name="textColor"]:checked').value;
  let textPosition = { x: 0, y: 0 };
  let hasSelectedImage = false;

  const image = new Image();

  const defaultCustomizationOptions = {
    imageShape: 'square',
    textColor: '#9A682C'
  };

  // Set canvas dimensions to a constant 350x350 pixels
  function setCanvasSize() {
    const size = 350;
    canvas.width = size;
    canvas.height = size;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
  }

  // Function to load an image and draw it to fit within the canvas
  function loadImage(src) {
    image.onload = function () {
      drawImageToFitCanvas();
      setTextPosition();
      updateText();
    };
    image.src = src;
  }

  // Draw the image to fit within the canvas dimensions
  function drawImageToFitCanvas() {
    const canvasAspect = canvas.width / canvas.height;
    const imageAspect = image.naturalWidth / image.naturalHeight;

    let drawWidth, drawHeight, drawX, drawY;

    if (imageAspect > canvasAspect) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imageAspect;
      drawX = 0;
      drawY = (canvas.height - drawHeight) / 2;
    } else {
      drawHeight = canvas.height;
      drawWidth = canvas.height * imageAspect;
      drawX = (canvas.width - drawWidth) / 2;
      drawY = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  }

  // Set the position of the text on the canvas
  function setTextPosition() {
    const relativeYPositionSquare = 0.82;
    const relativeYPositionRectangle = 0.75;

    textPosition.x = canvas.width / 2;

    const selectedShape = document.querySelector('input[name="imageShape"]:checked')?.value || defaultCustomizationOptions.imageShape;

    if (selectedShape === 'square') {
      fontSize=squareFontSize;
      textPosition.y = canvas.height * relativeYPositionSquare;
    } else if (selectedShape === 'rectangle') {
      textPosition.y = canvas.height * relativeYPositionRectangle;
      fontSize=rectangleFontSize;
    }

    console.log(`Text position set to: ${textPosition.x}, ${textPosition.y}`);
  }

  // Update the text on the canvas
  function updateText() {
    drawImageToFitCanvas();
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, textPosition.x, textPosition.y);
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
      setTextPosition();
    });
  });

  // Event listeners for the image selection radio buttons
  document.querySelectorAll('input[name="selectedImage"]').forEach((radio) => {
    radio.addEventListener('change', function () {
      const [imageKey, size] = this.value.split('_');
      currentImageSrc = imageSources[imageKey][size];
      loadImage(currentImageSrc);
      resetCustomizationOptions(false);
      updateRadioSelection();
      updateTickMarks();
      document.getElementById('customizationOptions').style.display = 'block';
      hasSelectedImage = true;
      updateGrayscale();
    });
  });

  // Event listeners for the image shape radio buttons
  document.querySelectorAll('input[name="imageShape"]').forEach((radio) => {
    radio.addEventListener('change', function () {
      const selectedImage = document.querySelector('input[name="selectedImage"]:checked')?.value.split('_')[0] || '';
      currentImageSrc = imageSources[selectedImage][this.value];
      loadImage(currentImageSrc);
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

    if (hasSelectedImage) {
      updateGrayscale();
    }
  }

  // Function to apply grayscale filter to unselected images
  function updateGrayscale() {
    const selectedImage = document.querySelector('input[name="selectedImage"]:checked')?.value.split('_')[0] || '';
    const imageChoices = document.querySelectorAll('.image-choice img');
    imageChoices.forEach(image => {
      image.style.filter = 'grayscale(100%)';
      image.closest('.image-choice').style.border = '1px solid #ddd';
    });

    if (selectedImage) {
      const selectedImageElement = document.querySelector(`input[value="${selectedImage}_square"]`).closest('.image-choice').querySelector('img');
      selectedImageElement.style.filter = 'none';
      selectedImageElement.closest('.image-choice').style.border = 'none';
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
      tempCanvas.width = originalImage.naturalWidth;
      tempCanvas.height = originalImage.naturalHeight;

      tempCtx.drawImage(originalImage, 0, 0, tempCanvas.width, tempCanvas.height);

      // Scale the font size and text position based on the scale of the original image to the canvas
      let scaleX = originalImage.naturalWidth / canvas.width;
      let scaleY = originalImage.naturalHeight / canvas.height;

   // Calculate the scaling factor
    let scaleY = originalImage.naturalHeight / canvas.height;

    // Adjust the font size based on the scale factor
    let adjustedFontSize = fontSize * scaleY;
      let adjustedTextPositionX = textPosition.x * scaleX;
      let adjustedTextPositionY = textPosition.y * scaleY;

      tempCtx.font = `${adjustedFontSize}px ${fontFamily}`;
      tempCtx.fillStyle = color;
      tempCtx.textAlign = 'center';
      tempCtx.textBaseline = 'middle';

      tempCtx.fillText(name, adjustedTextPositionX, adjustedTextPositionY);

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

      showDownloadSuccessModal();
    };
    originalImage.src = currentImageSrc;
  }

  // Function to show the download success modal
  function showDownloadSuccessModal() {
    const modal = document.getElementById('downloadSuccessModal');
    modal.style.display = "block";

    document.querySelector('.close-button').onclick = function () {
      modal.style.display = "none";
    };

    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  }

  const downloadButton = document.getElementById('downloadBtn');
  downloadButton.addEventListener('click', handleDownload);

  document.querySelectorAll('.image-choice input[type="radio"]').forEach(radio => {
    radio.checked = false;
  });
  document.querySelectorAll('.image-choice img').forEach(image => {
    image.style.filter = 'none';
  });
  document.getElementById('customizationOptions').style.display = 'none';

  // Set the canvas size on page load
  setCanvasSize();
});
