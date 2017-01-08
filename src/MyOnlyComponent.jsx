import React, { Component } from 'react';

import './main.less';
import cuteDogUrl from './cutedog.png';

export default class MyOnlyComponent extends Component {
  render() {
    return (<div>
      <h1>React Nirvana</h1>
      <ul>
        <li>Not much to see here.</li>
        <li>Look at webpack.config.js, package.json and the scripts folder instead.</li>
        <li>The background should be pinkish (demonstrating that the less loader is working)</li>
        <li>This should be an image of a cute dog:
          <div><img src={cuteDogUrl} /></div>
        </li>
      </ul>
    </div>);
  }
}