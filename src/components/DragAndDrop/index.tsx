import React, { Component, ReactNode, RefObject } from "react";
import * as S from "./styles";

interface IDragAndDropProps {
  handleDrop: (files: any) => void;
  children: ReactNode;
}

export class DragAndDrop extends Component<IDragAndDropProps> {
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
      <S.DragAndDropWrapper ref={this.dropRef}>
        {this.state.dragging && (
          <S.Border
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
            <S.Center>
              <S.Title>drop here</S.Title>
            </S.Center>
          </S.Border>
        )}

        {this.props.children}
      </S.DragAndDropWrapper>
    );
  }
}
