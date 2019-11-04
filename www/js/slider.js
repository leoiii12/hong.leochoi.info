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

function imageSlider() {
    var $scope;
    var $imagePaths = [];
    var $opacity = 0;
    var $timer = setInterval(function () {
        if ($opacity < 1)
            $opacity += 0.02;
        if ($scope.stage)
            $scope.stage.style.opacity = $opacity;
        if ($scope.elaspedTime == "next")
            $scope.next();
        if ($scope.elaspedTime == "previous")
            $scope.previous();
        if ($scope.elaspedTime >= 3000)
            $scope.next();
        $scope.elaspedTime += 10;
    }, 10);
    var $nextNumber = function () {
        var nextNumber = $scope.currentPage + 1;
        if (nextNumber >= $imagePaths.length)
            nextNumber = 0;
        return nextNumber;
    };
    var $previousNumber = function () {
        var previousNumber = $scope.currentPage - 1;
        if (previousNumber < 0)
            previousNumber = $imagePaths.length - 1;
        return previousNumber;
    };
    return {
        width: 0,
        maxHeight: 0,
        container: null,
        stage: null,
        currentPage: 0,
        elaspedTime: 0,
        initialise: function (targetElementId) {
            $scope = this;
            $scope.container = createElementWithId("div", "slider-container");
            $scope.container.onclick = function (event) {
                if ((event.clientX - $scope.container.getBoundingClientRect().left) > ($scope.container.offsetWidth / 2))
                    $scope.elaspedTime = "next";
                else
                    $scope.elaspedTime = "previous";
            }
            document.getElementById(targetElementId).appendChild($scope.container);
            return $scope;
        },
        loadPicturesByXML: function (xmlPath) {
            var xml = loadXMLDoc(xmlPath);
            var images = xml.getElementsByTagName("image");
            for (var i = 0; i < images.length; i++)
                $imagePaths.push(images[i].getElementsByTagName("path")[0].childNodes[0].nodeValue);
        },
        next: function () {
            $scope.elaspedTime = 0;
            $scope.to($nextNumber());
        },
        previous: function () {
            $scope.elaspedTime = 0;
            $scope.to($previousNumber());
        },
        to: function (pageNumber) {
            $scope.currentPage = pageNumber;
            // Remove old stage
            if ($scope.stage)
                $scope.stage.parentNode.removeChild($scope.stage);
            // Add new stage
            $scope.stage = createElementWithId("img", "slider-view");
            $scope.stage.src = $imagePaths[$scope.currentPage];

            $scope.stage.onload = function () {
                if ($scope.stage.naturalWidth >= $scope.width) {
                    $scope.stage.style.width = $scope.width + "px";
                }
                console.log($scope.stage.naturalWidth >= $scope.width);
                $opacity = 0;
                $scope.stage.style.maxHeight = $scope.maxHeight + "px";

                $scope.container.appendChild($scope.stage);
                // Preload images
                var preload = [];
                preload[0] = new Image();
                preload[0].src = $imagePaths[$nextNumber()];
                preload[1] = new Image();
                preload[1].src = $imagePaths[$previousNumber()];
            };


        }
    }
}