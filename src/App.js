import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, } from 'react-bootstrap';
import Header from './Components/Header';
import Wrapper from './Components/Wrapper';
import Highcharts from 'highcharts/highstock';
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
    // this.drilldown_common = this.drilldown_common.bind(this)
    // this.populate_drilldown_gender_data = this.populate_drilldown_gender_data(this)
    // this.populate_drilldown_gender_data = this.populate_chart_drilldown_gender_data.bind(this)
    this.onItemClickHandler = this.onFilterClickHandler.bind(this)
  }

  componentDidMount = () => {
    this.fetchData();
  }

  fetchData = async () => {
    fetch(county_data).then(response => response.json()).
      then(response => {
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
          column_names: column_names,
          uniq_gender: _.countBy(data_map, 'gender'),
          uniq_dept_name: _.countBy(data_map, 'department_name'),
        }, () => {
          this.populate_gender_chart()
          this.populate_department_name_chart();
        })        
      })
  }

  drill_common(e, t, filter, type){
    console.log('filter - ', filter)
    console.log('e - ', e)
    console.log('this - ', t)
    let filter_by_value = null;        

    if (type == 'down'){
      if (filter == 'gender'){
        filter_by_value = e.point.name === 'Female' ? 'F': 'M'                                                            
      }else{
        filter_by_value = e.point.name 
      }    
      let key_present = _.filter(filters, {filter: filter_by_value})
      if (key_present.length == 0) {
        let filter_obj = {}
        filter_obj[filter] = filter_by_value;
        filters.push(filter_obj)
      }
      if (filter == 'gender'){
        let series = this.populate_chart_drilldown_gender_data(e);
        e.target.addSeriesAsDrilldown(e.point, series[0]);                 
      }else{
        let series = this.populate_chart_drilldown_department_data(e);
        e.target.addSeriesAsDrilldown(e.point, series[0]);                 
      }    
      console.log('department_chart_options - ', this.department_chart_options)
    }else{      
      _.omit(filters, [filter])      
    }        
    console.log('filters - ', filters)        
    let data = this.filter_data_map(filter)    
    let grouped_data_by_chunks = _.chunk(data, data.length / 100)
    this.setState({
      'employee_data': grouped_data_by_chunks[0]
    })
  }

  populate_gender_chart = () => {    
    var options = {
      chart: {
        type: "pie",        
        events:{                  
          drilldown: (e) => this.drill_common(e, this, 'gender', 'down'),
          drillup: (e) => this.drill_common(e, this, 'gender', 'up'),
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
    this.set_chart_data(options, 'gender', false)                        
    }    

    populate_chart_drilldown_gender_data = (e) => {                  
      let data = this.filter_data_map();      
      data = _.map(data, 'gender') 
      data = this.chart_format_gender_data(data)
      return _.map(data,function(val){
        return {name: val.name,
              data: [[e.point.name, val.y]]
        }
      })      
    }

    populate_chart_drilldown_department_data = (e) => {
      let data = this.filter_data_map();
      data = _.map(data, 'department_name')   
      data = this.chart_format_department_data(data)
      return _.map(data,function(val){
        return {name: val.name,
              data: [[e.point.name, val.y]]
        }
      })          
    }

    populate_department_name_chart = () => {
      var options = {
        chart: {
          type: "pie",        
          events:{          
            drilldown: (e) => this.drill_common(e, this, 'department_name', 'down'),            
            drillup: (e) => this.drill_common(e, this, 'department_name', 'up')            
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
        this.set_chart_data(options, 'department_name', false)              
      }  
  
  set_chart_data = (options, type, reset) => {
    
    let data = this.filter_data_map()
    
    data = _.map(data, type)   
    console.log('this.state.gender_chart_options - ', this.state)
    
    if (type === 'gender'){
      data = this.chart_format_gender_data(data);
    }else{
      data = this.chart_format_department_data(data);
    }
    
    if (reset){
      options = this.state.gender_chart_options;
      options = new Highcharts.Chart(options)      
      console.log('reset options - ', options.series[0])
      console.log('reset options-1 - ', Object.getOwnPropertyNames(options.series[0]))
      console.log('reset options-2 - ', Object.prototype.toString.call(options.series[0]))
      
      // options.series[0].data.length = 0
      options.series[0].setData(data);
      }
    else{
        options.series[0].data = data;
      }                
    var chart_options = type + '_chart_options';

    this.setState({
      [chart_options]: options
    }, ()=>{
      console.log('chart options -', this.state); 
    })      
  }

  set_department_chart = (options, reset) => {
    let data = this.filter_data_map()
    data = _.map(data, 'department_name')   
    data = this.chart_format_department_data(data);

    if (reset){
      options = this.state.gender_chart_options;
    }

    options.series[0].data = data;
    this.setState({
      department_chart_options: options
    }, ()=>{
      console.log('prem department state -', this.state)
    })
  }

  filter_data_map = () => {    
    var data = this.state.data_map;

    // if (filters.length > 0) {
    //   let combined = _.assign.apply(_, filters)
    //   console.log('combined - ', combined)
    //   data = _.filter(data, combined)
    // }    
    if (filters.length > 0){
    data = _.filter(data,			
      function(row){
        let found = false;
        _.forEach(filters,function(filter){
          if (_.filter([row], filter).length != 0){
              found = true;
          }}          
        )
        return found;
      })   
    }
    console.log('filter_data_map - ', data)
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
      console.log('chart_format_gender_data - ', data);
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

  onFilterClickHandler(e, filter){
    console.log('item clicked - ', e.target.value)
    console.log('item checked - ', e.target.checked)    
    if (e.target.checked){
      let filter_obj = {}
      filter_obj[filter] = e.target.value;
      filters.push(filter_obj)
    }else{
      let filter_obj = {}
      filter_obj[filter] = e.target.value;
      _.remove(filters, filter_obj)
    }
    console.log('filters - ', filters)
    this.set_chart_data(null, 'gender', true)              
    // this.set_chart_data(null, 'department_name', true)              
    // https://stackoverflow.com/questions/46805086/change-series-data-dynamically-in-react-highcharts-without-re-render-of-the-char
  }

  render() {
    console.log('render state.gender_chart  - ', this.state.gender_chart_options)
    return (
      <div className="App">
        <Container fluid={true}>
          <Header />
          <Wrapper gender_chart={this.state.gender_chart_options}
            department_chart={this.state.department_name_chart_options}
            data={this.state.employee_data}
            uniq_gender={this.state.uniq_gender}
            onFilterClickHandler={this.onItemClickHandler}
            uniq_dept_name={this.state.uniq_dept_name}
          ></Wrapper>
        </Container>
      </div>
    );
  }
}

export default App;
