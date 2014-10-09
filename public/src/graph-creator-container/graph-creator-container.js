/** @jsx React.DOM */


/*
* This component holds our filter buttons and
* generates the proper buttons diretly from our dataset.
* Currently, the dataset must have at UTC date column,
* some column that holds y-values, and one or more
* values that hold qualitatie identifiers for the row.
*
*/

var GraphCreatorContainer = React.createClass({

	handleCreate: function(){
		this.props.handleCreate();
	},
	
	handleClear: function() {
		this.props.handleClear();
	},

	// helper function that stops us from putting 
	// the x-axis or y-axis data columns in the filter buttons.
	graphButtonsShouldNotContain: function(header){
		var xAxis = this.props.options.dateColumn;
		var yAxis = this.props.options.yAxisDataColumn;
		return (header === xAxis 
				|| header === yAxis)
	},

	/*
	* 'generateButtonGroupObjects' generates the filter buttons in the graph creator
	* by scanning through the dataset and getting unique
	* qualitative values for each column. 
	* The column titles becomes the 'title' of the filter group,
	* and the unique values become the filter buttons.
	* If you supply 'addGroupingButtonsOn' to a given 
	* column, it will attempt to create buttons
	* that allow for graphing multiple categories on a column while still 
	* graphing the individual datalines/points.
	*
	*/
	generateButtonGroupObjects: function(){
		var rows = this.props.rows;
		var buttonGroups = {};

		rows.forEach(function(row_obj){

			$.each(row_obj, function(header, value){

				if (this.graphButtonsShouldNotContain(header)) { 
					return;
				}

				if (buttonGroups[header] === undefined ){
					buttonGroups[header] = {};
					buttonGroups[header].filters = [];
				}
				if (buttonGroups[header].filters.indexOf(value) === -1 && value){
					buttonGroups[header].filters.push(value);
				}
			}.bind(this));
		}.bind(this));


		var options = this.props.options;

		$.each(buttonGroups, function(header, buttonGroup){
			if (options.filterSettings && options.filterSettings[header]){
				var filterSettings = options.filterSettings[header];
			}

			if (filterSettings && filterSettings.addGroupingButtonsOn){
				var groups = filterSettings.addGroupingButtonsOn;

				buttonGroup.categories = {};

				groups.forEach(function(group){

					if (buttonGroups[group] === undefined){
						var error_message = 'The column ' + group + ' could not be found in your data. Check your options hash';

						this.props.handleConfigurationError(error_message);
					}

					var filtersForGroup = buttonGroups[group].filters;
					buttonGroup.categories[group] = filtersForGroup;
				}.bind(this))
			}

			if (filterSettings && filterSettings.addSubfiltersOn){
				var subfilters = filterSettings.addSubfiltersOn;

				buttonGroup.subfilters = subfilters;
			}
		}.bind(this));


		return buttonGroups;
	},

	/*
	*  This large render function creates our filter buttons and 
	*  renders them on the page!
	*/
	render: function(){
		var buttonGroupObjects = this.generateButtonGroupObjects();

		var buttonGroupNodes = [];
		$.each(buttonGroupObjects, function(header, buttonGroupObject){

			var buttonGroupNode = (
				<ButtonGroup key={header}
							 header={header} 
							 groupObject={buttonGroupObject} 
							 filters={this.props.filters}
							 handleFilterToggle={this.props.handleFilterToggle}
							 handleSubfilterToggle={this.props.handleSubfilterToggle}
							 handleCategoryToggle={this.props.handleCategoryToggle} />
			);

			buttonGroupNodes.push(buttonGroupNode);
		}.bind(this));


		return (
			<div id='graph-creator-container'>
				<div id='button-group-container'>
					{buttonGroupNodes}
					<div className='button-group'>
						<div className='group-title' >Graph</div>
						<div className='filter-button' onClick={this.handleCreate}> 
							<div className='filter-button-text'>
							 	Create 
							 </div>
						</div>

						<div className='filter-button' onClick={this.handleClear}> 
							<div className='filter-button-text'>
								ClearAll 
							</div>
						</div>
					</div>

				</div>
			</div>
		);
	}
});
