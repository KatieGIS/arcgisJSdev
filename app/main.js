define(["require", "exports", "tslib", "esri/Map", "esri/views/MapView"], function (require, exports, tslib_1, Map_1, MapView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Map_1 = tslib_1.__importDefault(Map_1);
    MapView_1 = tslib_1.__importDefault(MapView_1);
    const map = new Map_1.default({
        basemap: "streets-vector"
    });
    const view = new MapView_1.default({
        map: map,
        container: "viewDiv",
        center: [-118.244, 34.052],
        zoom: 12
    });
});
//# sourceMappingURL=main.js.map