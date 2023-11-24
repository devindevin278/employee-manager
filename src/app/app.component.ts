import { EmployeeService } from './employee.service';
import { Employee } from './employee';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'amigos-employee';

  public employees!: Employee[];
  public filteredEmployees!: Employee[];

  public activeEmployee!: Employee;


  constructor(private employeeService: EmployeeService) {
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  public getEmployees(): void {
    this.employeeService.getAllEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
        this.filteredEmployees = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public searchEmployee(key: string): void {
    const results: Employee[] = [];
    // this.getEmployees();
    for(var employee of this.employees) {
      if(employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1
      ) {
        results.push(employee);
      }
    }

    this.filteredEmployees = results;

    if(!key) {
      // this.getEmployees();
      this.filteredEmployees = this.employees;
    }
  }

  addEmployeeForm = new FormGroup({
    name: new FormControl(),
    email: new FormControl(),
    phone: new FormControl(),
    imageUrl: new FormControl(),
    jobTitle: new FormControl(),
  })

  updateEmployeeForm = new FormGroup({
    id: new FormControl(),
    name: new FormControl(),
    email: new FormControl(),
    phone: new FormControl(),
    imageUrl: new FormControl(),
    jobTitle: new FormControl(),
  })

  public addEmployee() {
    const button = document.getElementById('close-modal-add');
    button?.click();
    this.employeeService.addEmployee(this.addEmployeeForm.value as Employee).subscribe(
      data => {
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public updateEmployee() {
    const button = document.getElementById('close-modal-update');
    button?.click();

    this.employeeService.updateEmployee(this.updateEmployeeForm.value as Employee).subscribe(
      data => {
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public deleteEmployee(id: string) {
    const button = document.getElementById('close-modal-delete');
    button?.click();

    var deletedid = Number(id);

    this.employeeService.deleteEmployee(deletedid).subscribe(
      data => {
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public onOpenModalAdd(): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#addEmployeeModal');

    container?.appendChild(button);
    button.click();
  }

  public onOpenModal(employee: Employee, mode: string): void {

    this.activeEmployee = employee;

    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');

    if( mode === 'edit') {
      button.setAttribute('data-bs-target', '#editEmployeeModal');

      this.updateEmployeeForm.patchValue({
        id: this.activeEmployee?.id,
        name: this.activeEmployee?.name,
        email: this.activeEmployee?.email,
        phone: this.activeEmployee?.phone,
        imageUrl: this.activeEmployee?.imageUrl,
        jobTitle: this.activeEmployee?.jobTitle
      })

    } else if( mode === 'delete') {
      button.setAttribute('data-bs-target', '#deleteEmployeeModal');
    }

    container?.appendChild(button);
    button.click();
  }
}
