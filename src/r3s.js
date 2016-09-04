import remove from "lodash.remove";
import at from "lodash.at";
import find from "lodash.find";

export default class R3S {
  constructor(component, fields, sharedStateName = "_default") {
    let sharedState = R3S.sharedStates[sharedStateName];
    if (!sharedState) {
      sharedState = R3S.sharedStates[sharedStateName] = this;
      sharedState.members = [];
    }
    sharedState.attach(component, fields);
    return sharedState;
  }

  attach(component, fields) {
    if (!component) {
      return;
    }

    const originalSetState = component.setState;
    component.setState = (newState, callback) => {
      this.propagateState(component, newState, callback);
    };

    const originalComponentWillUnmount = component.componentWillUnmount;
    component.componentWillUnmount = () => {
      this.detach(component);
    };

    this.members.push({
      component: component,
      fields: fields,
      setState: originalSetState,
      componentWillUnmount: originalComponentWillUnmount
    });
  }

  detach(component) {
    const member = remove(this.members, {component: component});
    if (member) {
      member.component.setState = member.setState;
      member.component.componentWillUnmount = member.componentWillUnmount;
    }
  }

  propagateState(srcComponent, newState, callback) {
    const cleanedState = this._getCleanedState(srcComponent, newState);

    this.members.forEach((member) => {
      if (member.component == srcComponent) {
        member.setState.call(member.component, newState);
      } else if (cleanedState != null) {
        if (!member.fields || member.fields.length == 0) {
          member.setState.call(member.component, cleanedState);
        } else {
          var stateChanges = this._getStateChangesForComponent(cleanedState, member);
          if (stateChanges != null) {
            member.setState.call(member.component, stateChanges);
          }
        }
      }
    });
    if (typeof callback == "function") {
      callback.call(srcComponent);
    }
  }

  _getCleanedState(srcComponent, newState) {
    const srcMember = find(this.members, {component: srcComponent});
    if (srcMember.fields && srcMember.fields.length) {
      let cleanedState = {}, containsFields = false;
      srcMember.fields.forEach((field) => {
        if (newState.hasOwnProperty(field)) {
          cleanedState[field] = newState[field];
          containsFields = true;
        }
      });
      if (containsFields) {
        return cleanedState;
      } else {
        return null;
      }
    }
    return newState;
  }

  //noinspection JSMethodCanBeStatic
  _getStateChangesForComponent(newState, member) {
    const values = at(newState, member.fields);
    let componentsNewState = {}, somethingChanged = false;
    for (let i = 0; i < member.fields.length; i++) {
      if (values[i] !== undefined) {
        componentsNewState[member.fields[i]] = values[i];
        somethingChanged = true;
      }
    }
    if (somethingChanged) {
      return componentsNewState;
    } else {
      return null;
    }
  }
}

R3S.sharedStates = {};