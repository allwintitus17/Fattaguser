// import React, { useState, useEffect, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Coins, Trophy, Gauge, CreditCard, Loader } from 'lucide-react';
// import { getTagById } from '../features/tag/tagSlice';

// const TollPlazaSimulation = () => {
//   const dispatch = useDispatch();
//   const canvasRef = useRef(null);
  
//   const { currentTag, isLoading, isError, message } = useSelector((state) => state.tags || {
//     currentTag: null,
//     isLoading: false,
//     isError: false,
//     message: ''
//   });

//   const { user } = useSelector((state) => state.auth || { user: null });
  
//   const [gameState, setGameState] = useState('menu');
//   const [carX, setCarX] = useState(400);
//   const [carY, setCarY] = useState(500);
//   const [carAngle, setCarAngle] = useState(-90);
//   const [speed, setSpeed] = useState(0);
//   const [wallet, setWallet] = useState(0);
//   const [score, setScore] = useState(0);
//   const [keys, setKeys] = useState({});
//   const [camera, setCamera] = useState({ x: 0, y: 0 });
//   const [gameMessage, setGameMessage] = useState('');
//   const [particles, setParticles] = useState([]);
//   const [autoMove, setAutoMove] = useState(false);
//   const [targetPlaza, setTargetPlaza] = useState(null);
  
//   const [showTagModal, setShowTagModal] = useState(false);
//   const [tagId, setTagId] = useState('');
//   const [validationError, setValidationError] = useState('');
//   const [currentTrip, setCurrentTrip] = useState(null);
//   const [tollsPassed, setTollsPassed] = useState([]);
//   const [activeTag, setActiveTag] = useState(null);

//   const tollPlazas = [
//     { name: 'Start - Coimbatore', x: 400, y: 500, type: 'start', fee: 0, color: '#10b981', passed: false },
//     { name: 'Karur Toll', x: 400, y: 200, type: 'paid', fee: 85, color: '#ef4444', passed: false },
//     { name: 'Dindigul', x: 600, y: -100, type: 'free', fee: 0, color: '#3b82f6', passed: false },
//     { name: 'Trichy Toll', x: 400, y: -400, type: 'paid', fee: 95, color: '#ef4444', passed: false },
//     { name: 'Villupuram', x: 600, y: -700, type: 'free', fee: 0, color: '#3b82f6', passed: false },
//     { name: 'Sriperumbudur', x: 400, y: -1000, type: 'paid', fee: 75, color: '#ef4444', passed: false },
//     { name: 'Chennai', x: 400, y: -1300, type: 'end', fee: 0, color: '#10b981', passed: false }
//   ];

//   const [plazas, setPlazas] = useState(tollPlazas);
//   const [trees, setTrees] = useState([]);
//   const [buildings, setBuildings] = useState([]);

//   // Handle successful tag validation from database
//   useEffect(() => {
//     console.log('useEffect triggered - currentTag:', currentTag, 'showTagModal:', showTagModal, 'isLoading:', isLoading, 'isError:', isError);
    
//     if (currentTag && showTagModal && !isLoading && !isError) {
//       console.log('Conditions met! Tag data:', currentTag);
      
//       // Validate tag status
//       if (currentTag.status !== 'active') {
//         console.log('Tag is not active');
//         setValidationError('FastTag is not active. Please contact support.');
//         setActiveTag(null);
//         return;
//       }
      
//       // Validate balance
//       if (currentTag.balance < 100) {
//         console.log('Insufficient balance:', currentTag.balance);
//         setValidationError(`Insufficient balance (₹${currentTag.balance}). Minimum ₹100 required to start journey.`);
//         setActiveTag(null);
//         return;
//       }
      
//       // Tag is valid, prepare to start journey
//       console.log('FastTag is VALID! Balance:', currentTag.balance);
//       console.log('Setting wallet and activeTag...');
//       setWallet(currentTag.balance);
//       setActiveTag(currentTag);
      
//       // Close modal and start journey
//       console.log('Closing modal and starting journey...');
//       setShowTagModal(false);
//       setValidationError('');
      
//       // Start journey immediately
//       setTimeout(() => {
//         console.log('Timeout executed - calling startJourney');
//         startJourney(currentTag);
//       }, 100);
//     }
//   }, [currentTag, showTagModal, isLoading, isError]);

//   // Handle validation errors
//   useEffect(() => {
//     if (isError && showTagModal) {
//       setValidationError(message || 'FastTag not found in database. Please check your FastTag ID.');
//     }
//   }, [isError, message, showTagModal]);

//   useEffect(() => {
//     if (gameState === 'playing') {
//       const newTrees = [];
//       const newBuildings = [];
      
//       for (let i = 0; i < 150; i++) {
//         newTrees.push({
//           x: Math.random() * 1200 - 100,
//           y: Math.random() * 2000 - 1500,
//           size: 20 + Math.random() * 15,
//           type: Math.floor(Math.random() * 3)
//         });
//       }
      
//       for (let i = 0; i < 80; i++) {
//         newBuildings.push({
//           x: Math.random() * 1200 - 100,
//           y: Math.random() * 2000 - 1500,
//           width: 60 + Math.random() * 80,
//           height: 80 + Math.random() * 120,
//           color: `hsl(${200 + Math.random() * 60}, 60%, ${35 + Math.random() * 25}%)`,
//           floors: 3 + Math.floor(Math.random() * 8)
//         });
//       }
      
//       setTrees(newTrees);
//       setBuildings(newBuildings);
//     }
//   }, [gameState]);

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === 'Enter' && gameState === 'playing' && !autoMove) {
//         startAutoMove();
//       } else {
//         setKeys(prev => ({ ...prev, [e.key]: true }));
//       }
//     };
//     const handleKeyUp = (e) => {
//       setKeys(prev => ({ ...prev, [e.key]: false }));
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('keyup', handleKeyUp);
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('keyup', handleKeyUp);
//     };
//   }, [gameState, autoMove]);

//   useEffect(() => {
//     if (gameState !== 'playing') return;

//     const gameLoop = setInterval(() => {
//       updateGame();
//     }, 1000 / 60);

//     return () => clearInterval(gameLoop);
//   }, [gameState, carX, carY, carAngle, speed, keys, autoMove, targetPlaza]);

//   useEffect(() => {
//     if (gameState !== 'playing' && gameState !== 'payment') return;
    
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     const drawLoop = setInterval(() => {
//       drawGame(ctx);
//     }, 1000 / 60);

//     return () => clearInterval(drawLoop);
//   }, [gameState, carX, carY, carAngle, speed, camera, plazas, trees, buildings, particles]);

//   const validateFastTag = async () => {
//     if (!tagId.trim()) {
//       setValidationError('Please enter a FastTag ID');
//       return;
//     }

//     setValidationError('');
//     console.log('Starting validation for FastTag ID:', tagId.trim());
    
//     // Call the real API to validate FastTag from database
//     try {
//       const result = await dispatch(getTagById(tagId.trim())).unwrap();
//       console.log('FastTag validation successful:', result);
      
//       // Extract the actual tag data
//       const tagData = result.data || result;
//       console.log('Extracted tag data:', tagData);
      
//       // Validate immediately after getting the result
//       if (tagData.status !== 'active') {
//         console.log('Tag is not active');
//         setValidationError('FastTag is not active. Please contact support.');
//         return;
//       }
      
//       if (tagData.balance < 100) {
//         console.log('Insufficient balance:', tagData.balance);
//         setValidationError(`Insufficient balance (₹${tagData.balance}). Minimum ₹100 required to start journey.`);
//         return;
//       }
      
//       // Tag is valid - start journey directly
//       console.log('FastTag is VALID! Starting journey immediately...');
//       setWallet(tagData.balance);
//       setActiveTag(tagData);
//       setShowTagModal(false);
//       setValidationError('');
      
//       // Start journey with the validated tag data
//       setTimeout(() => {
//         startJourney(tagData);
//       }, 300);
      
//     } catch (error) {
//       console.error('FastTag validation failed:', error);
//       setValidationError(error.message || 'FastTag not found in database. Please check your FastTag ID.');
//     }
//   };

//   const startJourney = (tag) => {
//     console.log('startJourney called with tag:', tag);
    
//     const tripData = {
//       tagId: tag.tagId,
//       startTime: new Date().toISOString(),
//       startLocation: 'Coimbatore',
//       vehicleNumber: tag.vehicleInfo?.registrationNumber || 'Unknown',
//       vehicleId: tag.vehicleId || tag._id,
//       personalDetailsId: tag.personalDetailsId,
//       tollsPassed: [],
//       totalAmount: 0
//     };
    
//     console.log('Setting trip data:', tripData);
//     setCurrentTrip(tripData);
//     setTollsPassed([]);
//     setGameState('playing');
//     setCarX(400);
//     setCarY(500);
//     setCarAngle(-90);
//     setSpeed(0);
//     setScore(0);
//     setPlazas(tollPlazas.map(p => ({ ...p, passed: false })));
//     setCamera({ x: -50, y: 200 });
//     setParticles([]);
//     setGameMessage('Journey Started! Drive to Chennai');
    
//     console.log('Journey started successfully! Game state:', 'playing');
//     setTimeout(() => setGameMessage(''), 2000);
//   };

//   const startAutoMove = () => {
//     const nextPlaza = plazas.find(p => !p.passed);
//     if (nextPlaza) {
//       setAutoMove(true);
//       setTargetPlaza(nextPlaza);
//       setGameMessage(`Driving to ${nextPlaza.name}...`);
//     }
//   };

//   const updateGame = () => {
//     let newSpeed = speed;
//     let newAngle = carAngle;
//     let newX = carX;
//     let newY = carY;

//     if (autoMove && targetPlaza) {
//       const dx = targetPlaza.x - carX;
//       const dy = targetPlaza.y - carY;
//       const distance = Math.sqrt(dx * dx + dy * dy);
      
//       if (distance > 10) {
//         const targetAngle = Math.atan2(dy, dx) * 180 / Math.PI;
//         let angleDiff = targetAngle - carAngle;
//         while (angleDiff > 180) angleDiff -= 360;
//         while (angleDiff < -180) angleDiff += 360;
        
//         if (Math.abs(angleDiff) > 2) {
//           newAngle += Math.sign(angleDiff) * 2;
//         } else {
//           newAngle = targetAngle;
//         }
        
//         newSpeed = 6;
//         newX += Math.cos((newAngle * Math.PI) / 180) * newSpeed;
//         newY += Math.sin((newAngle * Math.PI) / 180) * newSpeed;
//       } else {
//         newSpeed = 0;
//         setAutoMove(false);
//         setTargetPlaza(null);
//       }
//     } else {
//       if (keys['ArrowUp'] || keys['w'] || keys['W']) {
//         newSpeed = Math.min(speed + 0.4, 10);
//       } else if (keys['ArrowDown'] || keys['s'] || keys['S']) {
//         newSpeed = Math.max(speed - 0.5, -4);
//       } else {
//         newSpeed *= 0.96;
//       }

//       if ((keys['ArrowLeft'] || keys['a'] || keys['A']) && Math.abs(newSpeed) > 0.5) {
//         newAngle -= 3.5;
//       }
//       if ((keys['ArrowRight'] || keys['d'] || keys['D']) && Math.abs(newSpeed) > 0.5) {
//         newAngle += 3.5;
//       }

//       newX += Math.cos((newAngle * Math.PI) / 180) * newSpeed;
//       newY += Math.sin((newAngle * Math.PI) / 180) * newSpeed;
//     }

//     setCamera({ x: newX - 450, y: newY - 300 });

//     if (Math.abs(newSpeed) > 5) {
//       setParticles(prev => [...prev.slice(-15), {
//         x: newX - Math.cos((newAngle * Math.PI) / 180) * 25,
//         y: newY - Math.sin((newAngle * Math.PI) / 180) * 25,
//         life: 20,
//         angle: newAngle + 180 + (Math.random() - 0.5) * 30
//       }]);
//     }

//     setSpeed(newSpeed);
//     setCarAngle(newAngle);
//     setCarX(newX);
//     setCarY(newY);

//     checkTollCollisions(newX, newY);
//   };

//   const checkTollCollisions = (x, y) => {
//     plazas.forEach((plaza, index) => {
//       const distance = Math.sqrt(Math.pow(x - plaza.x, 2) + Math.pow(y - plaza.y, 2));
      
//       if (distance < 50 && !plaza.passed) {
//         if (plaza.type === 'paid') {
//           handleTollPayment(plaza, index);
//         } else if (plaza.type === 'free') {
//           const updated = [...plazas];
//           updated[index].passed = true;
//           setPlazas(updated);
//           setScore(prev => prev + 50);
//           setGameMessage('Free pass! +50 points');
//           setTimeout(() => setGameMessage(''), 2000);
//         } else if (plaza.type === 'end') {
//           completeJourney();
//         } else if (plaza.type === 'start') {
//           const updated = [...plazas];
//           updated[index].passed = true;
//           setPlazas(updated);
//         }
//       }
//     });
//   };

//   const handleTollPayment = (plaza, index) => {
//     setGameState('payment');
//     setSpeed(0);
//     setAutoMove(false);
//     setTargetPlaza(null);
    
//     // Check if sufficient balance
//     if (wallet < plaza.fee) {
//       setGameMessage('Insufficient Balance! Journey Ended');
//       setTimeout(() => {
//         setGameState('menu');
//         setShowTagModal(true);
//       }, 3000);
//       return;
//     }

//     // Deduct toll amount
//     setWallet(prev => prev - plaza.fee);
//     setScore(prev => prev + 100);
    
//     // Record toll transaction
//     const tollRecord = {
//       plazaName: plaza.name,
//       amount: plaza.fee,
//       timestamp: new Date().toISOString()
//     };
//     setTollsPassed(prev => [...prev, tollRecord]);
    
//     // Mark plaza as passed
//     const updated = [...plazas];
//     updated[index].passed = true;
//     setPlazas(updated);
    
//     setGameMessage(`Paid ₹${plaza.fee} at ${plaza.name}! +100 points`);
//     setGameState('playing');
    
//     setTimeout(() => setGameMessage(''), 2000);

//     // TODO: Call backend API to update toll payment statistics
//     // This would create a payment record with paymentFlag: 2
//     console.log('Toll payment processed:', tollRecord);
//   };

//   const completeJourney = async () => {
//     setGameState('completed');
//     setScore(prev => prev + 200);
//     setAutoMove(false);

//     const completedTrip = {
//       ...currentTrip,
//       endTime: new Date().toISOString(),
//       endLocation: 'Chennai',
//       tollsPassed: tollsPassed,
//       totalAmount: tollsPassed.reduce((sum, toll) => sum + toll.amount, 0),
//       finalBalance: wallet,
//       status: 'completed'
//     };

//     console.log('Trip completed:', completedTrip);
    
//     // TODO: Call backend API to update trip statistics in FastTag
//     // This should increment totalTrips and update totalTollAmount
//   };

//   const drawGame = (ctx) => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     ctx.fillStyle = '#0a0e1a';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     ctx.save();
//     ctx.translate(-camera.x, -camera.y);

//     ctx.strokeStyle = '#1a1f35';
//     ctx.lineWidth = 1;
//     for (let x = -500; x < 1500; x += 50) {
//       ctx.beginPath();
//       ctx.moveTo(x, -2000);
//       ctx.lineTo(x, 1000);
//       ctx.stroke();
//     }
//     for (let y = -2000; y < 1000; y += 50) {
//       ctx.beginPath();
//       ctx.moveTo(-500, y);
//       ctx.lineTo(1500, y);
//       ctx.stroke();
//     }

//     ctx.strokeStyle = '#2a2a3e';
//     ctx.lineWidth = 140;
//     ctx.lineCap = 'round';
//     ctx.lineJoin = 'round';
//     ctx.beginPath();
//     plazas.forEach((plaza, i) => {
//       if (i === 0) ctx.moveTo(plaza.x, plaza.y);
//       else ctx.lineTo(plaza.x, plaza.y);
//     });
//     ctx.stroke();

//     ctx.strokeStyle = '#ffd700';
//     ctx.lineWidth = 4;
//     ctx.setLineDash([30, 30]);
//     ctx.beginPath();
//     plazas.forEach((plaza, i) => {
//       if (i === 0) ctx.moveTo(plaza.x, plaza.y);
//       else ctx.lineTo(plaza.x, plaza.y);
//     });
//     ctx.stroke();
//     ctx.setLineDash([]);

//     buildings.forEach(building => {
//       const gradient = ctx.createLinearGradient(building.x, building.y, building.x, building.y + building.height);
//       gradient.addColorStop(0, building.color);
//       gradient.addColorStop(1, '#1a1a2e');
//       ctx.fillStyle = gradient;
//       ctx.fillRect(building.x, building.y, building.width, building.height);
      
//       ctx.strokeStyle = '#000';
//       ctx.lineWidth = 2;
//       ctx.strokeRect(building.x, building.y, building.width, building.height);

//       ctx.fillStyle = Math.random() > 0.3 ? '#ffd700' : '#333';
//       const windowSize = 8;
//       const spacing = 15;
//       for (let floor = 0; floor < building.floors; floor++) {
//         for (let col = 0; col < Math.floor(building.width / spacing) - 1; col++) {
//           ctx.fillRect(
//             building.x + col * spacing + 8,
//             building.y + floor * (building.height / building.floors) + 10,
//             windowSize,
//             windowSize
//           );
//         }
//       }

//       ctx.fillStyle = '#1a1a2e';
//       ctx.beginPath();
//       ctx.moveTo(building.x - 5, building.y);
//       ctx.lineTo(building.x + building.width + 5, building.y);
//       ctx.lineTo(building.x + building.width, building.y + 10);
//       ctx.lineTo(building.x, building.y + 10);
//       ctx.closePath();
//       ctx.fill();
//     });

//     trees.forEach(tree => {
//       const treeColors = ['#0d7c2e', '#1a8f3f', '#0a5a20'];
      
//       ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
//       ctx.beginPath();
//       ctx.ellipse(tree.x, tree.y + tree.size, tree.size * 0.6, tree.size * 0.3, 0, 0, Math.PI * 2);
//       ctx.fill();

//       ctx.fillStyle = '#5c3a1e';
//       ctx.fillRect(tree.x - tree.size * 0.15, tree.y - tree.size * 0.3, tree.size * 0.3, tree.size * 0.8);

//       ctx.fillStyle = treeColors[tree.type];
//       ctx.beginPath();
//       ctx.arc(tree.x, tree.y - tree.size * 0.4, tree.size * 0.8, 0, Math.PI * 2);
//       ctx.fill();

//       ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
//       ctx.beginPath();
//       ctx.arc(tree.x - tree.size * 0.2, tree.y - tree.size * 0.6, tree.size * 0.3, 0, Math.PI * 2);
//       ctx.fill();
//     });

//     plazas.forEach((plaza) => {
//       const gradient = ctx.createRadialGradient(plaza.x, plaza.y, 20, plaza.x, plaza.y, 80);
//       gradient.addColorStop(0, plaza.color + 'dd');
//       gradient.addColorStop(1, plaza.color + '00');
//       ctx.fillStyle = gradient;
//       ctx.fillRect(plaza.x - 80, plaza.y - 80, 160, 160);

//       const plazaGradient = ctx.createLinearGradient(plaza.x - 50, plaza.y - 60, plaza.x + 50, plaza.y + 20);
//       plazaGradient.addColorStop(0, plaza.passed ? '#444' : plaza.color);
//       plazaGradient.addColorStop(1, plaza.passed ? '#222' : '#000');
//       ctx.fillStyle = plazaGradient;
      
//       ctx.beginPath();
//       ctx.moveTo(plaza.x - 50, plaza.y + 20);
//       ctx.lineTo(plaza.x - 50, plaza.y - 40);
//       ctx.lineTo(plaza.x - 40, plaza.y - 60);
//       ctx.lineTo(plaza.x + 40, plaza.y - 60);
//       ctx.lineTo(plaza.x + 50, plaza.y - 40);
//       ctx.lineTo(plaza.x + 50, plaza.y + 20);
//       ctx.closePath();
//       ctx.fill();

//       ctx.strokeStyle = '#000';
//       ctx.lineWidth = 3;
//       ctx.stroke();

//       ctx.fillStyle = 'white';
//       ctx.font = 'bold 32px Arial';
//       ctx.textAlign = 'center';
//       ctx.textBaseline = 'middle';
      
//       if (plaza.type === 'paid') {
//         ctx.fillText('₹', plaza.x, plaza.y - 10);
//       } else if (plaza.type === 'free') {
//         ctx.fillText('✓', plaza.x, plaza.y - 10);
//       } else {
//         ctx.fillText('●', plaza.x, plaza.y - 10);
//       }

//       ctx.fillStyle = 'white';
//       ctx.font = 'bold 14px Arial';
//       ctx.shadowBlur = 8;
//       ctx.shadowColor = '#000';
//       ctx.fillText(plaza.name, plaza.x, plaza.y - 75);
//       ctx.shadowBlur = 0;
      
//       if (plaza.type === 'paid' && !plaza.passed) {
//         ctx.fillStyle = '#ffd700';
//         ctx.font = 'bold 18px Arial';
//         ctx.fillText(`₹${plaza.fee}`, plaza.x, plaza.y + 35);
//       }

//       if (plaza.passed) {
//         ctx.fillStyle = '#10b981';
//         ctx.font = 'bold 48px Arial';
//         ctx.shadowBlur = 15;
//         ctx.shadowColor = '#10b981';
//         ctx.fillText('✓', plaza.x + 35, plaza.y - 35);
//         ctx.shadowBlur = 0;
//       }
//     });

//     setParticles(prev => {
//       const updated = prev.map(p => ({ ...p, life: p.life - 1 })).filter(p => p.life > 0);
      
//       updated.forEach(particle => {
//         const alpha = particle.life / 20;
//         ctx.fillStyle = `rgba(150, 150, 150, ${alpha * 0.6})`;
//         ctx.beginPath();
//         ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
//         ctx.fill();
//       });
      
//       return updated;
//     });

//     ctx.save();
//     ctx.translate(carX, carY);
//     ctx.rotate((carAngle * Math.PI) / 180);

//     ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
//     ctx.fillRect(-22, -12, 44, 24);

//     const carGradient = ctx.createLinearGradient(-20, -15, -20, 15);
//     carGradient.addColorStop(0, '#ff1744');
//     carGradient.addColorStop(0.5, '#d50000');
//     carGradient.addColorStop(1, '#b71c1c');
//     ctx.fillStyle = carGradient;
//     ctx.fillRect(-20, -15, 40, 30);

//     ctx.strokeStyle = '#000';
//     ctx.lineWidth = 2;
//     ctx.strokeRect(-20, -15, 40, 30);

//     ctx.fillStyle = 'rgba(50, 100, 200, 0.7)';
//     ctx.fillRect(-15, -10, 12, 8);
//     ctx.fillRect(-15, 2, 12, 8);
//     ctx.fillRect(3, -10, 12, 8);
//     ctx.fillRect(3, 2, 12, 8);

//     ctx.strokeStyle = '#000';
//     ctx.lineWidth = 1;
//     ctx.strokeRect(-15, -10, 12, 8);
//     ctx.strokeRect(-15, 2, 12, 8);
//     ctx.strokeRect(3, -10, 12, 8);
//     ctx.strokeRect(3, 2, 12, 8);

//     ctx.fillStyle = speed > 3 ? '#ffff00' : '#ffff99';
//     ctx.shadowBlur = speed > 3 ? 15 : 5;
//     ctx.shadowColor = '#ffff00';
//     ctx.beginPath();
//     ctx.arc(20, -10, 3, 0, Math.PI * 2);
//     ctx.arc(20, 10, 3, 0, Math.PI * 2);
//     ctx.fill();
//     ctx.shadowBlur = 0;

//     ctx.fillStyle = '#ff0000';
//     ctx.shadowBlur = 8;
//     ctx.shadowColor = '#ff0000';
//     ctx.beginPath();
//     ctx.arc(-20, -8, 2, 0, Math.PI * 2);
//     ctx.arc(-20, 8, 2, 0, Math.PI * 2);
//     ctx.fill();
//     ctx.shadowBlur = 0;

//     ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
//     ctx.fillRect(-5, -15, 10, 30);

//     ctx.fillStyle = '#1a1a1a';
//     ctx.fillRect(-18, -18, 6, 8);
//     ctx.fillRect(-18, 10, 6, 8);
//     ctx.fillRect(12, -18, 6, 8);
//     ctx.fillRect(12, 10, 6, 8);

//     ctx.strokeStyle = '#444';
//     ctx.lineWidth = 1;
//     ctx.strokeRect(-18, -18, 6, 8);
//     ctx.strokeRect(-18, 10, 6, 8);
//     ctx.strokeRect(12, -18, 6, 8);
//     ctx.strokeRect(12, 10, 6, 8);

//     ctx.restore();
//     ctx.restore();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-5 mb-4 shadow-2xl">
//           <h1 className="text-5xl font-bold text-white text-center drop-shadow-lg">
//             Toll Plaza Journey Simulator
//           </h1>
//           <p className="text-white text-center mt-2 text-xl font-semibold">Coimbatore to Chennai Highway</p>
//         </div>

//         {gameState !== 'menu' && (
//           <div className="grid grid-cols-4 gap-3 mb-4">
//             <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 shadow-lg">
//               <div className="flex items-center gap-2 text-white">
//                 <Coins className="w-6 h-6" />
//                 <div>
//                   <p className="text-xs opacity-90">Balance</p>
//                   <p className="text-2xl font-bold">₹{wallet}</p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-4 shadow-lg">
//               <div className="flex items-center gap-2 text-white">
//                 <Trophy className="w-6 h-6" />
//                 <div>
//                   <p className="text-xs opacity-90">Score</p>
//                   <p className="text-2xl font-bold">{score}</p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-4 shadow-lg">
//               <div className="flex items-center gap-2 text-white">
//                 <Gauge className="w-6 h-6" />
//                 <div>
//                   <p className="text-xs opacity-90">Speed</p>
//                   <p className="text-2xl font-bold">{Math.round(Math.abs(speed) * 12)} km/h</p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-gradient-to-br from-pink-500 to-red-600 rounded-xl p-4 shadow-lg">
//               <div className="flex items-center gap-2 text-white">
//                 <CreditCard className="w-6 h-6" />
//                 <div>
//                   <p className="text-xs opacity-90">FastTag</p>
//                   <p className="text-lg font-bold">{activeTag?.tagId || 'N/A'}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {gameMessage && gameState !== 'menu' && (
//           <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold text-center py-4 px-6 rounded-xl mb-4 text-xl shadow-lg">
//             {gameMessage}
//           </div>
//         )}

//         {gameState === 'menu' && (
//           <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-16 text-center shadow-2xl border-4 border-blue-400">
//             <div className="text-6xl mb-8">🛣️</div>
//             <h2 className="text-5xl font-bold text-white mb-6">Toll Plaza Simulation</h2>
//             <p className="text-white/90 text-xl mb-10 max-w-3xl mx-auto">
//               Experience realistic toll plaza journey from Coimbatore to Chennai
//             </p>
//             <button
//               onClick={() => setShowTagModal(true)}
//               className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-20 py-6 rounded-2xl text-3xl font-bold hover:scale-110 transform transition-all shadow-2xl border-4 border-white"
//             >
//               Start Your Journey
//             </button>
//           </div>
//         )}

//         {(gameState === 'playing' || gameState === 'payment') && (
//           <div className="relative">
//             <canvas
//               ref={canvasRef}
//               width={900}
//               height={600}
//               className="w-full border-8 border-blue-400 rounded-2xl shadow-2xl"
//             />
//             <div className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded-xl backdrop-blur">
//               <p className="font-bold text-lg">Mission</p>
//               <p>Drive to Chennai</p>
//               <p className="text-yellow-400 mt-2">🔴 Paid | 🔵 Free</p>
//               <p className="text-green-400 mt-3 font-bold">Press ENTER for Auto-Drive</p>
//             </div>
//             {autoMove && (
//               <div className="absolute top-4 right-4 bg-green-600/90 text-white p-4 rounded-xl backdrop-blur animate-pulse">
//                 <p className="font-bold text-lg">AUTO-PILOT ON</p>
//                 <p>Driving to next location...</p>
//               </div>
//             )}
//           </div>
//         )}

//         {gameState === 'completed' && (
//           <div className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-3xl p-16 text-center shadow-2xl border-8 border-yellow-400">
//             <div className="text-9xl mb-8">✅</div>
//             <h2 className="text-6xl font-bold text-white mb-6">Journey Completed!</h2>
//             <p className="text-4xl text-yellow-300 font-bold mb-4">Score: {score}</p>
//             <p className="text-3xl text-white mb-4">Remaining Balance: ₹{wallet}</p>
//             <p className="text-2xl text-white mb-10">Tolls Passed: {tollsPassed.length}</p>
//             <div className="bg-black/30 rounded-xl p-6 mb-8">
//               <h3 className="text-white font-bold text-2xl mb-4">Trip Summary</h3>
//               <div className="text-left text-white space-y-2">
//                 <p><strong>FastTag:</strong> {activeTag?.tagId}</p>
//                 <p><strong>Vehicle:</strong> {activeTag?.vehicleInfo?.registrationNumber}</p>
//                 <p><strong>Total Toll Amount:</strong> ₹{tollsPassed.reduce((sum, toll) => sum + toll.amount, 0)}</p>
//                 <p><strong>Trip Duration:</strong> {currentTrip && new Date(new Date() - new Date(currentTrip.startTime)).toISOString().substr(11, 8)}</p>
//               </div>
//             </div>
//             <button
//               onClick={() => {
//                 setGameState('menu');
//                 setShowTagModal(true);
//                 setActiveTag(null);
//                 setTagId('');
//               }}
//               className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-16 py-6 rounded-2xl text-3xl font-bold hover:scale-110 transform transition-all shadow-2xl"
//             >
//               Start New Journey
//             </button>
//           </div>
//         )}

//         {showTagModal && (
//           <div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50">
//             <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 max-w-lg w-full shadow-2xl border-8 border-white">
//               <h3 className="text-5xl font-bold text-white mb-8 text-center">
//                 <CreditCard className="inline w-12 h-12 mr-3" />
//                 Enter FastTag ID
//               </h3>
//               <div className="bg-black/30 rounded-2xl p-6 mb-6">
//                 <p className="text-white text-lg mb-4">
//                   Please enter your FastTag ID to start your journey
//                 </p>
//                 <p className="text-yellow-300 text-sm mb-4">
//                   Your FastTag will be validated from the database
//                 </p>
//                 <input
//                   type="text"
//                   value={tagId}
//                   onChange={(e) => {
//                     setTagId(e.target.value.toUpperCase());
//                     setValidationError('');
//                   }}
//                   onKeyPress={(e) => {
//                     if (e.key === 'Enter' && tagId.trim() && !isLoading) {
//                       validateFastTag();
//                     }
//                   }}
//                   placeholder="e.g., FT994085413018"
//                   className="w-full px-6 py-4 rounded-xl mb-4 text-2xl font-bold text-center focus:ring-4 focus:ring-yellow-400 outline-none uppercase"
//                   autoFocus
//                   disabled={isLoading}
//                 />
//                 {validationError && (
//                   <div className="bg-red-500/90 text-white px-4 py-3 rounded-xl mb-4">
//                     {validationError}
//                   </div>
//                 )}
//                 {isLoading && (
//                   <div className="flex items-center justify-center gap-3 text-white mb-4">
//                     <Loader className="w-6 h-6 animate-spin" />
//                     <span>Validating FastTag from database...</span>
//                   </div>
//                 )}
//                 {activeTag && (
//                   <div className="bg-green-500/20 border border-green-500 text-white px-4 py-3 rounded-xl mb-4">
//                     <p className="font-bold">✓ FastTag Validated</p>
//                     <p className="text-sm">Vehicle: {activeTag.vehicleInfo.registrationNumber}</p>
//                     <p className="text-sm">Balance: ₹{activeTag.balance}</p>
//                   </div>
//                 )}
//               </div>
//               <div className="flex gap-4">
//                 <button
//                   onClick={() => {
//                     setShowTagModal(false);
//                     setTagId('');
//                     setValidationError('');
//                   }}
//                   className="flex-1 bg-gray-500 text-white py-4 rounded-2xl text-xl font-bold hover:scale-105 transform transition-all"
//                   disabled={isLoading}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={validateFastTag}
//                   disabled={!tagId.trim() || isLoading}
//                   className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl text-xl font-bold hover:scale-105 transform transition-all shadow-xl border-4 border-white disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isLoading ? 'Validating...' : 'Start Journey'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TollPlazaSimulation;
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Coins, Trophy, Gauge, CreditCard, Loader } from 'lucide-react';
import { getTagById } from '../features/tag/tagSlice';
import UpiPaymentGateway from '../components/UpiPaymentGateway';

const TollPlazaSimulation = () => {
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  
  const { currentTag, isLoading, isError, message } = useSelector((state) => state.tags || {
    currentTag: null,
    isLoading: false,
    isError: false,
    message: ''
  });

  const { user } = useSelector((state) => state.auth || { user: null });
  
  const [gameState, setGameState] = useState('menu');
  const [carX, setCarX] = useState(400);
  const [carY, setCarY] = useState(500);
  const [carAngle, setCarAngle] = useState(-90);
  const [speed, setSpeed] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [score, setScore] = useState(0);
  const [keys, setKeys] = useState({});
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [gameMessage, setGameMessage] = useState('');
  const [particles, setParticles] = useState([]);
  const [autoMove, setAutoMove] = useState(false);
  const [targetPlaza, setTargetPlaza] = useState(null);
  
  const [showTagModal, setShowTagModal] = useState(false);
  const [tagId, setTagId] = useState('');
  const [validationError, setValidationError] = useState('');
  const [currentTrip, setCurrentTrip] = useState(null);
  const [tollsPassed, setTollsPassed] = useState([]);
  const [activeTag, setActiveTag] = useState(null);
  
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [currentTollPlaza, setCurrentTollPlaza] = useState(null);
  const [currentTollIndex, setCurrentTollIndex] = useState(null);

  const tollPlazas = [
    { name: 'Start - Coimbatore', x: 400, y: 500, type: 'start', fee: 0, color: '#10b981', passed: false },
    { name: 'Karur Toll', x: 400, y: 200, type: 'paid', fee: 85, color: '#ef4444', passed: false },
    { name: 'Dindigul', x: 600, y: -100, type: 'free', fee: 0, color: '#3b82f6', passed: false },
    { name: 'Trichy Toll', x: 400, y: -400, type: 'paid', fee: 95, color: '#ef4444', passed: false },
    { name: 'Villupuram', x: 600, y: -700, type: 'free', fee: 0, color: '#3b82f6', passed: false },
    { name: 'Sriperumbudur', x: 400, y: -1000, type: 'paid', fee: 75, color: '#ef4444', passed: false },
    { name: 'Chennai', x: 400, y: -1300, type: 'end', fee: 0, color: '#10b981', passed: false }
  ];

  const [plazas, setPlazas] = useState(tollPlazas);
  const [trees, setTrees] = useState([]);
  const [buildings, setBuildings] = useState([]);

  useEffect(() => {
    if (gameState === 'playing') {
      const newTrees = [];
      const newBuildings = [];
      
      for (let i = 0; i < 150; i++) {
        newTrees.push({
          x: Math.random() * 1200 - 100,
          y: Math.random() * 2000 - 1500,
          size: 20 + Math.random() * 15,
          type: Math.floor(Math.random() * 3)
        });
      }
      
      for (let i = 0; i < 80; i++) {
        newBuildings.push({
          x: Math.random() * 1200 - 100,
          y: Math.random() * 2000 - 1500,
          width: 60 + Math.random() * 80,
          height: 80 + Math.random() * 120,
          color: `hsl(${200 + Math.random() * 60}, 60%, ${35 + Math.random() * 25}%)`,
          floors: 3 + Math.floor(Math.random() * 8)
        });
      }
      
      setTrees(newTrees);
      setBuildings(newBuildings);
    }
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && gameState === 'playing' && !autoMove) {
        startAutoMove();
      } else {
        setKeys(prev => ({ ...prev, [e.key]: true }));
      }
    };
    const handleKeyUp = (e) => {
      setKeys(prev => ({ ...prev, [e.key]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, autoMove]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      updateGame();
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [gameState, carX, carY, carAngle, speed, keys, autoMove, targetPlaza, showUpiModal]);

  useEffect(() => {
    if (gameState !== 'playing' && gameState !== 'payment') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const drawLoop = setInterval(() => {
      drawGame(ctx);
    }, 1000 / 60);

    return () => clearInterval(drawLoop);
  }, [gameState, carX, carY, carAngle, speed, camera, plazas, trees, buildings, particles]);

  const validateFastTag = async () => {
    if (!tagId.trim()) {
      setValidationError('Please enter a FastTag ID');
      return;
    }

    setValidationError('');
    console.log('Starting validation for FastTag ID:', tagId.trim());
    
    try {
      const result = await dispatch(getTagById(tagId.trim())).unwrap();
      console.log('FastTag validation successful:', result);
      
      const tagData = result.data || result;
      console.log('Extracted tag data:', tagData);
      
      if (tagData.status !== 'active') {
        console.log('Tag is not active');
        setValidationError('FastTag is not active. Please contact support.');
        return;
      }
      
      if (tagData.balance < 100) {
        console.log('Insufficient balance:', tagData.balance);
        setValidationError(`Insufficient balance (₹${tagData.balance}). Minimum ₹100 required to start journey.`);
        return;
      }
      
      console.log('FastTag is VALID! Starting journey immediately...');
      setWallet(tagData.balance);
      setActiveTag(tagData);
      setShowTagModal(false);
      setValidationError('');
      
      setTimeout(() => {
        startJourney(tagData);
      }, 300);
      
    } catch (error) {
      console.error('FastTag validation failed:', error);
      setValidationError(error.message || 'FastTag not found in database. Please check your FastTag ID.');
    }
  };

  const startJourney = (tag) => {
    console.log('startJourney called with tag:', tag);
    
    const tripData = {
      tagId: tag.tagId,
      startTime: new Date().toISOString(),
      startLocation: 'Coimbatore',
      vehicleNumber: tag.vehicleInfo?.registrationNumber || 'Unknown',
      vehicleId: tag.vehicleId || tag._id,
      personalDetailsId: tag.personalDetailsId,
      tollsPassed: [],
      totalAmount: 0
    };
    
    console.log('Setting trip data:', tripData);
    setCurrentTrip(tripData);
    setTollsPassed([]);
    setGameState('playing');
    setCarX(400);
    setCarY(500);
    setCarAngle(-90);
    setSpeed(0);
    setScore(0);
    setPlazas(tollPlazas.map(p => ({ ...p, passed: false })));
    setCamera({ x: -50, y: 200 });
    setParticles([]);
    setGameMessage('Journey Started! Drive to Chennai');
    
    console.log('Journey started successfully! Game state:', 'playing');
    setTimeout(() => setGameMessage(''), 2000);
  };

  const startAutoMove = () => {
    const nextPlaza = plazas.find(p => !p.passed);
    if (nextPlaza) {
      setAutoMove(true);
      setTargetPlaza(nextPlaza);
      setGameMessage(`Driving to ${nextPlaza.name}...`);
    }
  };

  const updateGame = () => {
    let newSpeed = speed;
    let newAngle = carAngle;
    let newX = carX;
    let newY = carY;

    if (autoMove && targetPlaza) {
      const dx = targetPlaza.x - carX;
      const dy = targetPlaza.y - carY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 10) {
        const targetAngle = Math.atan2(dy, dx) * 180 / Math.PI;
        let angleDiff = targetAngle - carAngle;
        while (angleDiff > 180) angleDiff -= 360;
        while (angleDiff < -180) angleDiff += 360;
        
        if (Math.abs(angleDiff) > 2) {
          newAngle += Math.sign(angleDiff) * 2;
        } else {
          newAngle = targetAngle;
        }
        
        newSpeed = 6;
        newX += Math.cos((newAngle * Math.PI) / 180) * newSpeed;
        newY += Math.sin((newAngle * Math.PI) / 180) * newSpeed;
      } else {
        newSpeed = 0;
        setAutoMove(false);
        setTargetPlaza(null);
      }
    } else {
      if (keys['ArrowUp'] || keys['w'] || keys['W']) {
        newSpeed = Math.min(speed + 0.4, 10);
      } else if (keys['ArrowDown'] || keys['s'] || keys['S']) {
        newSpeed = Math.max(speed - 0.5, -4);
      } else {
        newSpeed *= 0.96;
      }

      if ((keys['ArrowLeft'] || keys['a'] || keys['A']) && Math.abs(newSpeed) > 0.5) {
        newAngle -= 3.5;
      }
      if ((keys['ArrowRight'] || keys['d'] || keys['D']) && Math.abs(newSpeed) > 0.5) {
        newAngle += 3.5;
      }

      newX += Math.cos((newAngle * Math.PI) / 180) * newSpeed;
      newY += Math.sin((newAngle * Math.PI) / 180) * newSpeed;
    }

    setCamera({ x: newX - 450, y: newY - 300 });

    if (Math.abs(newSpeed) > 5) {
      setParticles(prev => [...prev.slice(-15), {
        x: newX - Math.cos((newAngle * Math.PI) / 180) * 25,
        y: newY - Math.sin((newAngle * Math.PI) / 180) * 25,
        life: 20,
        angle: newAngle + 180 + (Math.random() - 0.5) * 30
      }]);
    }

    setSpeed(newSpeed);
    setCarAngle(newAngle);
    setCarX(newX);
    setCarY(newY);

    checkTollCollisions(newX, newY);
  };

  const checkTollCollisions = (x, y) => {
    if (showUpiModal) return;
    
    plazas.forEach((plaza, index) => {
      const distance = Math.sqrt(Math.pow(x - plaza.x, 2) + Math.pow(y - plaza.y, 2));
      
      if (distance < 50 && !plaza.passed) {
        if (plaza.type === 'paid') {
          setSpeed(0);
          setAutoMove(false);
          setTargetPlaza(null);
          setGameState('payment');
          setCurrentTollPlaza(plaza);
          setCurrentTollIndex(index);
          setGameMessage(`Toll Plaza: ${plaza.name} - ₹${plaza.fee}`);
          
          setShowUpiModal(true);
          
        } else if (plaza.type === 'free') {
          const updated = [...plazas];
          updated[index].passed = true;
          setPlazas(updated);
          setScore(prev => prev + 50);
          setGameMessage('Free pass! +50 points');
          setTimeout(() => setGameMessage(''), 2000);
        } else if (plaza.type === 'end') {
          completeJourney();
        } else if (plaza.type === 'start') {
          const updated = [...plazas];
          updated[index].passed = true;
          setPlazas(updated);
        }
      }
    });
  };

  const handleTollPaymentSuccess = () => {
    console.log('Toll payment successful!');
    
    if (!currentTollPlaza || currentTollIndex === null) {
      console.error('Missing toll plaza data');
      return;
    }
    
    const tollAmount = currentTollPlaza.fee;
    setWallet(prev => prev - tollAmount);
    setScore(prev => prev + 100);
    
    const tollRecord = {
      plazaName: currentTollPlaza.name,
      amount: tollAmount,
      timestamp: new Date().toISOString()
    };
    setTollsPassed(prev => [...prev, tollRecord]);
    
    const updated = [...plazas];
    updated[currentTollIndex].passed = true;
    setPlazas(updated);
    
    setGameMessage(`Paid ₹${tollAmount} at ${currentTollPlaza.name}! +100 points`);
    
    setShowUpiModal(false);
    setCurrentTollPlaza(null);
    setCurrentTollIndex(null);
    
    setTimeout(() => {
      setGameState('playing');
      setGameMessage('');
    }, 1500);
  };

  const completeJourney = async () => {
    setGameState('completed');
    setScore(prev => prev + 200);
    setAutoMove(false);

    const completedTrip = {
      ...currentTrip,
      endTime: new Date().toISOString(),
      endLocation: 'Chennai',
      tollsPassed: tollsPassed,
      totalAmount: tollsPassed.reduce((sum, toll) => sum + toll.amount, 0),
      finalBalance: wallet,
      status: 'completed'
    };

    console.log('Trip completed:', completedTrip);
  };

  const drawGame = (ctx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    ctx.strokeStyle = '#1a1f35';
    ctx.lineWidth = 1;
    for (let x = -500; x < 1500; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, -2000);
      ctx.lineTo(x, 1000);
      ctx.stroke();
    }
    for (let y = -2000; y < 1000; y += 50) {
      ctx.beginPath();
      ctx.moveTo(-500, y);
      ctx.lineTo(1500, y);
      ctx.stroke();
    }

    ctx.strokeStyle = '#2a2a3e';
    ctx.lineWidth = 140;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    plazas.forEach((plaza, i) => {
      if (i === 0) ctx.moveTo(plaza.x, plaza.y);
      else ctx.lineTo(plaza.x, plaza.y);
    });
    ctx.stroke();

    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 4;
    ctx.setLineDash([30, 30]);
    ctx.beginPath();
    plazas.forEach((plaza, i) => {
      if (i === 0) ctx.moveTo(plaza.x, plaza.y);
      else ctx.lineTo(plaza.x, plaza.y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    buildings.forEach(building => {
      const gradient = ctx.createLinearGradient(building.x, building.y, building.x, building.y + building.height);
      gradient.addColorStop(0, building.color);
      gradient.addColorStop(1, '#1a1a2e');
      ctx.fillStyle = gradient;
      ctx.fillRect(building.x, building.y, building.width, building.height);
      
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.strokeRect(building.x, building.y, building.width, building.height);

      ctx.fillStyle = Math.random() > 0.3 ? '#ffd700' : '#333';
      const windowSize = 8;
      const spacing = 15;
      for (let floor = 0; floor < building.floors; floor++) {
        for (let col = 0; col < Math.floor(building.width / spacing) - 1; col++) {
          ctx.fillRect(
            building.x + col * spacing + 8,
            building.y + floor * (building.height / building.floors) + 10,
            windowSize,
            windowSize
          );
        }
      }

      ctx.fillStyle = '#1a1a2e';
      ctx.beginPath();
      ctx.moveTo(building.x - 5, building.y);
      ctx.lineTo(building.x + building.width + 5, building.y);
      ctx.lineTo(building.x + building.width, building.y + 10);
      ctx.lineTo(building.x, building.y + 10);
      ctx.closePath();
      ctx.fill();
    });

    trees.forEach(tree => {
      const treeColors = ['#0d7c2e', '#1a8f3f', '#0a5a20'];
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(tree.x, tree.y + tree.size, tree.size * 0.6, tree.size * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#5c3a1e';
      ctx.fillRect(tree.x - tree.size * 0.15, tree.y - tree.size * 0.3, tree.size * 0.3, tree.size * 0.8);

      ctx.fillStyle = treeColors[tree.type];
      ctx.beginPath();
      ctx.arc(tree.x, tree.y - tree.size * 0.4, tree.size * 0.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(tree.x - tree.size * 0.2, tree.y - tree.size * 0.6, tree.size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    });

    plazas.forEach((plaza) => {
      const gradient = ctx.createRadialGradient(plaza.x, plaza.y, 20, plaza.x, plaza.y, 80);
      gradient.addColorStop(0, plaza.color + 'dd');
      gradient.addColorStop(1, plaza.color + '00');
      ctx.fillStyle = gradient;
      ctx.fillRect(plaza.x - 80, plaza.y - 80, 160, 160);

      const plazaGradient = ctx.createLinearGradient(plaza.x - 50, plaza.y - 60, plaza.x + 50, plaza.y + 20);
      plazaGradient.addColorStop(0, plaza.passed ? '#444' : plaza.color);
      plazaGradient.addColorStop(1, plaza.passed ? '#222' : '#000');
      ctx.fillStyle = plazaGradient;
      
      ctx.beginPath();
      ctx.moveTo(plaza.x - 50, plaza.y + 20);
      ctx.lineTo(plaza.x - 50, plaza.y - 40);
      ctx.lineTo(plaza.x - 40, plaza.y - 60);
      ctx.lineTo(plaza.x + 40, plaza.y - 60);
      ctx.lineTo(plaza.x + 50, plaza.y - 40);
      ctx.lineTo(plaza.x + 50, plaza.y + 20);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = 'white';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      if (plaza.type === 'paid') {
        ctx.fillText('₹', plaza.x, plaza.y - 10);
      } else if (plaza.type === 'free') {
        ctx.fillText('✓', plaza.x, plaza.y - 10);
      } else {
        ctx.fillText('●', plaza.x, plaza.y - 10);
      }

      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Arial';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#000';
      ctx.fillText(plaza.name, plaza.x, plaza.y - 75);
      ctx.shadowBlur = 0;
      
      if (plaza.type === 'paid' && !plaza.passed) {
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(`₹${plaza.fee}`, plaza.x, plaza.y + 35);
      }

      if (plaza.passed) {
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 48px Arial';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#10b981';
        ctx.fillText('✓', plaza.x + 35, plaza.y - 35);
        ctx.shadowBlur = 0;
      }
    });

    setParticles(prev => {
      const updated = prev.map(p => ({ ...p, life: p.life - 1 })).filter(p => p.life > 0);
      
      updated.forEach(particle => {
        const alpha = particle.life / 20;
        ctx.fillStyle = `rgba(150, 150, 150, ${alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
      
      return updated;
    });

    ctx.save();
    ctx.translate(carX, carY);
    ctx.rotate((carAngle * Math.PI) / 180);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(-22, -12, 44, 24);

    const carGradient = ctx.createLinearGradient(-20, -15, -20, 15);
    carGradient.addColorStop(0, '#ff1744');
    carGradient.addColorStop(0.5, '#d50000');
    carGradient.addColorStop(1, '#b71c1c');
    ctx.fillStyle = carGradient;
    ctx.fillRect(-20, -15, 40, 30);

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(-20, -15, 40, 30);

    ctx.fillStyle = 'rgba(50, 100, 200, 0.7)';
    ctx.fillRect(-15, -10, 12, 8);
    ctx.fillRect(-15, 2, 12, 8);
    ctx.fillRect(3, -10, 12, 8);
    ctx.fillRect(3, 2, 12, 8);

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(-15, -10, 12, 8);
    ctx.strokeRect(-15, 2, 12, 8);
    ctx.strokeRect(3, -10, 12, 8);
    ctx.strokeRect(3, 2, 12, 8);

    ctx.fillStyle = speed > 3 ? '#ffff00' : '#ffff99';
    ctx.shadowBlur = speed > 3 ? 15 : 5;
    ctx.shadowColor = '#ffff00';
    ctx.beginPath();
    ctx.arc(20, -10, 3, 0, Math.PI * 2);
    ctx.arc(20, 10, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ff0000';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ff0000';
    ctx.beginPath();
    ctx.arc(-20, -8, 2, 0, Math.PI * 2);
    ctx.arc(-20, 8, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(-5, -15, 10, 30);

    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-18, -18, 6, 8);
    ctx.fillRect(-18, 10, 6, 8);
    ctx.fillRect(12, -18, 6, 8);
    ctx.fillRect(12, 10, 6, 8);

    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    ctx.strokeRect(-18, -18, 6, 8);
    ctx.strokeRect(-18, 10, 6, 8);
    ctx.strokeRect(12, -18, 6, 8);
    ctx.strokeRect(12, 10, 6, 8);

    ctx.restore();
    ctx.restore();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-5 mb-4 shadow-2xl">
          <h1 className="text-5xl font-bold text-white text-center drop-shadow-lg">
            Toll Plaza Journey Simulator
          </h1>
          <p className="text-white text-center mt-2 text-xl font-semibold">Coimbatore to Chennai Highway</p>
        </div>

        {gameState !== 'menu' && (
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-2 text-white">
                <Coins className="w-6 h-6" />
                <div>
                  <p className="text-xs opacity-90">Balance</p>
                  <p className="text-2xl font-bold">₹{wallet}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-2 text-white">
                <Trophy className="w-6 h-6" />
                <div>
                  <p className="text-xs opacity-90">Score</p>
                  <p className="text-2xl font-bold">{score}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-2 text-white">
                <Gauge className="w-6 h-6" />
                <div>
                  <p className="text-xs opacity-90">Speed</p>
                  <p className="text-2xl font-bold">{Math.round(Math.abs(speed) * 12)} km/h</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-red-600 rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-2 text-white">
                <CreditCard className="w-6 h-6" />
                <div>
                  <p className="text-xs opacity-90">FastTag</p>
                  <p className="text-lg font-bold">{activeTag?.tagId || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {gameMessage && gameState !== 'menu' && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold text-center py-4 px-6 rounded-xl mb-4 text-xl shadow-lg">
            {gameMessage}
          </div>
        )}

        {gameState === 'menu' && (
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-16 text-center shadow-2xl border-4 border-blue-400">
            <div className="text-6xl mb-8">🛣️</div>
            <h2 className="text-5xl font-bold text-white mb-6">Toll Plaza Simulation</h2>
            <p className="text-white/90 text-xl mb-10 max-w-3xl mx-auto">
              Experience realistic toll plaza journey from Coimbatore to Chennai
            </p>
            <button
              onClick={() => setShowTagModal(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-20 py-6 rounded-2xl text-3xl font-bold hover:scale-110 transform transition-all shadow-2xl border-4 border-white"
            >
              Start Your Journey
            </button>
          </div>
        )}

        {(gameState === 'playing' || gameState === 'payment') && (
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={900}
              height={600}
              className="w-full border-8 border-blue-400 rounded-2xl shadow-2xl"
            />
            <div className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded-xl backdrop-blur">
              <p className="font-bold text-lg">Mission</p>
              <p>Drive to Chennai</p>
              <p className="text-yellow-400 mt-2">🔴 Paid | 🔵 Free</p>
              <p className="text-green-400 mt-3 font-bold">Press ENTER for Auto-Drive</p>
            </div>
            {autoMove && (
              <div className="absolute top-4 right-4 bg-green-600/90 text-white p-4 rounded-xl backdrop-blur animate-pulse">
                <p className="font-bold text-lg">AUTO-PILOT ON</p>
                <p>Driving to next location...</p>
              </div>
            )}
          </div>
        )}

        {gameState === 'completed' && (
          <div className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-3xl p-16 text-center shadow-2xl border-8 border-yellow-400">
            <div className="text-9xl mb-8">✅</div>
            <h2 className="text-6xl font-bold text-white mb-6">Journey Completed!</h2>
            <p className="text-4xl text-yellow-300 font-bold mb-4">Score: {score}</p>
            <p className="text-3xl text-white mb-4">Remaining Balance: ₹{wallet}</p>
            <p className="text-2xl text-white mb-10">Tolls Passed: {tollsPassed.length}</p>
            <div className="bg-black/30 rounded-xl p-6 mb-8">
              <h3 className="text-white font-bold text-2xl mb-4">Trip Summary</h3>
              <div className="text-left text-white space-y-2">
                <p><strong>FastTag:</strong> {activeTag?.tagId}</p>
                <p><strong>Vehicle:</strong> {activeTag?.vehicleInfo?.registrationNumber}</p>
                <p><strong>Total Toll Amount:</strong> ₹{tollsPassed.reduce((sum, toll) => sum + toll.amount, 0)}</p>
                <p><strong>Trip Duration:</strong> {currentTrip && new Date(new Date() - new Date(currentTrip.startTime)).toISOString().substr(11, 8)}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setGameState('menu');
                setShowTagModal(true);
                setActiveTag(null);
                setTagId('');
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-16 py-6 rounded-2xl text-3xl font-bold hover:scale-110 transform transition-all shadow-2xl"
            >
              Start New Journey
            </button>
          </div>
        )}

        {showTagModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 max-w-lg w-full shadow-2xl border-8 border-white">
              <h3 className="text-5xl font-bold text-white mb-8 text-center">
                <CreditCard className="inline w-12 h-12 mr-3" />
                Enter FastTag ID
              </h3>
              <div className="bg-black/30 rounded-2xl p-6 mb-6">
                <p className="text-white text-lg mb-4">
                  Please enter your FastTag ID to start your journey
                </p>
                <p className="text-yellow-300 text-sm mb-4">
                  Your FastTag will be validated from the database
                </p>
                <input
                  type="text"
                  value={tagId}
                  onChange={(e) => {
                    setTagId(e.target.value.toUpperCase());
                    setValidationError('');
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && tagId.trim() && !isLoading) {
                      validateFastTag();
                    }
                  }}
                  placeholder="e.g., FT994085413018"
                  className="w-full px-6 py-4 rounded-xl mb-4 text-2xl font-bold text-center focus:ring-4 focus:ring-yellow-400 outline-none uppercase"
                  autoFocus
                  disabled={isLoading}
                />
                {validationError && (
                  <div className="bg-red-500/90 text-white px-4 py-3 rounded-xl mb-4">
                    {validationError}
                  </div>
                )}
                {isLoading && (
                  <div className="flex items-center justify-center gap-3 text-white mb-4">
                    <Loader className="w-6 h-6 animate-spin" />
                    <span>Validating FastTag from database...</span>
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowTagModal(false);
                    setTagId('');
                    setValidationError('');
                  }}
                  className="flex-1 bg-gray-500 text-white py-4 rounded-2xl text-xl font-bold hover:scale-105 transform transition-all"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={validateFastTag}
                  disabled={!tagId.trim() || isLoading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl text-xl font-bold hover:scale-105 transform transition-all shadow-xl border-4 border-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Validating...' : 'Start Journey'}
                </button>
              </div>
            </div>
          </div>
        )}

        {showUpiModal && currentTollPlaza && activeTag && (
          <UpiPaymentGateway
            isOpen={showUpiModal}
            onClose={() => {
              console.log('UPI Modal closing...');
              setShowUpiModal(false);
              setCurrentTollPlaza(null);
              setCurrentTollIndex(null);
              setGameMessage('Payment cancelled. Please pay toll to continue.');
              setTimeout(() => {
                setGameMessage('');
              }, 3000);
            }}
            amount={currentTollPlaza.fee}
            vehicleData={activeTag.vehicleInfo}
            personalData={activeTag.personalInfo}
            user={user || {
              mobile: activeTag.personalInfo.phoneNumber,
              email: activeTag.personalInfo.email
            }}
            vehicleId={activeTag.vehicleId}
            personalDetailsId={activeTag.personalDetailsId}
            tagId={activeTag.tagId}
            isRecharge={false}
            isTollPayment={true}
            tollPlazaName={currentTollPlaza.name}
            onSuccess={handleTollPaymentSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default TollPlazaSimulation;