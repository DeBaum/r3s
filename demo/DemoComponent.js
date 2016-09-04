import React, {Component} from "react";
import R3S from "../src/r3s";

export default class DemoComponent extends Component {
  constructor(props) {
    super(props);
    new R3S(this, this.props.fields);
  }

  componentWillMount() {
    this.setState({
      bool: false
    });
    this.changeSting();
  }

  toggleBool() {
    this.setState({
      bool: !this.state.bool
    });
  }

  changeSting() {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    let newString = "";
    for (let i = 0; i < 5; i++) {
      newString += chars[Math.round(Math.random() * 24)]
    }
    this.setState({
      string: newString
    });
  }

  render() {
    const {bool, string} = this.state;
    return (
      <tr>
        <td>
          {this.props.fields.join(", ")}
        </td>
        <td role="button" onClick={() => this.toggleBool()}>
          {String(bool)}
        </td>
        <td role="button" onClick={() => this.changeSting()}>
          {string}
        </td>
      </tr>
    )
  }
}