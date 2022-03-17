import React from "react";
import ReactDOM from "react-dom";
import {Table} from './Table.jsx';
class App extends React.Component {
    render() {
        return (
            <div>
                <h3 className="p-3 text-center">Diploma work for EPAM DevOps school v2</h3>
                <h5>Variant 2</h5>
                <h5> Made by Andrei Trotskii v2</h5>
                <Table />
            </div>
        );
    }
}
export { App };
ReactDOM.render(
    <App />,
    document.getElementById("root")
);
