import React, { Component } from 'react'


class Thought extends Component {

  render() {
    return (
      <div>
        <form onSubmit={(event) => {
          event.preventDefault()
          this.props.createThought(this.thought.value)
        }}>
          <input ref={(input) => this.thought = input} type="text" className="" placeholder="What are you thinking?" required />
          <input type="submit" hidden={true} />
        </form>

        <br />
        <br />

        <ul>
            { this.props.thoughts.map((thought, key) => {
              return(
                <div key={key}>
                  <label>
                  <span>{thought.thought}</span>
                  <span> &nbsp; &nbsp; </span>
                  <span>{thought.user}</span>
                  </label>
                </div>
              )
            })}
          </ul>



      </div>
    );
  }
}

export default Thought;
