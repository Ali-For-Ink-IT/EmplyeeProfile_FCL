const { getService } = require("../util/serviceOperation");

const empJob = async(req) => {
    const sfService = await getService("sf_api");
    const response = await sfService.tx(req).run(req.query)
    
    return response;
}

module.exports = {empJob}