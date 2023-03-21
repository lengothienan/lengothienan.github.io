import { Injectable } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';


export class Task {
	Task_ID: number;
	Task_Parent_ID: number;
	Task_Assigned_Employee_ID: number;
	Task_Completion: number;
	Task_Priority: number;
	Task_Status: string;
	Task_Subject: string;
	Task_Start_Date: string;
	Task_Due_Date: string;
	Task_Assigned_Employee?: Employee;
}

export class Employee {
    Picture=  AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';
	ID: number;
	Name: string;
    // Picture: string;
    
}

export class Priority {
	id: number;
	value: string;
}

let tasks: Task[] = [{
    "Task_ID": 1,
    "Task_Assigned_Employee_ID": 1,
    "Task_Subject": "Nguyễn Mạnh Hùng",
    "Task_Start_Date": "2015-01-01T00:00:00",
    "Task_Due_Date": "2015-04-01T00:00:00",
    "Task_Status": "Chuyển giám đốc",
    "Task_Priority": 4,
    "Task_Completion": 100,
    "Task_Parent_ID": 0
}, 
 
{
    "Task_ID": 2,
    "Task_Assigned_Employee_ID": 2,
    "Task_Subject": "Phan Trung Hiếu",
    "Task_Start_Date": "2015-01-15T00:00:00",
    "Task_Due_Date": "2015-01-31T00:00:00",
    "Task_Status": "Chuyển phòng ban và phó GĐ",
    "Task_Priority": 4,
    "Task_Completion": 100,
    "Task_Parent_ID": 1
},  {
    "Task_ID": 3,
    "Task_Assigned_Employee_ID": 4,
    "Task_Subject": "Nguyễn Tú Linh",
    "Task_Start_Date": "2015-02-16T00:00:00",
    "Task_Due_Date": "2015-02-28T00:00:00",
    "Task_Status": "tiếp nhận , trình lãnh đạo phòng",
    "Task_Priority": 4,
    "Task_Completion": 100,
    "Task_Parent_ID": 2
},   {
    "Task_ID": 4,
    "Task_Assigned_Employee_ID": 5,
    "Task_Subject": "Nguyễn Thu Đăng",
    "Task_Start_Date": "2015-02-16T00:00:00",
    "Task_Due_Date": "2015-02-28T00:00:00",
    "Task_Status": "Tiếp nhận, chuyển đội phó",
    "Task_Priority": 4,
    "Task_Completion": 100,
    "Task_Parent_ID": 3
},    {
    "Task_ID": 5,
    "Task_Assigned_Employee_ID": 6,
    "Task_Subject": "Nguyễn Lê Phương",
    "Task_Start_Date": "2015-02-16T00:00:00",
    "Task_Due_Date": "2015-02-28T00:00:00",
    "Task_Status": "Tiếp nhận, chuyển cho đội",
    "Task_Priority": 4,
    "Task_Completion": 100,
    "Task_Parent_ID": 4
},   {
    "Task_ID": 6,
    "Task_Assigned_Employee_ID": 7,
    "Task_Subject": "Nguyễn Tiến Nam",
    "Task_Start_Date": "2015-02-16T00:00:00",
    "Task_Due_Date": "2015-02-28T00:00:00",
    "Task_Status": "Tiếp nhận, chuyển  đội phó",
    "Task_Priority": 4,
    "Task_Completion": 100,
    "Task_Parent_ID": 5
},    {
    "Task_ID": 7,
    "Task_Assigned_Employee_ID": 9,
    "Task_Subject": "Nguyễn Tiến Nam",
    "Task_Start_Date": "2015-02-16T00:00:00",
    "Task_Due_Date": "2015-02-28T00:00:00",
    "Task_Status": "Tiếp nhận, chuyển  tổ",
    "Task_Priority": 4,
    "Task_Completion": 100,
    "Task_Parent_ID": 6
},
{
    "Task_ID": 8,
    "Task_Assigned_Employee_ID": 8,
    "Task_Subject": "Nguyễn Xuân Phúc",
    "Task_Start_Date": "2015-02-16T00:00:00",
    "Task_Due_Date": "2015-02-28T00:00:00",
    "Task_Status": "Tiếp nhận, chuyển cán bộ",
    "Task_Priority": 4,
    "Task_Completion": 100,
    "Task_Parent_ID": 7
}, {
    "Task_ID": 9,
    "Task_Assigned_Employee_ID": 12,
    "Task_Subject": "Nguyễn Xuân Linh",
    "Task_Start_Date": "2015-02-16T00:00:00",
    "Task_Due_Date": "2015-02-28T00:00:00",
    "Task_Status": "Lưu văn bản",
    "Task_Priority": 4,
    "Task_Completion": 100,
    "Task_Parent_ID": 8
},];

let employees: Employee[] = [{
    "ID": 1,
    "Name": "Văn thư",
    "Picture": "assets/common/images/default-profile-picture.png"
}, {
    "ID": 2,
    "Name": "Giám đốc",
    "Picture": "assets/common/images/default-profile-picture.png"
}, {
    "ID": 3,
    "Name": "Phó giám đốc",
    "Picture": "assets/common/images/default-profile-picture.png"
}, {
    "ID": 4,
    "Name": "Văn thư phòng",
    "Picture": "assets/common/images/default-profile-picture.png"
}, {
    "ID": 5,
    "Name": "Trưởng phòng",
    "Picture": "assets/common/images/default-profile-picture.png"
}, {
    "ID": 6,
    "Name": "Phó phòng",
    "Picture": "assets/common/images/default-profile-picture.png"
}, { 
    "ID": 7,
    "Name": "Đội trưởng",
    "Picture": "assets/common/images/default-profile-picture.png"
}, {
    "ID": 8,
    "Name": "Đội phó",
    "Picture": "assets/common/images/default-profile-picture.png"
}, {
    "ID": 9,
    "Name": "Tổ trưởng",
    "Picture": "assets/common/images/default-profile-picture.png"
}, {
    "ID": 10,
    "Name": "Tổ phó",
    "Picture": "assets/common/images/default-profile-picture.png"
}, {
    "ID": 11,
    "Name": "Tổ trưởng",
    "Picture": "assets/common/images/default-profile-picture.png"
}, {
    "ID": 12,
    "Name": "Cán bộ",
    "Picture": "assets/common/images/default-profile-picture.png"
},  ];

let priorities: Priority[] = [
	{ id: 1, value: "Low" },
	{ id: 2, value: "Normal" },
	{ id: 3, value: "Urgent" },
	{ id: 4, value: "High" }
];

@Injectable()
export class Service {
	getTasks(): Task[] {
		return tasks.map(function (task: Task) {
			employees.forEach(function (employee: Employee) {
				if (task.Task_Assigned_Employee_ID === employee.ID) {
					task.Task_Assigned_Employee = employee;
				}
			});

			return task;
		});
	}

	getEmployees(): Employee[] {
		return employees;
	}

	getPriorities(): Priority[] {
		return priorities;
	}
}
