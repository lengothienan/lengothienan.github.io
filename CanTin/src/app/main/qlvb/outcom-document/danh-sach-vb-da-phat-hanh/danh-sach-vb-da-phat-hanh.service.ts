import { Injectable } from '@angular/core';

  
  export class Employee {
    ID: string;
  
    FirstName: string;
  
    LastName: string;
  
    Prefix: string;
  
    Position: string;
  
    Picture: string;
  
    BirthDate: string;
  
    HireDate: string;
  
  }
  const employees: Employee[] = [{
    ID: "Nguyễn Văn A",
    FirstName: '12',
    LastName: '4',
    Prefix: '1',
    Position: '1',
    Picture: '7',
    BirthDate: '1',
    HireDate: '4',

  }, {
    ID: "Nguyễn Văn B",
    FirstName: '30',
    LastName: '2',
    Prefix: '3',
    Position: '2',
    Picture: '2',
    BirthDate: '5',
    HireDate: '3',
  }];

  @Injectable()
    export class Service {
  getEmployees() {
    return employees;
  }
}


​