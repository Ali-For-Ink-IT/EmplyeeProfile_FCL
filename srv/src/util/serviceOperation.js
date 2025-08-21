const cds = require("@sap/cds");

const getService = async (sServiceName) => {
    const oService = await cds.connect.to(sServiceName);
    return oService
}

module.exports = {getService};