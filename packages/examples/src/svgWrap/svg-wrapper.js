import {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  Line,
  LinearGradient,
  G,
  Path,
  Polygon,
  Polyline,
  RadialGradient,
  Rect,
  Stop,
  Svg,
  Text,
  Tspan,
} from '@react-pdf/renderer';
import React, { useEffect, useState } from 'react';

const ElementTypes = {
  circle: Circle,
  clippath: ClipPath,
  defs: Defs,
  elipse: Ellipse,
  line: Line,
  lineargradient: LinearGradient,
  g: G,
  path: Path,
  polygon: Polygon,
  polyline: Polyline,
  radialgradient: RadialGradient,
  rect: Rect,
  stop: Stop,
  text: Text,
  tspan: Tspan,
};

const SvgWrapper = ({ height, src, style, width }) => {
  const [domObject, setDomObject] = useState();

  useEffect(() => {
    fetch(src)
      .then(res => res.text())
      .then(text => {
        const domparser = new DOMParser();
        return domparser.parseFromString(text, 'image/svg+xml');
      })
      .then(dom => {
        setDomObject(dom);
      });
  }, [src]);

  const getProps = element =>
    Array.from(element.attributes).reduce(
      (acc, curr) => ({ ...acc, [curr.nodeName]: curr.nodeValue }),
      {},
    );

  const processChild = (element, index) => {
    const ElementType = ElementTypes[element.nodeName.toLowerCase()];

    if (!ElementType) {
      // eslint-disable-next-line no-console
      console.warn(
        `SVG Element Type: ${element.nodeName} is invalid or not implemented. 
        If this causes rendering or compatibility issues with the SVG ${src}, 
        consider rendering the SVG to a png file and including it as a static image with Image`,
      );
      return null;
    }

    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <ElementType key={index} {...getProps(element)}>
        {Array.from(element.children).map(processChild)}
      </ElementType>
    );
  };

  if (!domObject) {
    return <Svg height={height} style={style} width={width} />;
  }

  const parent = domObject.children[0];

  if (parent.nodeName.toLowerCase() !== 'svg') {
    throw new Error(`src object is not a valid svg file`, domObject);
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Svg {...getProps(parent)} height={height} style={style} width={width}>
      {Array.from(parent.children).map(processChild)}
    </Svg>
  );
};

export default React.memo(SvgWrapper);
