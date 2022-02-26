import React from 'react';

class Table extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            isLoading: false,
        };
    }

    componentDidMount() {
        // Simple GET request using fetch
        this.setState({ isLoading: true });
        fetch('http://localhost:3000/api/v1/get')
            .then(response => response.json())
            .then(data => this.setState({ items: data, isLoading: false }));
    }

    render() {
        const { items, isLoading } = this.state;
        if (isLoading) {
            return <p>Loading ...</p>;
          }
        return (
            <div>
                    <table border="1">
                        <caption>The Beatles</caption>
                        <tr>
                            <th>Kind</th>
                            <th>Collection Name</th>
                            <th>Track Name</th>
                            <th>Track Number</th>
                            <th>Release Date</th>
                        </tr>
                        
                            {items.map(item => (
                                <tr>
                                    <td>{item.kind}</td>
                                    <td>{item.collectionName}</td>
                                    <td>{item.trackName}</td>
                                    <td>{item.trackNumber}</td>
                                    <td>{(new Date(item.releaseDate)).toLocaleDateString()}</td>
                                </tr>
                            ))}
                    </table>
            </div>
        );
    }
}

export { Table }; 