/** @jsx React.DOM */

/*
* This is where all the graphing happens. This class receives 
* both the rows object and the graph information from it's 
* parent component. This could be split in to two componenets.
*/

var Graph = React.createClass({
	statics: {
		// used to sort [date, value] pairs
		sortPairHelper: function(a,b){
			if (a[0] === b[0]){
				return 0;
			} else {
				return (a[0] < b[0]) ? -1 : 1;
			}
		},

		// Merges values with the same date by creating
		// a hash on the date, collecting the values,
		// and either adding or averaging them based on the datatype
		// in the options hash.
		combineValuesOnDate: function (series_data, yAxisType){
			var dates_and_vals = {};

			series_data.forEach(function(date_val){
				var date = date_val[0];
				var value = date_val[1];
				if (!dates_and_vals[date]){
					dates_and_vals[date] = [];
				}
				dates_and_vals[date].push(value);
			});

			var compressed_series_data = [];

			$.each(dates_and_vals, function(date, vals_arr){
				date = parseInt(date);

				var sum = 0;
				for (var i = 0; i < vals_arr.length; i++){
					sum += vals_arr[i];
				}

				var total;

				if (yAxisType === 'percentage'){
					total = sum / (vals_arr.length) / 100;
				} else {
					total = sum;
				}
				compressed_series_data.push([date, total]);
			});
			
			compressed_series_data.sort(Graph.sortPairHelper)
			return compressed_series_data;
		},

		/*
		* This holds the defaults for the graph
		*/
		generateChartObject: function(y_axis_title, series_arr){
			return {
				chart: {
					type:'line',
					zoomType: 'xy',
					resetZoomButton: {
						position: {
							x: 0,
							y: -30
						}
					}
				},
				title: {
					text: y_axis_title,
				},
				xAxis: {
					type: 'datetime',
					text: 'Date',
					dateTimeLabelFormats: {

					}
				},
				yAxis: {
					title: {
						text: y_axis_title
					},
					plotLines: [{
						value: 0,
						width: 1,
						color: '#808080'
					}]
				},
				plotOptions: {
					series: {
						animation: false,
						marker: {
							radius: 3
						}
					}
				},
				tooltip: {
					dateTimeLabelFormats: {
					},
					formatter: function() {
	                    return  '<b>' + this.series.name +'</b><br/>' +
	                        Highcharts.dateFormat('%e - %b - %Y',
	                                              new Date(this.x))
	                    + '  <br/>' + this.y;
	                }
				},
				legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'middle',
					borderWidth: 0
				},
				series: series_arr
			}
		}, 

		groupBy: function(header, rows){
			var groups = {};

			rows.forEach(function(row){
				var header_value = row[header];

				if (!groups[header_value]) {
					groups[header_value] = [];
				}
				groups[header_value].push(row);
			});

			return groups;
		},
	},

	/*
	* 'createTimeSeriesArr' converts a list of objects
	*  to an array of [date, value] pairs that 
	*  highcharts requires. 
	*/
	createTimeSeriesArr: function(series_data){
		var options = this.props.options;
		var value = options.yAxisDataColumn;
		var date = options.dateColumn;

		return series_data.map(function(element){

				if (typeof element[value] === 'string'){
					element[value] = parseFloat(element[value]);
				}

				return [element[date], element[value]]; 
		}.bind(this));
	},


	// This takes the enabled_filters and generates the 
	// timeseries data that Highcharts needs. 
	convertFiltersToSeries: function(){
		var options = this.props.options;
		var current_graph = this.props.current_graph;

		var y_axis_header = options.yAxisIsAnInstanceOf;
		var y_axis_title = current_graph.yAxis;

		// rows is an array of all our objects
		var rows = this.props.rows;
		var series_array = [];

		var relevant_filters = current_graph.filters.filter(function(filter){
			return filter.type === 'filter';
		});

		var filtered_rows;
		relevant_filters.forEach(function(filter){
			
			filtered_rows = rows.filter(function(row){
				return row[filter.column_header] === filter.value
					   && row[y_axis_header] === y_axis_title;
			});

			var grouped_rows = Graph.groupBy(filter.column_header, filtered_rows);
			var series_objects = this.createSeriesObjects(grouped_rows);
			
			series_array = series_array.concat(series_objects);
		}.bind(this));

		return series_array;
	},

	// This takes the enabled_categories and generates the 
	// time series data needed by Highcharts.
	convertCategoriesToSeries: function() {
		var options = this.props.options;
		var current_graph = this.props.current_graph;
		if (!current_graph) return [];

		var y_axis_header = options.yAxisIsAnInstanceOf;
		var y_axis_title = current_graph.yAxis;

		// rows is an array of all our objects
		var rows = this.props.rows;
		var series_array = [];

		var relevant_filters = current_graph.filters.filter(function(filter){
			return filter.type === 'category';
		});

		var filtered_rows;
		relevant_filters.forEach(function(filter){

			filtered_rows = rows.filter(function(row){
				return row[filter.category_header] === filter.value
				       && row[y_axis_header] === y_axis_title;
			});
			
			var grouped_rows = Graph.groupBy(filter.column_header, filtered_rows);
			var series_objects = this.createSeriesObjects(grouped_rows);

			series_array = series_array.concat(series_objects);
		}.bind(this));

		return series_array;
	},

	// This takes the enabled_subfilters and generates the 
	// time series data needed by Highcharts.
	convertSubfiltersToSeries: function(){
		var options = this.props.options;
		var current_graph = this.props.current_graph;
		var enabled_subfilters = current_graph.enabled_subfilters;

		var y_axis_header = options.yAxisIsAnInstanceOf;
		var y_axis_title = current_graph.yAxis;

		var rows = this.props.rows;
		var series_array = [];

		var relevant_filters = current_graph.filters.filter(function(filter){
			return filter.type === 'subfilter';
		});

		var filtered_rows;

		relevant_filters.forEach(function(filter){

			var filtered_rows = rows.filter(function(row){
				return row[filter.subfilter_header] === filter.subfilter
					   && row[filter.column_header] === filter.value
					   && row[y_axis_header] === y_axis_title;
			});

			var grouped_rows = Graph.groupBy(filter.column_header, filtered_rows);
			var series_objects = this.createSeriesObjects(grouped_rows, filter.subfilter);
			series_array = series_array.concat(series_objects);

		}.bind(this));

		return series_array;
	},

	handleClearGraph: function(){
		this.props.handleClearGraph(this.props.current_graph);
	},

	// Creates the required series object for Highcharts.
	createSeriesObjects: function(grouped_rows_object, series_name_prefix){
		var current_graph = this.props.current_graph;
		var series_objects = [];

		$.each(grouped_rows_object, function(series_name, series_rows){
			var series_object = {};

			if (series_name_prefix){
				series_object.name = series_name_prefix + " " + series_name;
			} else {
				series_object.name = series_name;
			}
			
			var unflattened_series_data = this.createTimeSeriesArr(series_rows);
			series_object.data = Graph.combineValuesOnDate(unflattened_series_data, 
													current_graph.yAxisType); 
			
			series_objects.push(series_object);
		}.bind(this));

		return series_objects;
	},

	componentDidMount: function(){
		this.renderGraph();
	},

	renderGraph: function(){
		// extract information about our graph
		var options = this.props.options;
		var current_graph = this.props.current_graph;

		var enabled_filters = current_graph.filters;
		var enabled_categories = current_graph.enabled_categories;
		var y_axis_header = options.yAxisIsAnInstanceOf;
		var y_axis_title = current_graph.yAxis;
		var rows = this.props.rows;

		var filter_series_objects = this.convertFiltersToSeries();

		var category_series_objects = this.convertCategoriesToSeries();

		var subfilter_series_objects = this.convertSubfiltersToSeries();

		var series_object_array = filter_series_objects.concat(category_series_objects, subfilter_series_objects);

		var chartObject = Graph.generateChartObject(y_axis_title, series_object_array);

		$(this.getDOMNode()).highcharts(chartObject);

		// this is not the 'React' way to add content, 
		// but at the time I didn't want to add another component 
		// inbewteen here a graphContainer 
		this.appendClearButton();

	},

	appendClearButton: function(){
		var html = '<div class="clear-button"> x </div>';
		$(html).click(function(){
			this.handleClearGraph();
		}.bind(this))
		.appendTo(this.getDOMNode());
	},

	render: function() {
		return (
			<div className='graph'></div>
		)
	}
});