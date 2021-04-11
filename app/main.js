define(["require", "exports", "tslib", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/PopupTemplate", "esri/layers/GraphicsLayer", "esri/widgets/Sketch/SketchViewModel", "esri/geometry/Geometry", "esri/Graphic"], function (require, exports, tslib_1, Map_1, MapView_1, FeatureLayer_1, PopupTemplate_1, GraphicsLayer_1, SketchViewModel_1, Geometry_1, Graphic_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Map_1 = tslib_1.__importDefault(Map_1);
    MapView_1 = tslib_1.__importDefault(MapView_1);
    FeatureLayer_1 = tslib_1.__importDefault(FeatureLayer_1);
    PopupTemplate_1 = tslib_1.__importDefault(PopupTemplate_1);
    GraphicsLayer_1 = tslib_1.__importDefault(GraphicsLayer_1);
    SketchViewModel_1 = tslib_1.__importDefault(SketchViewModel_1);
    Geometry_1 = tslib_1.__importDefault(Geometry_1);
    Graphic_1 = tslib_1.__importDefault(Graphic_1);
    initialMapView();
    let layerView, graphics, featureLayerView;
    var simpleMarker = {
        type: "simple-marker",
        style: "circle",
        color: "orange",
        size: "12px",
        outline: {
            // autocasts as new SimpleLineSymbol()
            color: [255, 255, 0],
            width: 2 // points
        }
    };
    function initialMapView() {
        let tempGraphicsLayer = new GraphicsLayer_1.default();
        let selectedGeometry = new Geometry_1.default();
        // create field list
        const operationalFields = [
            {
                name: "Station_ID",
                alias: "Station ID"
            },
            {
                name: "Station_Name",
                alias: "Station Name"
            },
            {
                name: "Current_Reading_",
                alias: "Current Reading"
            },
            {
                name: "RTP_COLOR",
                alias: "RTP_COLOR"
            },
            {
                name: "PCT_of_Mean_Ann_Disch_",
                alias: "PCT of Mean Ann Disch="
            },
            {
                name: "Return_Period",
                alias: "Return Period"
            },
            {
                name: "Updated_at",
                alias: "Updated at"
            },
            {
                name: "WSC_Real_Time_Data",
                alias: "WSC Real-Time Data"
            }
        ];
        var stationPopupTemplate = new PopupTemplate_1.default({
            title: "Streamflow Conditions at <br>{Station_Name}",
            content: "<b>Station ID:</b> {Station_ID}<br><b>Station Name:</b> {Station_Name}<br><b>Current Reading:</b>{Current_Reading_}<br><b>Return Period:</b> {Return_Period}<br><b>Current streamflow discharge as percentage of mean annual discharge </b>{PCT_of_Mean_Ann_Disch_}<br><b>PCT CL: </b>{PCT_CL}<br><b>WSC Real-Time Data: </b><a href={WSC_Real_Time_Data}>Visit Real Time Data</a>"
        });
        var queryPopupTemplate = new PopupTemplate_1.default({
            title: "Streamflow Conditions at <br>{Station_Name}",
            content: "<b>Current Reading:</b>{Current_Reading_}<br><b>Return Period:</b> {Return_Period}<br><b>Current streamflow discharge as percentage of mean annual discharge </b>{PCT_of_Mean_Ann_Disch_}<br><b>PCT CL: </b>{PCT_CL}<br><b>WSC Real-Time Data: </b><a href={WSC_Real_Time_Data}>Visit Real Time Data</a>"
        });
        //add operational layer.
        const operationalLayer = new FeatureLayer_1.default({
            url: "https://services6.arcgis.com/ubm4tcTYICKBpist/ArcGIS/rest/services/StationInformation/FeatureServer/0",
            legendEnabled: true,
            popupEnabled: true,
            fields: operationalFields,
            popupTemplate: stationPopupTemplate
        });
        //create a layer view when the operational layer is ready.
        operationalLayer
            .when(function () {
            view.whenLayerView(operationalLayer).then(function (layerView) {
                featureLayerView = layerView;
            });
        })
            .catch(errorCallback);
        //var pcl_mean_ann_dis = $feature.{PCT_of_Mean_Ann_Disch_}
        /* var basemap = new Basemap({
          baseLayers: [
            new MapImageLayer({
              url: "url to your dynamic MapServer",
              title: "Basemap"
            })
          ],
          title: "basemap",
          id: "basemap"
        }); */
        const map = new Map_1.default({
            basemap: "dark-gray",
            layers: [operationalLayer]
        });
        const view = new MapView_1.default({
            map: map,
            container: "viewDiv",
            //center: [-118.244, 34.052],
            //BC center
            center: [-123.98703341579261, 53.187256664615],
            //extent: bcExtent,
            zoom: 6
        });
        //initialSketch;
        const sketchViewModel = new SketchViewModel_1.default({
            layer: tempGraphicsLayer,
            view: view
        });
        //sketchViewModel.create("polygon", {mode: "freehand"});
        view.ui.add("select-by-polygon", "top-left");
        const selectButton = document.getElementById("select-by-polygon");
        view.graphics.removeAll();
        // click event for the button
        selectButton.addEventListener("click", function () {
            view.popup.close();
            // ready to draw a polygon
            sketchViewModel.create("polygon", { mode: "freehand" });
        });
        sketchViewModel.on("create", function (event) {
            if (event.state === "complete") {
                tempGraphicsLayer.remove(event.graphic);
                selectedGeometry = event.graphic.geometry;
                view.goTo({ target: selectedGeometry });
                highlightSelection();
            }
        });
        function highlightSelection() {
            view.graphics.removeAll();
            const intersectQuery = operationalLayer.createQuery();
            intersectQuery.geometry = selectedGeometry;
            intersectQuery.outFields = ["*"];
            intersectQuery.returnGeometry = true;
            // make a query
            operationalLayer.queryFeatures(intersectQuery)
                .then(function (response) {
                const graphics = response.features;
                if (graphics.length > 0) {
                    var i = 0;
                    for (i = 0; i < graphics.length; i++) {
                        const selectedGraphic = new Graphic_1.default({
                            geometry: graphics[i].geometry,
                            symbol: simpleMarker
                        });
                        // add the selected graphic to the view
                        // this graphic corresponds to the row that was clicked
                        view.graphics.add(selectedGraphic);
                    }
                }
            });
        }
        ;
    }
    ;
    function errorCallback() {
        console.log("error:", "");
    }
});
//# sourceMappingURL=main.js.map