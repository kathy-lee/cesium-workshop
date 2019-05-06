(function () {
    "use strict";
    var viewer = new Cesium.Viewer('cesiumContainer', {
        shouldAnimate : true
    });


    viewer.dataSources.add(Cesium.CzmlDataSource.load('./Source/SampleData/Vehicle.czml'));

    viewer.scene.camera.setView({
        destination:  Cesium.Cartesian3.fromDegrees(-116.52, 35.02, 95000),
        orientation: {
            heading: 6
        }
    });

}());