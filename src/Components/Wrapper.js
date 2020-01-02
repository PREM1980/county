import React from 'react';
import { Row, Col } from 'react-bootstrap';
import EmployeeList from './EmployeeList';
import Charts from './Charts';

export default function(props){
    console.log(';hhhhhhh', props)
    const {gender_chart} = props;
    return(
        <Row>        
            {/* <Col lg={2}>                  
                Test
            </Col>             */}
            {/* <Col lg={10}>                   */}
                <Row>                                        
                    <Col lg={12} >              
                        {gender_chart && <Charts gender_chart_options={gender_chart}></Charts>}
                    </Col>                
                    {/* <Col lg={4} >              
                        <Charts chart_options={props.dept_name_chart}></Charts>
                    </Col>                 */}
                    
                </Row>
                <Row>
                    <Col lg={12} style={{'overflowX': 'auto'}}>
                        <EmployeeList data={props.data}></EmployeeList>
                    </Col>            
                </Row>
            {/* </Col>                   */}
        </Row>
    )
} 
