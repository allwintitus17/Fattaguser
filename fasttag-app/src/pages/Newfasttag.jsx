import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
  createBankDetails, 
  resetBank 
} from '../features/bank/bankSlice';

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

  const { 
    isLoading: bankLoading, 
    isError: bankError, 
    isSuccess: bankSuccess, 
    message: bankMessage 
  } = useSelector((state) => state.bank);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form step state
  const [currentStep, setCurrentStep] = useState(1);
  
  // Track validation states
  const [personalDataValidated, setPersonalDataValidated] = useState(false);
  const [vehicleDataValidated, setVehicleDataValidated] = useState(false);
  
  // Track submission state
  const [isSubmittingAll, setIsSubmittingAll] = useState(false);
  const [personalSubmitted, setPersonalSubmitted] = useState(false);
  const [vehicleSubmitted, setVehicleSubmitted] = useState(false);
  const [bankSubmitted, setBankSubmitted] = useState(false);

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

  // Bank Details State
  const [bankData, setBankData] = useState({
    accountHolderName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    upiId: '',
    linkedMobileNumber: '',
    accountType: '',
    consentToDebit: false
  });

  // Handle form changes
  const handlePersonalChange = (e) => {
    setPersonalData({
      ...personalData,
      [e.target.name]: e.target.value
    });
  };

  const handleVehicleChange = (e) => {
    setVehicleData({
      ...vehicleData,
      [e.target.name]: e.target.value
    });
  };

  const handleBankChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBankData({
      ...bankData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle submission success states
  useEffect(() => {
    if (personalError && isSubmittingAll) {
      toast.error(personalMessage);
      setIsSubmittingAll(false);
      setPersonalSubmitted(false);
    }

    if (personalSuccess && isSubmittingAll) {
      setPersonalSubmitted(true);
      dispatch(resetPersonal());
    }
  }, [personalError, personalSuccess, personalMessage, dispatch, isSubmittingAll]);

  useEffect(() => {
    if (vehicleError && isSubmittingAll) {
      toast.error(vehicleMessage);
      setIsSubmittingAll(false);
      setVehicleSubmitted(false);
    }

    if (vehicleSuccess && isSubmittingAll) {
      setVehicleSubmitted(true);
      dispatch(resetVehicle());
    }
  }, [vehicleError, vehicleSuccess, vehicleMessage, dispatch, isSubmittingAll]);

  useEffect(() => {
    if (bankError && isSubmittingAll) {
      toast.error(bankMessage);
      setIsSubmittingAll(false);
      setBankSubmitted(false);
    }

    if (bankSuccess && isSubmittingAll) {
      setBankSubmitted(true);
      dispatch(resetBank());
    }
  }, [bankError, bankSuccess, bankMessage, dispatch, isSubmittingAll]);

  // Check if all submissions are complete
  useEffect(() => {
    if (personalSubmitted && vehicleSubmitted && bankSubmitted) {
      toast.success('FastTag application completed successfully! All details saved.');
      navigate('/dashboard');
      // Reset states
      setIsSubmittingAll(false);
      setPersonalSubmitted(false);
      setVehicleSubmitted(false);
      setBankSubmitted(false);
    }
  }, [personalSubmitted, vehicleSubmitted, bankSubmitted, navigate]);

  const onPersonalSubmit = (e) => {
    e.preventDefault();

    if (!user || !user._id) {
      toast.error('User not logged in');
      return;
    }

    setPersonalDataValidated(true);
    toast.success('Personal details validated successfully');
    setCurrentStep(2);
  };

  const onVehicleSubmit = (e) => {
    e.preventDefault();

    if (!personalDataValidated) {
      toast.error('Please complete personal details first');
      return;
    }

    setVehicleDataValidated(true);
    toast.success('Vehicle details validated successfully');
    setCurrentStep(3);
  };

  const onBankSubmit = (e) => {
    e.preventDefault();

    if (!user || !user._id) {
      toast.error('User not logged in');
      return;
    }

    if (!personalDataValidated || !vehicleDataValidated) {
      toast.error('Please complete all previous steps first');
      return;
    }

    // Validate account numbers match
    if (bankData.accountNumber !== bankData.confirmAccountNumber) {
      toast.error('Account numbers do not match');
      return;
    }

    // Start the submission process for all three forms
    setIsSubmittingAll(true);

    // Prepare all payloads
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

    const bankPayload = {
      ownerId: user._id,
      accountHolderName: bankData.accountHolderName,
      accountNumber: bankData.accountNumber,
      confirmAccountNumber: bankData.confirmAccountNumber,
      ifscCode: bankData.ifscCode,
      bankName: bankData.bankName,
      branchName: bankData.branchName,
      upiId: bankData.upiId,
      linkedMobileNumber: bankData.linkedMobileNumber,
      accountType: bankData.accountType,
      consentToDebit: bankData.consentToDebit,
    };

    console.log('Submitting all three forms:');
    console.log('Personal details:', personalPayload);
    console.log('Vehicle details:', vehiclePayload);
    console.log('Bank details:', bankPayload);

    // Dispatch all three actions
    dispatch(createPersonalDetails(personalPayload));
    dispatch(createVehicle(vehiclePayload));
    dispatch(createBankDetails(bankPayload));
  };

  const goToPreviousStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    }
  };

  if ((personalLoading || vehicleLoading || bankLoading) && isSubmittingAll) {
    return <Spinner />;
  }

  // Indian Banks List
  const indianBanks = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Canara Bank',
    'Union Bank of India',
    'Bank of India',
    'Central Bank of India',
    'Indian Bank',
    'IDBI Bank',
    'Federal Bank',
    'South Indian Bank',
    'Karnataka Bank',
    'Karur Vysya Bank',
    'City Union Bank',
    'DCB Bank',
    'RBL Bank',
    'IndusInd Bank',
    'YES Bank',
    'IDFC First Bank',
    'Bandhan Bank',
    'CSB Bank',
    'Equitas Small Finance Bank',
    'Ujjivan Small Finance Bank',
    'AU Small Finance Bank',
    'Jana Small Finance Bank',
    'Capital Small Finance Bank',
    'ESAF Small Finance Bank',
    'North East Small Finance Bank',
    'Suryoday Small Finance Bank',
    'Utkarsh Small Finance Bank',
    'Fincare Small Finance Bank'
  ];

  return (
    <>
      <BackButton />
      <section className="heading">
        <h1>Apply for FastTag</h1>
        <p>Step {currentStep} of 3: {
          currentStep === 1 ? 'Personal Information' : 
          currentStep === 2 ? 'Vehicle Details' : 
          'Bank/Wallet Details'
        }</p>
        {isSubmittingAll && (
          <p style={{ color: '#007bff', fontWeight: 'bold' }}>
            Submitting all application details...
          </p>
        )}
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
          <span>3</span> Bank Details
        </div>
      </div>

      {/* Step 1: Personal Details */}
      {currentStep === 1 && (
        <section className="form">
          <h2>Personal Information</h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Fill your personal details (will be saved after completing all steps)
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
              <label>Aadhar Number (Format: XXXX-XXXX-XXXX)</label>
              <input
                type="text"
                name="aadharNumber"
                className="form-control"
                value={personalData.aadharNumber}
                onChange={handlePersonalChange}
                placeholder="1234-5678-9012"
                pattern="^\d{4}-\d{4}-\d{4}$"
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
                placeholder="ABCDE1234F"
                pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
                style={{ textTransform: 'uppercase' }}
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
              <button type="submit" className="btn btn-block">
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
            Fill vehicle details (will be saved after completing bank details)
          </p>
          <form onSubmit={onVehicleSubmit}>
            <div className="form-group">
              <label>Registration Number</label>
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
              <label>Vehicle Type (FastTag Class)</label>
              <select
                name="vehicleType"
                className="form-control"
                value={vehicleData.vehicleType}
                onChange={handleVehicleChange}
                required
              >
                <option value="">Select Vehicle Class</option>
                <option value="Class 1 - Car / Jeep / Van">Class 1 - Car / Jeep / Van</option>
                <option value="Class 2 - Light Commercial Vehicle (LCV)">Class 2 - Light Commercial Vehicle (LCV)</option>
                <option value="Class 3 - Bus / Truck (2 Axles)">Class 3 - Bus / Truck (2 Axles)</option>
                <option value="Class 4 - 3-Axle Commercial Vehicles">Class 4 - 3-Axle Commercial Vehicles</option>
                <option value="Class 5 - 4 to 6 Axle Vehicles">Class 5 - 4 to 6 Axle Vehicles</option>
                <option value="Class 6 - 7 or more Axle Vehicles">Class 6 - 7 or more Axle Vehicles</option>
                <option value="Class 7 - Oversized Vehicles (Earth movers, etc.)">Class 7 - Oversized Vehicles (Earth movers, etc.)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Chassis Number</label>
              <input
                type="text"
                name="chassisNumber"
                className="form-control"
                value={vehicleData.chassisNumber}
                onChange={handleVehicleChange}
                style={{ textTransform: 'uppercase' }}
                required
              />
            </div>

            <div className="form-group">
              <label>Engine Number</label>
              <input
                type="text"
                name="engineNumber"
                className="form-control"
                value={vehicleData.engineNumber}
                onChange={handleVehicleChange}
                style={{ textTransform: 'uppercase' }}
                required
              />
            </div>

            <div className="form-group">
              <label>Vehicle Model</label>
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
              <label>Fuel Type</label>
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
              <label>Registration Year</label>
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
                <button type="submit" className="btn btn-block">
                  Next: Bank Details
                </button>
              </div>
            </div>
          </form>
        </section>
      )}

      {/* Step 3: Bank Details */}
      {currentStep === 3 && (
        <section className="form">
          <h2>Bank/Wallet Details</h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Complete bank details to submit entire FastTag application
          </p>
          <form onSubmit={onBankSubmit}>
            <div className="form-group">
              <label>Account Holder Name *</label>
              <input
                type="text"
                name="accountHolderName"
                className="form-control"
                value={bankData.accountHolderName}
                onChange={handleBankChange}
                placeholder="As per bank records"
                required
              />
            </div>

            <div className="form-group">
              <label>Account Number *</label>
              <input
                type="text"
                name="accountNumber"
                className="form-control"
                value={bankData.accountNumber}
                onChange={handleBankChange}
                placeholder="Enter 9-18 digit account number"
                pattern="^\d{9,18}$"
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Account Number *</label>
              <input
                type="text"
                name="confirmAccountNumber"
                className="form-control"
                value={bankData.confirmAccountNumber}
                onChange={handleBankChange}
                placeholder="Re-enter account number"
                pattern="^\d{9,18}$"
                required
              />
            </div>

            <div className="form-group">
              <label>IFSC Code *</label>
              <input
                type="text"
                name="ifscCode"
                className="form-control"
                value={bankData.ifscCode}
                onChange={handleBankChange}
                placeholder="SBIN0001234"
                pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
                style={{ textTransform: 'uppercase' }}
                maxLength="11"
                required
              />
            </div>

            <div className="form-group">
              <label>Bank Name *</label>
              <select
                name="bankName"
                className="form-control"
                value={bankData.bankName}
                onChange={handleBankChange}
                required
              >
                <option value="">Select Bank</option>
                {indianBanks.map((bank, index) => (
                  <option key={index} value={bank}>{bank}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Branch Name</label>
              <input
                type="text"
                name="branchName"
                className="form-control"
                value={bankData.branchName}
                onChange={handleBankChange}
                placeholder="Optional - can be auto-fetched"
              />
            </div>

            <div className="form-group">
              <label>UPI ID</label>
              <input
                type="text"
                name="upiId"
                className="form-control"
                value={bankData.upiId}
                onChange={handleBankChange}
                placeholder="yourname@upi (Optional)"
                pattern="^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z0-9.\-]{2,64}$"
              />
            </div>

            <div className="form-group">
              <label>Linked Mobile Number *</label>
              <input
                type="text"
                name="linkedMobileNumber"
                className="form-control"
                value={bankData.linkedMobileNumber}
                onChange={handleBankChange}
                placeholder="9876543210"
                pattern="^[6-9]\d{9}$"
                maxLength="10"
                required
              />
            </div>

            <div className="form-group">
              <label>Account Type *</label>
              <select
                name="accountType"
                className="form-control"
                value={bankData.accountType}
                onChange={handleBankChange}
                required
              >
                <option value="">Select Account Type</option>
                <option value="Savings">Savings</option>
                <option value="Current">Current</option>
                <option value="Salary">Salary</option>
                <option value="NRI">NRI</option>
                <option value="Joint">Joint</option>
              </select>
            </div>

            <div className="form-group">
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="consentToDebit"
                    checked={bankData.consentToDebit}
                    onChange={handleBankChange}
                    required
                  />
                  <span className="checkmark"></span>
                  I consent to auto-debit for FastTag recharge and toll payments *
                </label>
              </div>
            </div>

            <div className="form-group">
              <div className="button-group">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={goToPreviousStep}
                  disabled={isSubmittingAll}
                >
                  Previous
                </button>
                <button 
                  type="submit" 
                  className="btn btn-block"
                  disabled={isSubmittingAll}
                >
                  {isSubmittingAll ? 'Submitting...' : 'Submit Complete FastTag Application'}
                </button>
              </div>
            </div>
          </form>
        </section>
      )}
    </>
  );
}

export default NewFastTag;