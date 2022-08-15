import React, { Component, ReactNode, RefObject } from 'react';
import styled from 'styled-components';
import { colors } from 'utils/colors';

interface IProps {
  handleDrop: (files: any) => void;
  children: ReactNode;
}

export const Wrapper = styled.div`
  background: ${colors.alto};
  border-radius: 10px;
  padding: 32px 17px 16px;
  margin: 0 auto;
  display: flex;
  flex-flow: column;
  width: 220px;
  align-items: center;
  color: ${colors.dustyGray};
  margin-bottom: 24px;
  position: relative;
`;

class DragAndDrop extends Component<IProps> {
  state = {
    drag: false,
    dragging: false,
  };
  dragCounter: number = 0;
  dropRef: RefObject<HTMLDivElement> = React.createRef();
  handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  handleDragIn = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({ dragging: true });
      this.dragCounter++;
    }
  };
  handleDragOut = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter--;
    if (this.dragCounter === 0) {
      this.setState({ dragging: false });
    }
  };

  handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ drag: false });
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.props.handleDrop(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
      this.setState({ dragging: false });
      this.dragCounter = 0;
    }
  };
  componentDidMount() {
    let div = this.dropRef.current;

    if (div) {
      div.addEventListener('dragenter', this.handleDragIn);
      div.addEventListener('dragleave', this.handleDragOut);
      div.addEventListener('dragover', this.handleDrag);
      div.addEventListener('drop', this.handleDrop);
    }
  }
  componentWillUnmount() {
    let div = this.dropRef.current;

    if (div) {
      div.removeEventListener('dragenter', this.handleDragIn);
      div.removeEventListener('dragleave', this.handleDragOut);
      div.removeEventListener('dragover', this.handleDrag);
      div.removeEventListener('drop', this.handleDrop);
    }
  }
  render() {
    return (
      <Wrapper ref={this.dropRef}>
        {this.state.dragging && (
          <div
            style={{
              border: 'dashed grey 4px',
              backgroundColor: 'rgba(255,255,255,.8)',
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 9999,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                right: 0,
                left: 0,
                textAlign: 'center',
                color: 'grey',
                fontSize: 36,
              }}
            >
              <div>drop here</div>
            </div>
          </div>
        )}
        {this.props.children}
      </Wrapper>
    );
  }
}
export default DragAndDrop;
