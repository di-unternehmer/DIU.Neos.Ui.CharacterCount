import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {$get, $transform} from 'plow-js';
import {Icon} from '@neos-project/react-ui-components';
import {connect} from 'react-redux';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

@neos(globalRegistry => ({
    nodeTypeRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
@connect($transform({
    state: state => state,
    focusedNode: selectors.CR.Nodes.focusedSelector,
    focusedNodeParentLine: selectors.CR.Nodes.focusedNodeParentLineSelector,
    nodesByContextPath: selectors.CR.Nodes.nodesByContextPathSelector
}))
export default class CharacterCount extends Component {
    static propTypes = {
        focusedNodeParentLine: PropTypes.array.isRequired
    };

    render() {
        const closestContentCollection = this.props.focusedNodeParentLine.find(node => this.props.nodeTypeRegistry.hasRole(node.nodeType, 'contentCollection'));
        if (closestContentCollection) {
            const totalTextLength = closestContentCollection.children.map(child => {
                const node = this.props.nodesByContextPath[child.contextPath];
                const textProperties = ['title', 'text'];
                const textLength = textProperties
                    .map(property => $get(['properties', property], node))
                    .map(property => typeof property === 'string' ? property.length : 0)
                    .reduce((a, b) => a + b, 0);
                return textLength;
            }).reduce((a, b) => a + b, 0);
            return (
                <div style={{display: 'inline-block', marginTop: '9px'}}>
                    Character count: {totalTextLength}
                </div>
            );
        }
        return null;
    }
}
