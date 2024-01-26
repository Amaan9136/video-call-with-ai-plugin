import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faExclamationCircle,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import './Header.css';

export default function Header({ handleCalendar }) {

  return (
    <>
      <div className="header">
        <div className="logo">
          <p className='text-3xl'>WeXpert</p>
          <span className="help-text mt-3">Meet</span>
        </div>
        <div className="action-btn">
          <button><FontAwesomeIcon className="icon-block" icon={faQuestionCircle} /></button>
          <button><FontAwesomeIcon className="icon-block" icon={faExclamationCircle} /></button>
          <button onClick={handleCalendar}><FontAwesomeIcon className="icon-block" icon={faCalendarAlt} /></button>
        </div>
      </div>
    </>
  )
}
