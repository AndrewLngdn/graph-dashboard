/** @jsx React.DOM */

var CategoryButton = React.createClass({
	handleCategoryToggle: function(e) {
		this.props.handleCategoryToggle(this.props.header, this.props.category, this.props.value);
	},

	render: function() {
		var value = this.props.value;
		var header = this.props.header;

		var enabled_filters = this.props.filters;
		
		if (enabled_filters){
			var this_filter = enabled_filters.filter(function(filter){
				return filter.type === 'category'
				       && filter.value === value 
				       && filter.column_header === header;
			});
		}
		
		var selected = '';
		if (this_filter && this_filter.length !== 0){
			selected = ' selected'
		}

		return (
			<div className={'filter-button' + selected} onClick={this.handleCategoryToggle}>
				<div className={'filter-button-text'}>
					{this.props.value}
				</div>
			</div>
		);
	}
})
