import React from "react";
import DemoComponent from "./DemoComponent";

export default class Parent extends React.Component {
  //noinspection JSMethodCanBeStatic
  render() {
    return (
      <table className="table table-bordered">
        <tbody>
        <tr>
          <th>Fields in R3S</th>
          <th>Bool</th>
          <th>String</th>
        </tr>
        <DemoComponent fields={[]}/>
        <DemoComponent fields={["bool"]}/>
        <DemoComponent fields={["string"]}/>
        <DemoComponent fields={["bool", "string"]}/>
        </tbody>
      </table>
    );
  }
}