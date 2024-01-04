// Levar McKnight
// Module 14 Challenge

// FUNCTION TO POPULATE THE META DATA
function demoInfo(sample)
{
    // use d3.json to get the data
    d3.json("samples.json").then((data) => {
        // grab all of the metadata
        let metaData = data.metadata;

        // filter based on the value of the sample (should return 1 result in an array
        //based on the dataset)
        let result = metaData.filter(sampleResult => sampleResult.id == sample);

        // access index 0 from the array
        let resultData = result[0];

        // clear the metadata HTML so demo info will not keep appending when selecting ID numbers
        d3.select("#sample-metadata").html("");

        // use Object.entries to get the value key pairs
        Object.entries(resultData).forEach(([key, value]) =>{
            // add to the sample data / demographics section
            d3.select("#sample-metadata")
                .append("h5").text(`${key}: ${value}`);
        });
    });
}

// FUNCTION TO BUILD THE BAR CHART
function buildBarChart(sample)
{
    d3.json("samples.json").then((data) => {
        // grab all of the samples
        let sampleData = data.samples;
        
        // filter based on the value of the sample (should return 1 result in an array
        //based on the dataset)
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
        
        // access index 0 from the array
        let resultData = result[0];

        // get the otu_ids, labels, and sample values
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;

        // build the bar chart
        let yTicks = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        let xValues = sample_values.slice(0, 10);
        let textLabels = otu_labels.slice(0, 10);

        let barChart = {
            y: yTicks.reverse(),
            x: xValues.reverse(),
            text: textLabels.reverse(),
            type: "bar",
            orientation: "h"
        }
        
        let layout = {
            title: "Top 10 Belly Button Bacteria"
        };

        Plotly.newPlot("bar", [barChart], layout);
    });
}

// FUNCTION TO BUILD THE BUBBLE CHART
function buildBubbleChart(sample)
{
    d3.json("samples.json").then((data) => {
        // grab all of the samples
        let sampleData = data.samples;
        
        // filter based on the value of the sample (should return 1 result in an array
        //based on the dataset)
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
        
        // access index 0 from the array
        let resultData = result[0];

        // get the otu_ids, labels, and sample values
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;

        // build the bubble chart  
        let bubbleChart = {
            y: sample_values,
            x: otu_ids,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }
        
        let layout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"}
        };

        Plotly.newPlot("bubble", [bubbleChart], layout);
    });   
}

// FUNCTION TO INILIALIZE THE DASHBOARD
function initialize()
{
    // access the dropdown selector from the index.html file
    var select = d3.select("#selDataset");

    // use d3.json to get the data
    d3.json("samples.json").then((data) => {
        let sampleNames = data.names; // an array of the names

        //use a foreach to create options for each sample in the selector
        sampleNames.forEach((sample) => {
            select.append("option")
                .text(sample)
                .property("value", sample);           
        });
        // when initialized, pass in the information for the first sample
        let sample1 = sampleNames[0];

        // call the function to build the metadata
        demoInfo(sample1);
        // call the function to build the bar chart
        buildBarChart(sample1);
        // call the function to build the bubble chart
        buildBubbleChart(sample1);
    });   
}

// FUNCTION TO UPDATE THE DASHBOARD
function optionChanged(item)
{
    // call the update to the metadata
    demoInfo(item);
    // call the function to build the bar chart
    buildBarChart(item);
    // call the function to build bubble chart
    buildBubbleChart(item);
}

// CALL THE INITIALIZE FUNCTION
initialize();