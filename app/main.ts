import EsriMap from "esri/Map"
import MapView from "esri/views/MapView";
import FeatureLayer from "esri/layers/FeatureLayer";
import { Extent } from "esri/geometry";



//add operational layer.
const operationalLayer = new FeatureLayer({
  url: "https://services6.arcgis.com/ubm4tcTYICKBpist/ArcGIS/rest/services/StationInformation/FeatureServer/0",
  legendEnabled: true,
  popupEnabled: true,
  fields:[
    {
      name: "Station_ID",
      alias:"Station ID"
    },
    {
      name: "Station_Name",
      alias:"Station Name"
    },
    {
      name: "Current_Reading_",
      alias:"Current Reading"
    },
    {
      name: "RTP_COLOR",
      alias:"RTP_COLOR"
    },
    {
      name: "PCT_of_Mean_Ann_Disch_",
      alias:"PCT of Mean Ann Disch="
    },
    {
      name: "Return_Period",
      alias:"Return Period"
    },
    {
      name: "Updated_at",
      alias:"Updated at"
    },
    {
      name: "ObjectId",
      alias:"ObjectId"
    }
  ]
});


const map = new EsriMap({
  basemap: "streets-vector",
  layers: [operationalLayer]
});

var bcExtent = new Extent({
  xmin: 215623.368267935,
  ymin: -134636.43176746,
  xmax: 2192535.41443207,
  ymax: 2176649.46196746,
  spatialReference: {wkid: 102190}
})

const view = new MapView({
  map: map,
  container: "viewDiv",
  center: [-118.244, 34.052],
  extent: bcExtent,
  zoom: 12
});