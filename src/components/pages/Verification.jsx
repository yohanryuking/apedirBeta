import React from 'react';
import { Box } from '@mui/system';
import { Alert, AlertTitle } from '@mui/lab';

const Verification = () => {
  return (
    <Box sx={{ 
      width: '100%', 
      marginTop: 2, 
      marginBottom: 2 
    }}>
      <Alert severity="info">
        <AlertTitle>Email Verification</AlertTitle>
        We have sent you a verification email. Please check your inbox and follow the instructions to complete the verification process.
      </Alert>
    </Box>
  );
};

export default Verification;