/** @jsx React.DOM */

// Component Hierarchy

// GraphDashContainer
//   GraphCreatorContainer
//     ButtonGroup
//       CategoryButton
//       FilterButton
//         SubfilterButton
//   GraphContainer
//	   GraphPlaceholder
//     Graph
//     ErrorMsg

// Notes/ TODO s:
// Make options hash unneccessary, have more default actions
// when given a dataset

// Entry point for the coding challenge! 
// CSV simulates an API endpoint, and 
// we need to format the dates as UTC


$('#mobile-dataset').click(function(){

	$.get('mobile-dataset.csv', function(response){

		var parsed_data = Papa.parse(response, {
			header: true,
			dynamicTyping: true
		});

		var rows = parsed_data.data.map(function(el){
			var strDate = el['Date'];
			var dateParts = strDate.split('/');
			var date = Date.UTC("20" + dateParts[2], dateParts[0] - 1, dateParts[1]);
			el['Date'] = date;
			return el;
		});

		// This is the options hash that gives 
		// graphdash information about the dataset/
		// which 'should' let us create more interesting
		// and relevant graphs. Also some of this 
		// information is necessary and I should
		// throw errors when it's not available

		var options = {
			filterSettings:{
				'App': { // This will allow apps to be grouped by category and playform,
						 // and also let us filter the individual 
						 // category 'App' by iOS and Android values in 'Platform'
					addGroupingButtonsOn:['Category', 'Platform'],
					addSubfiltersOn: {
						'Platform': ['iOS', 'Android']
					}
				},	
				'Category':{
					// addGroupingButtonsOn: ['App'], // Just for demonstration purposes,
												  // this doesn't reveal any useful graphs
				}
			},
			
			types: { 
				'Downloads': 'number', // this can also be a percentage, which will be averaged instead
				'Daily Revenue': 'number' 
			},

			yAxisIsAnInstanceOf:'Metric',
			yAxisDataColumn:'Value', // these two options prevent the columns
			dateColumn:'Date'		 // 'Value' and 'Date' from becoming 
			                         // buttons on the graph creator 
		}

		React.renderComponent(<GraphDashboard rows={rows} 
											  options={options}
								/>, document.body);
	}.bind(this));

});

$('#gdp-dataset').click(function(){

	$.get('gdp-dataset.csv', function(response){

		var parsed_data = Papa.parse(response, {
			header: true,
			dynamicTyping: true
		});

		var rows = parsed_data.data.map(function(el){
			var strDate = el['Date'];
			var dateParts = strDate.split('/');
			var date = Date.UTC("20" + dateParts[2], dateParts[0] - 1, dateParts[1]);
			el['Date'] = date;
			return el;
		});

		var options = {
			types: { 
				'GDP(billions)': 'number'
			},
			yAxisIsAnInstanceOf:'Measurement', 
			yAxisDataColumn:'Value', 
			dateColumn:'Date'
		}

		React.renderComponent(<GraphDashboard rows={rows} 
											  options={options}
								/>, document.body);
	
	}.bind(this));
});

$(document).ready(function(){
	

});
