import React from 'react';
import { Table } from 'react-bootstrap';

export default function(props) {
    return (            
        <Table striped bordered hover size="sm">
        <thead>
          <tr>       
            <th>Full Name</th>
            <th>Gender</th>
            <th>Current Annual Salary</th>
            <th>2018 Gross Pay Received</th>
            <th>2018 Overtime Pay</th>
            <th>Department</th>
            <th>Department Name</th>
            <th>Division</th>
            <th>Assignment Category</th>
            <th>Employee Position Title</th>
            <th>Position Under-filled</th>
            <th>Date First Hired</th>
          </tr>
        </thead>  
        <tbody>
          {props.employee_data.map((employee, index)=>{
            return (<tr>
              <td>{employee['full_name']}</td>
              <td>{employee['gender']}</td>
              <td>{employee['current_annual_salary']}</td>
              <td>{employee['2018_gross_pay_received']}</td>
              <td>{employee['2018_overtime_pay']}</td>
              <td>{employee['department']}</td>
              <td>{employee['department_name']}</td>
              <td>{employee['division']}</td>
              <td>{employee['assignment_category']}</td>
              <td>{employee['employee_position_title']}</td>
              <td>{employee['position_under_filled']}</td>
              <td>{employee['date_first_hired']}</td>              
              </tr>)
          }
          )}
        </tbody>
      </Table>
    )
  }
