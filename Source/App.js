(function () {
    "use strict";
    var viewer = new Cesium.Viewer('cesiumContainer', {
        shouldAnimate : true
    });


    viewer.dataSources.add(Cesium.CzmlDataSource.load('C:/Projects/GPXtoCZML_demo/CZMLfromSUMO_date.czml'));

    viewer.scene.camera.setView({
        destination:  Cesium.Cartesian3.fromDegrees(11.425557,48.764698, 3000),
        orientation: {
            heading: 6
        }
    });

}());