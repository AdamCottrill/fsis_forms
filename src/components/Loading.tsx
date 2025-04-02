import BsSpinner from "react-bootstrap/Spinner";

function Loading({ isFetching }) {
  if (isFetching) {
    return (
      <BsSpinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </BsSpinner>
    );
  } else {
    return;
  }
}

export default Loading;
