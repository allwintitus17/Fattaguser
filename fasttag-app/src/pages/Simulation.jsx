import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const FastTagSimulation = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const carRef = useRef(null);
  const mixerRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(0);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [showTollAlert, setShowTollAlert] = useState(false);
  const [fastTagBalance, setFastTagBalance] = useState(500);
  const [isMoving, setIsMoving] = useState(false);
  const [weather, setWeather] = useState('sunny');
  const [timeOfDay, setTimeOfDay] = useState('day');

  // Enhanced Tamil Nadu toll plazas with more details
  const tamilNaduTolls = [
    { name: 'Kappalur', hasToll: true, tollAmount: 45, type: 'National PF', city: 'Salem', highway: 'NH-44' },
    { name: 'Omalur Toll Plaza', hasToll: true, tollAmount: 55, type: 'National Conc.', city: 'Salem', highway: 'NH-44' },
    { name: 'Nanguneri', hasToll: true, tollAmount: 40, type: 'National PF', city: 'Tirunelveli', highway: 'NH-44' },
    { name: 'Paranur', hasToll: false, tollAmount: 0, type: 'National PF', city: 'Villupuram', highway: 'NH-45' },
    { name: 'Lembalakudi', hasToll: true, tollAmount: 50, type: 'National PF', city: 'Thanjavur', highway: 'NH-83' },
    { name: 'Lechchumanapatti', hasToll: false, tollAmount: 0, type: 'National PF', city: 'Dindigul', highway: 'NH-38' },
    { name: 'Etturvattam', hasToll: true, tollAmount: 60, type: 'National PF', city: 'Kanyakumari', highway: 'NH-44' },
    { name: 'Boothakudi', hasToll: true, tollAmount: 55, type: 'National PF', city: 'Ramanathapuram', highway: 'NH-49' },
    { name: 'Chittampatti', hasToll: true, tollAmount: 40, type: 'National PF', city: 'Dharmapuri', highway: 'NH-44' },
    { name: 'Mathur Toll Plaza', hasToll: true, tollAmount: 65, type: 'National PF', city: 'Krishnagiri', highway: 'NH-44' },
    { name: 'SriPerumbadur', hasToll: false, tollAmount: 0, type: 'National PF', city: 'Chennai', highway: 'NH-4' },
    { name: 'Chennasamaduram', hasToll: false, tollAmount: 0, type: 'National PF', city: 'Chennai', highway: 'NH-4' },
    { name: 'Vikkravandi Toll Plaza', hasToll: true, tollAmount: 70, type: 'National Conc.', city: 'Villupuram', highway: 'NH-45' },
    { name: 'SENGURICHI TOLL PLAZA', hasToll: true, tollAmount: 45, type: 'National Conc.', city: 'Trichy', highway: 'NH-38' },
    { name: 'Samayapuram Toll Plaza', hasToll: true, tollAmount: 60, type: 'National Conc.', city: 'Trichy', highway: 'NH-38' }
  ];

  const routes = [
    'Chennai to Coimbatore (NH-4)',
    'Chennai to Madurai (NH-45)',
    'Coimbatore to Salem (NH-44)',
    'Trichy to Chennai (NH-38)',
    'Chennai to Kanyakumari (NH-44)'
  ];

  useEffect(() => {
    if (!mountRef.current) return;

    // Enhanced Scene setup with fog and atmosphere
    const scene = new THREE.Scene();
    
    // Dynamic sky based on time of day
    const skyColor = timeOfDay === 'day' ? 0x87CEEB : timeOfDay === 'sunset' ? 0xFF6B35 : 0x191970;
    scene.background = new THREE.Color(skyColor);
    scene.fog = new THREE.Fog(skyColor, 50, 200);
    sceneRef.current = scene;

    // Enhanced Camera with smooth movement
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 8, 15);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Enhanced Renderer with post-processing effects
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Enhanced Lighting System
    const ambientLight = new THREE.AmbientLight(0x404040, timeOfDay === 'night' ? 0.3 : 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, timeOfDay === 'night' ? 0.5 : 1);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    scene.add(directionalLight);

    // Enhanced Ground with texture-like appearance
    const groundGeometry = new THREE.PlaneGeometry(400, 400, 50, 50);
    const vertices = groundGeometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      vertices[i + 2] = Math.sin(vertices[i] * 0.01) * Math.cos(vertices[i + 1] * 0.01) * 0.5;
    }
    groundGeometry.computeVertexNormals();
    
    const groundMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x90EE90,
      transparent: true,
      opacity: 0.9
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Multi-lane Highway with realistic markings
    const roadGeometry = new THREE.PlaneGeometry(12, 400);
    const roadMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x2C2C2C,
      transparent: true,
      opacity: 0.95
    });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.y = 0.02;
    scene.add(road);

    // Enhanced Road Markings - Multiple lanes
    const createRoadMarkings = () => {
      // Center divider
      for (let i = -190; i <= 190; i += 8) {
        const dividerGeometry = new THREE.PlaneGeometry(0.3, 4);
        const dividerMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
        const divider = new THREE.Mesh(dividerGeometry, dividerMaterial);
        divider.rotation.x = -Math.PI / 2;
        divider.position.set(0, 0.03, i);
        scene.add(divider);
      }

      // Lane markings
      [-3, 3].forEach(x => {
        for (let i = -190; i <= 190; i += 12) {
          const laneGeometry = new THREE.PlaneGeometry(0.2, 3);
          const laneMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
          const lane = new THREE.Mesh(laneGeometry, laneMaterial);
          lane.rotation.x = -Math.PI / 2;
          lane.position.set(x, 0.03, i);
          scene.add(lane);
        }
      });

      // Side borders
      [-6, 6].forEach(x => {
        const borderGeometry = new THREE.PlaneGeometry(0.3, 400);
        const borderMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        const border = new THREE.Mesh(borderGeometry, borderMaterial);
        border.rotation.x = -Math.PI / 2;
        border.position.set(x, 0.03, 0);
        scene.add(border);
      });
    };
    createRoadMarkings();

    // Enhanced Car with more realistic design
    const createEnhancedCar = () => {
      const carGroup = new THREE.Group();
      
      // Main body with curves
      const bodyGeometry = new THREE.BoxGeometry(2.2, 1, 4.5);
      const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xFF4444,
        shininess: 100,
        specular: 0x444444
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.5;
      body.castShadow = true;
      carGroup.add(body);

      // Enhanced roof
      const roofGeometry = new THREE.BoxGeometry(1.8, 0.8, 2.5);
      roofGeometry.scale(1, 1, 1);
      const roofMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xCC2222,
        shininess: 100
      });
      const roof = new THREE.Mesh(roofGeometry, roofMaterial);
      roof.position.y = 1.3;
      roof.position.z = -0.2;
      roof.castShadow = true;
      carGroup.add(roof);

      // Windscreen
      const windscreenGeometry = new THREE.PlaneGeometry(1.6, 0.7);
      const windscreenMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x87CEEB,
        transparent: true,
        opacity: 0.3
      });
      const windscreen = new THREE.Mesh(windscreenGeometry, windscreenMaterial);
      windscreen.position.set(0, 1.3, 1.2);
      windscreen.rotation.x = -0.3;
      carGroup.add(windscreen);

      // Enhanced Wheels with rims
      const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 16);
      const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x111111 });
      
      // Rim
      const rimGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.45, 16);
      const rimMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x888888,
        shininess: 100
      });

      const wheelPositions = [
        { x: -1.2, z: 1.5 },
        { x: 1.2, z: 1.5 },
        { x: -1.2, z: -1.5 },
        { x: 1.2, z: -1.5 }
      ];

      wheelPositions.forEach(pos => {
        const wheelWrap = new THREE.Group();
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        
        wheel.rotation.z = Math.PI / 2;
        rim.rotation.z = Math.PI / 2;
        
        wheelWrap.add(wheel);
        wheelWrap.add(rim);
        wheelWrap.position.set(pos.x, 0.5, pos.z);
        wheelWrap.castShadow = true;
        carGroup.add(wheelWrap);
      });

      // Headlights
      const headlightGeometry = new THREE.SphereGeometry(0.3, 8, 8);
      const headlightMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xFFFFAA,
        emissive: 0x444422
      });
      
      [-0.7, 0.7].forEach(x => {
        const headlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        headlight.position.set(x, 0.7, 2.1);
        headlight.castShadow = true;
        carGroup.add(headlight);
      });

      // Taillights
      const taillightMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xFF0000,
        emissive: 0x220000
      });
      
      [-0.5, 0.5].forEach(x => {
        const taillight = new THREE.Mesh(headlightGeometry, taillightMaterial);
        taillight.position.set(x, 0.7, -2.1);
        taillight.scale.set(0.7, 0.7, 0.7);
        carGroup.add(taillight);
      });

      carGroup.position.set(0, 0, -80);
      carRef.current = carGroup;
      return carGroup;
    };

    const car = createEnhancedCar();
    scene.add(car);

    // Environmental Elements
    const createEnvironment = () => {
      // Trees along the highway
      const treePositions = [];
      for (let i = -180; i < 180; i += 15) {
        treePositions.push(
          { x: 15 + Math.random() * 5, z: i + Math.random() * 10 },
          { x: -15 - Math.random() * 5, z: i + Math.random() * 10 }
        );
      }

      treePositions.forEach(pos => {
        // Tree trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 4);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(pos.x, 2, pos.z);
        trunk.castShadow = true;
        scene.add(trunk);

        // Tree foliage
        const foliageGeometry = new THREE.SphereGeometry(2 + Math.random(), 8, 6);
        const foliageColor = weather === 'autumn' ? 0xFF8C00 : 0x228B22;
        const foliageMaterial = new THREE.MeshLambertMaterial({ color: foliageColor });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.set(pos.x, 5, pos.z);
        foliage.castShadow = true;
        scene.add(foliage);
      });

      // Mountains in the distance
      for (let i = 0; i < 20; i++) {
        const mountainGeometry = new THREE.ConeGeometry(
          5 + Math.random() * 10,
          10 + Math.random() * 15,
          8
        );
        const mountainMaterial = new THREE.MeshLambertMaterial({ 
          color: 0x696969,
          transparent: true,
          opacity: 0.7
        });
        const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
        mountain.position.set(
          (Math.random() - 0.5) * 200,
          5,
          -150 + Math.random() * 300
        );
        mountain.rotation.y = Math.random() * Math.PI;
        scene.add(mountain);
      }

      // Clouds
      if (weather !== 'clear') {
        for (let i = 0; i < 15; i++) {
          const cloudGeometry = new THREE.SphereGeometry(3 + Math.random() * 2, 8, 6);
          const cloudMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.8
          });
          const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
          cloud.position.set(
            (Math.random() - 0.5) * 200,
            20 + Math.random() * 10,
            (Math.random() - 0.5) * 200
          );
          cloud.scale.set(2, 1, 2);
          scene.add(cloud);
        }
      }
    };

    createEnvironment();

    // Particle system for effects
    const createParticleSystem = () => {
      const particleCount = weather === 'rain' ? 1000 : 200;
      const particles = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      const particleVelocities = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        particlePositions[i] = (Math.random() - 0.5) * 200;
        particlePositions[i + 1] = Math.random() * 50;
        particlePositions[i + 2] = (Math.random() - 0.5) * 200;
        
        particleVelocities[i] = (Math.random() - 0.5) * 0.1;
        particleVelocities[i + 1] = -Math.random() * 0.2;
        particleVelocities[i + 2] = (Math.random() - 0.5) * 0.1;
      }

      particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      particles.setAttribute('velocity', new THREE.BufferAttribute(particleVelocities, 3));

      const particleMaterial = new THREE.PointsMaterial({
        color: weather === 'rain' ? 0x87CEEB : 0xFFFFFF,
        size: weather === 'rain' ? 0.1 : 0.3,
        transparent: true,
        opacity: 0.6
      });

      const particleSystem = new THREE.Points(particles, particleMaterial);
      scene.add(particleSystem);

      return { particles, particleSystem };
    };

    const { particles, particleSystem } = createParticleSystem();

    // Animation loop with enhanced effects
    const clock = new THREE.Clock();
    const animate = () => {
      const delta = clock.getDelta();
      
      // Animate particles
      const positions = particles.attributes.position.array;
      const velocities = particles.attributes.velocity.array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];
        
        if (positions[i + 1] < 0) {
          positions[i + 1] = 50;
        }
      }
      particles.attributes.position.needsUpdate = true;

      // Animate car wheels if moving
      if (isMoving && carRef.current) {
        carRef.current.children.forEach(child => {
          if (child.type === 'Group') { // wheels
            child.rotation.x += delta * 10;
          }
        });
      }

      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [timeOfDay, weather]);

  // Enhanced toll plaza markers
  useEffect(() => {
    if (!sceneRef.current || !simulationStarted) return;

    // Clear existing markers
    const existingMarkers = sceneRef.current.children.filter(child => child.userData.isMarker);
    existingMarkers.forEach(marker => sceneRef.current.remove(marker));

    // Create enhanced toll plaza structures
    tamilNaduTolls.forEach((toll, index) => {
      const tollGroup = new THREE.Group();
      const zPosition = -80 + (index * 25);

      if (toll.hasToll) {
        // Toll booth structure
        const boothGeometry = new THREE.BoxGeometry(4, 3, 2);
        const boothMaterial = new THREE.MeshPhongMaterial({ color: 0xFF6B35 });
        const booth = new THREE.Mesh(boothGeometry, boothMaterial);
        booth.position.set(0, 1.5, zPosition);
        booth.castShadow = true;
        tollGroup.add(booth);

        // Toll booth roof
        const roofGeometry = new THREE.ConeGeometry(3, 1, 4);
        const roofMaterial = new THREE.MeshPhongMaterial({ color: 0xDC143C });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.set(0, 3.5, zPosition);
        roof.castShadow = true;
        tollGroup.add(roof);

        // Barrier gates
        [-2, 2].forEach(x => {
          const barrierGeometry = new THREE.BoxGeometry(0.2, 0.2, 4);
          const barrierMaterial = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
          const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
          barrier.position.set(x, 2.5, zPosition);
          barrier.rotation.y = Math.PI / 2;
          tollGroup.add(barrier);
        });

        // Warning lights
        for (let i = 0; i < 4; i++) {
          const lightGeometry = new THREE.SphereGeometry(0.2);
          const lightMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFF0000,
            emissive: 0xFF0000,
            emissiveIntensity: 0.5
          });
          const light = new THREE.Mesh(lightGeometry, lightMaterial);
          light.position.set(
            Math.cos(i * Math.PI / 2) * 2.5,
            3,
            zPosition + Math.sin(i * Math.PI / 2) * 2.5
          );
          tollGroup.add(light);
        }
      } else {
        // Free passage marker - green arch
        const archGeometry = new THREE.TorusGeometry(3, 0.3, 8, 16, Math.PI);
        const archMaterial = new THREE.MeshPhongMaterial({ color: 0x00FF00 });
        const arch = new THREE.Mesh(archGeometry, archMaterial);
        arch.position.set(0, 4, zPosition);
        arch.rotation.z = Math.PI;
        tollGroup.add(arch);
      }

      // Location signboard
      const signGeometry = new THREE.PlaneGeometry(6, 2);
      const signMaterial = new THREE.MeshBasicMaterial({ 
        color: toll.hasToll ? 0xFFFFFF : 0x00AA00 
      });
      const sign = new THREE.Mesh(signGeometry, signMaterial);
      sign.position.set(0, 5, zPosition - 3);
      tollGroup.add(sign);

      tollGroup.userData.isMarker = true;
      tollGroup.userData.tollInfo = toll;
      sceneRef.current.add(tollGroup);
    });
  }, [simulationStarted]);

  const moveToNextLocation = () => {
    if (currentLocation < tamilNaduTolls.length - 1) {
      setIsMoving(true);
      const nextLocation = currentLocation + 1;
      const nextToll = tamilNaduTolls[nextLocation];
      
      // Smooth car movement animation
      const startZ = carRef.current.position.z;
      const endZ = -80 + (nextLocation * 25);
      const duration = 2000; // 2 seconds
      const startTime = Date.now();

      const animateMovement = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth movement
        const easeInOutQuad = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        const currentZ = startZ + (endZ - startZ) * easeInOutQuad;
        
        if (carRef.current) {
          carRef.current.position.z = currentZ;
        }
        
        // Update camera to follow smoothly
        if (cameraRef.current) {
          cameraRef.current.position.z = currentZ + 15;
          cameraRef.current.lookAt(0, 0, currentZ);
        }

        if (progress < 1) {
          requestAnimationFrame(animateMovement);
        } else {
          setIsMoving(false);
          setCurrentLocation(nextLocation);
          
          // Check if next location has toll
          if (nextToll.hasToll) {
            setTimeout(() => setShowTollAlert(true), 500);
          }
        }
      };

      animateMovement();
    }
  };

  const handleTollPayment = () => {
    const currentToll = tamilNaduTolls[currentLocation];
    if (fastTagBalance >= currentToll.tollAmount) {
      setFastTagBalance(prev => prev - currentToll.tollAmount);
      setShowTollAlert(false);
      
      // Success animation effect
      const successDiv = document.createElement('div');
      successDiv.innerHTML = `✓ Toll Paid: ₹${currentToll.tollAmount}`;
      successDiv.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #00ff00, #32cd32); color: white;
        padding: 20px; border-radius: 10px; font-size: 18px; font-weight: bold;
        z-index: 1000; box-shadow: 0 4px 15px rgba(0,255,0,0.3);
        animation: fadeInOut 2s ease-in-out forwards;
      `;
      
      const style = document.createElement('style');
      style.textContent = `
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
      `;
      document.head.appendChild(style);
      document.body.appendChild(successDiv);
      
      setTimeout(() => {
        successDiv.remove();
        style.remove();
      }, 2000);
    } else {
      alert('Insufficient FastTag balance! Please recharge your FastTag.');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && simulationStarted && !isMoving) {
      if (showTollAlert) {
        handleTollPayment();
      } else {
        moveToNextLocation();
      }
    }
  };

  const startSimulation = () => {
    if (selectedRoute) {
      setSimulationStarted(true);
      setCurrentLocation(0);
    } else {
      alert('Please select a route first!');
    }
  };

  const resetSimulation = () => {
    setSimulationStarted(false);
    setCurrentLocation(0);
    setShowTollAlert(false);
    setFastTagBalance(500);
    setIsMoving(false);
    
    if (carRef.current) {
      carRef.current.position.z = -80;
    }
    if (cameraRef.current) {
      cameraRef.current.position.z = 15;
      cameraRef.current.lookAt(0, 0, -80);
    }
  };

  useEffect(() => {
    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, [simulationStarted, showTollAlert, currentLocation, fastTagBalance, isMoving]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-6 lg:p-8 border border-white/20">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-center bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4 sm:mb-6 lg:mb-8">
          🚗 FastTag Toll Plaza Simulation - Tamil Nadu 🛣️
        </h1>

        {/* Route Overview Map */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-3 sm:p-6 lg:p-8 mb-6 lg:mb-8 border border-white/20">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 lg:mb-6 text-center">Route Overview - Tamil Nadu Highways</h2>
          
          {/* Horizontal scrollable route view for mobile and tablet */}
          <div className="block lg:hidden mb-4">
            <div className="overflow-x-auto pb-4">
              <div className="flex space-x-4 min-w-max px-4">
                {tamilNaduTolls.map((toll, index) => (
                  <div key={index} className="flex flex-col items-center min-w-16">
                    <div 
                      className={`w-6 h-6 rounded-full border-2 border-white z-10 transition-all duration-300 mb-2 ${
                        toll.hasToll ? 'bg-red-500' : 'bg-green-500'
                      } ${index === currentLocation && simulationStarted ? 'animate-pulse scale-125 shadow-lg ring-2 ring-yellow-400' : ''}`}
                    ></div>
                    <div className={`text-xs text-center w-16 ${
                      index === currentLocation && simulationStarted ? 'text-yellow-300 font-bold' : 'text-white/80'
                    }`}>
                      <div className="truncate text-xs">{toll.name.split(' ')[0]}</div>
                      <div className={`text-xs font-bold mt-1 ${toll.hasToll ? 'text-red-300' : 'text-green-300'}`}>
                        {toll.hasToll ? `₹${toll.tollAmount}` : 'FREE'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Mobile progress bar */}
            {simulationStarted && (
              <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${((currentLocation + 1) / tamilNaduTolls.length) * 100}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Desktop large screen view - constrained and centered */}
          <div className="hidden lg:block">
            <div className="max-w-5xl mx-auto relative bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 lg:p-8 mb-4 min-h-32">
              {/* Route line */}
              <div className="absolute top-1/2 left-8 right-8 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-full transform -translate-y-1/2"></div>
              
              {/* Location markers in fixed grid with proper spacing */}
              <div className="grid grid-cols-5 gap-4 lg:gap-6 xl:gap-8 relative z-10 max-w-4xl mx-auto">
                {tamilNaduTolls.slice(0, 15).map((toll, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className={`w-6 h-6 lg:w-7 lg:h-7 rounded-full border-2 border-white transition-all duration-300 mb-2 ${
                        toll.hasToll ? 'bg-red-500' : 'bg-green-500'
                      } ${index === currentLocation && simulationStarted ? 'animate-pulse scale-150 shadow-lg ring-2 ring-yellow-400' : ''}`}
                      title={`${toll.name} - ${toll.hasToll ? `₹${toll.tollAmount}` : 'FREE'}`}
                    ></div>
                    <div className={`text-xs lg:text-sm text-center w-full ${
                      index === currentLocation && simulationStarted ? 'text-yellow-300 font-bold' : 'text-white/80'
                    }`}>
                      <div className="truncate text-xs lg:text-sm leading-tight px-1">{toll.name.length > 12 ? toll.name.substring(0, 12) + '...' : toll.name}</div>
                      <div className={`text-xs lg:text-sm font-bold mt-1 ${toll.hasToll ? 'text-red-300' : 'text-green-300'}`}>
                        {toll.hasToll ? `₹${toll.tollAmount}` : 'FREE'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Progress indicator */}
              {simulationStarted && (
                <div className="absolute bottom-2 left-8 right-8">
                  <div className="w-full bg-gray-600 rounded-full h-3">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${((currentLocation + 1) / tamilNaduTolls.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center flex-wrap gap-4 lg:gap-6 text-sm lg:text-base max-w-2xl mx-auto">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-red-500"></div>
              <span className="text-white">Toll Plaza</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-green-500"></div>
              <span className="text-white">Free Passage</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-yellow-400"></div>
              <span className="text-white">Current Position</span>
            </div>
          </div>

          {/* Route summary statistics - constrained width */}
          <div className="mt-6 lg:mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 rounded-lg p-3 lg:p-4 text-center">
              <div className="text-xl lg:text-2xl font-bold text-white">{tamilNaduTolls.length}</div>
              <div className="text-xs lg:text-sm text-white/80">Total Locations</div>
            </div>
            <div className="bg-red-500/20 rounded-lg p-3 lg:p-4 text-center">
              <div className="text-xl lg:text-2xl font-bold text-red-300">
                {tamilNaduTolls.filter(toll => toll.hasToll).length}
              </div>
              <div className="text-xs lg:text-sm text-red-200">Toll Plazas</div>
            </div>
            <div className="bg-green-500/20 rounded-lg p-3 lg:p-4 text-center">
              <div className="text-xl lg:text-2xl font-bold text-green-300">
                {tamilNaduTolls.filter(toll => !toll.hasToll).length}
              </div>
              <div className="text-xs lg:text-sm text-green-200">Free Passages</div>
            </div>
            <div className="bg-yellow-500/20 rounded-lg p-3 lg:p-4 text-center">
              <div className="text-xl lg:text-2xl font-bold text-yellow-300">
                ₹{tamilNaduTolls.reduce((total, toll) => total + toll.tollAmount, 0)}
              </div>
              <div className="text-xs lg:text-sm text-yellow-200">Total Toll Cost</div>
            </div>
          </div>
        </div>

        {/* Main content area with proper constraints */}
        <div className="flex flex-col xl:grid xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 max-w-6xl mx-auto">
          {/* Left sidebar */}
          <div className="xl:col-span-1 space-y-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 lg:p-5 rounded-xl text-white">
              <label className="block text-sm lg:text-base font-medium mb-3">
                Select Route:
              </label>
              <select
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value)}
                className="w-full p-3 border-0 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:ring-2 focus:ring-yellow-400 text-sm lg:text-base"
              >
                <option value="" className="text-gray-800">Choose a route...</option>
                {routes.map((route, index) => (
                  <option key={index} value={route} className="text-gray-800">{route}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-row xl:flex-col space-x-2 xl:space-x-0 xl:space-y-3">
              <button
                onClick={startSimulation}
                disabled={!selectedRoute || simulationStarted}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 transform hover:scale-105 transition-all duration-200 shadow-lg text-sm lg:text-base"
              >
                Start Journey
              </button>
              <button
                onClick={resetSimulation}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg font-bold hover:from-red-600 hover:to-rose-700 transform hover:scale-105 transition-all duration-200 shadow-lg text-sm lg:text-base"
              >
                Reset Journey
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTimeOfDay(timeOfDay === 'day' ? 'sunset' : timeOfDay === 'sunset' ? 'night' : 'day')}
                className="px-3 py-2 bg-gradient-to-r from-orange-400 to-yellow-500 text-white rounded-lg font-medium hover:from-orange-500 hover:to-yellow-600 text-xs lg:text-sm"
              >
                {timeOfDay === 'day' ? '☀️ Day' : timeOfDay === 'sunset' ? '🌅 Sunset' : '🌙 Night'}
              </button>
              <button
                onClick={() => setWeather(weather === 'sunny' ? 'rain' : weather === 'rain' ? 'cloudy' : 'sunny')}
                className="px-3 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-500 hover:to-cyan-600 text-xs lg:text-sm"
              >
                {weather === 'sunny' ? '☀️ Sunny' : weather === 'rain' ? '🌧️ Rain' : '☁️ Cloudy'}
              </button>
            </div>
          </div>

          {/* Center - 3D Viewport with fixed aspect ratio */}
          <div className="xl:col-span-2 order-first xl:order-none">
            <div className="border-4 border-gradient rounded-xl overflow-hidden shadow-2xl bg-gradient-to-r from-purple-500 to-pink-500 p-1 max-w-4xl mx-auto">
              <div ref={mountRef} className="w-full aspect-[4/3] max-h-[500px] rounded-lg overflow-hidden bg-black" />
            </div>
          </div>

          {/* Right sidebar */}
          <div className="xl:col-span-1 space-y-4">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 lg:p-5 rounded-xl text-white shadow-lg">
              <h3 className="font-bold text-base lg:text-lg mb-3">💳 FastTag Balance</h3>
              <p className="text-2xl lg:text-3xl font-bold">₹{fastTagBalance}</p>
              <div className="mt-3 bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{ width: `${Math.max((fastTagBalance / 500) * 100, 0)}%` }}
                ></div>
              </div>
            </div>
            
            {simulationStarted && (
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 lg:p-5 rounded-xl text-white shadow-lg">
                <h3 className="font-bold text-base lg:text-lg mb-3">🎯 Current Location</h3>
                <p className="text-sm lg:text-base font-semibold mb-1">
                  {tamilNaduTolls[currentLocation]?.name || 'Starting Point'}
                </p>
                <p className="text-xs lg:text-sm opacity-80">
                  {tamilNaduTolls[currentLocation]?.city} • {tamilNaduTolls[currentLocation]?.highway}
                </p>
                <div className="mt-3 bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-1000"
                    style={{ width: `${((currentLocation + 1) / tamilNaduTolls.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs mt-1 opacity-70">
                  Progress: {currentLocation + 1} / {tamilNaduTolls.length}
                </p>
              </div>
            )}

            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 lg:p-5 rounded-xl text-white shadow-lg">
              <h3 className="font-bold text-base lg:text-lg mb-3">📋 Instructions</h3>
              <ul className="text-xs lg:text-sm space-y-1 opacity-90">
                <li>🔴 Red structures = Toll plazas</li>
                <li>🟢 Green arches = Free passage</li>
                <li>⌨️ Press ENTER to move forward</li>
                <li>💰 Pay tolls when prompted</li>
                <li>🎮 Change time/weather for effects</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom section - constrained width */}
        {simulationStarted && (
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 lg:p-6 border border-white/20">
              <h3 className="text-lg lg:text-xl font-bold text-white mb-4">🛣️ Route Information</h3>
              <div className="max-h-64 lg:max-h-80 overflow-y-auto space-y-2">
                {tamilNaduTolls.map((toll, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border transition-all duration-300 ${
                      index === currentLocation 
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-300 transform scale-105 shadow-lg' 
                        : index < currentLocation
                        ? 'bg-green-500/20 border-green-400 text-green-100'
                        : 'bg-white/10 border-white/20 text-white/80'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <span className={`w-4 h-4 rounded-full flex-shrink-0 ${
                          toll.hasToll ? 'bg-red-500' : 'bg-green-500'
                        } ${index === currentLocation ? 'animate-pulse' : ''}`}></span>
                        <div className="min-w-0 flex-1">
                          <span className="font-medium text-sm block truncate">{toll.name}</span>
                          <p className="text-xs opacity-70 truncate">{toll.city} • {toll.highway}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        {toll.hasToll ? (
                          <span className="font-bold text-sm">₹{toll.tollAmount}</span>
                        ) : (
                          <span className="text-green-400 text-sm">FREE</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 lg:p-6 border border-white/20">
              <h3 className="text-lg lg:text-xl font-bold text-white mb-4">📊 Journey Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                  <span className="text-white/80 text-sm">Selected Route:</span>
                  <span className="text-white font-medium text-sm text-right max-w-40 truncate">{selectedRoute}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                  <span className="text-white/80 text-sm">Total Locations:</span>
                  <span className="text-white font-medium text-sm">{tamilNaduTolls.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                  <span className="text-white/80 text-sm">Tolls Passed:</span>
                  <span className="text-white font-medium text-sm">
                    {tamilNaduTolls.slice(0, currentLocation + 1).filter(toll => toll.hasToll).length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                  <span className="text-white/80 text-sm">Total Spent:</span>
                  <span className="text-white font-medium text-sm">
                    ₹{500 - fastTagBalance}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                  <span className="text-white/80 text-sm">Status:</span>
                  <span className={`font-medium text-sm ${
                    isMoving ? 'text-blue-400' : 
                    showTollAlert ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {isMoving ? '🚗 Moving...' : 
                     showTollAlert ? '🛑 Toll Payment Required' : '✅ Ready to Move'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Toll Payment Alert Modal - properly sized */}
      {showTollAlert && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-r from-red-500 to-rose-600 p-1 rounded-xl w-full max-w-md lg:max-w-lg animate-pulse">
            <div className="bg-white p-6 lg:p-8 rounded-lg">
              <div className="text-center mb-6">
                <div className="text-5xl lg:text-6xl mb-4">🚨</div>
                <h3 className="text-2xl lg:text-3xl font-bold text-red-600 mb-2">Toll Plaza Alert!</h3>
                <div className="w-full h-1 bg-red-200 rounded-full overflow-hidden">
                  <div className="w-full h-1 bg-gradient-to-r from-red-500 to-rose-600 animate-pulse"></div>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 p-4 lg:p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-gray-700">Location:</span>
                    <span className="font-bold text-gray-900 text-right truncate max-w-48">{tamilNaduTolls[currentLocation]?.name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-gray-700">Highway:</span>
                    <span className="text-gray-900">{tamilNaduTolls[currentLocation]?.highway}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-gray-700">Toll Amount:</span>
                    <span className="text-2xl lg:text-3xl font-bold text-red-600">₹{tamilNaduTolls[currentLocation]?.tollAmount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Current Balance:</span>
                    <span className={`text-xl lg:text-2xl font-bold ${
                      fastTagBalance >= tamilNaduTolls[currentLocation]?.tollAmount ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ₹{fastTagBalance}
                    </span>
                  </div>
                </div>
                
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm lg:text-base text-blue-700 font-medium">
                    Press ENTER to pay toll and continue your journey
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleTollPayment}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  💳 Pay Toll
                </button>
                <button
                  onClick={() => setShowTollAlert(false)}
                  className="px-6 py-3 bg-gradient-to-r from-gray-500 to-slate-600 text-white rounded-lg font-bold hover:from-gray-600 hover:to-slate-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .border-gradient {
          background: linear-gradient(45deg, #ff6b35, #f7931e, #ffd700, #32cd32, #1e90ff, #9370db);
          background-size: 400% 400%;
          animation: gradient 3s ease infinite;
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default FastTagSimulation;