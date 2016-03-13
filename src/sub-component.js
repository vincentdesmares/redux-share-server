import React from 'react';
import Button from 'react-button';
import { connect } from 'react-redux';
import { actions } from './actions.js'


class SubComponent extends React.Component {
	render() {
		return (
			<div>
				<Button onClick={() => store.dispatch(actions.moveTo(1,2,2)) }>
					1 2 2
				</Button>
			</div>);
	}
};

export default connect()(SubComponent);