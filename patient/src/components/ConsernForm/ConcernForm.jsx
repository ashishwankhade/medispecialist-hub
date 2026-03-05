import React from "react";
import "./ConsernForm.css";
import { useNavigate } from "react-router-dom";

const ConsentForm = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/book-now");
  };

  return (
    <div className="consentForm">
      <div className="consentForm-body">
        <h1 className="consentForm-h1">Consent Form</h1>
        <h3 className="consentForm-h3">Client Information</h3>
        
        <p className="consentForm-p">
          <span>Purpose of Online Therapy: </span>The purpose of our online
          sessions is to provide psychological support and therapeutic
          interventions to help you address your mental health needs and
          personal concerns.
        </p>

        <p className="consentForm-p">
          <span>Confidentiality:</span>All information shared during online
          sessions is confidential. It will not be disclosed without your
          consent, except in the following circumstances:
        </p>
        <ul className="consentForm-ul">
          <li> If there is a risk of harm to yourself or others.</li>
          <li> If there is suspicion of abuse or neglect.</li>
          <li> If required by law.</li>
        </ul>

        <p id="consentForm-p"> Technology and Security:</p>
        <ul className="consentForm-ul">
          <li>
            Sessions will be conducted via a secure platform (e.g., Zoom,
            Doxy.me).
          </li>
          <li>
            You are responsible for ensuring that your environment is private
            and free from interruptions.
          </li>
          <li>
            Ensure your device and internet connection are secure and
            functioning properly.
          </li>
        </ul>

        <p className="consentForm-p">
          <span>Informed Consent: </span>By signing this form, you acknowledge
          that you understand the nature of online therapy and agree to
          participate voluntarily. You have had the opportunity to ask questions
          regarding the process, confidentiality, and your rights as a client.
        </p>

        <p className="consentForm-p">Limitations of Confidentiality: </p>
        <ul className="consentForm-ul">
          <li>
            Please note that while confidentiality is prioritized, there are
            legal limits, which will be discussed in detail during our initial
            session.
          </li>
          <li>
            Client family members don't have authority to take legal action
            against counselor, if a client is 18+.
          </li>
          <li>
            If you develop a personal relationship with your counsellor—through
            conversations, friendship, or social media interactions—it is your
            responsibility. Any such relationship is separate from our
            organization. If any legal issues arise from this relationship,
            neither the organization nor the counsellor will be held
            responsible.
          </li>
        </ul>

        <div className="concern-btn-div">
          <p className="concern-btn" onClick={handleClick}>
            Accept
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConsentForm;
