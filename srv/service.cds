using {employeeprofile.db as db} from '../db/schema';

type EmpJobType : {
  userId: String;
  customString4: String;
  customString7: String;
  startDate: Date;
  company: String;
  division: String;
  endDate: Date;
  jobCode: String;
  timeRecordingVariant: String;
  employmentType: String;
  emplStatus: String;
  customString6: String;
  workscheduleCode: String;
  holidayCalendarCode: String;
  managerId: String;
  department: String;
};

@path: 'EmployeeService'
service EmployeeService {
    entity EmpJob as projection on db.EmpJob;
    function getEmpJob() returns array of EmpJobType;

}
