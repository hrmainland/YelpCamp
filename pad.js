if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

async function main() {
    const geoData = await geocoder.forwardGeocode({
        query: "Casa De Las Conchas, Salamanca, Spain",
        limit: 1
    }).send()
    console.log(geoData.body.features[0].geometry)
}

main();