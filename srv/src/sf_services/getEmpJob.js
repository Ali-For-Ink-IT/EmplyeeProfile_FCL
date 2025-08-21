const { getService } = require("../util/serviceOperation");

const getEmpJob = async (req) => {
    const sfService = await getService("sf_api");

    let query = SELECT.from('EmpJob')
        .columns(empJob => {
                empJob.userId,
                empJob.jobCode,
                empJob.division,
                empJob.startDate,
                empJob.workscheduleCode,

                empJob.employmentNav(employment => {
                    employment.personIdExternal,
                        employment.userId,

                        employment.personNav(person => {
                            person.personIdExternal,

                                person.personalInfoNav(personalInfo => {
                                    personalInfo.personIdExternal,
                                        personalInfo.firstName,
                                        personalInfo.middleName,
                                        personalInfo.lastName
                                });
                        });

                    employment.photoNav(photo => {
                        photo.mimeType;
                    });
                });

                empJob.emplStatusNav(employmentStatus => {
                employmentStatus.picklistLabels(label => {
                    label.locale,
                        label.label;
                });
                });

                empJob.departmentNav(department => {
                department.name;
                });
                empJob.locationNav(location => {
                location.name;
                });
                empJob.payGradeNav(payGrade => {
                payGrade.externalCode,

                    payGrade.nameTranslationNav(nameTranslation => {
                        nameTranslation.value_defaultValue;
                    });
                });
                empJob.companyNav(company => {
                    company.name
                });
                empJob.divisionNav(division => {
                    division.name
                });
                empJob.managerUserNav(manager => {
                    manager.displayName,
                    manager.email,
                    manager.country,
                    manager.title
                });
                empJob.workscheduleCodeNav(workSchedule => {
                    workSchedule.externalCode,
                    workSchedule.averageHoursPerDay,
                    workSchedule.averageWorkingDaysPerWeek,
                    workSchedule.externalName_defaultValue,
                    workSchedule.averageHoursPerMonth,
                    workSchedule.startingDate,
                    workSchedule.workScheduleDayModels(wsdm => {
                        wsdm.day,
                        wsdm.category
                    })
                })
        });


    const response = await sfService.tx(req).run(query)
    return response;
}

module.exports = { getEmpJob }