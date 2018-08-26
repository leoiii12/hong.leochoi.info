"use strict";

function loadXMLDoc(filename) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", filename, false);
    xhttp.send();
    return xhttp.responseXML;
}

function createElementWithId(tagName, id) {
    var element = document.createElement(tagName);
    element.id = id;
    return element;
}

function wall() {
    var $scope;
    var $getSize = function (image) {
        var scale = 1;
        var originalSize = { height: image.naturalHeight, width: image.naturalWidth };
        if (originalSize.height > window.innerHeight)
            scale = window.innerHeight / originalSize.height * 0.9;
        if (originalSize.width * scale > window.innerWidth)
            scale = scale * window.innerWidth / originalSize.width * 0.9;
        return { height: image.naturalHeight * scale, width: image.naturalWidth * scale };
    };
    return {
        height: 0,
        container: null,
        lightboxContainer: null,
        initialise: function (targetElementId) {
            $scope = this;
            $scope.container = createElementWithId("div", "wall-container");
            $scope.lightboxContainer = createElementWithId("div", "lightbox-container");
            $scope.container.appendChild($scope.lightboxContainer);
            document.getElementById(targetElementId).appendChild($scope.container);
            return $scope;
        },
        loadPicturesByXML: function (xmlPath) {
            var xml = loadXMLDoc(xmlPath);
            var images = xml.getElementsByTagName("image");
            for (var i = 0; i < images.length; i++) {
                var imagePath = images[i].getElementsByTagName("path")[0].childNodes[0].nodeValue;
                var imagePreview = new Image();
                imagePreview.src = imagePath + "?height=" + $scope.height+"&width=" + $scope.height+"&mode=crop";
                imagePreview.setAttribute("data-src", imagePath);
                imagePreview.className = "box";
                imagePreview.onclick = function () {
                    var image = new Image();
                    image.src = this.getAttribute("data-src");
                    image.className = "lightbox";
                    image.onload = function () {
                        var size = $getSize(image);
                        image.style.height = size.height + "px";
                        image.style.width = size.width + "px";
                        $scope.lightboxContainer.appendChild(image);
                        $scope.lightboxContainer.style.display = "block";
                        image.onclick = function () {
                            this.parentElement.removeChild(this);
                            $scope.lightboxContainer.style.display = "none";
                        };
                    };
                };
                $scope.container.appendChild(imagePreview);
            }
        }
    }
}