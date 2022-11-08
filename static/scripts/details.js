/*--------------------------------------------------------------------------------- */
/* DECLARE VARIABLES HERE */
/*--------------------------------------------------------------------------------- */
let todayDate = document.getElementById('todayDate').value
var ctx = document.getElementById("piechart").getContext('2d');
var ctx2 = document.getElementById('passengerpiechart').getContext('2d');
var ctx3 = document.getElementById("boatpiechart").getContext('2d');
var barChart1 = document.getElementById('tripChartArrival').getContext('2d');
var barChart2 = document.getElementById('tripChartDeparture').getContext('2d');
var hist= document.getElementById("lineWithFilter2").getContext('2d');

// Variable for update
// Boat Count Div
var arrivalBoatCount = document.getElementById('arrivalBoatCount');
var departureBoatCount = document.getElementById('departureBoatCount');
var bountCountPercent = document.getElementById('bountCountPercent');
var passengersIn = document.getElementById('passengersIn');
var passengersOut = document.getElementById('passengersOut');
var passengersPercent = document.getElementById('passengersPercent');
var femaleIn = document.getElementById("femaleIn");
var maleIn = document.getElementById('maleIn');
var passengersInPercent = document.getElementById('passengersInPercent');



/*-----------------------------------------------------------------------------------*/
// Histogram test code

function plotHist(dataval, datalabs, divclass) {
  var dataValues = dataval;
var dataLabels = datalabs;
var myChart = new Chart(divclass, {
  type: 'bar',
  data: {
    labels: dataLabels,
    datasets: [{
      label: 'Group A',
      data: dataValues,
      backgroundColor: 'rgba(255, 99, 132, 1)',
    }]
  },
  options: {
    scales: {
      xAxes: [{
        display: false,
        barPercentage: 1.3,
        ticks: {
            max: 3,
        }
     }, {
        display: true,
        ticks: {
            autoSkip: false,
            max: 4,
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero:true
        }
      }]
    }
  }
});

}




/*------------------------------------------------------------------------------------ */
//SLIDE DOWN FUCTION
/*------------------------------------------------------------------------------------ */



/*------------------------------------------------------------------------------------*/
/* CHART FUNCTIONS
/*------------------------------------------------------------------------------------*/

function showPie(docid, data1, data2){
// Pie chart function on page load
var myChart = new Chart(docid, {
    type: 'doughnut',
    data: {
        datasets: [{    
            data: [data1, data2], // Specify the data values array
          
            borderColor: ['#2196f38c', '#f443368c'], // Add custom color border 
            backgroundColor: ['#2196f38c', '#f443368c'], // Add custom color background (Points and Fill)
            borderWidth: 0 // Specify bar border width
        }]},         
    options: {
        layout :{
            margin: {
                left:0
            },
            padding:{
                left:-10
            }
        },
        
    cutoutPercentage: 84,
    responsive: true, // Instruct chart js to respond nicely.
    maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
    }
});
}

// Pie chart to autoupdate
function showPieUpdate(docid, data1, data2, divname){
  if (data1 === null){
    data1 = 0
  }
  if (data2 === null){
    data2 = 0
  }
  if (divname == 'boatcount') {
    var checkBoatIn = document.getElementById('arrivalBoatCount');
    var checkBoatOut = document.getElementById('departureBoatCount');
    if (checkBoatOut.textContent == data1 && checkBoatIn.textContent == data2){

    }
    else {
      var myChart = new Chart(docid, {
        type: 'doughnut',
        data: {
            datasets: [{    
                data: [data1, data2], // Specify the data values array
              
                borderColor: ['#2196f38c', '#f443368c'], // Add custom color border 
                backgroundColor: ['#2196f38c', '#f443368c'], // Add custom color background (Points and Fill)
                borderWidth: 0 // Specify bar border width
            }]},         
        options: {
            layout :{
                margin: {
                    left:0
                },
                padding:{
                    left:-10
                }
            },
            
        cutoutPercentage: 84,
        responsive: true, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
        }
    });

    }
  } else if (divname == 'passengercount'){
    var checkPassengerIn = document.getElementById('passengersIn');
    var checkPassengerOut = document.getElementById('passengersOut');
    if (checkPassengerOut.textContent == data1 && checkPassengerIn.textContent == data2){

    }
    else {
      var myChart = new Chart(docid, {
        type: 'doughnut',
        data: {
            datasets: [{    
                data: [data1, data2], // Specify the data values array
              
                borderColor: ['#2196f38c', '#f443368c'], // Add custom color border 
                backgroundColor: ['#2196f38c', '#f443368c'], // Add custom color background (Points and Fill)
                borderWidth: 0 // Specify bar border width
            }]},         
        options: {
            layout :{
                margin: {
                    left:0
                },
                padding:{
                    left:-10
                }
            },
            
        cutoutPercentage: 84,
        responsive: true, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
        }
    });

    }

  } else if(divname == 'gendercount') {
    var checkPassengerIn = document.getElementById('femaleIn');
    var checkPassengerOut = document.getElementById('maleIn');
    if (checkPassengerOut.textContent == data2 && checkPassengerIn.textContent == data1){

    }
    else {
      var myChart = new Chart(docid, {
        type: 'doughnut',
        data: {
            datasets: [{    
                data: [data1, data2], // Specify the data values array
              
                borderColor: ['#2196f38c', '#f443368c'], // Add custom color border 
                backgroundColor: ['#2196f38c', '#f443368c'], // Add custom color background (Points and Fill)
                borderWidth: 0 // Specify bar border width
            }]},         
        options: {
            layout :{
                margin: {
                    left:0
                },
                padding:{
                    left:-10
                }
            },
            
        cutoutPercentage: 84,
        responsive: true, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
        }
    });

    }

  }

}




function showLineChart(docid){
    const showLine = new Chart(docid, {
        type: 'line',
        data: [],
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Chart.js Line Chart'
            }
          }
        },
      })

}

/*------------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------------*/
// 3D SURFACE PLOT HERE
/*------------------------------------------------------------------------------------------------------------*/
 
// Turn this to function





// 3D SURFACE PLOT ENDS
/*------------------------------------------------------------------------------------------------------------*/


/*------------------------------------------------------------------------------------------------------------*/
// HORIZONTAL BAR CHART HERE
/*------------------------------------------------------------------------------------------------------------*/
function plotBar(chartdata, chartlabels, div, colorcode, bordercode){
  var testdata = {
    labels: chartlabels,
    datasets: [
      
    {
      label: '',
      "yAxisID": "A",
      "backgroundColor": colorcode,
      "borderColor": bordercode,
      "data": chartdata
    }]
  };
  
    var options = {scales:{
    yAxes:
    [
    {id: 'A',
    position: 'left',
  display:true,
  gridLines:{color:"rgba(53,81,103,.4)"}
  },],
  xAxes: 
  [{ 
    barPercentage: 0.4,
    display:true,
    id:"1",
    position: 'bottom',
  
    ticks:{
      fontColor: 'rgb(0, 0, 0)'},
    fontSize:500,
    beginAtZero: true
  }],
  }};
new Chart(div, {type: "horizontalBar",data:testdata, options:options});
}
//END OF BAR CHART HERE
/*------------------------------------------------------------------------------------------------------------*/

//lebl = ['Lel1', 'Label2', 'Label3', 'Label4', 'Label5', 'Label6', 'Label7','label8', "label9", 'label10']
//plotBar([100,40,30,70,60, 10, 70, 20, 30, 20], lebl, barChart1)
//plotBar([100,40,30,70,60, 10, 70, 20, 30, 20], lebl, barChart2)



  
// ASYNC function to reload the passenger count div
/***
 * 

setInterval(() => {
  var newDate = todayDate = document.getElementById('todayDate').value
  fetch('http://shadie77.pythonanywhere.com/api/ridership/passenger_data?jetty_id='+pk+"&arrival_departure_date="+ newDate)
  .then(response => response.json()).then(data =>{
    showPieUpdate(ctx2,data.totalPassengerOut, data.totalPassengerIn, 'passengercount'),
    showPieUpdate(ctx,data.totalFemaleIn, data.totalMaleIn, 'gendercount'),
    passengersIn.textContent = data.totalPassengerIn,
    passengersOut.textContent = data.totalPassengerOut,
    passengerpercent = data.totalPassengerIn/(data.totalPassengerIn + data.totalPassengerOut)* 100,
    passengersPercent.textContent = passengerpercent.toFixed(1)+'%',
    maleIn.textContent = data.totalMaleIn,
    femaleIn.textContent = data.totalFemaleIn,
    passengersInPercent.textContent = (data.totalMaleIn/(data.totalMaleIn+ data.totalFemaleIn)*100).toFixed(1)+"%"

  })}, 2000);
   */

  /*---------------------------------------------------------------------------------------
  TEST FOR COMBINING TWO LABELS
  --------------------------------------------------------------------------------------------------*/
var testctx = document.getElementById('lineWithFilter');
/*---
var myChart = new Chart(testctx, {
    type: 'line',
    data: {
      labels: [10,11,13,15,18,19,20,21,22],
        datasets: [{
            label: 'In',
            fill: false,
            data: [1, 5, 10, 15, 5, 7, 10],
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            labels: [10,11,13,15,20,21,22]
        }, {
            label: 'Out',
            fill:false,
            data: [5,1,17,15,2,0,12],
            backgroundColor: 'rgb(25, 234, 45)',
            borderColor: 'rgb(25, 234, 45)',
            labels: [10,13,15,18,19,20,21]
        },]
    },
    options: {
      scales: {
        x: {
            type: 'time',
            time: {
                unit: 'month'
            }
        }
    },
      responsive: true,
      plugins: {
        legend: {
          position: 'left',
        },
        title: {
          display: true,
          text: 'Chart.js Line Chart'
        }
      }
    },
    tooltips: {
      intersect: true,
      callbacks: {
          label: function(tooltipItem, data) {
              const dataset = data.datasets[tooltipItem.datasetIndex];
              const index = tooltipItem.index;
              return dataset.labels[index] + ': $' + dataset.data[index];
          }
      }
  }
    }
);
*/


/*--------------------------------------------------------------------------------------------------
TIMESERIES LINECHART
-----------------------------------------------------------------------------------------------------------*/

/*-----------------------------------------------------------------------------------------
FUNCTION TO PROCESS API REQUEST INTO LIST OF DATA
------------------------------------------------------------------------------------------*/
function processDataset(jsondata){
  var apidata = []
  jsondata.forEach(element => {
    xtime = element.arrival_departure_date + " " + element.arrival_departure_time.split('.')[0]
    apidata.push({x: moment(xtime, "YYYY-MM-DD HH:mm:ss"), y: element.number_of_passengers})
  });
  return apidata
}
/*-----------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------------------
FUNCTION TO GET BOTH DATA IN CHARTJS DATASET FORMAT
------------------------------------------------------------------------------------------------------------------*/
function formatDataset(firstData, secondData, data1Label, data2Label){
  let dataSet = {
    labels: secondData,
  
    datasets: [
      {
        type: "line",
        label: data1Label,
        borderColor: "#ff0000",
        data: firstData
      },
  
      {
        type: "line",
        label: data2Label,
        borderColor: "#00ff00",
        data: secondData
      }
    ]
  };
  return dataSet
}

/*--------------------------------------------------------------------------------------------------------------------------*/

/*----------------------------------------------------------------------------------------------------------------------------
FUNCTION TO GET DATA FROM API AND PARSE TO CORRECT FORMAT USING THE FUNCTIONS ABOVE
------------------------------------------------------------------------------------------------------------------------------*/
    
async function fetchData(url){
  let response = await fetch(url);
  let data = await response.json()
  return data;
}

async function main() {
  // Load the passenger line chart on load
  rawdata1 = await fetchData("http://shadie77.pythonanywhere.com/api/ridership?jetty_id="+pk+"&arrival_departure=Arrival&arrival_departure_date="+todayDate);
  rawdata2 = await fetchData("http://shadie77.pythonanywhere.com/api/ridership?jetty_id="+pk+"&arrival_departure=Departure&arrival_departure_date="+todayDate);
  data1 = processDataset(rawdata1)
  data2 = processDataset(rawdata2)
  preppedDataset = formatDataset(data1, data2, 'Arrival', 'Departure')
  showLineChart2(testctx, preppedDataset)

  // Load the trip bar charts
  tripArrivalDataArrival = await fetchData('http://shadie77.pythonanywhere.com/api/ridership/trip_data?jetty_id='+pk+'&arrival_departure=Arrival&arrival_departure_date='+todayDate)
  tripArrivalDataDeparture = await fetchData('http://shadie77.pythonanywhere.com/api/ridership/trip_data?jetty_id='+pk+'&arrival_departure=Departure&arrival_departure_date='+todayDate)
  if (tripArrivalDataArrival.total.length<10){
    plotBar(tripArrivalDataArrival.total, tripArrivalDataArrival.labels, barChart1, "rgba(244, 67, 54, 0.549)", "rgba(244, 67, 54, 0.549)")
  } else {
    plotBar(tripArrivalDataArrival.total.slice(0,10), tripArrivalDataArrival.labels.slice(0,10), barChart1, "rgba(244, 67, 54, 0.549)", "rgba(244, 67, 54, 0.549)")
  }
  if (tripArrivalDataDeparture.total.length <10) {
    plotBar(tripArrivalDataDeparture.total, tripArrivalDataDeparture.labels, barChart2, "rgba(33, 150, 243, 0.549)", "rgba(33, 150, 243, 0.549)")
  } else{
    plotBar(tripArrivalDataDeparture.total.slice(0,10), tripArrivalDataDeparture.labels.slice(0,10), barChart2, "rgba(33, 150, 243, 0.549)", "rgba(33, 150, 243, 0.549)")
  }

  // Load histogram chart
  boatrawdata = await fetchData("http://shadie77.pythonanywhere.com/api/ridership/boat_data?jetty_id="+pk+"&arrival_departure_date="+todayDate)
  showPieUpdate(ctx3,boatrawdata.totalBoatOut, boatrawdata.totalBoatIn, 'boatcount')
  plotHist(boatrawdata.timehourcount, boatrawdata.timehourlabel, hist)

  // Load Bathymetry data plotly
  // Get the API call
  bathyData = await fetchData("http://shadie77.pythonanywhere.com/api/bathymetry/bathy_depth?jetty_id=38")
  var bathymetry_data = [{
    x: bathyData.x,
    y: bathyData.y,
   z: bathyData.z,
   type: 'surface'
}];

var bathymetry_layout = {
autosize: true,
width: 1000,
height: 300,
margin: {
l: 0,
r: 0,
b: 0,
t: 0,
},
scene: {
aspectmode: "manual",
aspectratio: {
x: 1.2, y: 1.9, z: 1.5,
},
}
};
if (bathyData.x.length == 0){
  canvass = document.getElementById('batthyy')
  canvass. innerHTML = "No data to Display"
} else{
  Plotly.newPlot('batthyy', bathymetry_data, bathymetry_layout,{displayModeBar: false, responsive: true});


}
  
}
main()

function showLineChart2(testctx, dataSets){
  
new Chart(testctx, {
  type: "bar",
  data: dataSets,
  options: {
    responsive: true,
    maintainAspectRatio: false,

    tooltips: {
      mode: "x",
      intersect: false
    },

    scales: {
      xAxes: [
        {
          type: "time",
          distribution: "linear"
        }
      ]
    }
  }
});
}


testctx2 = document.getElementById("lineWithFilter2")


/*----------------------------------------------------------------------------------------------------------------------------
ASYNCHRONOUS AJAX REQUESTS TO UPDATE THE PAGE
-------------------------------------------------------------------------------------------------------------------------------*/
// Async function to reload boat information every 2seconds
setInterval(async () => {
  if (document.getElementById('singleDate').checked) {
    var newDate = document.getElementById('todayDate').value
    var checktimeRange = document.getElementById('appt').value
    var checktimeRange2 = document.getElementById('appt2').value
    if (checktimeRange =="" || checktimeRange2 == "") {
      fetchurl = "http://shadie77.pythonanywhere.com/api/ridership/boat_data?jetty_id="+pk+"&arrival_departure_date="+ newDate
      fetchurl2 = "http://shadie77.pythonanywhere.com/api/ridership/passenger_data?jetty_id="+pk+"&arrival_departure_date="+ newDate
      linecharturl1 = "http://shadie77.pythonanywhere.com/api/ridership?jetty_id="+pk+"&arrival_departure=Arrival&arrival_departure_date="+newDate
      linecharturl2 = "http://shadie77.pythonanywhere.com/api/ridership?jetty_id="+pk+"&arrival_departure=Departure&arrival_departure_date="+newDate
      barcharturl1 = 'http://shadie77.pythonanywhere.com/api/ridership/trip_data?jetty_id='+pk+'&arrival_departure=Arrival&arrival_departure_date='+newDate
      barcharturl2 = 'http://shadie77.pythonanywhere.com/api/ridership/trip_data?jetty_id='+pk+'&arrival_departure=Departure&arrival_departure_date='+newDate
    } else {
      fetchurl= "http://shadie77.pythonanywhere.com/api/ridership/boat_data?jetty_id="+pk+"&arrival_departure_date="+ newDate +"&arrival_departure_time__gte="+checktimeRange+"&arrival_departure_time__lte="+checktimeRange2
      fetchurl2 = "http://shadie77.pythonanywhere.com/api/ridership/passenger_data?jetty_id="+pk+"&arrival_departure_date="+ newDate+"&arrival_departure_time__gte="+checktimeRange+"&arrival_departure_time__lte="+checktimeRange2
      linecharturl1 = "http://shadie77.pythonanywhere.com/api/ridership?jetty_id="+pk+"&arrival_departure=Arrival&arrival_departure_date="+newDate+"&arrival_departure_time__gte="+checktimeRange+"&arrival_departure_time__lte="+checktimeRange2
      linecharturl2 = "http://shadie77.pythonanywhere.com/api/ridership?jetty_id="+pk+"&arrival_departure=Departure&arrival_departure_date="+newDate+"&arrival_departure_time__gte="+checktimeRange+"&arrival_departure_time__lte="+checktimeRange2
      barcharturl1 = 'http://shadie77.pythonanywhere.com/api/ridership/trip_data?jetty_id='+pk+'&arrival_departure=Arrival&arrival_departure_date='+newDate+"&arrival_departure_time__gte="+checktimeRange+"&arrival_departure_time__lte="+checktimeRange2
      barcharturl2 = 'http://shadie77.pythonanywhere.com/api/ridership/trip_data?jetty_id='+pk+'&arrival_departure=Departure&arrival_departure_date='+newDate+"&arrival_departure_time__gte="+checktimeRange+"&arrival_departure_time__lte="+checktimeRange2
    }
  } else {
    var newDate1 = document.getElementById("dateRange1").value
    var newDate2 = document.getElementById('dateRange2').value
    var checktimeRange = document.getElementById('appt').value
    var checktimeRange2 = document.getElementById('appt2').value
    if (checktimeRange =="" || checktimeRange2 == "") {
      fetchurl = "http://shadie77.pythonanywhere.com/api/ridership/boat_data?jetty_id="+pk+"&arrival_departure_date__gte="+newDate1+"&arrival_departure_date__lte="+newDate2
      fetchurl2 = "http://shadie77.pythonanywhere.com/api/ridership/passenger_data?jetty_id="+pk+"&arrival_departure_date__gte="+newDate1+"&arrival_departure_date__lte="+newDate2
    } else {
      fetchurl= "http://shadie77.pythonanywhere.com/api/ridership/boat_data?jetty_id="+pk+"&arrival_departure_date__gte="+newDate1+"&arrival_departure_date__lte="+newDate2+"&arrival_departure_time__gte="+checktimeRange+"&arrival_departure_time__lte="+checktimeRange2
      fetchurl2= "http://shadie77.pythonanywhere.com/api/ridership/passenger_data?jetty_id="+pk+"&arrival_departure_date__gte="+newDate1+"&arrival_departure_date__lte="+newDate2+"&arrival_departure_time__gte="+checktimeRange+"&arrival_departure_time__lte="+checktimeRange2
    }
  }
  
  // Update  the boat pie chart
  fetch(fetchurl)
  .then(response => response.json()).then(data =>{
    showPieUpdate(ctx3,data.totalBoatOut, data.totalBoatIn, 'boatcount'),
    arrivalBoatCount.textContent = data.totalBoatIn,
    departureBoatCount.textContent = data.totalBoatOut,
    boatpercent = data.totalBoatIn/(data.totalBoatIn + data.totalBoatOut)* 100,
    bountCountPercent.textContent = boatpercent.toFixed(1)+'%'
    if (JSON.stringify(data.timehourcount)== JSON.stringify(boatrawdata.timehourcount) && JSON.stringify(data.timehourlabel)== JSON.stringify(boatrawdata.timehourlabel)){

    } else {
      document.getElementById("lineWithFilter2").remove(); // Remove the canvas element
      var canvaVariable = document.createElement("canvas");
      canvaVariable.id = "lineWithFilter2";
      document.getElementsByClassName("chartWithFilter")[1].append(canvaVariable);
      histcanvas = document.getElementById('lineWithFilter2').getContext('2d');
      plotHist(data.timehourcount, data.timehourlabel, histcanvas)
      boatrawdata = data
    }
  })

  // Update the passenger pie chart
  fetch(fetchurl2)
  .then(response => response.json()).then(data =>{
    showPieUpdate(ctx2,data.totalPassengerOut, data.totalPassengerIn, 'passengercount'),
    showPieUpdate(ctx,data.totalFemaleIn, data.totalMaleIn, 'gendercount'),
    passengersIn.textContent = data.totalPassengerIn,
    passengersOut.textContent = data.totalPassengerOut,
    passengerpercent = data.totalPassengerIn/(data.totalPassengerIn + data.totalPassengerOut)* 100,
    passengersPercent.textContent = passengerpercent.toFixed(1)+'%',
    maleIn.textContent = data.totalMaleIn,
    femaleIn.textContent = data.totalFemaleIn,
    passengersInPercent.textContent = (data.totalMaleIn/(data.totalMaleIn+ data.totalFemaleIn)*100).toFixed(1)+"%"

  })

   // Update the line chart
   datareturn1 = await fetchData(linecharturl1);
   datareturn2 = await fetchData(linecharturl2);
   datacheck1 = processDataset(datareturn1)
   datacheck2 = processDataset(datareturn2)
   if (JSON.stringify(datacheck1) == JSON.stringify(data1) && JSON.stringify(datacheck2) == JSON.stringify(data2))  {
   } else {
     preppedDataset2 = formatDataset(datacheck1, datacheck2, 'Arrival', 'Departure')
     document.getElementById("lineWithFilter").remove(); // Remove the canvas element
    var canvasVariable = document.createElement("canvas");
    canvasVariable.id = "lineWithFilter";
    document.getElementsByClassName("chartWithFilter")[0].append(canvasVariable);
    canvas = document.getElementById('lineWithFilter');
     showLineChart2(canvas, preppedDataset2)
     data1 = datacheck1
     data2 = datacheck2
 }

  // Update the trip bar chart

  barreturn1 = await fetchData(barcharturl1);
  barreturn2 = await fetchData(barcharturl2);
  if (JSON.stringify(tripArrivalDataArrival.total)== JSON.stringify(barreturn1.total) && JSON.stringify(tripArrivalDataArrival.labels) == JSON.stringify(barreturn1.labels)){

  } else{
    document.getElementById("tripChartArrival").remove(); // Remove the canvas element
    var canvasVariable = document.createElement("canvas");
    canvasVariable.id = "tripChartArrival";
    document.getElementsByClassName("barChartDiv")[0].append(canvasVariable);
    barcanvas = document.getElementById('tripChartArrival');
    if (barreturn1.total.length<10){
      plotBar(barreturn1.total, barreturn1.labels, barcanvas, "rgba(244, 67, 54, 0.549)", "rgba(244, 67, 54, 0.549)")
    } else {
      plotBar(barreturn1.total.slice(0,10), barreturn1.labels.slice(0,10), barcanvas, "rgba(244, 67, 54, 0.549)", "rgba(244, 67, 54, 0.549)")
    }
    tripArrivalDataArrival = barreturn1
        }
    if (JSON.stringify(tripArrivalDataDeparture.total) == JSON.stringify(barreturn2.total) && JSON.stringify(tripArrivalDataDeparture.labels) == JSON.stringify(barreturn2.labels)) {

    } else {
      document.getElementById("tripChartDeparture").remove(); // Remove the canvas element
    var canvasVariable = document.createElement("canvas");
    canvasVariable.id = "tripChartDeparture";
    document.getElementsByClassName("barChartDiv2")[0].append(canvasVariable);
    barcanvas2 = document.getElementById('tripChartDeparture');
      if (barreturn2.total.length <10) {
        plotBar(barreturn2.total, barreturn2.labels, barcanvas2, "rgba(33, 150, 243, 0.549)", "rgba(33, 150, 243, 0.549)")
      } else{
        plotBar(barreturn2.total.slice(0,10), barreturn2.labels.slice(0,10), barcanvas2, "rgba(33, 150, 243, 0.549)", "rgba(33, 150, 243, 0.549)")
      }
      tripArrivalDataDeparture = barreturn2

    }

  //Update histogram


 }, 2000);