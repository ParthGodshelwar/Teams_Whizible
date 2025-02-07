// UnauthorizedPopup.js
import React, { useEffect } from "react";
import { Modal, Button } from "react-bootstrap"; // or your preferred modal library

const UnauthorizedPopup = ({ onClose }) => {
  const [timer, setTimer] = React.useState(10);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [onClose]);

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Unauthorized</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ textAlign: "center" }}>
          <p>Unauthorized, please contact your admin.</p>
          <p>
            Redirecting in <span style={{ fontWeight: "bold" }}>{timer}</span> seconds
            <span role="img" aria-label="clock">
              ⏰
            </span>
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UnauthorizedPopup;
