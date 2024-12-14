import React from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

import Backdrop from './Backdrop';
import './Modal.css';

const Modal = props => {
  const content = (
    <motion.div
      className={`modal ${props.className}`}
      style={props.style}
      initial={{ opacity: 0, y: -100 }} // Animation start state
      animate={{ opacity: 1, y: 0 }}   // Animation end state
      exit={{ opacity: 0, y: -100 }}   // Animation exit state
      transition={{ duration: 0.2 }}   // Transition duration
    >
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={props.onSubmit ? props.onSubmit : event => event.preventDefault()}
      >
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </motion.div>
  );

  return ReactDOM.createPortal(content, document.getElementById('modal-hook'));
};

const ModalWithBackdrop = props => {
  return (
    <React.Fragment>
      {/* Backdrop */}
      <AnimatePresence>
        {props.show && <Backdrop onClick={props.onCancel} />}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {props.show && <Modal {...props} />}
      </AnimatePresence>
    </React.Fragment>
  );
};

export default ModalWithBackdrop;
