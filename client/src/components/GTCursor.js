import React from 'react';
import { subsribeEyemovedEvent } from '../api/socket-client';
import { arrowDirection } from '../api/arrowDirection';

const cursorSize = 100;
const arrowSize = 32;
const basicStyle = {
  borderRadius: '50%',
  width: `${cursorSize}px`,
  height: `${cursorSize}px`,
  background: 'rgba(10, 112, 215, 0.4)',
  marginTop: `-${Math.floor(cursorSize / 2)}px`,
  marginLeft: `-${Math.floor(cursorSize / 2)}px`,
  zIndex: 101,
  position: 'absolute',
  float: 'left',
  display: 'block'
};

const arrowStyle = {
  borderRadius: '50%',
  width: `${arrowSize}px`,
  height: `${arrowSize}px`,
  zIndex: 102,
  position: 'absolute',
  float: 'left',
  display: 'block'
};

export default class GTCursor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      overlaps: []
    };
    this.updatePosition = this.updatePosition.bind(this);
    this.checkOverlapping = this.checkOverlapping.bind(this);
  }

  componentDidMount() {
    console.log('did update');
    document.getElementById('bg').addEventListener('mousemove', e => {


      const { pageX, pageY } = e;
      console.log(`move:${pageX}, ${pageY}`);
      this.updatePosition({ screenX: pageX, screenY: pageY });
    });
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.socket && this.props.socket) {
      // subsribeEyemovedEvent(this.props.socket, (x, y) => {
      //   this.updatePosition({ screenX: x, screenY: y });
      // });

    }
  }

  updatePosition({ screenX, screenY }) {
    const minX = screenX - cursorSize / 2;
    const minY = screenY - cursorSize / 2;
    const maxX = screenX + cursorSize / 2;
    const maxY = screenY + cursorSize / 2;
    const lefTop =  {
      row: Math.floor(minY / 80),
      col: Math.floor(minX / 80),
    };

    const rightBottom = {
      row: Math.floor(maxY / 80),
      col: Math.floor(maxX / 80)
    };

    const cursor = {
      x: screenX,
      y: screenY,
      minR: lefTop.row,
      maxR: rightBottom.row,
      minC: lefTop.col,
      maxC: rightBottom.col
    };
    this.setState({ x: screenX, y: screenY, overlaps: this.checkOverlapping(cursor) });
  }

  checkOverlapping({ x, y, minR, maxR, minC, maxC }) {
    const { buttons, targetButton } = this.props;
    const intersections = [];
    if (buttons.length !== 0) {
      for (let r = minR; r < maxR + 1; r++) {
        for (let c = minC; c < maxC + 1; c++) {
          if (r >= 15 || r < 0 || c < 0 || c >= 24) {
            continue;
          }
          const grid = buttons[r][c];
          if (grid.w > 0 && grid.h > 0) {
            intersections.push(grid);
          }
        }
      }
    }
    if ((targetButton.row >= minR && targetButton.row <= maxR) && (targetButton.col >= minC && targetButton.col <= maxC)) {
      intersections.push(targetButton);
    }
    // const intersections = all.filter((btn, i) => {
    //   const l2 = { x: btn.x, y: btn.y };
    //   const r2 = { x: btn.x + btn.w, y: btn.y + btn.h };
    //   if (l1.x > r2.x || l2.x > r1.x) {
    //     return false;
    //   }
    //   if (l1.y > r2.y || l2.y > r1.y) {
    //     return false;
    //   }
    //   if (btn.w === btn.h) {
    //     // circle
    //     const d = Math.hypot(x - (btn.x + btn.w / 2), y - (btn.y + btn.h / 2));
    //     const touchD = (width + btn.w) / 2;
    //     return d < touchD;
    //   }
    //   return true;
    // });
    console.log(`intersections: ${intersections.length}`);
    if (!intersections || intersections.length === 0) {
      this.setState({ overlaps: [] });
      return;
    }
    intersections.sort((a, b) => {
      const da = Math.hypot(x - (a.x + a.w / 2), y - (a.y + a.h / 2));
      const db = Math.hypot(x - (b.x + b.w / 2), y - (b.y + b.h / 2));
      return da - db;
    });
    const final = intersections.length > 4 ? intersections.slice(0, 4) : intersections;
    // this.setState({ overlaps:  });
    return final.map(btn => btn.id);
  }

  render() {
    const { x, y, overlaps } = this.state;
    const cursorStyle = {...basicStyle};
    cursorStyle.left = `${x}px`;
    cursorStyle.top = `${y}px`;
    return (
      <div>
        <div style={cursorStyle} />
        {(overlaps && overlaps.length > 0 ?
          overlaps.map(pos => {
            const coord = pos.split('_');
            const style = {...arrowStyle};
            style.left = `${coord[0]}px`;
            style.top = `${coord[1]}px`;
            return <img style={style} src={arrowDirection.UP} />;
          }) : null)}
      </div>
  );
  }
}
