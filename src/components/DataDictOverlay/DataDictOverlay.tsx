import { useState, useRef } from "react";

import Button from "react-bootstrap/Button";
import Popover from "react-bootstrap/Popover";
import { BsInfoCircle } from "react-icons/bs";

import Overlay from "react-bootstrap/Overlay";

import { PopoverTableContent } from "./PopoverTableContent";
import { PopoverFieldContent } from "./PopoverFieldContent";

export const DataDictOverlay = ({ db_field_name, db_table_name, ...props }) => {
  const target = useRef(null);
  const [overlayOpen, setOverlayOpen] = useState(false);

  // allow us to customize some day:
  const overlay_placement = props?.popup_placement || "top";

  return (
    <>
      <Button
        variant="link"
        ref={target}
        onClick={() => setOverlayOpen(!overlayOpen)}
        aria-label={`Click to see the data dictionary defintion for '${db_field_name || db_table_name}'`}
      >
        <BsInfoCircle />
      </Button>
      <Overlay
        target={target.current}
        show={overlayOpen}
        placement={overlay_placement}
        rootClose
        onHide={() => setOverlayOpen(false)}
      >
        {({
          placement: overlay_placement,
          //arrowProps: _arrowProps,
          show: _show,
          popper: _popper,
          hasDoneInitialMeasure: _hasDoneInitialMeasure,
          ...props
        }) => {
          return (
            <Popover {...props}>
              {db_field_name && (
                <PopoverFieldContent
                  field_name={db_field_name}
                  enabled={overlayOpen}
                />
              )}
              {db_table_name && (
                <PopoverTableContent
                  table_name={db_table_name}
                  enabled={overlayOpen}
                />
              )}
            </Popover>
          );
        }}
      </Overlay>
    </>
  );
};
