import d3 from "d3";
import _ from "lodash";
import React from "react";
import Radium from "radium";
import {VictoryAnimation} from "victory-animation";

@Radium
class VictoryDonut extends React.Component {
  constructor(props) {
    super(props);
    const radius = Math.min(this.props.width, this.props.height) / 2;
    const sortOrder = this.getSortOrder();

    this.colors = d3.scale.ordinal().range(this.props.arcColors);

    this.arc = d3.svg.arc()
      .outerRadius(radius)
      .innerRadius(radius - this.props.arcWidth);

    this.pie = d3.layout.pie()
      .sort(sortOrder)
      .startAngle(this.convertToRadians(this.props.startAngle))
      .endAngle(this.convertToRadians(this.props.endAngle))
      .padAngle(this.convertToRadians(this.props.padAngle))
      .value((d) => { return d.y; });
  }

  convertToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  getSortOrder() {
    let comparator = this.props.sort;

    if (!_.isNull(comparator) && _.isString(comparator)) {
      if (comparator === "ascending" || comparator === "descending") {
        comparator = (a, b) => { return d3[this.props.sort](a.y, b.y); };
      } else {
        // console.error("Invalid sort order string. Try 'ascending' or 'descending'.");
        comparator = null;
      }
    }

    return comparator;
  }

  getStyles(fill) {
    return {
      text: {
        fill: this.props.fontColor,
        fontFamily: this.props.fontFamily,
        fontSize: this.props.fontSize,
        fontWeight: this.props.fontWeight,
        textAnchor: "middle"
      },
      path: {
        fill,
        stroke: this.props.borderColor,
        strokeWidth: this.props.borderWidth
      }
    };
  }

  drawArcs(arcs) {
    const arcData = this.pie(this.props.data);

    const arcComponents = _.map(arcs, (arc, index) => {
      const fill = this.colors(arc.x);
      const styles = this.getStyles(fill);

      return (
        <VictoryAnimation data={arcData[index]} key={index}>
          {(data) => {
            return (
              <g>
                <path
                  d={this.arc(data)}
                  style={styles.path}/>
                <text
                  dy=".35em"
                  style={styles.text}
                  transform={"translate(" + this.arc.centroid(data) + ")"}>
                  {arc.x}
                </text>
              </g>
            );
          }}
        </VictoryAnimation>
      );
    });

    return (<g>{arcComponents}</g>);
  }

  render() {
    return (
      <svg
        height={this.props.height}
        width={this.props.width}>
        <g transform={"translate(" + this.props.width / 2 + "," + this.props.height / 2 + ")"}>
          {this.drawArcs(this.props.data)}
        </g>
      </svg>
    );
  }
}

VictoryDonut.propTypes = {
  arcColors: React.PropTypes.arrayOf(React.PropTypes.string),
  arcWidth: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
  data: React.PropTypes.arrayOf(React.PropTypes.shape({
    x: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    y: React.PropTypes.number
  })),
  borderColor: React.PropTypes.string,
  borderWidth: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
  endAngle: React.PropTypes.number,
  fontColor: React.PropTypes.string,
  fontFamily: React.PropTypes.string,
  fontSize: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
  fontWeight: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
  height: React.PropTypes.number,
  padAngle: React.PropTypes.number,
  sort: React.PropTypes.oneOfType([
    React.PropTypes.oneOf(["ascending", "descending"]),
    React.PropTypes.func
  ]),
  startAngle: React.PropTypes.number,
  width: React.PropTypes.number
};

VictoryDonut.defaultProps = {
  arcColors: [
    "#75C776",
    "#39B6C5",
    "#78CCC4",
    "#62C3A4",
    "#64A8D1",
    "#8C95C8",
    "#3BAF74"
  ],
  arcWidth: 60,
  data: [
    { x: "A", y: 1 },
    { x: "B", y: 2 },
    { x: "C", y: 3 },
    { x: "D", y: 1 },
    { x: "E", y: 2 }
  ],
  borderColor: "white",
  borderWidth: 1,
  endAngle: 360,
  fontColor: "black",
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontSize: 10,
  fontWeight: 400,
  height: 400,
  padAngle: 0,
  sort: null,
  startAngle: 0,
  width: 400
};

export default VictoryDonut;
