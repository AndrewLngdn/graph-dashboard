/** @jsx React.DOM */

var SubFilterButton = React.createClass({
	handleSubfilterToggle: function () {
		this.props.handleSubfilterToggle(this.props.filter_header, 
										 this.props.filter, 
										 this.props.subfilter_header,
										 this.props.subfilter);
	},
	render: function() {
		var filter_header = this.props.filter_header;
		var filter_str = this.props.filter;
		var subfilter = this.props.subfilter;
		var enabled_filters = this.props.filters;
		
		if (enabled_filters){
			var this_filter = enabled_filters.filter(function(filter){
				return filter.type === 'subfilter' 
				       && filter.value === filter_str
				       && filter.column_header === filter_header
				       && filter.subfilter === subfilter;
			});
		}
		
		var selected = '';
		if (this_filter && this_filter.length !== 0){
			selected = ' selected'
		}

		return (
			<td className={'sub-filter-button' + selected} onClick={this.handleSubfilterToggle}>
				{this.props.subfilter}
			</td>
		);
	}
})