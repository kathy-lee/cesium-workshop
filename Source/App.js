(function () {
    "use strict";
    var viewer = new Cesium.Viewer('cesiumContainer', {
        shouldAnimate: true
    });


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


    /*
    // single vehicle case without composite property
    var vehicleroute = Cesium.CzmlDataSource.load('./Source/SampleData/CZMLfromSUMO_singleVeh.czml');
    //var vehicleroute = Cesium.CzmlDataSource.load('./Source/SampleData/CZMLfromSUMO_date3.czml');  //CZML file without intervals
    var vehicle;
    vehicleroute.then(function (dataSource) {
        viewer.dataSources.add(dataSource);
        vehicle = dataSource.entities.getById('Point');
        vehicle.model = {
            uri: './Source/SampleData/Models/CesiumMilkTruck.gltf',
            minimumPixelSize: 12,
            maximumScale: 1000,
            silhouetteColor: Cesium.Color.WHITE,
        };
        vehicle.orientation = new Cesium.VelocityOrientationProperty(vehicle.position);

        vehicle.position.setInterpolationOptions({
            interpolationDegree : 3,
            interpolationAlgorithm : Cesium.HermitePolynomialApproximation
        });
    });
    */


    //single vehicle case but with composite property of orientation
    var vehicleroute = Cesium.CzmlDataSource.load('./Source/SampleData/CZMLfromSUMO_singleVeh.czml');
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
        var position = Cesium.Cartesian3.fromDegrees(11.429103, 48.762381, 10);
        var heading = Cesium.Math.toRadians(90);
        var pitch = 0;
        var roll = 0;
        var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        // var stopOri = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
        // var stopOri = new Cesium.ConstantPositionProperty();
        var stopOri = undefined;
        compositeOri.intervals.addInterval(Cesium.TimeInterval.fromIso8601({
            iso8601 : '2019-05-08T00:00:00Z/2019-05-08T00:00:39Z',
            data : movingOri
        }));
        compositeOri.intervals.addInterval(Cesium.TimeInterval.fromIso8601({
            iso8601 : '2019-05-08T00:00:40Z/2019-05-08T00:01:25Z',
            data : stopOri
        }));
        compositeOri.intervals.addInterval(Cesium.TimeInterval.fromIso8601({
            iso8601 : '2019-05-08T00:01:26Z/2019-05-08T00:01:40Z',
            data : movingOri
        }));
        vehicle.orientation = compositeOri;

        vehicle.position.setInterpolationOptions({
            interpolationDegree : 3,
            interpolationAlgorithm : Cesium.HermitePolynomialApproximation
        });
    });


    /*
    // two vehicle case
    var vehicleroute = Cesium.CzmlDataSource.load('./Source/SampleData/CZMLfromSUMO_twovehicles.czml');
    var vehicle;
    var vehicle_second;
    vehicleroute.then(function (dataSource) {
        viewer.dataSources.add(dataSource);
        vehicle = dataSource.entities.getById('Point');
        vehicle.model = {
            uri: './Source/SampleData/Models/CesiumMilkTruck.gltf',
            minimumPixelSize: 12,
            maximumScale: 1000,
            silhouetteColor: Cesium.Color.WHITE,
        };
        vehicle.orientation = new Cesium.VelocityOrientationProperty(vehicle.position);

        vehicle.position.setInterpolationOptions({
            interpolationDegree : 3,
            interpolationAlgorithm : Cesium.HermitePolynomialApproximation
        });

        vehicle_second = dataSource.entities.getById('SecondVehicle');
        vehicle_second.model = {
            uri: './Source/SampleData/Models/CesiumMilkTruck.gltf',
            minimumPixelSize: 12,
            maximumScale: 1000,
            silhouetteColor: Cesium.Color.WHITE,
        };
        vehicle_second.orientation = new Cesium.VelocityOrientationProperty(vehicle_second.position);

        vehicle_second.position.setInterpolationOptions({
            interpolationDegree : 3,
            interpolationAlgorithm : Cesium.HermitePolynomialApproximation
        });
    });
    */


    /*
    // multiple vehicles case
    var vehicleroute = Cesium.CzmlDataSource.load('./Source/SampleData/CZMLfromSUMO_multiVeh_model.czml');
    var var_dataSource;
    vehicleroute.then(function (dataSource) {
        viewer.dataSources.add(dataSource);
        var_dataSource = dataSource;
        var entities = var_dataSource.entities.values;
        for(let i=0;i<entities.length;i++){
            let entity = entities[i];
            entity.orientation = new Cesium.VelocityOrientationProperty(entity.position);
            entity.position.setInterpolationOptions({
                interpolationDegree:3,
                interpolationAlgorithm: Cesium.HermitePolynomialApproximation
            });
        }
    });
    */

}());