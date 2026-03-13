const config = {
  cloudName: 'djdop2uca',
  uploadPreset: 'upload_nlw'
}

var myWidget = cloudinary.createUploadWidget(
  config,
  (error, result) => {
    if (!error && result && result.event === "success") {
      console.log('Done! Here is the image info: ', result.info);
    }
  }
)

document.getElementById("upload_widget").addEventListener("click", function () {
  myWidget.open();
}, false);