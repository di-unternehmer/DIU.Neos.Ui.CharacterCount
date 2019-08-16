import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {$get, $transform} from 'plow-js';
import {Icon} from '@neos-project/react-ui-components';
import {connect} from 'react-redux';
import {selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

@neos(globalRegistry => ({
    nodeTypeRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository'),
    i18nRegistry: globalRegistry.get('i18n'),
    options: globalRegistry.get('frontendConfiguration').get('DIU_CharacterCount')
}))
@connect($transform({
    state: state => state,
    documentNode: selectors.CR.Nodes.documentNodeSelector,
    nodesByContextPath: selectors.CR.Nodes.nodesByContextPathSelector
}))
export default class CharacterCount extends Component {
    static propTypes = {
        documentNode: PropTypes.object.isRequired,
        options: PropTypes.object.isRequired
    };

    render() {
        const {documentNode, nodeTypeRegistry, nodesByContextPath, options, i18nRegistry} = this.props;
        if (!documentNode) {
            return null;
        }
        if (!options.textProperties) {
            console.warn('No text properties setting');
            return null;
        }
        const characterCountLimit = $get('properties.characterCountLimit', documentNode);
        if (!characterCountLimit) {
            return null;
        }
        const mainContentCollection = documentNode.children.find(node => nodeTypeRegistry.hasRole(node.nodeType, 'contentCollection'));
        if (!mainContentCollection) {
            return null;
        }
        const mainContentCollectionNode = nodesByContextPath[mainContentCollection.contextPath]
        if (!mainContentCollectionNode) {
            return null;
        }
        const totalTextLength = mainContentCollectionNode.children.map(child => {
            const node = nodesByContextPath[child.contextPath];
            const textLength = options.textProperties
                .map(property => $get(['properties', property], node))
                .map(property => typeof property === 'string' ? property.replace(/(<([^>]+)>)/ig, '').length : 0)
                .reduce((a, b) => a + b, 0);
            return textLength;
        }).reduce((a, b) => a + b, 0);
        const isOverlimit = totalTextLength > characterCountLimit;
        return (
            <div
                style={{
                    display: 'inline-block',
                    height: '100%',
                    padding: '9px',
                    background: isOverlimit ? '#ff460d' : 'transparent',
                    cursor: 'default'
                }}
                title={isOverlimit ? i18nRegistry.translate('DIU.Neos.Ui.CharacterCount:Main:ccOverlimit') : i18nRegistry.translate('DIU.Neos.Ui.CharacterCount:Main:ccValid')}
            >
                <Icon icon='closed-captioning'/> <strong>{totalTextLength}</strong>{characterCountLimit ? ' / ' + characterCountLimit : ''}
            </div>
        );
    }
}
