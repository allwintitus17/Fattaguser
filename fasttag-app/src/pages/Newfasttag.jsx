// import { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import BackButton from '../components/BackButton';
// import Spinner from '../components/Spinner';
// import { 
//   createPersonalDetails, 
//   resetPersonal 
// } from '../features/kyc/personalSlice';
// import { 
//   createVehicle, 
//   resetVehicle 
// } from '../features/vehicle/vehicleSlice';

// function NewFastTag() {
//   const { user } = useSelector((state) => state.auth);
//   const { 
//     isLoading: personalLoading, 
//     isError: personalError, 
//     isSuccess: personalSuccess, 
//     message: personalMessage 
//   } = useSelector((state) => state.kyc);
  
//   const { 
//     isLoading: vehicleLoading, 
//     isError: vehicleError, 
//     isSuccess: vehicleSuccess, 
//     message: vehicleMessage 
//   } = useSelector((state) => state.vehicle);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Form step state
//   const [currentStep, setCurrentStep] = useState(1);
  
//   // Track validation states
//   const [personalDataValidated, setPersonalDataValidated] = useState(false);
//   const [formValidationPassed, setFormValidationPassed] = useState(false);
  
//   // Track submission state
//   const [isSubmittingAll, setIsSubmittingAll] = useState(false);
//   const [personalSubmitted, setPersonalSubmitted] = useState(false);
//   const [vehicleSubmitted, setVehicleSubmitted] = useState(false);
//   const [hasAttemptedSubmission, setHasAttemptedSubmission] = useState(false);

//   // Personal Details State
//   const [personalData, setPersonalData] = useState({
//     fullName: user?.name || '',
//     dob: '',
//     aadharNumber: '',
//     panNumber: '',
//     line1: '',
//     city: '',
//     state: '',
//     pincode: ''
//   });

//   // Vehicle Details State
//   const [vehicleData, setVehicleData] = useState({
//     registrationNumber: '',
//     vehicleType: '',
//     chassisNumber: '',
//     engineNumber: '',
//     model: '',
//     fuelType: '',
//     registrationYear: ''
//   });

//   // Form validation functions
//   const validatePersonalData = () => {
//     const errors = [];
    
//     if (!personalData.fullName.trim()) errors.push('Full Name is required');
//     if (!personalData.dob) errors.push('Date of Birth is required');
//     if (!personalData.aadharNumber.match(/^\d{4}-\d{4}-\d{4}$/)) {
//       errors.push('Aadhar Number must be in format XXXX-XXXX-XXXX');
//     }
//     if (!personalData.panNumber.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)) {
//       errors.push('PAN Number must be in format ABCDE1234F');
//     }
//     if (!personalData.line1.trim()) errors.push('Address Line 1 is required');
//     if (!personalData.city.trim()) errors.push('City is required');
//     if (!personalData.state.trim()) errors.push('State is required');
//     if (!personalData.pincode.match(/^\d{6}$/)) {
//       errors.push('Pincode must be 6 digits');
//     }
    
//     return errors;
//   };

//   const validateVehicleData = () => {
//     const errors = [];
    
//     if (!vehicleData.registrationNumber.trim()) errors.push('Registration Number is required');
//     if (!vehicleData.vehicleType) errors.push('Vehicle Type is required');
//     if (!vehicleData.chassisNumber.trim()) errors.push('Chassis Number is required');
//     if (!vehicleData.engineNumber.trim()) errors.push('Engine Number is required');
//     if (!vehicleData.model.trim()) errors.push('Vehicle Model is required');
//     if (!vehicleData.fuelType) errors.push('Fuel Type is required');
//     if (!vehicleData.registrationYear || vehicleData.registrationYear < 1980) {
//       errors.push('Valid Registration Year is required');
//     }
    
//     return errors;
//   };

//   // Handle form changes
//   const handlePersonalChange = (e) => {
//     setPersonalData({
//       ...personalData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleVehicleChange = (e) => {
//     setVehicleData({
//       ...vehicleData,
//       [e.target.name]: e.target.value
//     });
//   };

//   // Handle submission success states
//   useEffect(() => {
//     if (personalError && isSubmittingAll) {
//       toast.error(personalMessage);
//       setIsSubmittingAll(false);
//       setPersonalSubmitted(false);
//       setHasAttemptedSubmission(true);
//     }

//     if (personalSuccess && isSubmittingAll && !personalSubmitted) {
//       setPersonalSubmitted(true);
//       dispatch(resetPersonal());
//     }
//   }, [personalError, personalSuccess, personalMessage, dispatch, isSubmittingAll, personalSubmitted]);

//   useEffect(() => {
//     if (vehicleError && isSubmittingAll) {
//       toast.error(vehicleMessage);
//       setIsSubmittingAll(false);
//       setVehicleSubmitted(false);
//       setHasAttemptedSubmission(true);
//       // Don't reset personal submission state on vehicle error
//     }

//     if (vehicleSuccess && isSubmittingAll && !vehicleSubmitted) {
//       setVehicleSubmitted(true);
//       dispatch(resetVehicle());
//     }
//   }, [vehicleError, vehicleSuccess, vehicleMessage, dispatch, isSubmittingAll, vehicleSubmitted]);

//   // Check if all submissions are complete
//   useEffect(() => {
//     if (personalSubmitted && vehicleSubmitted && !hasAttemptedSubmission) {
//       toast.success('FastTag application completed successfully! All details saved.');
//       navigate('/dashboard');
//       // Reset states
//       setIsSubmittingAll(false);
//       setPersonalSubmitted(false);
//       setVehicleSubmitted(false);
//       setHasAttemptedSubmission(false);
//     }
//   }, [personalSubmitted, vehicleSubmitted, navigate, hasAttemptedSubmission]);

//   const onPersonalSubmit = (e) => {
//     e.preventDefault();

//     if (!user || !user._id) {
//       toast.error('User not logged in');
//       return;
//     }

//     // Client-side validation
//     const personalErrors = validatePersonalData();
//     if (personalErrors.length > 0) {
//       toast.error('Please fix the following errors:\n' + personalErrors.join('\n'));
//       return;
//     }

//     setPersonalDataValidated(true);
//     toast.success('Personal details validated successfully');
//     setCurrentStep(2);
//   };

//   const onVehicleSubmit = (e) => {
//     e.preventDefault();

//     if (!user || !user._id) {
//       toast.error('User not logged in');
//       return;
//     }

//     if (!personalDataValidated) {
//       toast.error('Please complete personal details first');
//       return;
//     }

//     // Client-side validation for both forms
//     const personalErrors = validatePersonalData();
//     const vehicleErrors = validateVehicleData();
//     const allErrors = [...personalErrors, ...vehicleErrors];

//     if (allErrors.length > 0) {
//       toast.error('Please fix the following errors:\n' + allErrors.join('\n'));
//       setFormValidationPassed(false);
//       return;
//     }

//     setFormValidationPassed(true);

//     // Prevent multiple submissions
//     if (isSubmittingAll || hasAttemptedSubmission) {
//       toast.warning('Submission already in progress or completed');
//       return;
//     }

//     // Start the submission process for both forms
//     setIsSubmittingAll(true);
//     setHasAttemptedSubmission(false); // Reset this flag for new submission

//     // Prepare all payloads
//     const personalPayload = {
//       authUserId: user._id,
//       fullName: personalData.fullName,
//       dob: personalData.dob,
//       aadharNumber: personalData.aadharNumber,
//       panNumber: personalData.panNumber,
//       address: {
//         line1: personalData.line1,
//         city: personalData.city,
//         state: personalData.state,
//         pincode: personalData.pincode,
//       },
//     };

//     const vehiclePayload = {
//       ownerId: user._id,
//       registrationNumber: vehicleData.registrationNumber,
//       vehicleType: vehicleData.vehicleType,
//       chassisNumber: vehicleData.chassisNumber,
//       engineNumber: vehicleData.engineNumber,
//       model: vehicleData.model,
//       fuelType: vehicleData.fuelType,
//       registrationYear: parseInt(vehicleData.registrationYear),
//     };

//     console.log('Submitting both forms:');
//     console.log('Personal details:', personalPayload);
//     console.log('Vehicle details:', vehiclePayload);

//     // Dispatch both actions only if validation passed
//     dispatch(createPersonalDetails(personalPayload));
//     dispatch(createVehicle(vehiclePayload));
//   };

//   const goToPreviousStep = () => {
//     if (currentStep === 2) {
//       setCurrentStep(1);
//     }
//   };

//   const resetForm = () => {
//     setCurrentStep(1);
//     setPersonalDataValidated(false);
//     setFormValidationPassed(false);
//     setIsSubmittingAll(false);
//     setPersonalSubmitted(false);
//     setVehicleSubmitted(false);
//     setHasAttemptedSubmission(false);
    
//     // Reset form data
//     setPersonalData({
//       fullName: user?.name || '',
//       dob: '',
//       aadharNumber: '',
//       panNumber: '',
//       line1: '',
//       city: '',
//       state: '',
//       pincode: ''
//     });
    
//     setVehicleData({
//       registrationNumber: '',
//       vehicleType: '',
//       chassisNumber: '',
//       engineNumber: '',
//       model: '',
//       fuelType: '',
//       registrationYear: ''
//     });
    
//     toast.info('Form reset successfully');
//   };

//   if ((personalLoading || vehicleLoading) && isSubmittingAll) {
//     return <Spinner />;
//   }

//   return (
//     <>
//       <BackButton />
//       <section className="heading">
//         <h1>Apply for FastTag</h1>
//         <p>Step {currentStep} of 2: {
//           currentStep === 1 ? 'Personal Information' : 'Vehicle Details'
//         }</p>
//         {isSubmittingAll && (
//           <p style={{ color: '#007bff', fontWeight: 'bold' }}>
//             Submitting application details...
//           </p>
//         )}
//         {hasAttemptedSubmission && (
//           <div style={{ marginTop: '10px' }}>
//             <button 
//               onClick={resetForm}
//               className="btn btn-warning"
//               style={{ fontSize: '14px', padding: '5px 10px' }}
//             >
//               Reset Form & Try Again
//             </button>
//           </div>
//         )}
//       </section>

//       {/* Progress Bar */}
//       <div className="progress-bar">
//         <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
//           <span>1</span> Personal Details {personalDataValidated && '✓'}
//         </div>
//         <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
//           <span>2</span> Vehicle Details {formValidationPassed && '✓'}
//         </div>
//       </div>

//       {/* Step 1: Personal Details */}
//       {currentStep === 1 && (
//         <section className="form">
//           <h2>Personal Information</h2>
//           <p style={{ color: '#666', marginBottom: '1rem' }}>
//             Fill your personal details (will be saved after completing vehicle details)
//           </p>
//           <form onSubmit={onPersonalSubmit}>
//             <div className="form-group">
//               <label>Full Name</label>
//               <input
//                 type="text"
//                 name="fullName"
//                 className="form-control"
//                 value={personalData.fullName}
//                 onChange={handlePersonalChange}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Date of Birth</label>
//               <input
//                 type="date"
//                 name="dob"
//                 className="form-control"
//                 value={personalData.dob}
//                 onChange={handlePersonalChange}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Aadhar Number (Format: XXXX-XXXX-XXXX)</label>
//               <input
//                 type="text"
//                 name="aadharNumber"
//                 className="form-control"
//                 value={personalData.aadharNumber}
//                 onChange={handlePersonalChange}
//                 placeholder="1234-5678-9012"
//                 pattern="^\d{4}-\d{4}-\d{4}$"
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>PAN Number</label>
//               <input
//                 type="text"
//                 name="panNumber"
//                 className="form-control"
//                 value={personalData.panNumber}
//                 onChange={handlePersonalChange}
//                 placeholder="ABCDE1234F"
//                 pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
//                 style={{ textTransform: 'uppercase' }}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Address Line 1</label>
//               <input
//                 type="text"
//                 name="line1"
//                 className="form-control"
//                 value={personalData.line1}
//                 onChange={handlePersonalChange}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>City</label>
//               <input
//                 type="text"
//                 name="city"
//                 className="form-control"
//                 value={personalData.city}
//                 onChange={handlePersonalChange}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>State</label>
//               <input
//                 type="text"
//                 name="state"
//                 className="form-control"
//                 value={personalData.state}
//                 onChange={handlePersonalChange}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Pincode</label>
//               <input
//                 type="text"
//                 name="pincode"
//                 className="form-control"
//                 value={personalData.pincode}
//                 onChange={handlePersonalChange}
//                 pattern="^\d{6}$"
//                 placeholder="123456"
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <button type="submit" className="btn btn-block">
//                 Next: Vehicle Details
//               </button>
//             </div>
//           </form>
//         </section>
//       )}

//       {/* Step 2: Vehicle Details */}
//       {currentStep === 2 && (
//         <section className="form">
//           <h2>Vehicle Information</h2>
//           <p style={{ color: '#666', marginBottom: '1rem' }}>
//             Complete vehicle details to submit your FastTag application
//           </p>
//           <form onSubmit={onVehicleSubmit}>
//             <div className="form-group">
//               <label>Registration Number</label>
//               <input
//                 type="text"
//                 name="registrationNumber"
//                 className="form-control"
//                 value={vehicleData.registrationNumber}
//                 onChange={handleVehicleChange}
//                 placeholder="MH12AB1234"
//                 style={{ textTransform: 'uppercase' }}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Vehicle Type (FastTag Class)</label>
//               <select
//                 name="vehicleType"
//                 className="form-control"
//                 value={vehicleData.vehicleType}
//                 onChange={handleVehicleChange}
//                 required
//               >
//                 <option value="">Select Vehicle Class</option>
//                 <option value="Class 1 - Car / Jeep / Van">Class 1 - Car / Jeep / Van</option>
//                 <option value="Class 2 - Light Commercial Vehicle (LCV)">Class 2 - Light Commercial Vehicle (LCV)</option>
//                 <option value="Class 3 - Bus / Truck (2 Axles)">Class 3 - Bus / Truck (2 Axles)</option>
//                 <option value="Class 4 - 3-Axle Commercial Vehicles">Class 4 - 3-Axle Commercial Vehicles</option>
//                 <option value="Class 5 - 4 to 6 Axle Vehicles">Class 5 - 4 to 6 Axle Vehicles</option>
//                 <option value="Class 6 - 7 or more Axle Vehicles">Class 6 - 7 or more Axle Vehicles</option>
//                 <option value="Class 7 - Oversized Vehicles (Earth movers, etc.)">Class 7 - Oversized Vehicles (Earth movers, etc.)</option>
//               </select>
//             </div>

//             <div className="form-group">
//               <label>Chassis Number</label>
//               <input
//                 type="text"
//                 name="chassisNumber"
//                 className="form-control"
//                 value={vehicleData.chassisNumber}
//                 onChange={handleVehicleChange}
//                 style={{ textTransform: 'uppercase' }}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Engine Number</label>
//               <input
//                 type="text"
//                 name="engineNumber"
//                 className="form-control"
//                 value={vehicleData.engineNumber}
//                 onChange={handleVehicleChange}
//                 style={{ textTransform: 'uppercase' }}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Vehicle Model</label>
//               <input
//                 type="text"
//                 name="model"
//                 className="form-control"
//                 value={vehicleData.model}
//                 onChange={handleVehicleChange}
//                 placeholder="e.g., Swift, Activa, etc."
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Fuel Type</label>
//               <select
//                 name="fuelType"
//                 className="form-control"
//                 value={vehicleData.fuelType}
//                 onChange={handleVehicleChange}
//                 required
//               >
//                 <option value="">Select Fuel Type</option>
//                 <option value="Petrol">Petrol</option>
//                 <option value="Diesel">Diesel</option>
//                 <option value="CNG">CNG</option>
//                 <option value="Electric">Electric</option>
//                 <option value="Hybrid">Hybrid</option>
//               </select>
//             </div>

//             <div className="form-group">
//               <label>Registration Year</label>
//               <input
//                 type="number"
//                 name="registrationYear"
//                 className="form-control"
//                 value={vehicleData.registrationYear}
//                 onChange={handleVehicleChange}
//                 min="1980"
//                 max={new Date().getFullYear()}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <div className="button-group">
//                 <button 
//                   type="button" 
//                   className="btn btn-secondary"
//                   onClick={goToPreviousStep}
//                   disabled={isSubmittingAll}
//                 >
//                   Previous
//                 </button>
//                 <button 
//                   type="submit" 
//                   className="btn btn-block"
//                   disabled={isSubmittingAll || hasAttemptedSubmission}
//                 >
//                   {isSubmittingAll ? 'Submitting...' : 'Submit FastTag Application'}
//                 </button>
//               </div>
//             </div>
//           </form>
//         </section>
//       )}
//     </>
//   );
// }

// export default NewFastTag;
import { useEffect, useState } from 'react'; 
import { useSelector, useDispatch } from 'react-redux'; 
import { useNavigate, useLocation } from 'react-router-dom'; 
import { toast } from 'react-toastify'; 
import { SignJWT, importPKCS8 } from 'jose'; 
import BackButton from '../components/BackButton'; 
import Spinner from '../components/Spinner'; 
import {    
  createPersonalDetails,    
  resetPersonal  
} from '../features/kyc/personalSlice'; 
import {    
  createVehicle,    
  resetVehicle  
} from '../features/vehicle/vehicleSlice';
import {    
  createTag,    
  reset as resetTag  
} from '../features/tag/tagSlice';
import { jwtDecode } from 'jwt-decode'; 
const jwtEncode = require('jwt-encode');  

// Constants for PAN verification 
const SECRET_KEY = 'Kejb4MDZRn76TezXogXDGNj0AADoyuPC-81Zs64D77eSzWOipuMBfrd9ks6i7v60HDKVgvWOXsqv6RaLb6Y_8w'; 
const ALGORITHM = 'HS512'; 
const AADHAAR_PRIVATE_KEY = "HLMVSD1767HJJJBi864VCEHHGC65676P67HUUIYDTSDUVKVU907784567NXU789IP"; 
const AADHAAR_ALGORITHM = 'ES256'; 

function NewFastTag() {   
  const { user } = useSelector((state) => state.auth);   
  const {      
    isLoading: personalLoading,      
    isError: personalError,      
    isSuccess: personalSuccess,      
    message: personalMessage    
  } = useSelector((state) => state.kyc);      
  
  const {      
    isLoading: vehicleLoading,      
    isError: vehicleError,      
    isSuccess: vehicleSuccess,      
    message: vehicleMessage    
  } = useSelector((state) => state.vehicle);



  const dispatch = useDispatch();   
  const navigate = useNavigate(); 
  const location = useLocation();   

  // Form step state (only 2 steps now)   
  const [currentStep, setCurrentStep] = useState(2);      
  
  // Track validation states   
  const [personalDataValidated, setPersonalDataValidated] = useState(true);   
  const [vehicleDataValidated, setVehicleDataValidated] = useState(false);      
  
  // Track submission state   
  const [isSubmittingAll, setIsSubmittingAll] = useState(false);   
  const [personalSubmitted, setPersonalSubmitted] = useState(false);   
  const [vehicleSubmitted, setVehicleSubmitted] = useState(false);
  const [tagSubmitted, setTagSubmitted] = useState(false);    

  // Verification states   
  const [isPanVerified, setIsPanVerified] = useState(false);   
  const [isPanVerifying, setIsPanVerifying] = useState(false);   
  const [isAadharVerified, setIsAadharVerified] = useState(false);   
  const [isAadharVerifying, setIsAadharVerifying] = useState(false);    

  const [aadharOtp, setAadharOtp] = useState('');   
  const [serverOtp, setServerOtp] = useState('');   
  const [isOtpSent, setIsOtpSent] = useState(false);   
  const [isOtpVerified, setIsOtpVerified] = useState(false);    

  // Vehicle verification states   
  const [isVehicleVerified, setIsVehicleVerified] = useState(false);   
  const [isVehicleVerifying, setIsVehicleVerifying] = useState(false);

  // Store created IDs for tag creation
  const [createdPersonalId, setCreatedPersonalId] = useState(null);
  const [createdVehicleId, setCreatedVehicleId] = useState(null);    

  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  // Personal Details State   
  const [personalData, setPersonalData] = useState({     
    fullName: user?.name || '',     
    dob: '',     
    aadharNumber: '',     
    panNumber: '',     
    line1: '',     
    city: '',     
    state: '',     
    pincode: ''   
  });    

  // Vehicle Details State   
  const [vehicleData, setVehicleData] = useState({     
    registrationNumber: '',     
    vehicleType: '',     
    chassisNumber: '',     
    engineNumber: '',     
    model: '',     
    fuelType: '',     
    registrationYear: ''   
  });    

  // Vehicle class amounts for payment   
  const vehicleClassAmounts = {     
    "Class 1 - Car / Jeep / Van": 500,     
    "Class 2 - Light Commercial Vehicle (LCV)": 800,     
    "Class 3 - Bus / Truck (2 Axles)": 1200,     
    "Class 4 - 3-Axle Commercial Vehicles": 1500,     
    "Class 5 - 4 to 6 Axle Vehicles": 2000,     
    "Class 6 - 7 or more Axle Vehicles": 2500,     
    "Class 7 - Oversized Vehicles (Earth movers, etc.)": 3000   
  };

  // ============== PAYMENT SUCCESS USEEFFECTS ============== //

  // Check if returning from successful payment (from state passed by payment-result)
  useEffect(() => {
    if (location.state) {
      const { paymentSuccess, paymentDetails, fromPaymentResult } = location.state;
      
      if (paymentSuccess && fromPaymentResult) {
        console.log('🎉 Payment successful! Processing database submission...');
        
        // Retrieve stored data from localStorage
        const storedPersonalData = localStorage.getItem('fasttagPersonalData');
        const storedVehicleData = localStorage.getItem('fasttagVehicleData');
        
        if (storedPersonalData && storedVehicleData) {
          try {
            const personalPayload = JSON.parse(storedPersonalData);
            const vehiclePayload = JSON.parse(storedVehicleData);
            
            console.log('Submitting to database after payment:', { personalPayload, vehiclePayload });
            
            setIsSubmittingAll(true);
            toast.info('💾 Saving your application data...');
            
            // Dispatch both actions to save to database
            dispatch(createPersonalDetails(personalPayload));
            dispatch(createVehicle(vehiclePayload));
            
          } catch (error) {
            console.error('Error parsing stored data:', error);
            toast.error('Error processing payment data. Please try again.');
            
            // Clean up localStorage on error
            localStorage.removeItem('fasttagPersonalData');
            localStorage.removeItem('fasttagVehicleData');
          }
        } else {
          toast.error('Payment data not found. Please restart the application process.');
          navigate('/new-fasttag');
        }
      }
    }
  }, [location.state, dispatch, navigate]);

  // Handle successful personal details submission after payment
  useEffect(() => {
    if (personalError && isSubmittingAll) {
      toast.error(personalMessage);
      setIsSubmittingAll(false);
      setPersonalSubmitted(false);
    }

    if (personalSuccess && isSubmittingAll) {
      setPersonalSubmitted(true);
      // Store the created personal details ID if available in the response
      // You might need to modify your personalSlice to return the created record with ID
      dispatch(resetPersonal());
    }
  }, [personalError, personalSuccess, personalMessage, dispatch, isSubmittingAll]);

  // Handle successful vehicle submission after payment
  useEffect(() => {
    if (vehicleError && isSubmittingAll) {
      toast.error(vehicleMessage);
      setIsSubmittingAll(false);
      setVehicleSubmitted(false);
    }

    if (vehicleSuccess && isSubmittingAll) {
      setVehicleSubmitted(true);
      // Store the created vehicle ID if available in the response
      // You might need to modify your vehicleSlice to return the created record with ID
      dispatch(resetVehicle());
    }
  }, [vehicleError, vehicleSuccess, vehicleMessage, dispatch, isSubmittingAll]);

  // Create tag after both personal and vehicle details are saved
  useEffect(() => {
    if (personalSubmitted && vehicleSubmitted && !tagSubmitted) {
      console.log('✅ Both personal and vehicle data submitted, creating tag...');
      
      // Prepare tag data
      const tagData = {
        personalDetailsId: createdPersonalId, // You'll need to get this from the response
        vehicleId: createdVehicleId, // You'll need to get this from the response
        // Note: The backend will handle generating tagId, userId, etc.
      };
      
      toast.info('🏷️ Creating your FastTag...');
      dispatch(createTag(tagData));
    }
  }, [personalSubmitted, vehicleSubmitted, tagSubmitted, dispatch, createdPersonalId, createdVehicleId]);

  // Handle tag creation response
  useEffect(() => {
    if (tagError && isSubmittingAll) {
      toast.error(tagMessage);
      setIsSubmittingAll(false);
    }

    if (tagSuccess && isSubmittingAll) {
      setTagSubmitted(true);
      dispatch(resetTag());
    }
  }, [tagError, tagSuccess, tagMessage, dispatch, isSubmittingAll]);

  // Final success after tag creation is complete
  useEffect(() => {
    if (personalSubmitted && vehicleSubmitted && tagSubmitted) {
      console.log('✅ FastTag application completed successfully!');
      
      toast.success('🎉 FastTag created successfully!');
      
      // Clean up localStorage
      localStorage.removeItem('fasttagPersonalData');
      localStorage.removeItem('fasttagVehicleData');
      
      // Reset submission states
      setIsSubmittingAll(false);
      setPersonalSubmitted(false);
      setVehicleSubmitted(false);
      setTagSubmitted(false);
      
      // Redirect to success page or dashboard
      setTimeout(() => {
        navigate('/dashboard'); // or wherever you want to redirect after completion
      }, 2000);
    }
  }, [personalSubmitted, vehicleSubmitted, tagSubmitted, navigate]);

  // Clean up navigation state to prevent re-triggering on refresh
  useEffect(() => {
    if (location.state?.fromPaymentResult) {
      // Clear the state after processing to prevent re-runs
      const timer = setTimeout(() => {
        navigate(location.pathname, { replace: true });
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state, navigate]);

  // ============== END PAYMENT SUCCESS USEEFFECTS ============== //

  // Handle form changes   
  const handlePersonalChange = (e) => {     
    const { name, value } = e.target;     
    setPersonalData({       
      ...personalData,       
      [e.target.name]: e.target.value     
    });      

    // Reset verification status when PAN number changes     
    if (name === 'panNumber') {       
      setIsPanVerified(false);     
    }     
    if (name === 'aadharNumber') {       
      setIsAadharVerified(false);     
    }   
  };    

  const handleVehicleChange = (e) => {     
    const { name, value } = e.target;     
    setVehicleData({       
      ...vehicleData,       
      [name]: value     
    });      

    // Reset vehicle verification status when any field changes     
    setIsVehicleVerified(false);   
  };    

  // PAN Verification Function   
  const handleVerifyPAN = async () => {     
    try {       
      console.log('Starting PAN verification...');       
      const panNumber = personalData.panNumber;              
      
      if (!panNumber) {         
        toast.error("Enter PAN number first");         
        return;       
      }        

      // Validate PAN format       
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;       
      if (!panRegex.test(panNumber)) {         
        toast.error("Please enter a valid PAN number format (ABCDE1234F)");         
        return;       
      }        

      setIsPanVerifying(true);       
      console.log('Verifying PAN:', panNumber);        

      // Method 1: Simple JWT creation       
      let pan_token;       
      try {         
        if (typeof SignJWT !== 'undefined') {           
          const payload = { pan_number: panNumber };           
          const secret = new TextEncoder().encode(SECRET_KEY);           
          pan_token = await new SignJWT(payload)             
            .setProtectedHeader({ alg: ALGORITHM })             
            .sign(secret);         
        } else {           
          const payload = { pan_number: panNumber, timestamp: Date.now() };           
          pan_token = btoa(JSON.stringify(payload));           
          console.log('Using fallback token creation');         
        }       
      } catch (jwtError) {         
        console.error('JWT creation error:', jwtError);         
        const payload = { pan_number: panNumber, timestamp: Date.now() };         
        pan_token = btoa(JSON.stringify(payload));       
      }        

      console.log('Token created, making API call...');        

      // Access token       
      const accessToken = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbGx3aW4iLCJyb2xlIjoidXNlciJ9.lQhWXYdn7m1DDsyO2HnufevN_44J86nY_kywUgQrgV4ZU7ViQBa_vCOQLTO7I0Cs7xX-RRQrxbMuKo0hdBI-Fw';              
      
      if (!accessToken) {         
        toast.error("Access token not found.");         
        setIsPanVerifying(false);         
        return;       
      }        

      // API call       
      const response = await fetch('http://192.168.161.3:8000/pancard/validate', {         
        method: 'POST',         
        headers: {           
          'Authorization': `Bearer ${accessToken}`,           
          'Content-Type': 'application/json',         
        },         
        body: JSON.stringify({           
          pan_token: pan_token         
        }),       
      });        

      console.log('API Response status:', response.status);       
      const data = await response.json();       
      console.log('API Response data:', data);        

      if (response.ok && data.result_token) {         
        try {           
          const tokenParts = data.result_token.split('.');           
          const payloadBase64 = tokenParts[1];           
          const decodedPayload = JSON.parse(atob(payloadBase64));           
          console.log('Decoded payload:', decodedPayload);                      
          
          if (decodedPayload.message && decodedPayload.message.toLowerCase() === 'valid') {             
            setIsPanVerified(true);             
            toast.success(`✅ PAN Status: ${decodedPayload.message}`);           
          } else {             
            toast.error(`❌ PAN Status: ${decodedPayload.message || 'Invalid'}`);           
          }         
        } catch (decodeError) {           
          console.error('Token decode error:', decodeError);           
          toast.error('Error processing verification response');         
        }       
      } else {         
        console.error('API Error:', data);         
        toast.error(`❌ Verification failed: ${data.error || data.message || 'Unknown error'}`);       
      }     
    } catch (err) {       
      console.error('PAN verification failed:', err);       
      toast.error(`Error verifying PAN: ${err.message || 'Network error'}`);     
    } finally {       
      setIsPanVerifying(false);     
    }   
  };    

  // Decode JWT OTP function   
  const decodeJwtOtp = (jwtToken) => {     
    try {       
      // Check if jwtDecode is properly imported and is a function       
      if (typeof jwtDecode === 'function') {         
        console.log('Using imported jwtDecode function');         
        return jwtDecode(jwtToken);       
      }        

      console.log('jwtDecode not available, using manual decoding');              
      
      // Manual JWT decoding fallback       
      const parts = jwtToken.split('.');       
      if (parts.length !== 3) {         
        throw new Error('Invalid JWT format - expected 3 parts');       
      }              

      // Decode the payload (second part)       
      const payload = JSON.parse(atob(parts[1]));       
      console.log('Manually decoded JWT payload:', payload);       
      return payload;     
    } catch (error) {       
      console.error('Error decoding JWT OTP:', error);              

      // Final fallback - try to extract any 6-digit number from the token       
      try {         
        const digitMatch = jwtToken.match(/\d{6}/);         
        if (digitMatch) {           
          console.log('Found 6-digit number in token:', digitMatch[0]);           
          return { otp: digitMatch[0] };         
        }       
      } catch (regexError) {         
        console.error('Regex fallback also failed:', regexError);       
      }              

      return null;     
    }   
  };    

  // Aadhar OTP sending function   
  const handleSendAadharOtp = async () => {     
    try {       
      const aadharNumber = personalData.aadharNumber;        

      if (!aadharNumber) {         
        toast.error("Please enter Aadhar number first");         
        return;       
      }        

      if (!/^\d{16}$/.test(aadharNumber)) {         
        toast.error("Please enter a valid 16-digit Aadhar number");         
        return;       
      }        

      setIsAadharVerifying(true);       
      console.log('Starting Aadhar verification for:', aadharNumber);        

      let encodedAadhaarNumber;       
      try {         
        encodedAadhaarNumber = jwtEncode(aadharNumber, AADHAAR_PRIVATE_KEY, AADHAAR_ALGORITHM);         
        console.log('JWT Encoded Aadhar:', encodedAadhaarNumber);       
      } catch (jwtError) {         
        console.error('JWT encoding error:', jwtError);         
        toast.error("Error encoding Aadhar number");         
        return;       
      }        

      const requestPayload = {         
        uniqueID: encodedAadhaarNumber       
      };       
      console.log('Request payload:', requestPayload);        

      const response = await fetch("https://j6s1rnmt-5000.inc1.devtunnels.ms/check/aadhaar", {         
        method: 'POST',         
        headers: {           
          'Content-Type': 'application/json'         
        },         
        body: JSON.stringify(requestPayload)       
      });        

      console.log('Response status:', response.status);       
      const data = await response.json();       
      console.log("Full API Response:", data);        

      if (response.ok) {         
        if (data.success === true || data.status === 'success' || data.otp || data.mailOTP) {           
          toast.success("OTP sent successfully to your registered mobile number");           
          setIsOtpSent(true);                      
          
          let otpToken = data.mailOTP || data.otp || data.otpToken;                      

          if (otpToken) {             
            console.log('OTP Token received:', otpToken);                          
            
            const decodedOtp = decodeJwtOtp(otpToken);             
            if (decodedOtp) {               
              console.log('Decoded OTP data:', decodedOtp);               
              setServerOtp(decodedOtp.otp || decodedOtp.mailOTP || decodedOtp);             
            } else {               
              console.log('Storing JWT token as-is');               
              setServerOtp(otpToken);             
            }           
          } else {             
            console.warn('No OTP token in response, but API call was successful');             
            setServerOtp('123456'); // Fallback for testing           
          }                      
          
          setAadharOtp('');         
        } else {           
          console.error('API returned success status but error data:', data);           
          toast.error(`❌ ${data.message || data.error || 'Invalid Aadhar number'}`);         
        }       
      } else {         
        console.error('API returned error status:', response.status, data);         
        toast.error(`❌ Server Error: ${data.message || data.error || 'Failed to send OTP'}`);       
      }      
    } catch (error) {       
      console.error("Aadhar OTP sending failed:", error);       
      toast.error(`Network Error: ${error.message || 'Failed to connect to server'}`);     
    } finally {       
      setIsAadharVerifying(false);     
    }   
  };    

  // OTP verification function   
  const handleVerifyOtp = () => {     
    if (!aadharOtp || aadharOtp.length !== 6) {       
      toast.error("Please enter a valid 6-digit OTP");       
      return;     
    }      

    let actualOtp = null;          
    console.log('Server OTP token:', serverOtp);          
    
    try {       
      if (typeof serverOtp === 'string' && serverOtp.includes('.')) {         
        console.log('Decoding JWT token...');                  
        
        let decodedOtp = null;                  

        // Try using the decodeJwtOtp function         
        decodedOtp = decodeJwtOtp(serverOtp);                  

        if (decodedOtp) {           
          actualOtp = decodedOtp.otp ||                       
                      decodedOtp.mailOTP ||                       
                      decodedOtp.code ||                       
                      decodedOtp.otpCode ||                      
                      decodedOtp.verification_code ||                      
                      decodedOtp.pin ||                      
                      (typeof decodedOtp === 'string' ? decodedOtp : null) ||                      
                      (typeof decodedOtp === 'number' ? String(decodedOtp) : null);                                 
          
          console.log('Extracted OTP from JWT:', actualOtp);                      

          if (!actualOtp) {             
            console.log('No OTP found in standard fields. Full decoded object:', decodedOtp);             
            const otpRegex = /\b\d{6}\b/;             
            const stringPayload = JSON.stringify(decodedOtp);             
            const match = stringPayload.match(otpRegex);             
            if (match) {               
              actualOtp = match[0];               
              console.log('Found 6-digit number in payload:', actualOtp);             
            }           
          }         
        }       
      } else {         
        actualOtp = serverOtp;         
        console.log('Using server OTP directly:', actualOtp);       
      }              
      
      actualOtp = String(actualOtp);              

      console.log('Final comparison:', {         
        entered: aadharOtp,         
        server: actualOtp,         
        serverType: typeof actualOtp       
      });        

      if (aadharOtp === actualOtp) {         
        setIsOtpVerified(true);         
        setIsAadharVerified(true);         
        toast.success("✅ Aadhar OTP verified successfully");       
      } else {         
        toast.error("❌ Incorrect OTP. Please try again.");         
        console.log('OTP mismatch details:', {           
          enteredOTP: aadharOtp,           
          expectedOTP: actualOtp,           
          enteredLength: aadharOtp.length,           
          expectedLength: actualOtp ? actualOtp.length : 'null'         
        });       
      }            
    } catch (error) {       
      console.error('Error during OTP verification:', error);       
      toast.error("Error verifying OTP. Please try again.");     
    }   
  };    

  // Vehicle verification function   
  const handleVerifyVehicle = async () => {     
    try {       
      console.log('Starting vehicle verification...');       
      const { registrationNumber, chassisNumber, engineNumber } = vehicleData;              
      
      if (!registrationNumber) {         
        toast.error("Please enter vehicle registration number");         
        return;       
      }        

      if (!chassisNumber) {         
        toast.error("Please enter chassis number");         
        return;       
      }        

      if (!engineNumber) {         
        toast.error("Please enter engine number");         
        return;       
      }        

      setIsVehicleVerifying(true);       
      console.log('Verifying vehicle with details:', { registrationNumber, chassisNumber, engineNumber });        

      const requestBody = {         
        reg_no: registrationNumber.trim(),         
        chassis_no: chassisNumber.trim(),         
        engine_no: engineNumber.trim()       
      };        

      console.log('Vehicle verification request body:', requestBody);        

      const apiUrl = `http://192.168.0.104:3000/api/vehicle/verify_RC`; 
      console.log('API URL:', apiUrl);        

      const response = await fetch(apiUrl, {         
        method: 'POST',         
        headers: {           
          'x-api-key': 'e2f8b7c6d5a4f3e2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8',  // ✅ Updated Header
          'Content-Type': 'application/json',           
          'Accept': 'application/json',         
        },         
        body: JSON.stringify(requestBody),       
      });        

      console.log('Vehicle API Response status:', response.status);        

      const responseText = await response.text();       
      console.log('Raw response:', responseText);        

      let data;       
      try {         
        data = JSON.parse(responseText);       
      } catch (parseError) {         
        console.error('JSON parse error:', parseError);         
        console.error('Response was:', responseText);                  

        if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html>')) {           
          throw new Error(`API endpoint returned HTML page instead of JSON. This usually means the endpoint URL is incorrect or the server route doesn't exist. Status: ${response.status}`);         
        }                  

        throw new Error(`Server returned invalid JSON: ${parseError.message}`);       
      }        

      console.log('Vehicle API Response data:', data);        

      if (response.ok) {         
        if (response.status === 200 && data.message === "Vehicle RC Verified Successfully.") {           
          setIsVehicleVerified(true);           
          toast.success('✅ Vehicle RC verified successfully');           
          console.log("Verified Vehicle ID:", data.vehicle_id); // ✅ log vehicle_id
          return true;         
        } else {           
          toast.error(`❌ Vehicle verification failed: ${data.message || 'Unknown error'}`);           
          return false;         
        }       
      } else {         
        if (response.status === 400) {           
          toast.error(`❌ Bad Request: ${data.message || 'Missing required fields'}`);         
        } else if (response.status === 401) {           
          toast.error(`❌ Unauthorized: ${data.message || 'Invalid API key'}`);         
        } else if (response.status === 403) {           
          toast.error(`❌ Vehicle Not Verified: ${data.message || 'Vehicle verification pending'}`);         
        } else if (response.status === 404) {           
          toast.error(`❌ Vehicle Not Found: ${data.message || 'Vehicle details do not match'}`);         
        } else if (response.status === 500) {           
          toast.error(`❌ Server Error: ${data.message || 'Database error'}`);         
        } else {           
          toast.error(`❌ Error: ${data.message || `HTTP ${response.status}`}`);         
        }         
        return false;       
      }     
    } catch (err) {       
      console.error('Vehicle verification failed:', err);              

      if (err.message.includes('Failed to fetch')) {         
        toast.error('❌ Cannot connect to server. Please check if the API server is running on 192.168.0.104:3000');       
      } else if (err.message.includes('HTML page instead of JSON')) {         
        toast.error('❌ API endpoint error: Server returned HTML instead of JSON. Check the endpoint URL.');       
      } else if (err.message.includes('CORS')) {         
        toast.error('❌ CORS error: Please configure CORS on your backend server');       
      } else if (err.name === 'SyntaxError' || err.message.includes('JSON')) {         
        toast.error('❌ Server returned invalid response format');       
      } else {         
        toast.error(`❌ Error verifying vehicle: ${err.message || 'Network error'}`);       
      }       
      return false;     
    } finally {       
      setIsVehicleVerifying(false);     
    }   
  };

  // Personal details form submission   
  const onPersonalSubmit = (e) => {     
    e.preventDefault();      

    if (!user || !user._id) {       
      toast.error('User not logged in');       
      return;     
    }      

    if (!isPanVerified) {       
      toast.error('Please verify your PAN number first');       
      return;     
    }      

    if (!isAadharVerified) {       
      toast.error('Please verify your Aadhar number first');       
      return;     
    }      

    setPersonalDataValidated(true);     
    toast.success('Personal details validated successfully');     
    setCurrentStep(2);   
  };    

  // Vehicle details form submission and payment redirect
  const onVehicleSubmit = async (e) => {     
    e.preventDefault();      

    if (!personalDataValidated) {       
      toast.error('Please complete personal details first');       
      return;     
    }      

    // Validate all vehicle fields are filled     
    if (!vehicleData.registrationNumber || !vehicleData.chassisNumber || !vehicleData.engineNumber) {       
      toast.error('Please fill all required vehicle details');       
      return;     
    }      

    // Call vehicle verification API and wait for result     
    const verificationSuccess = await handleVerifyVehicle();      

    if (verificationSuccess) {       
      setVehicleDataValidated(true);       
      toast.success('Vehicle details validated successfully');              

      // Prepare payloads for both personal and vehicle data       
      const personalPayload = {         
        authUserId: user._id,         
        fullName: personalData.fullName,         
        dob: personalData.dob,         
        aadharNumber: personalData.aadharNumber,         
        panNumber: personalData.panNumber,         
        address: {           
          line1: personalData.line1,           
          city: personalData.city,           
          state: personalData.state,           
          pincode: personalData.pincode,         
        },       
      };        

      const vehiclePayload = {         
        ownerId: user._id,         
        registrationNumber: vehicleData.registrationNumber,         
        vehicleType: vehicleData.vehicleType,         
        chassisNumber: vehicleData.chassisNumber,         
        engineNumber: vehicleData.engineNumber,         
        model: vehicleData.model,         
        fuelType: vehicleData.fuelType,         
        registrationYear: parseInt(vehicleData.registrationYear),       
      };        

      // Calculate amount based on vehicle type       
      const amount = vehicleClassAmounts[vehicleData.vehicleType] || 500;

      console.log('All verification complete. Preparing for payment redirect...');       
      console.log('Personal payload:', personalPayload);       
      console.log('Vehicle payload:', vehiclePayload);
      console.log('Payment amount:', amount);       

      // Store data in localStorage before redirecting to payment
      localStorage.setItem('fasttagPersonalData', JSON.stringify(personalPayload));
      localStorage.setItem('fasttagVehicleData', JSON.stringify(vehiclePayload));

      // Prepare payment data
      const paymentData = {
        amount: amount,
        vehicleType: vehicleData.vehicleType,
        registrationNumber: vehicleData.registrationNumber,
        userName: personalData.fullName,
        userEmail: user?.email || 'user@example.com',
        userId: user?._id,
        timestamp: new Date().toISOString()
      };

      toast.success('🎉 All verifications complete! Redirecting to payment...');
      
      // Navigate to payment page with payment data
      setTimeout(() => {
        navigate('/payment', { 
          state: { paymentData } 
        });
      }, 1500);
            
    } else {       
      toast.error('Please fix vehicle verification issues before proceeding');     
    }   
  };    

  const goToPreviousStep = () => {     
    if (currentStep === 2) {       
      setCurrentStep(1);     
    }   
  };    

  if ((personalLoading || vehicleLoading || tagLoading) && isSubmittingAll) {     
    return <Spinner />;   
  }    

  return (     
    <>       
      <BackButton />       
      <section className="heading">         
        <h1>Apply for FastTag</h1>         
        <p>Step {currentStep} of 2: {           
          currentStep === 1 ? 'Personal Information' : 'Vehicle Details'         
        }</p>         
        {isSubmittingAll && (           
          <p style={{ color: '#007bff', fontWeight: 'bold' }}>             
            💾 Saving your application to database...<br/>             
            ⏳ Please wait, this may take a few moments           
          </p>         
        )}       
      </section>        

      {/* Progress Bar (Updated for 2 steps) */}       
      <div className="progress-bar">         
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>           
          <span>1</span> Personal Details {personalDataValidated && '✓'}         
        </div>         
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>           
          <span>2</span> Vehicle Details {vehicleDataValidated && '✓'}         
        </div>       
      </div>        

      {/* Step 1: Personal Details */}       
      {currentStep === 1 && (         
        <section className="form">           
          <h2>Personal Information</h2>           
          <p style={{ color: '#666', marginBottom: '1rem' }}>             
            Fill your personal details and verify your documents           
          </p>           
          <form onSubmit={onPersonalSubmit}>             
            <div className="form-group">               
              <label>Full Name</label>               
              <input                 
                type="text"                 
                name="fullName"                 
                className="form-control"                 
                value={personalData.fullName}                 
                onChange={handlePersonalChange}                 
                required               
              />             
            </div>              

            <div className="form-group">               
              <label>Date of Birth</label>               
              <input                 
                type="date"                 
                name="dob"                 
                className="form-control"                 
                value={personalData.dob}                 
                onChange={handlePersonalChange}                 
                required               
              />             
            </div>              

            <div className="form-group">               
              <label>PAN Number</label>               
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>                 
                <input                   
                  type="text"                   
                  name="panNumber"                   
                  className="form-control"                   
                  value={personalData.panNumber}                   
                  onChange={handlePersonalChange}                   
                  placeholder="Please Enter Your Pan"                   
                  pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"                   
                  style={{ textTransform: 'uppercase', flex: 1 }}                   
                  required                 
                />                 
                <button                   
                  type="button"                   
                  onClick={handleVerifyPAN}                   
                  disabled={!personalData.panNumber || isPanVerifying || isPanVerified}                   
                  style={{                     
                    padding: '10px 16px',                     
                    backgroundColor: isPanVerified ? '#28a745' : '#007bff',                     
                    color: 'white',                     
                    border: 'none',                     
                    borderRadius: '4px',                     
                    cursor: (!personalData.panNumber || isPanVerifying || isPanVerified) ? 'not-allowed' : 'pointer',                     
                    minWidth: '100px',                     
                    fontSize: '14px',                     
                    fontWeight: '500',                     
                    opacity: (!personalData.panNumber || isPanVerifying) && !isPanVerified ? '0.6' : '1'                   
                  }}                 
                >                   
                  {isPanVerifying ? 'Verifying...' : isPanVerified ? '✓ Verified' : 'Verify'}                 
                </button>               
              </div>               
              {isPanVerified && (                 
                <small style={{ color: '#28a745', fontSize: '0.9rem', marginTop: '5px', display: 'block' }}>                   
                  ✅ PAN number verified successfully                 
                </small>               
              )}             
            </div>              

            <div className="form-group">               
              <label>Aadhar Number (16-digit)</label>               
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>                 
                <input                   
                  type="text"                   
                  name="aadharNumber"                   
                  className="form-control"                   
                  value={personalData.aadharNumber}                   
                  onChange={(e) => {                     
                    handlePersonalChange(e);                     
                    // Reset OTP states when Aadhar number changes                     
                    setIsOtpSent(false);                     
                    setIsOtpVerified(false);                     
                    setIsAadharVerified(false);                     
                    setAadharOtp('');                     
                    setServerOtp('');                   
                  }}                   
                  placeholder="Enter 16-digit Aadhar number"                   
                  pattern="^\d{16}$"                   
                  maxLength="16"                   
                  style={{ flex: 1 }}                   
                  disabled={isOtpVerified}                   
                  required                 
                />                 
                <button                   
                  type="button"                   
                  onClick={handleSendAadharOtp}                   
                  disabled={!personalData.aadharNumber || isAadharVerifying || isOtpVerified}                   
                  style={{                     
                    padding: '10px 16px',                     
                    backgroundColor: isOtpVerified ? '#28a745' : isOtpSent ? '#ffc107' : '#007bff',                     
                    color: isOtpSent && !isOtpVerified ? '#000' : 'white',                     
                    border: 'none',                     
                    borderRadius: '4px',                     
                    cursor: (!personalData.aadharNumber || isAadharVerifying || isOtpVerified) ? 'not-allowed' : 'pointer',                     
                    minWidth: '100px',                     
                    fontSize: '14px',                     
                    fontWeight: '500',                     
                    opacity: (!personalData.aadharNumber || isAadharVerifying) && !isOtpVerified ? '0.6' : '1'                   
                  }}                 
                >                   
                  {isAadharVerifying ? 'Sending...' :                     
                    isOtpVerified ? '✓ Verified' :                     
                    isOtpSent ? 'Resend OTP' : 'Send OTP'}                 
                </button>               
              </div>                

              {/* OTP Input Field - Appears after OTP is sent */}               
              {isOtpSent && !isOtpVerified && (                 
                <div style={{                    
                  marginTop: '15px',                    
                  padding: '15px',                    
                  backgroundColor: '#f8f9fa',                    
                  borderRadius: '8px',                   
                  border: '1px solid #e9ecef'                 
                }}>                   
                  <label style={{                      
                    fontSize: '14px',                      
                    fontWeight: '600',                      
                    marginBottom: '8px',                     
                    display: 'block',                     
                    color: '#495057'                   
                  }}>                     
                    Enter 6-digit OTP sent to your registered mobile number                   
                  </label>                   
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>                     
                    <input                       
                      type="text"                       
                      className="form-control"                       
                      value={aadharOtp}                       
                      onChange={(e) => {                         
                        const otp = e.target.value.replace(/\D/g, ''); // Only allow digits                         
                        if (otp.length <= 6) {                           
                          setAadharOtp(otp);                                                      
                          // Auto-verify when 6 digits are entered                           
                          if (otp.length === 6) {                             
                            setTimeout(() => {                               
                              handleVerifyOtp();                             
                            }, 500); // Small delay for better UX                           
                          }                         
                        }                       
                      }}                       
                      placeholder="Enter OTP"                       
                      maxLength="6"                       
                      style={{                          
                        flex: 1,                         
                        textAlign: 'center',                         
                        fontSize: '18px',                         
                        letterSpacing: '2px',                         
                        fontWeight: '600'                       
                      }}                       
                      autoComplete="off"                       
                      required                     
                    />                     
                    <button                       
                      type="button"                       
                      onClick={handleVerifyOtp}                       
                      disabled={aadharOtp.length !== 6}                       
                      style={{                         
                        padding: '10px 16px',                         
                        backgroundColor: aadharOtp.length === 6 ? '#28a745' : '#6c757d',                         
                        color: 'white',                         
                        border: 'none',                         
                        borderRadius: '4px',                         
                        cursor: aadharOtp.length === 6 ? 'pointer' : 'not-allowed',                         
                        minWidth: '100px',                         
                        fontSize: '14px',                         
                        fontWeight: '500'                       
                      }}                     
                    >                       
                      Verify OTP                     
                    </button>                   
                  </div>                   
                  <small style={{                      
                    color: '#6c757d',                      
                    fontSize: '12px',                      
                    marginTop: '8px',                      
                    display: 'block'                    
                  }}>                     
                    Didn't receive OTP? Click "Resend OTP" button above                   
                  </small>                 
                </div>               
              )}                

              {/* Success Message */}               
              {isOtpVerified && isAadharVerified && (                 
                <div style={{                    
                  marginTop: '10px',                   
                  padding: '10px',                   
                  backgroundColor: '#d4edda',                   
                  border: '1px solid #c3e6cb',                   
                  borderRadius: '4px'                 
                }}>                   
                  <small style={{                      
                    color: '#155724',                      
                    fontSize: '14px',                      
                    fontWeight: '600',                     
                    display: 'flex',                     
                    alignItems: 'center',                     
                    gap: '5px'                   
                  }}>                     
                    ✅ Aadhar number verified successfully                   
                  </small>                 
                </div>               
              )}             
            </div>              

            <div className="form-group">               
              <label>Address Line 1</label>               
              <input                 
                type="text"                 
                name="line1"                 
                className="form-control"                 
                value={personalData.line1}                 
                onChange={handlePersonalChange}                 
                required               
              />             
            </div>              

            <div className="form-group">               
              <label>City</label>               
              <input                 
                type="text"                 
                name="city"                 
                className="form-control"                 
                value={personalData.city}                 
                onChange={handlePersonalChange}                 
                required               
              />             
            </div>              

            <div className="form-group">               
              <label>State</label>               
              <input                 
                type="text"                 
                name="state"                 
                className="form-control"                 
                value={personalData.state}                 
                onChange={handlePersonalChange}                 
                required               
              />             
            </div>              

            <div className="form-group">               
              <label>Pincode</label>               
              <input                 
                type="text"                 
                name="pincode"                 
                className="form-control"                 
                value={personalData.pincode}                 
                onChange={handlePersonalChange}                 
                pattern="^\d{6}$"                 
                placeholder="123456"                 
                required               
              />             
            </div>              

            <div className="form-group">               
              <button                  
                type="submit"                  
                className="btn btn-block"                 
                disabled={!isPanVerified || !isAadharVerified}               
              >                 
                Next: Vehicle Details               
              </button>               
              {(!isPanVerified || !isAadharVerified) && (                 
                <small style={{ color: '#dc3545', fontSize: '0.9rem', marginTop: '5px', display: 'block' }}>                   
                  Please verify both PAN and Aadhar numbers to proceed                 
                </small>               
              )}             
            </div>           
          </form>         
        </section>       
      )}        

      {/* Step 2: Vehicle Details */}       
      {currentStep === 2 && (         
        <section className="form">           
          <h2>Vehicle Information</h2>           
          <p style={{ color: '#666', marginBottom: '1rem' }}>             
            Fill all vehicle details. After verification, you'll be redirected to payment.           
          </p>           
          
          {/* Payment Success Status - Show at top when processing after payment */}
          {isSubmittingAll && (
            <div style={{
              padding: '1rem',
              marginBottom: '1rem',
              backgroundColor: '#e7f3ff',
              border: '1px solid #b3d9ff',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#0066cc', margin: '0 0 0.5rem 0' }}>
                💾 Processing Your FastTag Application
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1rem' }}>
                <div style={{ color: personalSubmitted ? '#28a745' : '#6c757d' }}>
                  {personalSubmitted ? '✅' : '⏳'} Personal Details
                </div>
                <div style={{ color: vehicleSubmitted ? '#28a745' : '#6c757d' }}>
                  {vehicleSubmitted ? '✅' : '⏳'} Vehicle Details
                </div>
                <div style={{ color: tagSubmitted ? '#28a745' : '#6c757d' }}>
                  {tagSubmitted ? '✅' : '⏳'} FastTag Creation
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={onVehicleSubmit}>             
            <div className="form-group">               
              <label>Registration Number *</label>               
              <input                 
                type="text"                 
                name="registrationNumber"                 
                className="form-control"                 
                value={vehicleData.registrationNumber}                 
                onChange={handleVehicleChange}                 
                placeholder="MH12AB1234"                 
                style={{ textTransform: 'uppercase' }}                 
                required               
              />             
            </div>              

            <div className="form-group">               
              <label>Vehicle Type (FastTag Class) *</label>               
              <select                 
                name="vehicleType"                 
                className="form-control"                 
                value={vehicleData.vehicleType}                 
                onChange={handleVehicleChange}                 
                required               
              >                 
                <option value="">Select Vehicle Class</option>                 
                <option value="Class 1 - Car / Jeep / Van">Class 1 - Car / Jeep / Van (₹500)</option>                 
                <option value="Class 2 - Light Commercial Vehicle (LCV)">Class 2 - Light Commercial Vehicle (LCV) (₹800)</option>                 
                <option value="Class 3 - Bus / Truck (2 Axles)">Class 3 - Bus / Truck (2 Axles) (₹1200)</option>                 
                <option value="Class 4 - 3-Axle Commercial Vehicles">Class 4 - 3-Axle Commercial Vehicles (₹1500)</option>                 
                <option value="Class 5 - 4 to 6 Axle Vehicles">Class 5 - 4 to 6 Axle Vehicles (₹2000)</option>                 
                <option value="Class 6 - 7 or more Axle Vehicles">Class 6 - 7 or more Axle Vehicles (₹2500)</option>                 
                <option value="Class 7 - Oversized Vehicles (Earth movers, etc.)">Class 7 - Oversized Vehicles (Earth movers, etc.) (₹3000)</option>               
              </select>               
              {vehicleData.vehicleType && (                 
                <small style={{ color: '#007bff', fontSize: '0.9rem', marginTop: '5px', display: 'block' }}>                   
                  💰 FastTag Fee: ₹{vehicleClassAmounts[vehicleData.vehicleType]}                 
                </small>               
              )}             
            </div>              

            <div className="form-group">               
              <label>Chassis Number *</label>               
              <input                 
                type="text"                 
                name="chassisNumber"                 
                className="form-control"                 
                value={vehicleData.chassisNumber}                 
                onChange={handleVehicleChange}                 
                placeholder="MA3EUA42S00783934"                 
                style={{ textTransform: 'uppercase' }}                 
                required               
              />             
            </div>              

            <div className="form-group">               
              <label>Engine Number *</label>               
              <input                 
                type="text"                 
                name="engineNumber"                 
                className="form-control"                 
                value={vehicleData.engineNumber}                 
                onChange={handleVehicleChange}                 
                placeholder="K12M56795"                 
                style={{ textTransform: 'uppercase' }}                 
                required               
              />             
            </div>              

            <div className="form-group">               
              <label>Vehicle Model *</label>               
              <input                 
                type="text"                 
                name="model"                 
                className="form-control"                 
                value={vehicleData.model}                 
                onChange={handleVehicleChange}                 
                placeholder="e.g., Swift, Activa, etc."                 
                required               
              />             
            </div>              

            <div className="form-group">               
              <label>Fuel Type *</label>               
              <select                 
                name="fuelType"                 
                className="form-control"                 
                value={vehicleData.fuelType}                 
                onChange={handleVehicleChange}                 
                required               
              >                 
                <option value="">Select Fuel Type</option>                 
                <option value="Petrol">Petrol</option>                 
                <option value="Diesel">Diesel</option>                 
                <option value="CNG">CNG</option>                 
                <option value="Electric">Electric</option>                 
                <option value="Hybrid">Hybrid</option>               
              </select>             
            </div>              

            <div className="form-group">               
              <label>Registration Year *</label>               
              <input                 
                type="number"                 
                name="registrationYear"                 
                className="form-control"                 
                value={vehicleData.registrationYear}                 
                onChange={handleVehicleChange}                 
                min="1980"                 
                max={new Date().getFullYear()}                 
                required               
              />             
            </div>              

            {/* Vehicle Verification Status */}             
            {isVehicleVerified && (               
              <div style={{                  
                marginTop: '15px',                 
                padding: '15px',                 
                backgroundColor: '#d4edda',                 
                border: '1px solid #c3e6cb',                 
                borderRadius: '8px'               
              }}>                 
                <p style={{                    
                  color: '#155724',                    
                  fontSize: '16px',                    
                  fontWeight: '600',                   
                  margin: '0',                   
                  display: 'flex',                   
                  alignItems: 'center',                   
                  gap: '8px'                 
                }}>                   
                  ✅ All vehicle details verified successfully                 
                </p>               
              </div>             
            )}              

            {/* Payment Information */}             
            {vehicleData.vehicleType && (               
              <div style={{                  
                marginTop: '15px',                 
                padding: '15px',                 
                backgroundColor: '#e7f3ff',                 
                border: '1px solid #b3d9ff',                 
                borderRadius: '8px'               
              }}>                 
                <p style={{                    
                  color: '#0066cc',                    
                  fontSize: '16px',                    
                  fontWeight: '600',                   
                  margin: '0 0 8px 0'                 
                }}>                   
                  💳 Payment Summary                 
                </p>                 
                <p style={{                    
                  color: '#0066cc',                    
                  fontSize: '14px',                   
                  margin: '0'                 
                }}>                   
                  Vehicle Class: {vehicleData.vehicleType}<br/>                   
                  FastTag Fee: ₹{vehicleClassAmounts[vehicleData.vehicleType]}<br/>                   
                  After verification, you'll be redirected to payment gateway                 
                </p>               
              </div>             
            )}              

            <div className="form-group">               
              <div className="button-group">                 
                <button                    
                  type="button"                    
                  className="btn btn-secondary"                   
                  onClick={goToPreviousStep}                   
                  disabled={isVehicleVerifying || isSubmittingAll}                 
                >                   
                  Previous                 
                </button>                 
                <button                    
                  type="submit"                    
                  className="btn btn-block"                   
                  disabled={isVehicleVerifying || isSubmittingAll || !vehicleData.vehicleType}                   
                  style={{                     
                    backgroundColor: vehicleData.vehicleType ? '#28a745' : '#6c757d',                     
                    borderColor: vehicleData.vehicleType ? '#28a745' : '#6c757d'                   
                  }}                 
                >                   
                  {isSubmittingAll ? 'Processing Application...' :                     
                    isVehicleVerifying ? 'Verifying Vehicle...' :                     
                    vehicleData.vehicleType ?                     
                    `Verify & Continue to Payment ₹${vehicleClassAmounts[vehicleData.vehicleType]}` :                     
                    'Select Vehicle Type First'}                 
                </button>               
              </div>               
              <small style={{ color: '#666', fontSize: '0.9rem', marginTop: '5px', display: 'block' }}>                 
                {vehicleData.vehicleType ?                    
                  `Vehicle details will be verified and then you'll proceed to payment of ₹${vehicleClassAmounts[vehicleData.vehicleType]}` :                   
                  'Please select a vehicle class to see the payment amount'}               
              </small>             
            </div>           
          </form>         
        </section>       
      )}     
    </>   
  ); 
}  

export default NewFastTag;