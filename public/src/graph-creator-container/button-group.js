/** @jsx React.DOM */

var chrome_bug_fix_key_suffix = 0; // This needs to be here so that Chrome
								   // will show that a category has been selected onClick.
								   // This bug does not appear in Firefox or Safari
var ButtonGroup = React.createClass({
	statics: {
		button_key_suffix: 0
	},
	render: function(){
		var header = this.props.header;
		var filters = this.props.groupObject.filters;
		var categories = this.props.groupObject.categories;
		var subfilters = this.props.groupObject.subfilters;

		var filterButtonNodes = filters.map(function(value){
			return (
				<FilterButton key={value}
							  value={value} 
							  header={header}
							  subfilters={subfilters}
							  filters={this.props.filters}
							  handleSubfilterToggle={this.props.handleSubfilterToggle}
							  handleFilterToggle={this.props.handleFilterToggle} />
			);
		}.bind(this));

		var categoryJsx;
		if (categories){

			var categoryNodes = [];

			$.each(categories, function(category, groups){
				var nodes = groups.map(function(value){
					return (
						<CategoryButton key={"key-" + ButtonGroup.button_key_suffix++}
										value={value}
										category={category}
										header={header}
										filters={this.props.filters}
										handleCategoryToggle={this.props.handleCategoryToggle} />
					);
				}.bind(this));

				categoryNodes.push(nodes);
			}.bind(this));

			categoryJsx = (
				<div className='category-group'>
					<div className='group-title'>
						Group by
					</div>
					{categoryNodes}
				</div>
			);
		}

		return (
			<div className='button-group'>
				<div className='filter-group'>
					<div className='group-title'>
						{header}
					</div>
					{filterButtonNodes}
				</div>
				{categoryJsx}
			</div>
		);
	}
})