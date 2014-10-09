/** @jsx React.DOM */

var GraphDashboard = React.createClass({

	/*
	* 'filters' is the set of enabled buttons
	* at any given point. Its keys are column Headers
	* and it's values are the enabled filter strings.
	*
	* 'current_graphs' is an array of objects filled 
	* with the information needed to create the Graph object
	*
	* 'userErrors' are the current errors on screen and 
	* are rendered in the GraphContainer
	*/
	getInitialState: function(){
		return {
			current_graphs:[],
			filters: [],
			user_errors: []
		};
	},

	componentWillMount: function(){
		this.checkOptionsValidity();
		this.checkDataValidity();
	},

	/*
	* Currently, the graph needs these options set in the options
	* hash in order to create a graph.
	*/
	checkOptionsValidity: function(){
		if (!this.props.options.yAxisIsAnInstanceOf){
			throw new Error('You must supply "yAxisIsAnInstanceOf" in the options object');
		}

		if (!this.props.options.dateColumn){
			throw new Error('You must supply "dateColumn" in the options object');
		}
	},


	// TODO: it would be cool if you passed in props and strings to
	// a function and it checked undefined for you instead of typing it out.
	checkDataValidity: function() {
		var first_row = this.props.rows[0];
		var y_axis_data_column_name = this.props.options.yAxisDataColumn;
		if (first_row === undefined){
			throw new Error('Could not find the first row of the input data. It must be formatted as an array of objects with uniform keys.')
		}
		if (first_row[y_axis_data_column_name] === undefined){
			throw new Error('Your data must contain a column named ' + this.props.options.yAxisDataColumn + ', as indicaded by the received options object.');
		}

		// TODO: make it just graph the y-axis anyway
		var y_axis_label_column_name = this.props.options.yAxisIsAnInstanceOf;
		if (first_row[y_axis_data_column_name] === undefined){
			throw new Error('Your data must contain a label column named ' + this.props.options.yAxisIsAnInstanceOf + ', as indicaded by the received options object.');
		}

		var date_column_name = this.props.options.dateColumn;
		if (first_row[date_column_name] === undefined){
			throw new Error('Your data must contain a date column named ' + this.props.options.dateColumn + ', as indicaded by the received options object. This data must be in UTC format in the current version.' );
		}

	},
	
	/*
	* This method handles a user clicking on a FilterButton component.
	* It finds the correct header in the filter object and 
	* adds/removes the given filter from the array. 
	*/
	handleFilterToggle: function(column_header, value) {
		var filters = this.state.filters;

		var new_filter = {
			type: 'filter',
			column_header: column_header,
			value: value
		};

		var found = false;
		for (var i = 0; i < filters.length; i++){
			var other_filter = filters[i];
			if (_.isEqual(new_filter, other_filter)){
				filters.splice(i, 1);
				found = true;
				break;
			}
		}
		if (!found) {
			filters.push(new_filter);
		}
		this.setState({filters: filters});
	},

	handleSubfilterToggle: function(column_header, filter_str, subheader_str, subfilter_str){
		var filters = this.state.filters;

		var new_filter = {
			type: 'subfilter',
			column_header: column_header,
			value: filter_str,
			subfilter_header: subheader_str,
			subfilter: subfilter_str
		};

		var found = false;
		for (var i = 0; i < filters.length; i++){
			var other_filter = filters[i];
			if (_.isEqual(new_filter, other_filter)){
				filters.splice(i, 1);
				found = true;
				break;
			}
		}
		
		if (!found) {
			filters.push(new_filter);
		}

		this.setState({filters: filters});
	}, 

	/*
	* This method handles a user clicking on a CategoryButton component.
	* It adds the category to our state so the Graph component
	* knows to treat it differently than just a filter button.
	*/

	handleCategoryToggle: function(header_str, category_header_str, category_str){
		var filters = this.state.filters;

		var new_filter = {
			type: 'category',
			column_header: header_str,
			category_header: category_header_str,
			value: category_str
		}

		var found = false;
		for (var i = 0; i < filters.length; i++){
			var other_filter = filters[i];
			if (_.isEqual(new_filter, other_filter)){
				filters.splice(i, 1);
				found = true;
				break;
			}
		}

		if (!found){
			filters.push(new_filter);
		}

		this.setState({filters: filters});
	},


	/* 
	* Triggered when a user clicks the Create button in the 
	* GraphCreatorContainer component. 
	* It currently only renders one y-axis,
	* so if it detects the user has selected two y-axes,
	* it splits them in to two separate graphs.
	* It creates a userError if the user hasn't 
	* selected something to use on the y-axis
	*/
	handleCreate: function() {
		var options = this.props.options;
		var filters = this.state.filters;
		var current_graphs = this.state.current_graphs;

		var y_axes = filters.filter(function(filter){
			return filter.column_header === options.yAxisIsAnInstanceOf
		}).map(function(y_axis_object){
			return y_axis_object.value;
		});

		if (!y_axes || y_axes.length === 0){
			this.handleUserError('You must choose at least one ' + options.yAxisIsAnInstanceOf + ' parameter.');
			return;
		}

		y_axes.forEach(function(y_axis){ 
			var new_filters = [];

			// don't try to use y-axis as filter

			if (filters.length !== 1){
				filters.forEach(function(filter){
					if (filter.column_header !== options.yAxisIsAnInstanceOf){
						new_filters.push(filter);
					}
				});
			} else {
				new_filters = filters;
			}


			var current_graph = {     // all the stuff we need to make a cool graph!
				yAxisDataColumn: options.yAxisDataColumn,
				xAxisDataColumn: options.dateColumn,
				yAxisIsAnInstanceOf: options.yAxisIsAnInstanceOf,
				yAxis: y_axis,
				yAxisType: options.types[y_axis],
				filters: _.cloneDeep(new_filters),
			};

			current_graphs.push(current_graph); // I wanted to use unshift here so that 
		});									  // new graphs would show up at the top of the list.
											  // TODO urgency: low
		this.setState({current_graphs: current_graphs});
	},

	// If a user messes up, push the error_msg string in to
	// our state and let React do the rendering.
	handleUserError: function(error_msg){ 
		var errors = this.state.user_errors;
		errors.push(error_msg);
		this.setState({user_errors: errors});
	},

	handleConfigurationError: function(error_msg){
		throw new Error(error_msg);
	},

	handleClear: function(){
		this.setState({current_graphs: []});
		this.setState({user_errors: []});
	},

	// deletes an individual graph from our state
	handleClearGraph: function(graph_info){
		var current_graphs = this.state.current_graphs;

		var index = -1;

		current_graphs.forEach(function(curr_graph, i){
			if (_.isEqual(curr_graph, graph_info)){
				index = i;
			}
		});

		if (index > -1){
			current_graphs.splice(index, 1);
			this.setState({current_graphs: current_graphs});
		}
	},

	// removes an individual error from our state
	handleClearError: function(error_msg){
		var errors = this.state.user_errors;
		var index = errors.indexOf(error_msg);
		if (index > -1){
			errors.splice(index, 1);
			this.setState({user_errors: errors});
		}
	},

	render: function(){
		return (
			<div id='graphdash-container'>
				<div id='graph-placeholder-title'>Coding Challenge</div>

				<GraphCreatorContainer rows={this.props.rows} 
									   filters={this.state.filters}
									   options={this.props.options}
									   handleFilterToggle={this.handleFilterToggle}
									   handleCategoryToggle={this.handleCategoryToggle}
									   handleCreate={this.handleCreate}
									   handleClear={this.handleClear}
									   handleConfigurationError={this.handleConfigurationError}
									   handleSubfilterToggle={this.handleSubfilterToggle}
									   />

				<GraphContainer rows={this.props.rows}
								options={this.props.options}
								current_graphs={this.state.current_graphs}
								user_errors={this.state.user_errors}
								handleClearGraph={this.handleClearGraph}
								handleClearError={this.handleClearError}
								/>
			</div>
		);
	}
});
