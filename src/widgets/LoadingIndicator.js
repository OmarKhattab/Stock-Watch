import React from 'react';
import { Dimmer, Loader } from "semantic-ui-react";
const LoadingIndicator = () => (
  <div>
     <Dimmer active>

        <Loader />
      </Dimmer>
      <div style={{color:'white'}}>Loading...</div>
  </div>
)

export default LoadingIndicator;
