import React, { useState } from "react";
import * as Plivo from 'plivo-browser-sdk';
import * as $ from 'jquery';
import ReactStopwatch from 'react-stopwatch';
import Modal from "react-modal";
import apiServices from './services';

Modal.setAppElement("#root");

export default function App() {
  var plivoBrowserSdk;
  const [name, setName] = useState();
  const [fromNumber, setFromNumber] = useState();
  const [toNumber, setToNumber] = useState();
  const [time, setTime] = useState("01");
  const [stopWatchTimeLimit, setStopWatchTimeLimit] = useState("00");
  const [callDuration, setCallDuration] = useState("0");

  const [nameError, setNameError] = useState(false);
  const [phoneNumberError, setNumberError] = useState(false);
  const [fromNumberError, setFromNumberError] = useState(false);
  const [toNumberError, setToNumberError] = useState(false)

  const [isButton, setIsButton] = useState(false);
  const [isStopWatch, setIsStopWatch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setModalMessage] = useState("Call is in_progress");

  const makeCall = () => {
    let callDetails = {
      "name": name,
      "fromNumber": `+91${fromNumber}`,
      "toNumber": `+91${toNumber}`,
      "time": time
    };
    apiServices.createXML(callDetails)
      .then((response) => {
        var dest = toNumber;
        var extraHeaders = { 'X-PH-callerId': fromNumber };
        plivoBrowserSdk.client.call(dest, extraHeaders);
        plivoBrowserSdk.client.on('onCallAnswered', (callInfo) => {
          apiServices.saveCallDetails(callDetails)
          setIsStopWatch(true);
          setStopWatchTimeLimit(`00:${time}:00`);
          setCallDuration(parseInt(time))
          setIsOpen(!isOpen);
          setTimeout(() => {
            if(plivoBrowserSdk.client.callSession){
              plivoBrowserSdk.client.hangup();
            }
          }, parseInt(time) * 60 * 1000)
        });
        plivoBrowserSdk.client.on('onCallFailed', (reason, callInfo) => {
          setModalMessage(`Caller is Busy`);
          setCallDuration(0);
          setIsButton(true);
          setIsStopWatch(false);
          setIsOpen(!isOpen);
        });
      })
      .then((response) => {
      })
      .catch((error) => {
      });
  }

  const handleSubmitEvent = (e) => {
    e.preventDefault();
    
    setNameError(false);
    setNumberError(false);
    setFromNumberError(false);
    setToNumberError(false);

    let isNameError = false, isFromNumberError = false, isToNumberError = false, isNumberError = false;
    if(!name) {
      isNameError = true;
      setNameError(true);
    }
    if(fromNumber && toNumber && fromNumber.length === 10 && fromNumber.length === 10 && (fromNumber ===  toNumber)){
      isNumberError = true;
      setNumberError(true)
    }
    if(!fromNumber || !(fromNumber && fromNumber.match(/^\d{10}$/))){
      isFromNumberError = true;
      setFromNumberError(true);
    }
    if(!toNumber || !(toNumber && toNumber.match(/^\d{10}$/))){
      isToNumberError = true;
      setToNumberError(true);
    }
    if(!isNameError && !isNumberError && !isFromNumberError && !isToNumberError){
      makeCall();
    }

    
  }

  const handleNameChangeEvent = (event) => {
    setName(event.target.value)
  }
  const handleFromNumberChangeEvent = (event) => {
    setFromNumber(event.target.value)
  }
  const handleToNumberChangeEvent = (event) => {
    setToNumber(event.target.value)
  }

  const handleTimeChangeEvent = (event) => {
    setTime(event.target.value)
  }

  const reset = () => {
    setStopWatchTimeLimit(`00:00:00`);
    setIsButton(false);
    setIsStopWatch(false);
    setCallDuration(0);
    setModalMessage("Call is in_progress");
  }
  const toggleModal = ()=> {
    setIsOpen(!isOpen);
    setTimeout(() => {
      reset()
    }, 1000)
  }

  $(document).ready(function () {
    var options = {
      "debug": "DEBUG",
      "permOnClick": true,
      "enableTracking": true,
      "closeProtection": true,
      "maxAverageBitrate": 48000
    };
    if (!plivoBrowserSdk) {
      plivoBrowserSdk = new Plivo(options);
      plivoBrowserSdk.client.login("chiru18109102562936507", "Venkatesh@22");
    }
  });

  return (
    <div>
      <h1 className="heading">Connect People using Cloud Phone</h1>
      <form onSubmit={handleSubmitEvent}>
      {phoneNumberError && <div className="error">Enter different numbers in from and to fields</div>}
        <div className="card-number">
          <label>
            Name:
        <input type="text" name="name" placeholder="Please enter your name" onChange={handleNameChangeEvent} />
          </label>
        </div>
        {nameError && <div className="error">Please enter the Name</div>}
        <div className="card-number">
          <label>
            From:
        <input type="text" name="fromNumber" placeholder="Please enter your mobile number" onChange={handleFromNumberChangeEvent} />
          </label>
        </div>
        {fromNumberError && <div className="error">Enter 10 digit Phone Number</div>}
        <div className="card-number ">
          <label>
            To:
        <input type="text" className="to_phone_number" name="toNumber" placeholder="Please enter the destination number" onChange={handleToNumberChangeEvent} />
          </label>
        </div>
        {toNumberError && <div className="error">Enter 10 digit Phone Number</div>}
        <div className="card-number">
          <label className="call_limit">
            Call Time Limit:
            &nbsp;
          <select value={time} onChange={handleTimeChangeEvent}>
              <option value="01">1</option>
              <option value="02">2</option>
              <option value="03">3</option>
            </select>
          &nbsp;minute
        </label>
        </div>
        <button type="submit" className="myButton">
          Call
      </button>
      </form>
      <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}
        contentLabel="My dialog"
        className="mymodal"
        overlayClassName="myoverlay"
        closeTimeoutMS={500}
        shouldCloseOnOverlayClick={false}
        ariaHideApp={false}
      >
        <div>
          {isStopWatch && <ReactStopwatch
            seconds={0}
            minutes={0}
            hours={0}
            limit={stopWatchTimeLimit}
            onChange={({ hours, minutes, seconds }) => {
              // do something
            }}
            onCallback={() => {
              setModalMessage(`Call ended in ${callDuration} minutes`);
              setIsButton(true);
              setIsStopWatch(false);
            }}
            render={({ formatted, hours, minutes, seconds }) => {
              return (
                <div>
                  <p>
                    Time: {formatted}
                  </p>
                </div>
              );
            }}
          />}
          <div className="call_message">{message}</div>
        </div>
        {isButton && <button className="close_modal" onClick={toggleModal}>close the popup</button>}
      </Modal>
    </div>
  );
}
