import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, } from 'react-bootstrap';
import Header from './Components/Header';
import Wrapper from './Components/Wrapper';
import _ from 'lodash';
import './App.css';

let county_data = 'https://data.montgomerycountymd.gov/api/views/kdqy-4wzv/rows.json?accessType=DOWNLOAD'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      raw_data: [],
      employee_data: [],
      column_names: [],
      page_num: 1,
      gender_chart: null,
      dept_name_chart: {}
    }
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
          raw_data: data_map,
          employee_data: grouped_data_by_chunks[0],
          column_names: column_names
        }, () => this.populate_gender_chart(data_map))
        
        // this.populate_department_name_chart(data_map);
      })
  }

  populate_gender_chart = (data) => {
    console.log('drilldown this.filter_data -', this.filter_data)

    const options1 = {
      chart: {
        type: 'pie',
        events: {
          drilldown: function (e) {
            console.log('drilldown')
          }
        }
      },
      title: {
        text: 'Async drilldown'
      },
      xAxis: {
        type: 'category'
      },

      legend: {
        enabled: false
      },

      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true
          }
        }
      },

      series: [{
        name: 'Things',
        colorByPoint: true,
        data: [{
          name: 'Animals',
          y: 5,
          drilldown: true
        }, {
          name: 'Fruits',
          y: 2,
          drilldown: true
        }, {
          name: 'Cars',
          y: 4,
          drilldown: true
        }]
      }],

      // drilldown: {
      //   series: []
      // }
    }

    // options.series[0].data = this.filter_data('gender', data)
    this.setState({
      gender_chart: options1
    })
  }


  filter_data = (filter_by, data, filter_by_value) => {
    console.log('filter_data filter_by - ', filter_by)
    var result;
    if (filter_by === 'gender') {
      console.log('inside gender')
      data = _.map(data, 'gender')

      if (typeof filter_by_value !== "undefined") {
        data = _.filter(data, function (val) {
          return val === filter_by_value;
        })
      }

      result = _.values(_.groupBy(data)).map(d => ({
        'y': d.length,
        'name': d[0] === 'F' ? 'Female' : 'Male',
        'id': d[0] === 'F' ? 'F' : 'M',
        // 'drilldown': d[0] === 'F' ? 'Female': 'Male',
        'drilldown': true
      }));
    }

    if (typeof filter_by_value !== "undefined") {
      var raw_data = this.state.raw_data;
      var filters = {}
      filters[filter_by] = filter_by_value;
      var data_map = _.filter(raw_data, filters)
      let grouped_data_by_chunks = _.chunk(data_map, data_map.length / 100)
      this.setState({
        'employee_data': grouped_data_by_chunks[0]
      })

    }
    console.log('prem result - ', result)
    return result;
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

  render() {
    console.log('render state.gender_chart  - ', this.state.gender_chart)
    return (
      <div className="App">
        <Container fluid={true}>
          <Header />
          <Wrapper data={this.state.employee_data}
            gender_chart={this.state.gender_chart}
          ></Wrapper>
        </Container>
      </div>
    );
  }
}

export default App;
