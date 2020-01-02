import React from 'react';
import DataTable from './DataTable/DataTable';

export default function(props){    
    return(                    
        <DataTable employee_data={props.data}/>            
    )
}