/** @jsx React.DOM */

/*
* Basic FilterButton component. This doesn't really do anything
* but tell its parents when it's been clicked. 
*/
var FilterButton = React.createClass({
	statics: {
		key_suffix: 0
	},

	handleFilterToggle: function(e) {
		this.props.handleFilterToggle(this.props.header, this.props.value);
	},

	// Generates the subfilter nodes
	// based on the options hash.
	generateSubfilterJSX: function(){
		var value = this.props.value;
		var subfilters = this.props.subfilters;
		var subfilterJSX;

		if (subfilters){

			var subfilterNodes = [];
			
			$.each(subfilters, function(header, subfilter_arr){
				var nodes = subfilter_arr.map(function(subfilter_str){
						return (
							<SubFilterButton 
									   key={'filterButton-' + FilterButton.key_suffix++}
									   subfilter={subfilter_str}
									   filter={value}
									   filter_header={this.props.header}
									   subfilter_header={header}
									   filters={this.props.filters}
									   handleSubfilterToggle={this.props.handleSubfilterToggle} />
						);
				}.bind(this));

				subfilterNodes.push(nodes);

			}.bind(this));

			subfilterJSX = (
				<table className='subfilter-table'>
					<tr>
						{subfilterNodes}
					</tr>
				</table>
			);
		}

		return subfilterJSX;
	},

	render: function() {
		var header = this.props.header;
		var value = this.props.value;
		var enabled_filters = this.props.filters;
		
		if (enabled_filters){
			var this_filter = enabled_filters.filter(function(filter){
				return filter.type === 'filter'
				       && filter.value === value 
				       && filter.column_header === header;
			});	
		}
		
		var selected = '';
		if (this_filter && this_filter.length !== 0){
			selected = ' selected'
		}

		var subfilterJSX = this.generateSubfilterJSX();

		return (
			<div className={'filter-button'} >
				<div className={'filter-button-text' + selected} onClick={this.handleFilterToggle}>
					{this.props.value}
				</div>
				{subfilterJSX}
			</div>
		);
	}
})
