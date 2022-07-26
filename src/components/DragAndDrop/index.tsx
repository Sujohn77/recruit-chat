import React, { Component, ReactNode, RefObject } from "react";
import styled from "styled-components";
import { colors } from "utils/colors";
interface IProps {
  handleDrop: (files: any) => void;
  children: ReactNode;
}

export const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 0 16px;
  background: ${colors.white};
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
    }
  };
  handleDragOut = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ dragging: false });
  };

  handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ drag: false });
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.props.handleDrop(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
      this.dragCounter = 0;
    }
  };
  componentDidMount() {
    let div = this.dropRef.current;

    if (div) {
      div.addEventListener("dragenter", this.handleDragIn);
      div.addEventListener("dragleave", this.handleDragOut);
      div.addEventListener("dragover", this.handleDrag);
      div.addEventListener("drop", this.handleDrop);
    }
  }
  componentWillUnmount() {
    let div = this.dropRef.current;

    if (div) {
      div.removeEventListener("dragenter", this.handleDragIn);
      div.removeEventListener("dragleave", this.handleDragOut);
      div.removeEventListener("dragover", this.handleDrag);
      div.removeEventListener("drop", this.handleDrop);
    }
  }
  render() {
    return (
      <Avatar ref={this.dropRef}>
        {this.state.dragging && (
          <div
            style={{
              border: "dashed grey 4px",
              backgroundColor: "rgba(255,255,255,.8)",
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 9999,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                right: 0,
                left: 0,
                textAlign: "center",
                color: "grey",
                fontSize: 36,
              }}
            >
              <div>drop here :)</div>
            </div>
          </div>
        )}
        {this.props.children}
      </Avatar>
    );
  }
}
export default DragAndDrop;
