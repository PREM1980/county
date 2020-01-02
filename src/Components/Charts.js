import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Highcharts from 'highcharts/highstock';
// import HighchartsReact from 'highcharts-react-official';
import drilldow from "highcharts/modules/drilldown";
import PieChart from 'highcharts-react-official';
drilldow(Highcharts);

const options1 = {
  chart: {
    type: 'pie',
    events: {
      drilldown: function (e) {
        console.log('yooo drilldown')
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

export default function (props) {
  return (
    <Row>
      <Col>
        <PieChart highcharts={Highcharts} options={props.gender_chart_options} />
        {/* <PieChart highcharts={Highcharts} options={options1} /> */}

        {/* <PieChart highcharts={Highcharts} options={options} /> */}
      </Col>
    </Row>
  )
} 
