import React from 'react';

const Playhead = ({ position, scrollY }) => {
  return (
    <div
      className="Playhead"
      style={{
        position: 'fixed',
        transform: `translate3d(${position}px, ${scrollY}px, 0)`,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="PlayheadIcon"
      >
        <path d="M22.777,4.983C22.443,4.377,21.791,4,21.074,4H2.926C2.209,4,1.557,4.377,1.223,4.983C0.905,5.561,0.927,6.24,1.281,6.798 l9.074,14.315C10.706,21.669,11.321,22,12,22s1.294-0.331,1.646-0.886l9.074-14.315C23.073,6.24,23.095,5.561,22.777,4.983z" />
      </svg>
    </div>
  );
};

export default Playhead;
