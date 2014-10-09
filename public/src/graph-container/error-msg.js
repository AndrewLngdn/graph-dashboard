/** @jsx React.DOM */


// Simply displays any error message that's passed from
// the GraphDashContainer's state to this componenet's props.
var ErrorMsg = React.createClass({
	handleClearError: function(){
		this.props.handleClearError(this.props.errorMessage);
	},
	render: function (){
		return (
			<div className="error-message" onClick={this.handleClearError}>
				<div className="error-title">
					Graphing Error
				</div>
				<div className="error-text">
					<p>{this.props.errorMessage}</p>
					<p className='small'> Click on this message to remove</p>
				</div>
			</div>
		);
	}
});