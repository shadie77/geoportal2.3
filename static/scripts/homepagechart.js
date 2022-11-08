let chartCanvas = document.getElementById('summaryChartCanvas')
var verifyData
let verifyDate = document.getElementById('datePicker').value
let verifyDepartArrive = document.querySelector('input[name="dataType"]:checked').value;
let verifyJettyList = getParams()[2]
let chartObject

/**
 * 1. Function to get the parameters of the api request
 * 2. Function to do send the API request
 * 2. Function to plot the graph from the result
 * 3. Async with time to repeat the process
 */

function getParams(){
    //This function get the api parameters from the frontend
    dataDate = document.getElementById('datePicker').value
    dataNature = document.querySelector('input[name="dataType"]:checked').value;
    let jettyIdList = []
    jettyNames = []
    // Add the first dropdown value
    jettyIdList.push(document.getElementById('firstJetty').value)
    jettyNames.push(document.getElementById('firstJetty').selectedOptions[0].innerHTML)
    divSelect = document.getElementsByClassName('dropDownCheck')
    for (let index = 0; index < divSelect.length; index++) {
        const element = divSelect[index];
        if (element.style.display=='block') {
            jettyIdList.push(element.getElementsByClassName('jettySection')[0].value)
            jettyNames.push(element.getElementsByClassName('jettySection')[0].selectedOptions[0].innerHTML)
        }
    }
    return [dataDate, dataNature, jettyIdList, jettyNames]
}

//Asynchronous request to fetch data from APi endpoint

async function fetchData(url){
    let response = await fetch(url);
    let data = await response.json()
    return data;
  }
  
  async function main() {
    let dataList = []
    let jettyNameList = []
    filterdate = getParams()[0]
    departArrive = getParams()[1]
    list_of_jetties = getParams()[2]
    for (let index = 0; index < list_of_jetties.length; index++) {
        const element = getParams()[2][index];
        fetchurl = "http://127.0.0.1:8000/api/ridership?jetty_id="+element+"&arrival_departure="+departArrive +"&arrival_departure_date="+ filterdate;
        dataReturn = await fetchData(fetchurl)
        if (dataReturn.length){
            dataList.push(processDataset(dataReturn))
            jettyNameList.push(getParams()[3][index])
        } else {

        } 
    }
    if (dataList.length==0) {
        var ctx = chartCanvas.getContext("2d");
        ctx.font = "25px Arial";
        ctx.fillText("No data to Display", 20, 150)
    } else{
        preppedDataset = formatDataset2(dataList, jettyNameList, ["#ff0000", "#00ff00", "#0000ff", "#f0000f"])
        chartObject= showLineChart2(chartCanvas, preppedDataset)
    }
    verifyData = dataList
    verifyDate = filterdate
    verifyDepartArrive = departArrive
    verifyJettyList = list_of_jetties
  }
  
  main()

setInterval(async () => {
    var dataList = []
    let jettyNameList = []
    filterdate = getParams()[0]
    departArrive = getParams()[1]
    list_of_jetties = getParams()[2]
    for (let index = 0; index < list_of_jetties.length; index++) {
        const element = getParams()[2][index];
        fetchurl = "http://127.0.0.1:8000/api/ridership?jetty_id="+element+"&arrival_departure="+departArrive +"&arrival_departure_date="+ filterdate;
        dataReturn = await fetchData(fetchurl)
        if (dataReturn.length){
            dataList.push(processDataset(dataReturn))
            jettyNameList.push(getParams()[3][index])
        } else {

        } 
    }
    if (dataList.length==0) {
        document.getElementById("summaryChartCanvas").remove(); // Remove the canvas element
        var canvasVariable = document.createElement("canvas");
        canvasVariable.id = "summaryChartCanvas";
        document.getElementsByClassName("canvasContainer")[0].append(canvasVariable);
        canvas = document.getElementById('summaryChartCanvas');
        ctx = canvas.getContext('2d');
        ctx.canvas.width = 1000; // resize to parent width
        ctx.canvas.height = 1000; // resize to parent height
        ctx.font = "25px Arial";
        ctx.fillText("No data to Display", 300, 250)
        
        //Update verify data
        verifyData = dataList
        verifyDate = filterdate
        verifyDepartArrive = departArrive
        verifyJettyList = list_of_jetties
    } else{
        if (JSON.stringify(dataList) == JSON.stringify(verifyData)) {
          // Update Verify Data
          verifyData = dataList
          verifyDate = filterdate
          verifyDepartArrive = departArrive
          verifyJettyList = list_of_jetties
            
        } else {
          if (filterdate == verifyDate && departArrive == verifyDepartArrive && JSON.stringify(list_of_jetties) == JSON.stringify(verifyJettyList)) {
            //Update the chart
            console.log('Time to Update.......................................')
            for (let index = 0; index < dataList.length; index++) {
              const element = dataList[index];
              if (element.length > verifyData[index].length) {
                difference_data = element.slice(verifyData[index].length,)
                difference_data.forEach(eachValue => {
                index_number = chartObject.data.datasets[index].data.length
                chartObject.data.datasets[index].data[index_number] = eachValue;
                chartObject.update();
                });
              } else{
                // If new data is shorter than the old data or the same as the old data, do nothing
              }
              
            }
            verifyData = dataList
            verifyDate = filterdate
            verifyDepartArrive = departArrive
            verifyJettyList = list_of_jetties
          } else {
            console.log('........................................')
            console.log(dataList.length)
            console.log(verifyData.length)
            
            preppedDataset = formatDataset2(dataList, jettyNameList, ["#fa5f55", "#0096ff", "#0000ff", "#f0000f"])
            document.getElementById("summaryChartCanvas").remove(); // Remove the canvas element
            var canvasVariable = document.createElement("canvas");
            canvasVariable.id = "summaryChartCanvas";
            document.getElementsByClassName("canvasContainer")[0].append(canvasVariable);
            canvas = document.getElementById('summaryChartCanvas');
            chartObject = showLineChart2(canvas, preppedDataset)
            //Update Verify Varables
            verifyData = dataList
            verifyDate = filterdate
            verifyDepartArrive = departArrive
            verifyJettyList = list_of_jetties
          }
        }
        
    }
    

}, 2000);

/*
// Asynchronous request to fetch data from APi endpoint Plus update

async function fetchData(url){
  let response = await fetch(url);
  let data = await response.json()
  return data;
}

async function main() {
  let dataList = []
  let jettyNameList = []
  filterdate = getParams()[0]
  departArrive = getParams()[1]
  for (let index = 0; index < getParams()[2].length; index++) {
      const element = getParams()[2][index];
      fetchurl = "http://127.0.0.1:8000/api/ridership?jetty_id="+element+"&arrival_departure="+departArrive +"&arrival_departure_date="+ filterdate;
      dataReturn = await fetchData(fetchurl)
      if (dataReturn.length){
          dataList.push(processDataset(dataReturn))
          jettyNameList.push(getParams()[3][index])
      } else {

      } 
  }
  if (dataList.length==0) {
      var ctx = chartCanvas.getContext("2d");
      ctx.font = "25px Arial";
      ctx.fillText("No data to Display", 20, 150)
  } else{
      preppedDataset = formatDataset2(dataList, jettyNameList, ["#ff0000", "#00ff00", "#0000ff", "#f0000f"])
      showLineChart2(chartCanvas, preppedDataset)
  }

  verifyData = dataList
  
}

main()

setInterval(async () => {
  var dataList = []
  let jettyNameList = []
  filterdate = getParams()[0]
  departArrive = getParams()[1]
  list_of_jetties = getParams()[2]
  if (filterdate == verifyData && departArrive == verifyDepartArrive && JSON.stringify(list_of_jetties) == JSON.stringify()){
    // If data returned is different from the stored data, the update the map

  } else {
    // Plot data returned afresh


  }



  for (let index = 0; index < list_of_jetties.length; index++) {
      const element = getParams()[2][index];
      fetchurl = "http://127.0.0.1:8000/api/ridership?jetty_id="+element+"&arrival_departure="+departArrive +"&arrival_departure_date="+ filterdate;
      dataReturn = await fetchData(fetchurl)
      if (dataReturn.length){
          dataList.push(processDataset(dataReturn))
          jettyNameList.push(getParams()[3][index])
      } else {

      } 
  }
  if (dataList.length==0){
      document.getElementById("summaryChartCanvas").remove(); // Remove the canvas element
      var canvasVariable = document.createElement("canvas");
      canvasVariable.id = "summaryChartCanvas";
      document.getElementsByClassName("canvasContainer")[0].append(canvasVariable);
      canvas = document.getElementById('summaryChartCanvas');
      ctx = canvas.getContext('2d');
      ctx.canvas.width = 1000; // resize to parent width
      ctx.canvas.height = 1000; // resize to parent height
      ctx.font = "25px Arial";
      ctx.fillText("No data to Display", 300, 250)
  } else{
      if (JSON.stringify(dataList) == JSON.stringify(verifyData) ) {
          
      } else {
          console.log('........................................')
          console.log(dataList)
          preppedDataset = formatDataset2(dataList, jettyNameList, ["#fa5f55", "#0096ff", "#0000ff", "#f0000f"])
          document.getElementById("summaryChartCanvas").remove(); // Remove the canvas element
          var canvasVariable = document.createElement("canvas");
          canvasVariable.id = "summaryChartCanvas";
          document.getElementsByClassName("canvasContainer")[0].append(canvasVariable);
          canvas = document.getElementById('summaryChartCanvas');
          showLineChart2(canvas, preppedDataset)
          verifyData = dataList
      }
      
  }
  

}, 2000);
*/
  
function showLineChart2(testctx, dataSets){
    
 var myLineChart = new Chart(testctx, {
    type: "bar",
    data: dataSets,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      bezierCurve : false,

  
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
  return myLineChart
  }



/***
 * Compile the dataset 
 */
 function formatDataset2(datasetList, dataLabelList, colorList){

    let dataSet = {
      labels: datasetList[0],

      datasets: []};
      for (let index = 0; index < datasetList.length; index++) {
          if (datasetList[index].length == 0) {
              
          } else {
            let dataDict = {
                type: "line",
                label: dataLabelList[index],
                fill: false,
                lineTension: 0,
                borderColor: colorList[index],
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 2,
                pointHitRadius: 10,
                data: datasetList[index],
                
            }
            dataSet['datasets'].push(dataDict)
          }
          
          
      };
    
    return dataSet
  }


/**
 * 

setInterval (() => {
    console.log(getParams()[0]);
    console.log(getParams()[1]);

}, 2000);

 */
  
  
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
          data: firstData,
          lineTension: 0,
        },
    
        {
          type: "line",
          label: data2Label,
          borderColor: "#00ff00",
          data: secondData,
          lineTension:0,
        }
      ]
    };
    return dataSet
  }
  
  /*--------------------------------------------------------------------------------------------------------------------------*/
  
  /*----------------------------------------------------------------------------------------------------------------------------
  FUNCTION TO GET DATA FROM API AND PARSE TO CORRECT FORMAT USING THE FUNCTIONS ABOVE
  ------------------------------------------------------------------------------------------------------------------------------*/
      
  
  //showLineChart2(chartCanvas, dataSets)