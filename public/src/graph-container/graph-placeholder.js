/** @jsx React.DOM */

// This is what's rendered when there are no graphs on the page.
var GraphPlaceholder = React.createClass({
	render: function(){
		return (
			<div id='graph-placeholder-container'>
				<div id='graph-placeholder-text'>
					<h2> Usage </h2>
					<p>Select one or more metrics in the upper left filter group,
					and then select whichever apps, categories, or platforms 
					you'd like to graph. Click and drag on the graph to zoom, and 
					hover over datapoints for exact dates.</p>

			 	</div>
			</div>
		);
	}
});