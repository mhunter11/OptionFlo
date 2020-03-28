import React from 'react'
import socketIOClient from 'socket.io-client'

import FlowList from './FlowList'

// import styles from './Flow.module.css'

export default class Flow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      options: [],
    }
  }

  componentDidMount() {
    let self = this
    const socket = socketIOClient('http://localhost:8080')

    socket.on('all_options', data =>
      self.setState({
        options: data,
      })
    )

    socket.on('options', function (data) {
      let options = self.state.options
      options.unshift(...data)

      self.setState({options: options})
    })
  }

  render() {
    return (
      <div>
        <div>
          <ul>
            {this.state.options.map((data, index) => (
              <FlowList {...data} key={index} />
            ))}
          </ul>
        </div>
      </div>
    )
  }
}
