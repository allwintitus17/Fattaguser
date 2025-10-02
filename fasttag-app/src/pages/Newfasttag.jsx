
import { useEffect, useState } from 'react'; 
import { useSelector, useDispatch } from 'react-redux'; 
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify'; 
import BackButton from '../components/BackButton'; 
import Spinner from '../components/Spinner'; 
import UpiPaymentGateway from '../components/UpiPaymentGateway'; // Import the UPI component
import {    
  createPersonalDetails,    
  resetPersonal  
} from '../features/kyc/personalSlice'; 
import {    
  createVehicle,    
  resetVehicle  
} from '../features/vehicle/vehicleSlice';
import {
  createPayment,
  resetPayment,
  updatePaymentWithIds  // Add this import
} from '../features/payment/paymentSlice'; // Import payment actions

function NewFastTag() {   
  const { user } = useSelector((state) => state.auth);   
  const {      
    isLoading: personalLoading,      
    isError: personalError,      
    isSuccess: personalSuccess,      
    message: personalMessage,
    personalDetails // Add this to get created personal details
  } = useSelector((state) => state.kyc);      
  
  const {      
    isLoading: vehicleLoading,      
    isError: vehicleError,      
    isSuccess: vehicleSuccess,      
    message: vehicleMessage,
    vehicle // Add this to get created vehicle
  } = useSelector((state) => state.vehicle);

  // Payment state
  const {
    isLoading: paymentLoading,
    isError: paymentError,
    isSuccess: paymentSuccess,
    message: paymentMessage,
    paymentStatus,
    currentPayment
  } = useSelector((state) => state.payment);

  const dispatch = useDispatch();   
  const navigate = useNavigate(); 

  // Form step state (now 3 steps)
  const [currentStep, setCurrentStep] = useState(1);      
  
  // Track validation states   
  const [personalDataValidated, setPersonalDataValidated] = useState(false);   
  const [vehicleDataValidated, setVehicleDataValidated] = useState(false);
  const [dbSaveCompleted, setDbSaveCompleted] = useState(false);

  // UPI Payment Modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [createdVehicleId, setCreatedVehicleId] = useState(null);
  const [createdPersonalDetailsId, setCreatedPersonalDetailsId] = useState(null);

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

  // Handle personal success/error
  useEffect(() => {
    console.log('Personal Redux State:', { personalError, personalSuccess, personalMessage, personalDetails });
    
    if (personalError) {
      toast.error(personalMessage);
      dispatch(resetPersonal());
    }

    if (personalSuccess) {
      console.log('Personal Details Response:', personalDetails);
      toast.success('Personal details saved successfully to database');
      
      // If we have the full object, use its ID, otherwise keep the temp ID
      if (personalDetails && (personalDetails._id || personalDetails.id)) {
        setCreatedPersonalDetailsId(personalDetails._id || personalDetails.id);
      }
      // If personalDetails is null but success is true, keep the temporary ID we set earlier
    }
  }, [personalError, personalSuccess, personalMessage, personalDetails, dispatch]);

  // Handle vehicle success/error
  useEffect(() => {
    console.log('Vehicle Redux State:', { vehicleError, vehicleSuccess, vehicleMessage, vehicle });
    
    if (vehicleError) {
      toast.error(vehicleMessage);
      dispatch(resetVehicle());
    }

    if (vehicleSuccess) {
      console.log('Vehicle Response:', vehicle);
      toast.success('Vehicle details saved successfully to database');
      
      // If we have the full object, use its ID, otherwise keep the temp ID
      if (vehicle && (vehicle._id || vehicle.id)) {
        setCreatedVehicleId(vehicle._id || vehicle.id);
        console.log('Set vehicle ID:', vehicle._id || vehicle.id);
      }
      // If vehicle is null but success is true, keep the temporary ID we set earlier
    }
  }, [vehicleError, vehicleSuccess, vehicleMessage, vehicle, dispatch]);

  // Handle payment success/error
  useEffect(() => {
    if (paymentError) {
      toast.error(paymentMessage);
      dispatch(resetPayment());
    }

    if (paymentStatus === 'success') {
      setShowPaymentModal(false);
      toast.success('Payment completed successfully!');
      
      // Redirect after successful payment
      setTimeout(() => {
        navigate('/mytag');
      }, 2000);
    }
  }, [paymentError, paymentMessage, paymentStatus, dispatch, navigate]);

  // Update payment with database IDs once they're available
  useEffect(() => {
    if (createdVehicleId && createdPersonalDetailsId && currentPayment && 
        (!currentPayment.vehicleId || !currentPayment.personalDetailsId)) {
      
      // Update the payment record with the new IDs if they're missing
      console.log('Updating payment with database IDs:', {
        paymentId: currentPayment._id,
        vehicleId: createdVehicleId,
        personalDetailsId: createdPersonalDetailsId
      });
      
      // You would dispatch an update action here if needed
      // dispatch(updatePaymentWithIds({
      //   paymentId: currentPayment._id,
      //   vehicleId: createdVehicleId,
      //   personalDetailsId: createdPersonalDetailsId
      // }));
    }
  }, [createdVehicleId, createdPersonalDetailsId, currentPayment]);



  // Handle form changes   
  const handlePersonalChange = (e) => {     
    const { name, value } = e.target;     
    setPersonalData({       
      ...personalData,       
      [name]: value     
    });      
  };    

  const handleVehicleChange = (e) => {     
    const { name, value } = e.target;     
    setVehicleData({       
      ...vehicleData,       
      [name]: value     
    });      
  };    

  // Personal details form submission - SAVE TO DB IMMEDIATELY
  const onPersonalSubmit = (e) => {     
    e.preventDefault();      

    if (!user || !user._id) {       
      toast.error('User not logged in');       
      return;     
    }      

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

    // Save to database immediately
    dispatch(createPersonalDetails(personalPayload));
    setPersonalDataValidated(true);     
    toast.success('Personal details saved to database');     
    
    // Set a temporary ID as backup - will be updated by useEffect when Redux responds
    setCreatedPersonalDetailsId('temp-personal-id');
    
    setCurrentStep(2);   
  };    

  // Vehicle details form submission - SAVE TO DB IMMEDIATELY
  const onVehicleSubmit = (e) => {     
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

    // Save to database immediately
    dispatch(createVehicle(vehiclePayload));
    setVehicleDataValidated(true);       
    toast.success('Vehicle details saved to database');              
    
    // Set a temporary ID as backup - will be updated by useEffect when Redux responds
    setCreatedVehicleId('temp-vehicle-id');
    
    // Move to payment step
    setCurrentStep(3);   
  };    

  // Payment submission - uses created IDs from database
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    const amount = vehicleClassAmounts[vehicleData.vehicleType];
    
    if (!amount || isNaN(amount)) {
      toast.error('Invalid payment amount');
      return;
    }

    if (!personalDataValidated || !vehicleDataValidated) {
      toast.error('Please ensure all details are validated before proceeding to payment');
      return;
    }

    if (!createdVehicleId || !createdPersonalDetailsId) {
      toast.error('Please wait for personal and vehicle details to be saved to database first');
      return;
    }

    // Create payment record with actual database IDs
    const paymentData = {
      paymentFlag: 0, // New FastTag
      amount: parseFloat(amount),
      vehicleId: createdVehicleId, // Use actual database ID
      personalDetailsId: createdPersonalDetailsId, // Use actual database ID
      vehicleInfo: {
        registrationNumber: vehicleData.registrationNumber,
        vehicleType: vehicleData.vehicleType,
        model: vehicleData.model,
        chassisNumber: vehicleData.chassisNumber,
        engineNumber: vehicleData.engineNumber
      },
      personalInfo: {
        fullName: personalData.fullName,
        phoneNumber: user.mobile || user.phone || '0000000000',
        email: user.email,
        panNumber: personalData.panNumber,
        aadharNumber: personalData.aadharNumber
      },
      metadata: {
        deviceInfo: navigator.userAgent,
        appVersion: '1.0.0',
        source: 'web'
      }
    };

    // Dispatch payment creation
    dispatch(createPayment(paymentData));
    
    // Open UPI Payment Modal
    setShowPaymentModal(true);
  };

  // Handle payment modal close
  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
    dispatch(resetPayment());
  };

  const goToPreviousStep = () => {     
    if (currentStep === 2) {       
      setCurrentStep(1);     
    } else if (currentStep === 3) {
      setCurrentStep(2);
    }   
  };    

  if (personalLoading || vehicleLoading || paymentLoading) {     
    return <Spinner />;   
  }    

  return (     
    <>       
      <BackButton />       
      <section className="heading">         
        <h1>Apply for FastTag</h1>         
        <p>Step {currentStep} of 3: {           
          currentStep === 1 ? 'Personal Information' : 
          currentStep === 2 ? 'Vehicle Details' : 'Payment'
        }</p>       
      </section>        

      {/* Progress Bar */}       
      <div className="progress-bar">         
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>           
          <span>1</span> Personal Details {personalDataValidated && '✓'}         
        </div>         
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>           
          <span>2</span> Vehicle Details {vehicleDataValidated && '✓'}         
        </div>       
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>           
          <span>3</span> Payment {paymentStatus === 'success' && '✓'}         
        </div>       
      </div>        

      {/* Step 1: Personal Details */}       
      {currentStep === 1 && (         
        <section className="form">           
          <h2>Personal Information</h2>           
          <p style={{ color: '#666', marginBottom: '1rem' }}>             
            Fill your personal details (will be saved to database immediately)           
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
              <input                   
                type="text"                   
                name="panNumber"                   
                className="form-control"                   
                value={personalData.panNumber}                   
                onChange={handlePersonalChange}                   
                placeholder="Please Enter Your Pan"                   
                pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"                   
                style={{ textTransform: 'uppercase' }}                   
                required                 
              />                
            </div>              

            <div className="form-group">               
              <label>Aadhar Number (16-digit)</label>               
              <input                   
                type="text"                   
                name="aadharNumber"                   
                className="form-control"                   
                value={personalData.aadharNumber}                   
                onChange={handlePersonalChange}                   
                placeholder="Enter 16-digit Aadhar number"                   
                pattern="^\d{16}$"                   
                maxLength="16"                   
                required                 
              />              
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
              >                 
                Next: Vehicle Details               
              </button>            
            </div>           
          </form>         
        </section>       
      )}        

      {/* Step 2: Vehicle Details */}       
      {currentStep === 2 && (         
        <section className="form">           
          <h2>Vehicle Information</h2>           
          <p style={{ color: '#666', marginBottom: '1rem' }}>             
            Fill all vehicle details (will be saved to database immediately)           
          </p>           
          
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
                  FastTag Fee: ₹{vehicleClassAmounts[vehicleData.vehicleType]}                 
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

            <div className="form-group">               
              <div className="button-group">                 
                <button                    
                  type="button"                    
                  className="btn btn-secondary"                   
                  onClick={goToPreviousStep}                 
                >                   
                  Previous                 
                </button>                 
                <button                    
                  type="submit"                    
                  className="btn btn-block"                   
                  disabled={!vehicleData.vehicleType}                   
                  style={{                     
                    backgroundColor: vehicleData.vehicleType ? '#28a745' : '#6c757d',                     
                    borderColor: vehicleData.vehicleType ? '#28a745' : '#6c757d'                   
                  }}                 
                >                   
                  {vehicleData.vehicleType ?                     
                    'Continue to Payment' :                     
                    'Select Vehicle Type First'}                 
                </button>               
              </div>               
              <small style={{ color: '#666', fontSize: '0.9rem', marginTop: '5px', display: 'block' }}>                 
                {vehicleData.vehicleType ?                    
                  'Proceed to payment - details will be saved after successful payment' :                   
                  'Please select a vehicle class to proceed'}               
              </small>             
            </div>           
          </form>         
        </section>       
      )}

      {/* Step 3: Payment */}
      {currentStep === 3 && (
        <section className="form">
          <h2>Payment Details</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Complete your FastTag application by making the payment
          </p>
          
          {/* Order Summary Card */}
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '2rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ 
              color: '#495057', 
              marginBottom: '1.5rem',
              fontSize: '1.5rem',
              fontWeight: '600' 
            }}>
              Order Summary
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '0.5rem',
                color: '#6c757d'
              }}>
                <span><strong>Vehicle Registration:</strong></span>
                <span style={{ fontWeight: '600', color: '#495057' }}>
                  {vehicleData.registrationNumber}
                </span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '0.5rem',
                color: '#6c757d'
              }}>
                <span><strong>Vehicle Type:</strong></span>
                <span style={{ fontWeight: '600', color: '#495057' }}>
                  {vehicleData.vehicleType}
                </span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '0.5rem',
                color: '#6c757d'
              }}>
                <span><strong>Vehicle Model:</strong></span>
                <span style={{ fontWeight: '600', color: '#495057' }}>
                  {vehicleData.model}
                </span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '1rem',
                color: '#6c757d'
              }}>
                <span><strong>Customer Name:</strong></span>
                <span style={{ fontWeight: '600', color: '#495057' }}>
                  {personalData.fullName}
                </span>
              </div>
              
              <hr style={{ margin: '1rem 0', border: '1px solid #dee2e6' }} />
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                fontSize: '1.25rem',
                fontWeight: '700'
              }}>
                <span style={{ color: '#495057' }}>Total Amount:</span>
                <span style={{ 
                  color: '#28a745',
                  fontSize: '1.5rem'
                }}>
                  ₹{vehicleClassAmounts[vehicleData.vehicleType]}
                </span>
              </div>
            </div>
            
            {/* Payment Info Notice */}
            <div style={{
              backgroundColor: (!createdVehicleId || !createdPersonalDetailsId) ? '#fff3cd' : '#e7f3ff',
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '1rem',
              border: `1px solid ${(!createdVehicleId || !createdPersonalDetailsId) ? '#ffeaa7' : '#bee5eb'}`
            }}>
              <h4 style={{ 
                color: (!createdVehicleId || !createdPersonalDetailsId) ? '#856404' : '#0c5460', 
                marginBottom: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600'
              }}>
                {(!createdVehicleId || !createdPersonalDetailsId) ? 'Saving to Database...' : 'Ready for Payment:'}
              </h4>
              <p style={{ 
                margin: '0',
                color: (!createdVehicleId || !createdPersonalDetailsId) ? '#856404' : '#0c5460',
                fontSize: '0.9rem'
              }}>
                {(!createdVehicleId || !createdPersonalDetailsId) ? 
                  'Please wait while we save your details to the database. Payment will be available once saving is complete.' :
                  'Your personal and vehicle details have been saved to the database. Complete your payment to activate your FastTag.'
                }
              </p>
            </div>
            
            {/* Payment Features */}
            <div style={{
              backgroundColor: '#e7f3ff',
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '1rem'
            }}>
              <h4 style={{ 
                color: '#0066cc', 
                marginBottom: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600'
              }}>
                What you get:
              </h4>
              <ul style={{ 
                margin: '0',
                paddingLeft: '1.5rem',
                color: '#0066cc'
              }}>
                <li>Digital FastTag delivered instantly</li>
                <li>24/7 toll payment convenience</li>
                <li>SMS and email notifications</li>
                <li>Online recharge facility</li>
                <li>Transaction history tracking</li>
              </ul>
            </div>
          </div>
          
          <form onSubmit={handlePaymentSubmit}>
            <div className="form-group">
              <div className="button-group">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={goToPreviousStep}
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="btn btn-block"
                  style={{
                    backgroundColor: '#28a745',
                    borderColor: '#28a745',
                    fontSize: '1.1rem',
                    padding: '12px 24px',
                    fontWeight: '600'
                  }}
                  disabled={!personalDataValidated || !vehicleDataValidated || !createdVehicleId || !createdPersonalDetailsId}
                >
                  {(!createdVehicleId || !createdPersonalDetailsId) ? 
                    'Saving details to database...' : 
                    `Pay ₹${vehicleClassAmounts[vehicleData.vehicleType]} via UPI`
                  }
                </button>
              </div>
              <small style={{ 
                color: '#666', 
                fontSize: '0.9rem', 
                marginTop: '1rem', 
                display: 'block',
                textAlign: 'center'
              }}>
                {(!createdVehicleId || !createdPersonalDetailsId) ? 
                  'Please wait - saving your details to database first' : 
                  'Secure UPI payment gateway - Ready to proceed'
                }
              </small>
            </div>
          </form>
          
          {/* Security Info */}
          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            padding: '1rem',
            marginTop: '1.5rem',
            textAlign: 'center'
          }}>
            <p style={{ 
              margin: '0',
              color: '#856404',
              fontSize: '0.9rem'
            }}>
              🔒 Your payment is secured with bank-grade encryption
            </p>
          </div>
        </section>
      )}

      {/* UPI Payment Gateway Modal */}
      <UpiPaymentGateway
        isOpen={showPaymentModal}
        onClose={handlePaymentModalClose}
        amount={vehicleClassAmounts[vehicleData.vehicleType]}
        vehicleData={vehicleData}
        personalData={personalData}
        user={user}
        vehicleId={createdVehicleId}
        personalDetailsId={createdPersonalDetailsId}
      />

      {/* Success Message after payment completion */}
      {paymentStatus === 'success' && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#d4edda',
          border: '2px solid #c3e6cb',
          borderRadius: '12px',
          padding: '2rem',
          zIndex: 1000,
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '48px', color: '#28a745', marginBottom: '1rem' }}>
            ✅
          </div>
          <h3 style={{ color: '#155724', marginBottom: '1rem' }}>
            FastTag Application Completed!
          </h3>
          <p style={{ color: '#155724', marginBottom: '1rem' }}>
            Redirecting to My Tags page...
          </p>
          <div style={{
            width: '100%',
            height: '4px',
            backgroundColor: '#c3e6cb',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#28a745',
              animation: 'progress 2s linear forwards'
            }}></div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        
        .button-group {
          display: flex;
          gap: 1rem;
        }
        
        .button-group .btn-secondary {
          flex: 1;
        }
        
        .button-group .btn-block {
          flex: 2;
        }
        
        .progress-bar {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2rem;
          padding: 0 1rem;
        }
        
        .step {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          background-color: #f8f9fa;
          color: #6c757d;
          font-weight: 500;
        }
        
        .step.active {
          background-color: #007bff;
          color: white;
        }
        
        .step span {
          background-color: #fff;
          color: #007bff;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
        }
        
        .step.active span {
          background-color: #28a745;
          color: white;
        }
      `}</style>
    </>   
  ); 
}  
export default NewFastTag;
