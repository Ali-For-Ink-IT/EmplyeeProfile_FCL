namespace employeeprofile.db;

using { sf_api } from '../srv/external/sf_api';

entity EmpJob as projection on sf_api.EmpJob {
    key userId,
     customString4,
    customString7,
    startDate,
    company,
    division,
    endDate,
    jobCode,
    timeRecordingVariant,
    employmentType,
    emplStatus,
    customString6,
    workscheduleCode,
    holidayCalendarCode,
    managerId,
    department
}