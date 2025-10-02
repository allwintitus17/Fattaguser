// import { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import JsBarcode from 'jsbarcode';
// import BackButton from '../components/BackButton';
// import Spinner from '../components/Spinner';
// import {
//   getUserTags,
//   getUserTagStats,
//   getTagTransactions,
//   rechargeTag,
//   toggleTagBlockStatus,
//   reset
// } from '../features/tag/tagSlice';

// function MyTag() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { user } = useSelector((state) => state.auth);
//   const {
//     tags,
//     currentTag,
//     tagStats,
//     transactions,
//     isLoading,
//     isError,
//     isSuccess,
//     message,
//     pagination
//   } = useSelector((state) => state.tag);

//   const [selectedTag, setSelectedTag] = useState(null);
//   const [showRechargeModal, setShowRechargeModal] = useState(false);
//   const [rechargeAmount, setRechargeAmount] = useState('');
//   const [showTransactions, setShowTransactions] = useState(false);
//   const [activeTab, setActiveTab] = useState('overview');

//   useEffect(() => {
//     if (!user) {
//       navigate('/login');
//       return;
//     }

//     // Fetch user tags and statistics
//     dispatch(getUserTags());
//     dispatch(getUserTagStats());
//   }, [user, navigate, dispatch]);

//   useEffect(() => {
//     if (isError) {
//       toast.error(message);
//       dispatch(reset());
//     }

//     if (isSuccess) {
//       dispatch(reset());
//     }
//   }, [isError, isSuccess, message, dispatch]);

//   // Generate barcode for a tag
//   const generateBarcode = (tagId) => {
//     const canvas = document.createElement('canvas');
//     try {
//       JsBarcode(canvas, tagId, {
//         format: "CODE128",
//         width: 2,
//         height: 100,
//         displayValue: true,
//         fontSize: 14,
//         textMargin: 10
//       });
//       return canvas.toDataURL();
//     } catch (error) {
//       console.error('Barcode generation error:', error);
//       return null;
//     }
//   };

//   // Handle tag selection
//   const selectTag = (tag) => {
//     setSelectedTag(tag);
//     // Generate barcode for selected tag
//     if (tag.tagId) {
//       setTimeout(() => {
//         const barcodeImage = generateBarcode(tag.tagId);
//         if (barcodeImage) {
//           setSelectedTag(prev => ({ ...prev, barcodeImage }));
//         }
//       }, 100);
//     }
//   };

//   // Handle recharge
//   const handleRecharge = () => {
//     if (!rechargeAmount || parseFloat(rechargeAmount) <= 0) {
//       toast.error('Please enter a valid amount');
//       return;
//     }

//     if (!selectedTag) {
//       toast.error('Please select a FastTag');
//       return;
//     }

//     // In a real app, you would process payment first and then recharge
//     dispatch(rechargeTag({
//       tagId: selectedTag.tagId,
//       amount: parseFloat(rechargeAmount),
//       description: `Manual recharge of ₹${rechargeAmount}`
//     }));

//     setRechargeAmount('');
//     setShowRechargeModal(false);
//     toast.success('Recharge successful!');
//   };

//   // Handle view transactions
//   const handleViewTransactions = (tag) => {
//     setSelectedTag(tag);
//     dispatch(getTagTransactions({
//       tagId: tag.tagId,
//       page: 1,
//       limit: 10
//     }));
//     setShowTransactions(true);
//   };

//   // Block/Unblock tag
//   const handleToggleBlock = (tag) => {
//     const isBlocked = tag.security?.isBlocked || false;
//     dispatch(toggleTagBlockStatus({
//       tagId: tag.tagId,
//       isBlocked: !isBlocked,
//       reason: !isBlocked ? 'User requested block' : null
//     }));
//   };

//   // Get balance status color
//   const getBalanceStatusColor = (balance, minimumBalance = 100) => {
//     if (balance <= 0) return '#dc3545'; // Red for zero balance
//     if (balance < minimumBalance) return '#ffc107'; // Yellow for low balance
//     return '#28a745'; // Green for sufficient balance
//   };

//   // Get status badge color
//   const getStatusBadgeColor = (status) => {
//     switch (status) {
//       case 'active': return '#28a745';
//       case 'blocked': return '#dc3545';
//       case 'inactive': return '#6c757d';
//       case 'expired': return '#fd7e14';
//       default: return '#6c757d';
//     }
//   };

//   if (isLoading && tags.length === 0) {
//     return <Spinner />;
//   }

//   return (
//     <>
//       <BackButton />
//       <section className="heading">
//         <h1>My FastTags</h1>
//         <p>Manage your FastTag accounts and transactions</p>
//       </section>

//       {/* Statistics Cards */}
//       {tagStats && (
//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//           gap: '1rem',
//           marginBottom: '2rem'
//         }}>
//           <div style={{
//             backgroundColor: '#e7f3ff',
//             padding: '1.5rem',
//             borderRadius: '12px',
//             textAlign: 'center'
//           }}>
//             <h3 style={{ color: '#0066cc', margin: '0 0 0.5rem 0' }}>{tagStats.totalTags}</h3>
//             <p style={{ margin: 0, color: '#0066cc' }}>Total FastTags</p>
//           </div>
//           <div style={{
//             backgroundColor: '#d4edda',
//             padding: '1.5rem',
//             borderRadius: '12px',
//             textAlign: 'center'
//           }}>
//             <h3 style={{ color: '#155724', margin: '0 0 0.5rem 0' }}>₹{tagStats.totalBalance}</h3>
//             <p style={{ margin: 0, color: '#155724' }}>Total Balance</p>
//           </div>
//           <div style={{
//             backgroundColor: '#fff3cd',
//             padding: '1.5rem',
//             borderRadius: '12px',
//             textAlign: 'center'
//           }}>
//             <h3 style={{ color: '#856404', margin: '0 0 0.5rem 0' }}>{tagStats.totalTrips}</h3>
//             <p style={{ margin: 0, color: '#856404' }}>Total Trips</p>
//           </div>
//         </div>
//       )}

//       {/* No Tags Message */}
//       {tags.length === 0 && (
//         <div style={{
//           textAlign: 'center',
//           padding: '3rem',
//           backgroundColor: '#f8f9fa',
//           borderRadius: '12px',
//           marginBottom: '2rem'
//         }}>
//           <div style={{ fontSize: '48px', marginBottom: '1rem', opacity: 0.5 }}>🚗</div>
//           <h3 style={{ color: '#6c757d', marginBottom: '1rem' }}>No FastTags Found</h3>
//           <p style={{ color: '#6c757d', marginBottom: '2rem' }}>
//             You haven't created any FastTags yet. Apply for a new FastTag to get started.
//           </p>
//           <button
//             onClick={() => navigate('/newfasttag')}
//             style={{
//               backgroundColor: '#007bff',
//               color: 'white',
//               border: 'none',
//               padding: '12px 24px',
//               borderRadius: '8px',
//               fontSize: '16px',
//               fontWeight: '600',
//               cursor: 'pointer'
//             }}
//           >
//             Apply for FastTag
//           </button>
//         </div>
//       )}

//       {/* Tags List */}
//       {tags.length > 0 && (
//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: selectedTag ? '1fr 2fr' : '1fr',
//           gap: '2rem'
//         }}>
//           {/* Tags List Panel */}
//           <div>
//             <h2 style={{ marginBottom: '1rem' }}>Your FastTags</h2>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//               {tags.map((tag) => (
//                 <div
//                   key={tag._id}
//                   onClick={() => selectTag(tag)}
//                   style={{
//                     padding: '1.5rem',
//                     border: selectedTag?._id === tag._id ? '2px solid #007bff' : '1px solid #ddd',
//                     borderRadius: '12px',
//                     cursor: 'pointer',
//                     backgroundColor: selectedTag?._id === tag._id ? '#f8f9ff' : 'white',
//                     transition: 'all 0.3s'
//                   }}
//                 >
//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
//                     <div>
//                       <h3 style={{ 
//                         margin: '0 0 0.5rem 0', 
//                         color: '#333',
//                         fontSize: '1.2rem'
//                       }}>
//                         {tag.vehicleInfo?.registrationNumber || 'N/A'}
//                       </h3>
//                       <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
//                         {tag.vehicleInfo?.vehicleType}
//                       </p>
//                       <p style={{ margin: '0', color: '#666', fontSize: '0.8rem' }}>
//                         FastTag ID: {tag.tagId}
//                       </p>
//                     </div>
//                     <div style={{ textAlign: 'right' }}>
//                       <span
//                         style={{
//                           padding: '4px 8px',
//                           borderRadius: '12px',
//                           fontSize: '0.8rem',
//                           fontWeight: '600',
//                           color: 'white',
//                           backgroundColor: getStatusBadgeColor(tag.status)
//                         }}
//                       >
//                         {tag.status.toUpperCase()}
//                       </span>
//                     </div>
//                   </div>

//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <div>
//                       <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getBalanceStatusColor(tag.balance) }}>
//                         ₹{tag.balance}
//                       </span>
//                       <span style={{ fontSize: '0.9rem', color: '#666', marginLeft: '0.5rem' }}>
//                         balance
//                       </span>
//                     </div>
//                     <div style={{ display: 'flex', gap: '0.5rem' }}>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setSelectedTag(tag);
//                           setShowRechargeModal(true);
//                         }}
//                         style={{
//                           padding: '6px 12px',
//                           backgroundColor: '#28a745',
//                           color: 'white',
//                           border: 'none',
//                           borderRadius: '6px',
//                           fontSize: '0.8rem',
//                           cursor: 'pointer'
//                         }}
//                       >
//                         Recharge
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleViewTransactions(tag);
//                         }}
//                         style={{
//                           padding: '6px 12px',
//                           backgroundColor: '#007bff',
//                           color: 'white',
//                           border: 'none',
//                           borderRadius: '6px',
//                           fontSize: '0.8rem',
//                           cursor: 'pointer'
//                         }}
//                       >
//                         History
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Selected Tag Details Panel */}
//           {selectedTag && (
//             <div style={{
//               backgroundColor: 'white',
//               border: '1px solid #ddd',
//               borderRadius: '12px',
//               padding: '2rem'
//             }}>
//               {/* Tab Navigation */}
//               <div style={{
//                 display: 'flex',
//                 borderBottom: '1px solid #ddd',
//                 marginBottom: '2rem'
//               }}>
//                 <button
//                   onClick={() => setActiveTab('overview')}
//                   style={{
//                     padding: '1rem 2rem',
//                     border: 'none',
//                     backgroundColor: 'transparent',
//                     borderBottom: activeTab === 'overview' ? '2px solid #007bff' : '2px solid transparent',
//                     color: activeTab === 'overview' ? '#007bff' : '#666',
//                     fontWeight: '600',
//                     cursor: 'pointer'
//                   }}
//                 >
//                   Overview
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('barcode')}
//                   style={{
//                     padding: '1rem 2rem',
//                     border: 'none',
//                     backgroundColor: 'transparent',
//                     borderBottom: activeTab === 'barcode' ? '2px solid #007bff' : '2px solid transparent',
//                     color: activeTab === 'barcode' ? '#007bff' : '#666',
//                     fontWeight: '600',
//                     cursor: 'pointer'
//                   }}
//                 >
//                   FastTag Card
//                 </button>
//               </div>

//               {/* Overview Tab */}
//               {activeTab === 'overview' && (
//                 <div>
//                   <h2 style={{ marginBottom: '1.5rem' }}>FastTag Details</h2>
                  
//                   <div style={{
//                     display: 'grid',
//                     gridTemplateColumns: '1fr 1fr',
//                     gap: '1rem',
//                     marginBottom: '2rem'
//                   }}>
//                     <div>
//                       <h4 style={{ color: '#666', marginBottom: '0.5rem' }}>FastTag ID</h4>
//                       <p style={{ margin: '0', fontWeight: '600' }}>{selectedTag.tagId}</p>
//                     </div>
//                     <div>
//                       <h4 style={{ color: '#666', marginBottom: '0.5rem' }}>Status</h4>
//                       <span
//                         style={{
//                           padding: '4px 12px',
//                           borderRadius: '12px',
//                           fontSize: '0.9rem',
//                           fontWeight: '600',
//                           color: 'white',
//                           backgroundColor: getStatusBadgeColor(selectedTag.status)
//                         }}
//                       >
//                         {selectedTag.status.toUpperCase()}
//                       </span>
//                     </div>
//                     <div>
//                       <h4 style={{ color: '#666', marginBottom: '0.5rem' }}>Vehicle Number</h4>
//                       <p style={{ margin: '0', fontWeight: '600' }}>{selectedTag.vehicleInfo?.registrationNumber}</p>
//                     </div>
//                     <div>
//                       <h4 style={{ color: '#666', marginBottom: '0.5rem' }}>Vehicle Type</h4>
//                       <p style={{ margin: '0', fontWeight: '600' }}>{selectedTag.vehicleInfo?.vehicleType}</p>
//                     </div>
//                     <div>
//                       <h4 style={{ color: '#666', marginBottom: '0.5rem' }}>Owner Name</h4>
//                       <p style={{ margin: '0', fontWeight: '600' }}>{selectedTag.personalInfo?.fullName}</p>
//                     </div>
//                     <div>
//                       <h4 style={{ color: '#666', marginBottom: '0.5rem' }}>Phone Number</h4>
//                       <p style={{ margin: '0', fontWeight: '600' }}>{selectedTag.personalInfo?.phoneNumber}</p>
//                     </div>
//                   </div>

//                   {/* Balance Information */}
//                   <div style={{
//                     backgroundColor: '#f8f9fa',
//                     padding: '1.5rem',
//                     borderRadius: '8px',
//                     marginBottom: '1.5rem'
//                   }}>
//                     <h4 style={{ color: '#666', marginBottom: '1rem' }}>Balance Information</h4>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                       <div>
//                         <span style={{ 
//                           fontSize: '2rem', 
//                           fontWeight: 'bold', 
//                           color: getBalanceStatusColor(selectedTag.balance) 
//                         }}>
//                           ₹{selectedTag.balance}
//                         </span>
//                         <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
//                           Current Balance
//                         </p>
//                       </div>
//                       <div style={{ textAlign: 'right' }}>
//                         <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
//                           Minimum Balance: ₹{selectedTag.minimumBalance || 100}
//                         </p>
//                         <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
//                           Last Used: {selectedTag.statistics?.lastUsed ? 
//                             new Date(selectedTag.statistics.lastUsed).toLocaleDateString() : 
//                             'Never'
//                           }
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
//                     <button
//                       onClick={() => setShowRechargeModal(true)}
//                       style={{
//                         padding: '12px 24px',
//                         backgroundColor: '#28a745',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '8px',
//                         fontSize: '16px',
//                         fontWeight: '600',
//                         cursor: 'pointer'
//                       }}
//                     >
//                       Recharge Balance
//                     </button>
//                     <button
//                       onClick={() => handleViewTransactions(selectedTag)}
//                       style={{
//                         padding: '12px 24px',
//                         backgroundColor: '#007bff',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '8px',
//                         fontSize: '16px',
//                         fontWeight: '600',
//                         cursor: 'pointer'
//                       }}
//                     >
//                       View Transactions
//                     </button>
//                     <button
//                       onClick={() => handleToggleBlock(selectedTag)}
//                       style={{
//                         padding: '12px 24px',
//                         backgroundColor: selectedTag.security?.isBlocked ? '#28a745' : '#dc3545',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '8px',
//                         fontSize: '16px',
//                         fontWeight: '600',
//                         cursor: 'pointer'
//                       }}
//                     >
//                       {selectedTag.security?.isBlocked ? 'Unblock Tag' : 'Block Tag'}
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Barcode Tab */}
//               {activeTab === 'barcode' && (
//                 <div style={{ textAlign: 'center' }}>
//                   <h2 style={{ marginBottom: '2rem' }}>FastTag Card</h2>
                  
//                   {/* FastTag Card */}
//                   <div style={{
//                     backgroundColor: '#1e3a8a',
//                     color: 'white',
//                     padding: '2rem',
//                     borderRadius: '16px',
//                     marginBottom: '2rem',
//                     background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
//                     boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
//                     maxWidth: '400px',
//                     margin: '0 auto 2rem auto'
//                   }}>
//                     {/* Card Header */}
//                     <div style={{ 
//                       display: 'flex', 
//                       justifyContent: 'space-between', 
//                       alignItems: 'center', 
//                       marginBottom: '2rem' 
//                     }}>
//                       <div>
//                         <h3 style={{ margin: '0', fontSize: '1.2rem' }}>FastTag</h3>
//                         <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
//                           Digital Toll Payment
//                         </p>
//                       </div>
//                       <div style={{ 
//                         width: '50px', 
//                         height: '30px', 
//                         backgroundColor: 'rgba(255,255,255,0.3)', 
//                         borderRadius: '4px',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         fontSize: '0.8rem',
//                         fontWeight: 'bold'
//                       }}>
//                         RFID
//                       </div>
//                     </div>

//                     {/* FastTag ID */}
//                     <div style={{ marginBottom: '1.5rem' }}>
//                       <p style={{ margin: '0', opacity: 0.8, fontSize: '0.8rem' }}>FastTag ID</p>
//                       <p style={{ 
//                         margin: '0.5rem 0 0 0', 
//                         fontSize: '1.1rem', 
//                         fontWeight: 'bold',
//                         letterSpacing: '2px',
//                         fontFamily: 'monospace'
//                       }}>
//                         {selectedTag.tagId}
//                       </p>
//                     </div>

//                     {/* Vehicle and Owner Info */}
//                     <div style={{ 
//                       display: 'grid', 
//                       gridTemplateColumns: '1fr 1fr', 
//                       gap: '1rem',
//                       marginBottom: '1.5rem' 
//                     }}>
//                       <div>
//                         <p style={{ margin: '0', opacity: 0.8, fontSize: '0.8rem' }}>Vehicle</p>
//                         <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold', fontSize: '0.9rem' }}>
//                           {selectedTag.vehicleInfo?.registrationNumber}
//                         </p>
//                       </div>
//                       <div>
//                         <p style={{ margin: '0', opacity: 0.8, fontSize: '0.8rem' }}>Balance</p>
//                         <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold', fontSize: '0.9rem' }}>
//                           ₹{selectedTag.balance}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Owner Name */}
//                     <div style={{ marginBottom: '1rem' }}>
//                       <p style={{ margin: '0', opacity: 0.8, fontSize: '0.8rem' }}>Owner</p>
//                       <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold', fontSize: '0.9rem' }}>
//                         {selectedTag.personalInfo?.fullName}
//                       </p>
//                     </div>

//                     {/* Phone Number */}
//                     <div>
//                       <p style={{ margin: '0', opacity: 0.8, fontSize: '0.8rem' }}>Phone</p>
//                       <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold', fontSize: '0.9rem' }}>
//                         {selectedTag.personalInfo?.phoneNumber}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Barcode Section */}
//                   <div style={{
//                     backgroundColor: 'white',
//                     border: '2px solid #ddd',
//                     borderRadius: '12px',
//                     padding: '2rem',
//                     maxWidth: '400px',
//                     margin: '0 auto'
//                   }}>
//                     <h3 style={{ marginBottom: '1rem', color: '#333' }}>Scan Code</h3>
//                     {selectedTag.barcodeImage ? (
//                       <img 
//                         src={selectedTag.barcodeImage} 
//                         alt={`Barcode for ${selectedTag.tagId}`}
//                         style={{ 
//                           maxWidth: '100%', 
//                           height: 'auto',
//                           marginBottom: '1rem'
//                         }}
//                       />
//                     ) : (
//                       <div style={{
//                         height: '120px',
//                         backgroundColor: '#f8f9fa',
//                         border: '2px dashed #ddd',
//                         borderRadius: '8px',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         marginBottom: '1rem'
//                       }}>
//                         <p style={{ color: '#666', margin: 0 }}>Generating barcode...</p>
//                       </div>
//                     )}
//                     <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
//                       Present this code at toll plazas for manual verification
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Recharge Modal */}
//       {showRechargeModal && (
//         <div style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: 'rgba(0, 0, 0, 0.7)',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           zIndex: 1000
//         }}>
//           <div style={{
//             backgroundColor: 'white',
//             borderRadius: '12px',
//             padding: '2rem',
//             maxWidth: '400px',
//             width: '90%'
//           }}>
//             <h3 style={{ marginBottom: '1.5rem' }}>Recharge FastTag</h3>
//             <div style={{ marginBottom: '1rem' }}>
//               <label style={{ display: 'block', marginBottom: '0.5rem' }}>Amount (₹)</label>
//               <input
//                 type="number"
//                 value={rechargeAmount}
//                 onChange={(e) => setRechargeAmount(e.target.value)}
//                 placeholder="Enter amount"
//                 style={{
//                   width: '100%',
//                   padding: '12px',
//                   border: '1px solid #ddd',
//                   borderRadius: '6px',
//                   fontSize: '16px'
//                 }}
//               />
//             </div>
//             <div style={{ display: 'flex', gap: '1rem' }}>
//               <button
//                 onClick={() => setShowRechargeModal(false)}
//                 style={{
//                   flex: 1,
//                   padding: '12px',
//                   backgroundColor: '#6c757d',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '6px',
//                   cursor: 'pointer'
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleRecharge}
//                 style={{
//                   flex: 1,
//                   padding: '12px',
//                   backgroundColor: '#28a745',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '6px',
//                   cursor: 'pointer'
//                 }}
//               >
//                 Recharge
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Transactions Modal */}
//       {showTransactions && (
//         <div style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: 'rgba(0, 0, 0, 0.7)',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           zIndex: 1000
//         }}>
//           <div style={{
//             backgroundColor: 'white',
//             borderRadius: '12px',
//             padding: '2rem',
//             maxWidth: '600px',
//             width: '90%',
//             maxHeight: '80vh',
//             overflowY: 'auto'
//           }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
//               <h3 style={{ margin: 0 }}>Transaction History</h3>
//               <button
//                 onClick={() => setShowTransactions(false)}
//                 style={{
//                   background: 'none',
//                   border: 'none',
//                   fontSize: '24px',
//                   cursor: 'pointer',
//                   color: '#666'
//                 }}
//               >
//                 ×
//               </button>
//             </div>
            
//             {transactions.length > 0 ? (
//               <div>
//                 {transactions.map((txn, index) => (
//                   <div key={index} style={{
//                     padding: '1rem',
//                     borderBottom: '1px solid #eee',
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center'
//                   }}>
//                     <div>
//                       <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>
//                         {txn.description || txn.type}
//                       </p>
//                       <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
//                         {new Date(txn.transactionDate).toLocaleDateString()}
//                       </p>
//                     </div>
//                     <div style={{ textAlign: 'right' }}>
//                       <p style={{ 
//                         margin: '0 0 0.5rem 0', 
//                         fontWeight: 'bold',
//                         color: txn.type === 'recharge' ? '#28a745' : '#dc3545'
//                       }}>
//                         {txn.type === 'recharge' ? '+' : '-'}₹{txn.amount}
//                       </p>
//                       <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
//                         Balance: ₹{txn.balanceAfter}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
//                 No transactions found
//               </p>
//             )}
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         @media (max-width: 768px) {
//           .grid-container {
//             grid-template-columns: 1fr !important;
//           }
//         }
//       `}</style>
//     </>
//   );
// }

// export default MyTag;
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import JsBarcode from 'jsbarcode';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import {
  getUserTags,
  getUserTagStats,
  getTagTransactions,
  rechargeTag,
  toggleTagBlockStatus,
  reset
} from '../features/tag/tagSlice';

function MyTag() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  
  const {
    tags = [],
    currentTag,
    tagStats,
    transactions = [],
    isLoading,
    isError,
    isSuccess,
    message,
    pagination
  } = useSelector((state) => state.tag || {});

  const [selectedTag, setSelectedTag] = useState(null);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [showTransactions, setShowTransactions] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    dispatch(getUserTags());
    dispatch(getUserTagStats());
  }, [user, navigate, dispatch]);

  // FIXED: Only reset on error, NOT on success
  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isError, message, dispatch]);

  useEffect(() => {
    if (tags && tags.length > 0 && !selectedTag) {
      selectTag(tags[0]);
    }
  }, [tags, selectedTag]);

  const generateBarcode = (tagId) => {
    const canvas = document.createElement('canvas');
    try {
      JsBarcode(canvas, tagId, {
        format: "CODE128",
        width: 2,
        height: 100,
        displayValue: true,
        fontSize: 14,
        textMargin: 10
      });
      return canvas.toDataURL();
    } catch (error) {
      console.error('Barcode generation error:', error);
      return null;
    }
  };

  const selectTag = (tag) => {
    if (!tag) return;
    
    setSelectedTag(tag);
    if (tag.tagId) {
      setTimeout(() => {
        const barcodeImage = generateBarcode(tag.tagId);
        if (barcodeImage) {
          setSelectedTag(prev => ({ ...prev, barcodeImage }));
        }
      }, 100);
    }
  };

  const handleRecharge = () => {
    if (!rechargeAmount || parseFloat(rechargeAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!selectedTag) {
      toast.error('Please select a FastTag');
      return;
    }

    dispatch(rechargeTag({
      tagId: selectedTag.tagId,
      amount: parseFloat(rechargeAmount),
      description: `Manual recharge of ₹${rechargeAmount}`
    }));

    setRechargeAmount('');
    setShowRechargeModal(false);
    toast.success('Recharge initiated!');
  };

  const handleViewTransactions = (tag) => {
    if (!tag) return;
    
    setSelectedTag(tag);
    dispatch(getTagTransactions({
      tagId: tag.tagId,
      page: 1,
      limit: 10
    }));
    setShowTransactions(true);
  };

  const handleToggleBlock = (tag) => {
    if (!tag) return;
    
    const isBlocked = tag.security?.isBlocked || false;
    dispatch(toggleTagBlockStatus({
      tagId: tag.tagId,
      isBlocked: !isBlocked,
      reason: !isBlocked ? 'User requested block' : null
    }));
  };

  const getBalanceStatusColor = (balance, minimumBalance = 100) => {
    if (balance <= 0) return '#dc3545';
    if (balance < minimumBalance) return '#ffc107';
    return '#28a745';
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active': return '#28a745';
      case 'blocked': return '#dc3545';
      case 'inactive': return '#6c757d';
      case 'expired': return '#fd7e14';
      default: return '#6c757d';
    }
  };

  if (isLoading && tags.length === 0) {
    return <Spinner />;
  }

  return (
    <>
      <BackButton />
      <section className="heading">
        <h1>My FastTags</h1>
        <p>Manage your FastTag accounts and transactions</p>
      </section>

      {tagStats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: '#e7f3ff',
            padding: '1.5rem',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#0066cc', margin: '0 0 0.5rem 0' }}>{tagStats.totalTags || 0}</h3>
            <p style={{ margin: 0, color: '#0066cc' }}>Total FastTags</p>
          </div>
          <div style={{
            backgroundColor: '#d4edda',
            padding: '1.5rem',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#155724', margin: '0 0 0.5rem 0' }}>₹{tagStats.totalBalance || 0}</h3>
            <p style={{ margin: 0, color: '#155724' }}>Total Balance</p>
          </div>
          <div style={{
            backgroundColor: '#fff3cd',
            padding: '1.5rem',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#856404', margin: '0 0 0.5rem 0' }}>{tagStats.totalTrips || 0}</h3>
            <p style={{ margin: 0, color: '#856404' }}>Total Trips</p>
          </div>
        </div>
      )}

      {(!tags || tags.length === 0) && !isLoading && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem', opacity: 0.5 }}>🚗</div>
          <h3 style={{ color: '#6c757d', marginBottom: '1rem' }}>No FastTags Found</h3>
          <p style={{ color: '#6c757d', marginBottom: '2rem' }}>
            You haven't created any FastTags yet. Apply for a new FastTag to get started.
          </p>
          <button
            onClick={() => navigate('/newfasttag')}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Apply for FastTag
          </button>
        </div>
      )}

      {tags && tags.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: selectedTag ? '1fr 2fr' : '1fr',
          gap: '2rem'
        }}>
          <div>
            <h2 style={{ marginBottom: '1rem' }}>Your FastTags</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tags.map((tag) => (
                <div
                  key={tag._id}
                  onClick={() => selectTag(tag)}
                  style={{
                    padding: '1.5rem',
                    border: selectedTag?._id === tag._id ? '2px solid #007bff' : '1px solid #ddd',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    backgroundColor: selectedTag?._id === tag._id ? '#f8f9ff' : 'white',
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ 
                        margin: '0 0 0.5rem 0', 
                        color: '#333',
                        fontSize: '1.2rem'
                      }}>
                        {tag.vehicleInfo?.registrationNumber || 'N/A'}
                      </h3>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                        {tag.vehicleInfo?.vehicleType || 'Unknown'}
                      </p>
                      <p style={{ margin: '0', color: '#666', fontSize: '0.8rem' }}>
                        FastTag ID: {tag.tagId}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          color: 'white',
                          backgroundColor: getStatusBadgeColor(tag.status)
                        }}
                      >
                        {tag.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getBalanceStatusColor(tag.balance) }}>
                        ₹{tag.balance || 0}
                      </span>
                      <span style={{ fontSize: '0.9rem', color: '#666', marginLeft: '0.5rem' }}>
                        balance
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTag(tag);
                          setShowRechargeModal(true);
                        }}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        Recharge
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewTransactions(tag);
                        }}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        History
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedTag && (
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '12px',
              padding: '2rem'
            }}>
              <div style={{
                display: 'flex',
                borderBottom: '1px solid #ddd',
                marginBottom: '2rem'
              }}>
                <button
                  onClick={() => setActiveTab('overview')}
                  style={{
                    padding: '1rem 2rem',
                    border: 'none',
                    backgroundColor: 'transparent',
                    borderBottom: activeTab === 'overview' ? '2px solid #007bff' : '2px solid transparent',
                    color: activeTab === 'overview' ? '#007bff' : '#666',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('barcode')}
                  style={{
                    padding: '1rem 2rem',
                    border: 'none',
                    backgroundColor: 'transparent',
                    borderBottom: activeTab === 'barcode' ? '2px solid #007bff' : '2px solid transparent',
                    color: activeTab === 'barcode' ? '#007bff' : '#666',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  FastTag Card
                </button>
              </div>

              {activeTab === 'overview' && (
                <div>
                  <h2 style={{ marginBottom: '1.5rem' }}>FastTag Details</h2>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginBottom: '2rem'
                  }}>
                    <div>
                      <h4 style={{ color: '#666', marginBottom: '0.5rem' }}>FastTag ID</h4>
                      <p style={{ margin: '0', fontWeight: '600' }}>{selectedTag.tagId}</p>
                    </div>
                    <div>
                      <h4 style={{ color: '#666', marginBottom: '0.5rem' }}>Status</h4>
                      <span
                        style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          color: 'white',
                          backgroundColor: getStatusBadgeColor(selectedTag.status)
                        }}
                      >
                        {selectedTag.status?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 style={{ color: '#666', marginBottom: '0.5rem' }}>Vehicle Number</h4>
                      <p style={{ margin: '0', fontWeight: '600' }}>{selectedTag.vehicleInfo?.registrationNumber}</p>
                    </div>
                    <div>
                      <h4 style={{ color: '#666', marginBottom: '0.5rem' }}>Vehicle Type</h4>
                      <p style={{ margin: '0', fontWeight: '600' }}>{selectedTag.vehicleInfo?.vehicleType}</p>
                    </div>
                    <div>
                      <h4 style={{ color: '#666', marginBottom: '0.5rem' }}>Owner Name</h4>
                      <p style={{ margin: '0', fontWeight: '600' }}>{selectedTag.personalInfo?.fullName}</p>
                    </div>
                    <div>
                      <h4 style={{ color: '#666', marginBottom: '0.5rem' }}>Phone Number</h4>
                      <p style={{ margin: '0', fontWeight: '600' }}>{selectedTag.personalInfo?.phoneNumber}</p>
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem'
                  }}>
                    <h4 style={{ color: '#666', marginBottom: '1rem' }}>Balance Information</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ 
                          fontSize: '2rem', 
                          fontWeight: 'bold', 
                          color: getBalanceStatusColor(selectedTag.balance) 
                        }}>
                          ₹{selectedTag.balance}
                        </span>
                        <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
                          Current Balance
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                          Minimum Balance: ₹{selectedTag.minimumBalance || 100}
                        </p>
                        <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                          Last Used: {selectedTag.statistics?.lastUsed ? 
                            new Date(selectedTag.statistics.lastUsed).toLocaleDateString() : 
                            'Never'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setShowRechargeModal(true)}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Recharge Balance
                    </button>
                    <button
                      onClick={() => handleViewTransactions(selectedTag)}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      View Transactions
                    </button>
                    <button
                      onClick={() => handleToggleBlock(selectedTag)}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: selectedTag.security?.isBlocked ? '#28a745' : '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {selectedTag.security?.isBlocked ? 'Unblock Tag' : 'Block Tag'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'barcode' && (
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ marginBottom: '2rem' }}>FastTag Card</h2>
                  
                  <div style={{
                    backgroundColor: '#1e3a8a',
                    color: 'white',
                    padding: '2rem',
                    borderRadius: '16px',
                    marginBottom: '2rem',
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    maxWidth: '400px',
                    margin: '0 auto 2rem auto'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: '2rem' 
                    }}>
                      <div>
                        <h3 style={{ margin: '0', fontSize: '1.2rem' }}>FastTag</h3>
                        <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
                          Digital Toll Payment
                        </p>
                      </div>
                      <div style={{ 
                        width: '50px', 
                        height: '30px', 
                        backgroundColor: 'rgba(255,255,255,0.3)', 
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        RFID
                      </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <p style={{ margin: '0', opacity: 0.8, fontSize: '0.8rem' }}>FastTag ID</p>
                      <p style={{ 
                        margin: '0.5rem 0 0 0', 
                        fontSize: '1.1rem', 
                        fontWeight: 'bold',
                        letterSpacing: '2px',
                        fontFamily: 'monospace'
                      }}>
                        {selectedTag.tagId}
                      </p>
                    </div>

                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: '1rem',
                      marginBottom: '1.5rem' 
                    }}>
                      <div>
                        <p style={{ margin: '0', opacity: 0.8, fontSize: '0.8rem' }}>Vehicle</p>
                        <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold', fontSize: '0.9rem' }}>
                          {selectedTag.vehicleInfo?.registrationNumber}
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: '0', opacity: 0.8, fontSize: '0.8rem' }}>Balance</p>
                        <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold', fontSize: '0.9rem' }}>
                          ₹{selectedTag.balance}
                        </p>
                      </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ margin: '0', opacity: 0.8, fontSize: '0.8rem' }}>Owner</p>
                      <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        {selectedTag.personalInfo?.fullName}
                      </p>
                    </div>

                    <div>
                      <p style={{ margin: '0', opacity: 0.8, fontSize: '0.8rem' }}>Phone</p>
                      <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        {selectedTag.personalInfo?.phoneNumber}
                      </p>
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: 'white',
                    border: '2px solid #ddd',
                    borderRadius: '12px',
                    padding: '2rem',
                    maxWidth: '400px',
                    margin: '0 auto'
                  }}>
                    <h3 style={{ marginBottom: '1rem', color: '#333' }}>Scan Code</h3>
                    {selectedTag.barcodeImage ? (
                      <img 
                        src={selectedTag.barcodeImage} 
                        alt={`Barcode for ${selectedTag.tagId}`}
                        style={{ 
                          maxWidth: '100%', 
                          height: 'auto',
                          marginBottom: '1rem'
                        }}
                      />
                    ) : (
                      <div style={{
                        height: '120px',
                        backgroundColor: '#f8f9fa',
                        border: '2px dashed #ddd',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem'
                      }}>
                        <p style={{ color: '#666', margin: 0 }}>Generating barcode...</p>
                      </div>
                    )}
                    <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
                      Present this code at toll plazas for manual verification
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {showRechargeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Recharge FastTag</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Amount (₹)</label>
              <input
                type="number"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                placeholder="Enter amount"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowRechargeModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleRecharge}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Recharge
              </button>
            </div>
          </div>
        </div>
      )}

      {showTransactions && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Transaction History</h3>
              <button
                onClick={() => setShowTransactions(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>
            
            {transactions.length > 0 ? (
              <div>
                {transactions.map((txn, index) => (
                  <div key={index} style={{
                    padding: '1rem',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>
                        {txn.description || txn.type}
                      </p>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                        {new Date(txn.transactionDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ 
                        margin: '0 0 0.5rem 0', 
                        fontWeight: 'bold',
                        color: txn.type === 'recharge' ? '#28a745' : '#dc3545'
                      }}>
                        {txn.type === 'recharge' ? '+' : '-'}₹{txn.amount}
                      </p>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                        Balance: ₹{txn.balanceAfter}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                No transactions found
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default MyTag;