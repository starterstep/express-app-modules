var ea = require('express-app');

var EventEmitter = require('events');

module.exports = function(context) {
    var TARGET_IMAGE_SIZE = 256;
    var $ = new EventEmitter();
    var view = context.view;

    view.addEventListener('click', function(e) {
        var dialog = Ti.UI.createOptionDialog({
            cancel: 2,
            options: [
                'Take Photo',
                'Choose From Library',
                'Cancel'
            ],
            title: 'Select Picture'
        });

        dialog.addEventListener('click', function(e) {
            switch(e.index) {
                case 0:
                    Ti.Media.showCamera({
                        saveToPhotoGallery: false,
                        success: onMediaSuccess,
                        cancel: function() {},
                        error: function(err) {
                            console.log('Ti.Media.showCamera error:', err)
                            alert('Unable to capture photo.');
                        }
                    });
                    break;
                case 1:
                    Ti.Media.openPhotoGallery({
                        success: onMediaSuccess
                    });
                    break;
            }
        });

        dialog.show();
    });

    function onMediaSuccess(event) {
        var image = event.media;
        var imageAdjustments = {};
        var widthGreater = false;
        var heightGreater = false;

        //Figure out values for required image adjustments
        if(image.width > image.height) {
            widthGreater = true;
            imageAdjustments.resizeWidth = Math.round((TARGET_IMAGE_SIZE * image.width)/image.height);
            imageAdjustments.resizeHeight = TARGET_IMAGE_SIZE;
            imageAdjustments.cropX = Math.round((imageAdjustments.resizeWidth - TARGET_IMAGE_SIZE)/2);
            imageAdjustments.cropY = 0;
        }
        else if(image.height > image.width) {
            heightGreater = true;
            imageAdjustments.resizeWidth = TARGET_IMAGE_SIZE;
            imageAdjustments.resizeHeight = Math.round((TARGET_IMAGE_SIZE * image.height)/image.width);
            imageAdjustments.cropX = 0;
            imageAdjustments.cropY = Math.round((imageAdjustments.resizeHeight - TARGET_IMAGE_SIZE)/2);
        }
        else {
            imageAdjustments.resizeWidth = imageAdjustments.resizeHeight = TARGET_IMAGE_SIZE;
            imageAdjustments.cropX = imageAdjustments.cropY = 0;
        }

        //Resize
        image = image.imageAsResized(imageAdjustments.resizeWidth, imageAdjustments.resizeHeight);

        //Android fix when phone flips width and height in portrait
        if ((heightGreater && image.width > image.height) || (widthGreater && image.height > image.width)) {
            var tempY = imageAdjustments.cropY;
            imageAdjustments.cropY = imageAdjustments.cropX;
            imageAdjustments.cropX = tempY;
        }

        //Crop
        image = image.imageAsCropped({
            x: imageAdjustments.cropX,
            y: imageAdjustments.cropY,
            width: TARGET_IMAGE_SIZE,
            height: TARGET_IMAGE_SIZE
        });

        console.log('!!!!image = ', image);

        //Emit the new image selected event w/ the encoded image
        $.emit('imageSelected', {
            image: image,
            imageBase64: Ti.Utils.base64encode(image).toString().replace(/\r\n/g, '')
        });

        //Set the new image on the view
        view.setImage(image);
    }

    $.loadImage = function(image) {
        view.setImage(image);
    };

    $.loadImageUri = function(imageUri) {
        if(imageUri) {
            view.setImage(/^http/.test(imageUri) ? imageUri : ea.lib.http.baseUrl + imageUri);
        }
    };

    $.loadImageBase64 = function(imageBase64) {
        view.setImage(Ti.Utils.base64decode(imageBase64));
    };

    return $;
};