import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Carousel, Dropdown } from "react-bootstrap";
import { Input, Button as FluentButton, Link } from "@fluentui/react-components";
import ReCAPTCHA from "react-google-recaptcha";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LoginPage.css"; // Assuming your CSS is in LoginPage.css
import logo from "../../../assets/img/whiz_logo.png";
import logo1 from "../../../assets/img/login.svg";
import customerImage from "../../../assets/Images/customer_img.png";
import girlImage from "../../../assets/Images/gril1.png";
import lmsImage from "../../../assets/Images/lms_mandatory.png";
import loginFrameImage from "../../../assets/Images/Loginframe.png";
import developerImage from "../../../assets/Images/developerrr.png";
import { useTranslation } from "react-i18next";
import { FaCheckCircle } from "react-icons/fa";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import useAuth from "app/hooks/useAuth";
import microsoftLogo from "../../../assets/img/microsoft-logo.svg";
import settings from "../../../settings";
import * as microsoftTeams from "@microsoft/teams-js";

function LoginPage() {
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showChangePassword, setChangePassword] = useState(false);
  const [show2FA, set2FA] = useState(false);
  const [usernameValid, setUsernameValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [oldPasswordValid, setOldPasswordValid] = useState(false);
  const [newPasswordValid, setNewPasswordValid] = useState(false);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
  const [otpValid, setOtpValid] = useState(false);
  const { t, i18n } = useTranslation();
  const { initializeApp, login, handleMicrosoftSignIn } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/landingPage");
    }
  }, [token]);
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setUsernameValid(e.target.value.length > 0); // Validation logic for username
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordValid(e.target.value.length >= 8); // Validation logic for password
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // You can implement email validation logic here
  };

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
    // You can implement validation logic for old password here
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    // You can implement validation logic for new password here
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    // You can implement validation logic for confirm password here
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    // You can implement validation logic for OTP here
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    navigate("/dashboard/default");
    // const loginSuccess = false;
    // try {
    //   await login(username, password); // Perform login
    //   navigate("/dashboard/default"); // Navigate to dashboard on success
    // } catch (error) {
    //   setLoginAttempts((prev) => prev + 1);
    //   loginSuccess = true; // Increment login attempts on failure
    //   console.error("Login failed:", error);
    //   navigate("/dashboard/default");
    // }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // Handle forgot password logic here
  };

  const signin = () => {
    navigate("/landingPage");
  };
  const calculatePasswordStrength = () => {
    const strength = {
      0: "Very Weak",
      1: "Weak",
      2: "Fair",
      3: "Strong",
      4: "Very Strong"
    };
    let score = 0;
    // Check password length
    if (password.length >= 8) score++;
    // Check if password contains both lower and uppercase characters
    if (/(?=.*[a-z])(?=.*[A-Z])/.test(password)) score++;
    // Check if password contains at least one digit
    if (/(?=.*\d)/.test(password)) score++;
    // Check if password contains at least one special character
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return strength[score];
  };
  const getPasswordStrength = () => {
    const regex = {
      digit: /\d/,
      lowercase: /[a-z]/,
      uppercase: /[A-Z]/,
      special: /[^A-Za-z0-9]/
    };

    let strength = 0;

    if (password.length >= 8) strength++;
    if (regex.digit.test(password)) strength++;
    if (regex.lowercase.test(password)) strength++;
    if (regex.uppercase.test(password)) strength++;
    if (regex.special.test(password)) strength++;

    return strength;
  };

  const getProgressBarColor = () => {
    const strength = getPasswordStrength();
    switch (strength) {
      case 0:
      case 1:
        return "danger";
      case 2:
        return "warning";
      case 3:
        return "info";
      case 4:
        return "success";
      default:
        return "danger";
    }
  };
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  const handleclick = (e) => {
    // Running in a browser
    handleMicrosoftSignIn();
  };
  useEffect(() => {
    handleMicrosoftSignIn();
  }, []);

  return (
    <Container fluid className="p-0 login-container" style={{ width: "100%", height: "100vh" }}>
      <Row className="w-100 m-0">
        <Col>
          <Dropdown className="position-absolute top-0 start-0 mt-2 ml-3">
            <Dropdown.Toggle variant="success" id="language-dropdown">
              {t("language")}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => changeLanguage("en")}>{t("english")}</Dropdown.Item>
              <Dropdown.Item onClick={() => changeLanguage("mr")}>{t("french")}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row className="w-100 m-0">
        <Col
          md={6}
          className="d-none d-md-flex align-items-center justify-content-center text-white p-0"
          style={{
            backgroundImage: "linear-gradient(to top, #2b56a5, #236db7, #2283c8, #2e9ad6, #42b0e3)",
            height: "100vh"
          }}
        >
          <Carousel className="w-100 p-4">
            <Carousel.Item>
              <div className="text-center">
                <div className="image-container">
                  <img
                    src={customerImage}
                    alt="Customer"
                    className="mb-4 img-fluid carousel-image"
                  />
                </div>
                <h3>{t("collaborate_with_cross_teams")}</h3>
                <p>{t("lorem_ipsum")}</p>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="text-center">
                <div className="image-container">
                  <img src={girlImage} alt="Girl" className="mb-4 img-fluid carousel-image" />
                </div>
                <h3>{t("collaborate_with_cross_teams")}</h3>
                <p>{t("lorem_ipsum")}</p>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="text-center">
                <div className="image-container">
                  <img
                    src={lmsImage}
                    alt="LMS Mandatory"
                    className="mb-4 img-fluid carousel-image"
                  />
                </div>
                <h3>{t("collaborate_with_cross_teams")}</h3>
                <p>{t("lorem_ipsum")}</p>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="text-center">
                <div className="image-container">
                  <img
                    src={loginFrameImage}
                    alt="Login Frame"
                    className="mb-4 img-fluid carousel-image"
                  />
                </div>
                <h3>{t("collaborate_with_cross_teams")}</h3>
                <p>{t("lorem_ipsum")}</p>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="text-center">
                <div className="image-container">
                  <img
                    src={developerImage}
                    alt="Developer"
                    className="mb-4 img-fluid carousel-image"
                  />
                </div>
                <h3>{t("collaborate_with_cross_teams")}</h3>
                <p>{t("lorem_ipsum")}</p>
              </div>
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
