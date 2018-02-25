//
// Copyright (C) 2018 University of Dundee & Open Microscopy Environment.
// All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//

import React from 'react';
import DataContainer from './dataLoader/DataContainer'


const App = React.createClass({

    parentTypes: ["dataset", "orphaned", "tag", "share", "plate", "acquisition"],

    renderNothing: function(selected) {
        if (selected.length === 0) {
            if (this.previousParent) {
                return false;
            }
            return true;
        }
        var dtype = selected[0].type;
        if (dtype === "image") {
            return false;
        }
        if (selected.length > 1 && dtype !== "image") {
            return true;
        }
        if (this.parentTypes.indexOf(dtype) === -1) {
            return true;
        }
    },

    componentWillReceiveProps: function(nextProps) {
        // When props change...
        // If nothing is selected AND the previous node is valid
        // We continue to render that node (Dataset)
        if (nextProps.selected.length !== 0) {
            delete(this.previousParent);
        }
    },

    getParentNode: function() {
        // See http://will-moore.github.io/react-render-purely-props-and-state/
        var selected = this.props.selected,
            jstree = this.props.jstree;
        if (this.renderNothing(selected)) {
            return;
        }
        if (selected.length === 0 && this.previousParent) {
            return this.previousParent;
        }
        var dtype = selected[0].type;
        if (this.parentTypes.indexOf(dtype) > -1) {
            return selected[0];
        }
        if (dtype === "image") {
            return jstree.get_node(jstree.get_parent(selected[0]));
        }
    },

    render: function() {
        // parentNode may be null if not suitable to display
        let parentNode = this.getParentNode();

        if (parentNode) {
            let dtype = parentNode.type;
            return (
                <DataContainer
                    parentNode={parentNode}
                    jstree={this.props.jstree} />
            )
            // } else {
            //     // handles tag, orphaned, dataset, share
            //     // Cache this parentNode. If next selection == 0, still show this
            //     // E.g. if image in Dataset is de-selected
            //     this.previousParent = parentNode;
            //     return (
            //         <DatasetContainer
            //             parentNode={parentNode}
            //             jstree={this.props.jstree} />
            //     )
            // }
        }

        return (
            <div></div>
        );
    }
});


export default App
