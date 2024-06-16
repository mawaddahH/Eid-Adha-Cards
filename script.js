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
  const squareFontSize = 15;
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

  function loadImage(src) {
    image.onload = function () {
      updateCanvasSize();
      setTextPosition();
      updateText();
    };
    image.src = src;
  }

  function updateCanvasSize() {
    const devicePixelRatio = window.devicePixelRatio || 1;
    let maxWidth = window.innerWidth - 20;

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

    setTextPosition();
  }

  function setTextPosition() {
    const relativeYPositionSquare = 0.82;
    const relativeYPositionRectangle = 0.75;

    textPosition.x = canvas.width / 2 / (window.devicePixelRatio || 1);

    const selectedShape = document.querySelector('input[name="imageShape"]:checked')?.value || defaultCustomizationOptions.imageShape;

    if (selectedShape === 'square') {
      textPosition.y = canvas.height * relativeYPositionSquare / (window.devicePixelRatio || 1);
    } else if (selectedShape === 'rectangle') {
      textPosition.y = canvas.height * relativeYPositionRectangle / (window.devicePixelRatio || 1);
    }

    console.log(`Text position set to: ${textPosition.x}, ${textPosition.y}`);
  }

  function updateText() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (currentImageSrc) {
      ctx.drawImage(image, 0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
    }
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, textPosition.x, textPosition.y);
  }

  document.getElementById('nameInput').addEventListener('input', function () {
    name = this.value;
    updateText();
  });

  document.querySelectorAll('input[name="textColor"]').forEach((radio) => {
    radio.addEventListener('change', function () {
      color = this.value;
      updateText();
      updateTickMarks();
      setTextPosition();
    });
  });

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

  document.querySelectorAll('input[name="imageShape"]').forEach((radio) => {
    radio.addEventListener('change', function () {
      const selectedImage = document.querySelector('input[name="selectedImage"]:checked')?.value.split('_')[0] || '';
      currentImageSrc = imageSources[selectedImage][this.value];
      loadImage(currentImageSrc);
      updateRadioSelection();
    });
  });

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

  function resetCustomizationOptions(resetColor = true) {
    document.querySelector(`input[name="imageShape"][value="${defaultCustomizationOptions.imageShape}"]`).checked = true;

    if (resetColor) {
      document.querySelector(`input[name="textColor"][value="${defaultCustomizationOptions.textColor}"]`).checked = true;
      color = defaultCustomizationOptions.textColor;
    }

    updateRadioSelection();
    updateText();
  }
 function handleDownload() {
    let tempCanvas = document.createElement('canvas');
    let tempCtx = tempCanvas.getContext('2d');

    let originalImage = new Image();
    originalImage.onload = function () {
      tempCanvas.width = originalImage.naturalWidth;
      tempCanvas.height = originalImage.naturalHeight;

      tempCtx.drawImage(originalImage, 0, 0, tempCanvas.width, tempCanvas.height);

      let scaleX = tempCanvas.width / canvas.width;
      let scaleY = tempCanvas.height / canvas.height;

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
});
