import React from 'react';
import ReactDOM from 'react-dom';
import {Application} from "../src/Application";

it('renders without crashing', () => {
  let app = new Application();
  app.start();
});