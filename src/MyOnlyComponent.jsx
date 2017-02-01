import React, { Component } from 'react';

import './main.less';
import cuteDogUrl from './cutedog.png';

export default class MyOnlyComponent extends Component {
  render() {
    return (<div>
      <h1>Super Smooth Deployments with React and AWS</h1>
      <h2>Hello from QueensJS</h2>
      <ul>
        <li>This is the demo site that accompanies the presentation "Super Smooth Deployments with React and AWS".</li>
        <li>
          The source code can be found&nbsp;
          <a href="https://github.com/rbalicki2/react-aws-deployments">here</a>.
        </li>
        <li>Look at README.md, webpack.config.babel.js, package.json and the scripts/ folder.</li>
        <li>Hey! Look at this cute dog!
          <div><img src={cuteDogUrl} /></div>
        </li>
      </ul>
    </div>);
  }
}