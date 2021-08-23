import React from 'react';
import ReactPDF, {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
} from '@react-pdf/renderer';

import gaussianSvg from './gaussian.svg';
import gaussianPng from './gaussian.png';
import logo from './react-logo.svg';
import heliocentric from './heliocentric.svg';
import SvgWrapper from './svg-wrapper';

console.log(`React version: ${React.version}`);
console.log(`React-pdf version: ${ReactPDF.version}`);

const styles = StyleSheet.create({
  page: {
    fontSize: 20,
    color: 'black',
    display: 'flex',
    flexDirection: 'column',
    padding: '10',
  },
});

export default () => (
  <Document title="Hey!" subject="Test">
    <Page size="A4" style={styles.page}>
      <Text>React Logo</Text>
      <SvgWrapper height="200" src={logo} width="200" />
      <Text>Heliocentric solar system</Text>
      <SvgWrapper height="200" src={heliocentric} width="200" />
    </Page>

    <Page size="A4" style={styles.page}>
      <Text>
        Example of an SVG that does not work: Svg with filter elements
      </Text>
      <Text>Looks like: (Wrapped Svg)</Text>
      <SvgWrapper height="200" src={gaussianSvg} width="200" />
      <Text>Should look like: (Static Image)</Text>
      <Image style={{ height: 200, width: 200 }} src={gaussianPng} />
    </Page>
  </Document>
);
