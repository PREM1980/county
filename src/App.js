import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, } from 'react-bootstrap';
import Header from './Components/Header';
import Wrapper from './Components/Wrapper';
import _ from 'lodash';
import './App.css';

let county_data = 'https://data.montgomerycountymd.gov/api/views/kdqy-4wzv/rows.json?accessType=DOWNLOAD'

var filters = []

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      raw_data: [],
      employee_data: null,
      column_names: [],
      page_num: 1,
      gender_chart_options: null,
      gender_chart_data: null,
      department_chart_options: null,
      department_chart_data: null,
      filters: []
    }
    this.drilldown_common = this.drilldown_common.bind(this)
    // this.populate_drilldown_gender_data = this.populate_drilldown_gender_data(this)
    this.populate_drilldown_gender_data = this.populate_chart_drilldown_gender_data.bind(this)
  }

  componentDidMount = () => {
    this.fetchData();
  }

  fetchData = async () => {
    fetch(county_data).then(response => response.json()).
      then(response => {
        // console.log(response.data)          
        let column_names = _.map(response.meta.view.columns, 'name')

        const data_map = response.data.map(data => {
          return {
            id: data[0],
            'full_name': data[8],
            'gender': data[9],
            'current_annual_salary': data[10],
            '2018_gross_pay_received': data[11],
            '2018_overtime_pay': data[12],
            'department': data[13],
            'department_name': data[14],
            'division': data[15],
            'assignment_category': data[16],
            'employee_position_title': data[17],
            'position_under_filled': data[18],
            'date_first_hired': data[19]
          }
        })
        let grouped_data_by_chunks = _.chunk(data_map, data_map.length / 100)
        this.setState({
          data_map: data_map,
          employee_data: grouped_data_by_chunks[0],
          column_names: column_names
        }, () => {
          this.populate_gender_chart()
          // this.populate_department_name_chart();
        })        
      })
  }

  drilldown_common(e, filter){
    console.log('filter - ', filter)
    console.log('e - ', e)
    const filter_by_value = e.point.name === 'Female' ? 'F': 'M'                                                            
    let key_present = _.filter(filters, {'gender': filter_by_value})
    if (key_present.length == 0) {
      let filter_obj = {}
      filter_obj['gender'] = filter_by_value;
      filters.push(filter_obj)
    }
    console.log('filters - ', filters)
    let series = this.populate_chart_drilldown_gender_data(e);
    e.target.addSeriesAsDrilldown(e.point, series[0]);                 
    
    console.log('department_chart_options - ', this.department_chart_options)
    // this.department_chart_options.addSeriesAsDrilldown(e.point, series[0])
  }

    // series = this.populate_drilldown_gender_data(e);            
    // console.log('department_chart_options - ', this.department_chart_options)
    // this.department_chart_options.addSeriesAsDrilldown(e.point, series[0])


    // const setfilterstate = this.setfilterstate;
    // const department_chart_options = this.state.department_chart_options;
    // const populate_drilldown_gender_data = this.populate_chart_drilldown_gender_data;    
    // const populate_drilldown_department_data = this.populate_chart_drilldown_department_data;    

  populate_gender_chart = () => {

    const filter_data = this.filter_data;    
    var options = {
      chart: {
        type: "pie",        
        events:{                  
          drilldown: this.drilldown_common('gender')
        }
      },
      title: {
        text: 'By Gender'
      },
      series: [          
        {
          name: 'Gender',
          data: []
        }
      ],      
      plotOptions: {
        series: {
            cursor: 'pointer',
            point: {}
        },        
        },    
      drilldown: {
         series: []
        }        
      }         
      
      let data = this.filter_data('gender')
      data = this.chart_format_gender_data(data);
      options.series[0].data = data;

      this.setState({
        'gender_chart_options': options
      }, ()=>{
        console.log('gender_chart options -', this.state.gender_chart_options); 
      })
      
    }    

    populate_chart_drilldown_gender_data = (e) => {                  
      let data = this.filter_data('gender');      
      console.log('prem aaa - ', data)
      data = this.chart_format_gender_data(data)
      return _.map(data,function(val){
        return {name: val.name,
              data: [[e.point.name, val.y]]
        }
      })      
    }

    populate_chart_drilldown_department_data = (e) => {
      let data = this.filter_data('department_name');
      data = this.chart_format_department_data(data)
      return _.map(data,function(val){
        return {name: val.name,
              data: [[e.point.name, val.y]]
        }
      })          
    }

    populate_department_name_chart = () => {
      const filter_data = this.filter_data;
      const setfilterstate = this.setfilterstate;
      const populate_drilldown_gender_data = this.populate_chart_drilldown_gender_data;    
      const populate_drilldown_department_data = this.populate_chart_drilldown_department_data;    
      var options = {
        chart: {
          type: "pie",        
          events:{          
            drilldown: this.drilldown_common('department_name')
            // function(e){                        
            //   console.log('department drilldown')              
            //   var filter_by_value = e.point.name
            //   let key_present = _.filter(filters, {'department_name': filter_by_value})
            //   if (key_present.length == 0) {
            //     let filter = {}
            //     filter['department_name'] = filter_by_value;
            //     filters.push(filter)
            //   }
            //   let series = populate_drilldown_department_data(e);
            //   this.addSeriesAsDrilldown(e.point, series[0]);                          
            // },            
          },
        },
        title: {
          text: 'By Department'
        },
        series: [          
          {
            name: 'Department',
            data: []
          }
        ],      
        plotOptions: {
          series: {
              cursor: 'pointer',
              point: {}
          },        
          },    
        drilldown: {
           series: []
          }        
        }        
        let data = this.filter_data('department_name')
        data = this.chart_format_department_data(data);
        options.series[0].data = data;
        this.setState({
          department_chart_options: options
        }, ()=>{
          console.log('prem department state -', this.state)
        })                
      }  

  filter_data = (filter) => {    
    var data = this.state.data_map;
    // var filters = this.state.filters;
    console.log('before filter_data - ', data)
    console.log('filter - ', filter)    
    console.log('filters - ', filters)    
    console.log('filters.length - ', filters.length)    
    if (filters.length > 0) {
      let combined = _.assign.apply(_, filters)
      console.log('combined - ', combined)
      data = _.filter(data, combined)
    }
    
    data = _.map(data, filter)            
    
    console.log('after filter_data - ', data)
    return data
    }
    
  chart_format_gender_data = (data) => {
    data = _.values(_.groupBy(data)).map(d => ({
      'y': d.length,
      'name': d[0] === 'F' ? 'Female' : 'Male',
      'id': d[0] === 'F' ? 'F' : 'M',
      'drilldown': d[0] === 'F' ? 'Female': 'Male',    
    }));     
    return data;
  }

  chart_format_department_data = (data) => {
    data = _.values(_.groupBy(data)).map(d => ({
      'y': d.length,
      'name': d[0], 
      'id': d[0], 
      'drilldown': d[0] 
    }))  
    return data;
  }
      
    // if (this.state.filters.length > 0) {
    //   var data_map = this.state.data_map;
    //   var filters = {}
    //   filters[filter_by] = filter_by_value;
    //   data_map = _.filter(raw_data, filters)
    //   let grouped_data_by_chunks = _.chunk(data_map, data_map.length / 100)
    //   this.setState({
    //     'employee_data': grouped_data_by_chunks[0]
    //   })
    // }    
  
  
  set_employee_data = (filter_by, filter_by_value) => {
    if (typeof filter_by_value !== "undefined") {
      var raw_data = this.state.raw_data;
      var filters = {}
      filters[filter_by] = filter_by_value;

      this.setState({
        'group_by_gender_data': _.filter(raw_data, filters)
      })
    }
  }

  render() {
    console.log('render state.gender_chart  - ', this.state.gender_chart_options)
    return (
      <div className="App">
        <Container fluid={true}>
          <Header />
          <Wrapper data={this.state.employee_data}
            gender_chart={this.state.gender_chart_options}
            department_chart={this.state.department_chart_options}
          ></Wrapper>
        </Container>
      </div>
    );
  }
}

export default App;
