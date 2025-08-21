const cds = require("@sap/cds");
const {getEmpJob} = require("./src/sf_services/getEmpJob")
const {empJob} = require("./src/sf_services/empJob")

module.exports = cds.service.impl(async (srv) =>{
    srv.on("READ", "EmpJob", empJob)
    srv.on("getEmpJob", getEmpJob)
})