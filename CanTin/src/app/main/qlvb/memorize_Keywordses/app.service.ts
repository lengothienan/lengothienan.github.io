import { Injectable } from '@angular/core';

export class Employee {
    ID: number;
    Head_ID: number;
    Full_Name: string;
    Prefix: string;
    Title: number;
    City: number;   
    State: number;
   

    Hire_Date: string;
}

var employees: Employee[] = [{
    "ID": 1,
    "Head_ID": 0,
    "Full_Name": "Lãnh đạo đơn vị",
    "Prefix": "Mr.",
    "Title":0 ,
    "City":0 ,
    "State": 1,
    "Hire_Date": "1995-01-15"
}, {
    "ID": 2,
    "Head_ID": 1,
    "Full_Name": "Lãnh đạo 1",
    "Prefix": "Dr.",
    "Title": 0,
    "City": 0,
    "State": 1,
    "Hire_Date": "2004-05-24"
}, {
    "ID": 3,
    "Head_ID": 1,
    "Full_Name": "Lãnh đạo 2",
    "Prefix": "Mr.",
    "Title": 0,
    "City": 0,
    "State": 1,
    "Hire_Date": "2007-12-18"
   
},{
    "ID": 4,
    "Head_ID": 0,
    "Full_Name": "Phòng A",
    "Prefix": "Mr.",
    "Title": 0,
    "City": 0,
    "State": 0,
    "Hire_Date": "1995-01-15"
}, {
    "ID": 5,
    "Head_ID": 4,
    "Full_Name": "Nhân viên 1",
    "Prefix": "Dr.",
    "Title": 1,
    "City": 0,
    "State": 1,
    "Hire_Date": "2004-05-24"
}, {
    "ID": 6,
    "Head_ID": 4,
    "Full_Name": "Nhân viên 2",
    "Prefix": "Mr.",
    "Title": 0,
    "City": 1,
    "State": 0,
    "Hire_Date": "2007-12-18"
   
}];
    

@Injectable()
export class Service {
    getEmployees(): Employee[] {
        return employees;
    }
}
