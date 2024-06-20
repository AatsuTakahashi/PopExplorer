import '@testing-library/jest-dom';
import 'jest-canvas-mock';
import { createCanvas } from 'canvas';
import '@testing-library/jest-dom';

window.HTMLCanvasElement.prototype.getContext = function () {
  return createCanvas().getContext('2d');
};

Object.defineProperty(HTMLDivElement.prototype, 'ownerDocument', {
  value: document,
});
