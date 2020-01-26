import React from 'react';
import { Row, Col } from 'react-bootstrap';
import EmployeeList from './EmployeeList';
import Charts from './Charts';

export default function(props){
    console.log('props - ', props)
    const {data} = props;
    const {gender_chart} = props;
    const {department_chart} = props    
    const {uniq_gender} = props
    const {uniq_dept_name} = props
    const {onFilterClickHandler} = props
    // console.log('uniq_gender - ', uniq_gender)
    return(
        <Row>        
            <Col lg={2}>                  
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <h5>Gender</h5>
                {uniq_gender && Object.entries(uniq_gender).map(([key, value])=>{
                    return (
                    <div>
                        <label>
                            <input type="checkbox" value={key} onClick={(e) => onFilterClickHandler(e, 'gender')}/> 
                            <span>&nbsp;{key == 'F'? 'Female': 'Male'}   </span>
                            <span>({value})</span>
                        </label>
                    </div>
                    )
                })}
                <br></br>
                <br></br>
                <h5>Department Name</h5>
                {uniq_dept_name && Object.entries(uniq_dept_name).map(([key, value])=>{
                    return (
                    <div>
                        <label>
                            <input type="checkbox" value={key} onClick={() => onFilterClickHandler('department_name')}/> 
                            <span>&nbsp;{key}   </span>
                            <span>({value})</span>
                        </label>
                    </div>
                    )
                })}
            </Col>            
            <Col lg={10}>                  
                <Row>                                        
                    <Col lg={6} >              
                        {gender_chart && <Charts chart_options={gender_chart}></Charts>}
                    </Col>                
                    <Col lg={6} >              
                        {department_chart && <Charts chart_options={department_chart}></Charts>}
                    </Col>                                    
                </Row>
                <Row>
                    <Col lg={12} style={{'overflowX': 'auto'}}>
                        {data && <EmployeeList data={data}></EmployeeList>}
                    </Col>            
                </Row>
            </Col>                  
        </Row>
    )
} 
