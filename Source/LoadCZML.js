var viewer = new Cesium.Viewer('cesiumContainer');
var initialPosition = new Cesium.Cartesian3.fromDegrees(11.425557, 48.764698, 3000);
//var initialPosition = new Cesium.Cartesian3.fromDegrees(-73.998114468289017509, 40.674512895646692812, 2631.082799425431);
//var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(7.1077496389876024807, -31.987223091598949054, 0.025883251314954971306);
var homeCameraView = {
    destination: initialPosition,
    orientation: {
        heading: 6, //initialOrientation.heading,
        //pitch : initialOrientation.pitch,
        //roll : initialOrientation.roll
    }
};
viewer.scene.camera.setView(homeCameraView);

// Set up clock and timeline. 2019-05-08T00:00:00/2019-05-08T00:16:43
viewer.clock.shouldAnimate = true; // default
viewer.clock.startTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:00:00Z");
viewer.clock.stopTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:20:00Z");
viewer.clock.currentTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:00:00Z");
//viewer.clock.startTime = Cesium.JulianDate.fromIso8601("2019-05-08T00:00:00Z");
//viewer.clock.stopTime = Cesium.JulianDate.fromIso8601("2019-05-08T00:16:43Z");
//viewer.clock.currentTime = Cesium.JulianDate.fromIso8601("2019-05-08T00:00:00Z");
viewer.clock.multiplier = 2; // sets a speedup
viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER; // tick computation mode
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // loop at the end
viewer.timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime); // set visible range

// Handle file upload
var inputElement = document.querySelector("#browsefile");
inputElement.addEventListener("change", handleFiles, false);

function handleFiles() {
    // Read file
    var reader = new FileReader();
    reader.onload = function (event) {
        var czml = JSON.parse(event.target.result);
        showCZML(czml);
        // Add JSON to Cesium
        // var dataSourcePromise = Cesium.CzmlDataSource.load(czml);
        // viewer.dataSources.add(dataSourcePromise);
        // viewer.zoomTo(dataSourcePromise);
    }
    reader.onerror = function (event) {
        console.log(event.target.error);
    }

    reader.readAsText(this.files[0]);
}

function showCZML(czmlFile) {
    //single vehicle case but with composite property of orientation
    //version4.0:get the time interval from CZML
    var vehicleroute = Cesium.CzmlDataSource.load(czmlFile);
    var vehicle;
    var compositeOri = new Cesium.CompositeProperty();
    vehicleroute.then(function (dataSource) {
        viewer.dataSources.add(dataSource);
        vehicle = dataSource.entities.getById('Point');
        vehicle.model = {
            uri: './Source/SampleData/Models/CesiumMilkTruck.gltf',
            minimumPixelSize: 12,
            maximumScale: 1000,
            silhouetteColor: Cesium.Color.WHITE,
        };
        var movingOri = new Cesium.VelocityOrientationProperty(vehicle.position);
        var stopOri = new Cesium
            .ConstantProperty(); //movingOri.getValue(Cesium.JulianDate.fromIso8601('2019-05-08T00:00:39Z'))
        for (let i = 0; i < vehicle.position.intervals.length; i++) {
            if (vehicle.position.intervals.get(i).data.isConstant) {
                var vehicleInterval = new Cesium.TimeInterval({
                    start: vehicle.position.intervals.get(i).start,
                    stop: vehicle.position.intervals.get(i).stop,
                    data: stopOri
                })
            } else {
                var vehicleInterval = new Cesium.TimeInterval({
                    start: vehicle.position.intervals.get(i).start,
                    stop: vehicle.position.intervals.get(i).stop,
                    data: movingOri
                })
                var lastSecondTimeSpot = new Cesium.JulianDate();
                Cesium.JulianDate.addSeconds(vehicleInterval.stop, -1, lastSecondTimeSpot);
                stopOri.setValue(movingOri.getValue(lastSecondTimeSpot));
            }
            compositeOri.intervals.addInterval(vehicleInterval);
        }
        vehicle.orientation = compositeOri;
        vehicle.position.setInterpolationOptions({
            interpolationDegree: 3,
            interpolationAlgorithm: Cesium.HermitePolynomialApproximation
        });
    }).otherwise(function (error) {
        console.log(error);
    });
}