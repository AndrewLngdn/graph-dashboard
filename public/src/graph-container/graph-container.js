/** @jsx React.DOM */

/*
* The GraphContainerc component doesn't really do anything
* but create Graph components, ErrorMsg components,
* or the placeholder component.
*/ 

var GraphContainer = React.createClass({
	statics: {
		children_key_suffix: 0
	},
	render: function(){
		var current_graphs = this.props.current_graphs;
		var graph_nodes = current_graphs.map(function(current_graph){
			return (
				<Graph key={'graph-' + GraphContainer.children_key_suffix++}
					   current_graph={current_graph} 
					   current_graphs={current_graphs}
					   rows={this.props.rows}
					   options={this.props.options}
					   handleClearGraph={this.props.handleClearGraph}
					   />
			);
		}.bind(this));

		var user_errors = this.props.user_errors;
		var error_nodes = user_errors.map(function(err_msg){
			return (
				<ErrorMsg errorMessage={err_msg} 
						  handleClearError={this.props.handleClearError}/>
			);
		}.bind(this));

		// if we don't have anything to graph, show the description placeholder
		if (graph_nodes.length === 0 && user_errors.length === 0){
			graph_nodes = (
				<GraphPlaceholder />
			)
		}


		return (
			<div id='graph-container'>
				{error_nodes}
				{graph_nodes}
			</div>
		);
	}
});