import { questionFactory } from './builders'

const { mcq, num, short } = questionFactory('physics', 'phys')

// Uses g = 10 N/kg, as in Edexcel iGCSE Physics.
export const physicsQuestions = [
  // Forces & Motion
  num('Forces & Motion', 1, 'A runner covers 150 m in 20 s. Calculate the average speed.', 7.5, 'speed = distance ÷ time = 150 ÷ 20 = 7.5 m/s.', { unit: 'm/s' }),
  num('Forces & Motion', 1, 'A car accelerates from rest to 24 m/s in 8 s. Calculate its acceleration.', 3, 'a = (v − u) ÷ t = (24 − 0) ÷ 8 = 3 m/s².', { unit: 'm/s²' }),
  num('Forces & Motion', 1, 'A car of mass 1200 kg accelerates at 3 m/s². Calculate the resultant force.', 3600, 'F = ma = 1200 × 3 = 3600 N.', { unit: 'N' }),
  num('Forces & Motion', 1, 'Calculate the weight of a 5 kg mass. (g = 10 N/kg)', 50, 'W = mg = 5 × 10 = 50 N.', { unit: 'N', marks: 1 }),
  num('Forces & Motion', 2, 'A force of 40 N acts at a perpendicular distance of 0.25 m from a pivot. Calculate the moment.', 10, 'moment = force × perpendicular distance = 40 × 0.25 = 10 N m.', { unit: 'N m' }),
  num('Forces & Motion', 2, 'Calculate the momentum of a 1500 kg car moving at 20 m/s.', 30000, 'p = mv = 1500 × 20 = 30 000 kg m/s.', { unit: 'kg m/s' }),
  mcq('Forces & Motion', 2, 'Which two distances add together to give the overall stopping distance of a car?', ['Braking distance and reaction distance', 'Thinking distance and braking distance', 'Thinking distance and skidding distance', 'Braking distance and reaction time'], 1, 'Stopping distance = thinking distance + braking distance.'),
  mcq('Forces & Motion', 2, 'A skydiver reaches terminal velocity. Which statement is correct?', ['Weight is greater than air resistance', 'Air resistance is greater than weight', 'The resultant force is zero', 'The skydiver stops moving'], 2, 'At terminal velocity weight equals air resistance, so the resultant force is zero and acceleration is zero.'),
  num('Forces & Motion', 2, 'A force of 6 N extends a spring by 0.03 m. Calculate the spring constant.', 200, 'F = kx so k = F ÷ x = 6 ÷ 0.03 = 200 N/m.', { unit: 'N/m' }),
  num('Forces & Motion', 2, 'A force of 500 N acts on an area of 0.25 m². Calculate the pressure.', 2000, 'p = F ÷ A = 500 ÷ 0.25 = 2000 Pa.', { unit: 'Pa' }),

  // Energy
  num('Energy', 1, 'Calculate the kinetic energy of a 2 kg object moving at 6 m/s.', 36, 'KE = ½mv² = 0.5 × 2 × 36 = 36 J.', { unit: 'J' }),
  num('Energy', 1, 'Calculate the gravitational potential energy gained by a 3 kg mass lifted 5 m. (g = 10 N/kg)', 150, 'GPE = mgh = 3 × 10 × 5 = 150 J.', { unit: 'J' }),
  num('Energy', 1, 'A motor transfers 200 J of energy and 60 J is useful. Calculate the efficiency as a percentage.', 30, 'efficiency = useful ÷ total × 100 = 60 ÷ 200 × 100 = 30%.', { unit: '%' }),
  num('Energy', 1, 'A machine transfers 3000 J in 12 s. Calculate its power.', 250, 'P = E ÷ t = 3000 ÷ 12 = 250 W.', { unit: 'W' }),
  num('Energy', 1, 'A force of 50 N moves an object 8 m in the direction of the force. Calculate the work done.', 400, 'W = Fd = 50 × 8 = 400 J.', { unit: 'J' }),
  mcq('Energy', 1, 'Which of these is a renewable energy resource?', ['Natural gas', 'Coal', 'Wind', 'Uranium'], 2, 'Wind will not run out. Gas and coal are fossil fuels and uranium is a finite nuclear fuel.'),
  mcq('Energy', 2, 'Which type of material is the best thermal conductor?', ['Wood', 'Copper', 'Plastic', 'Air'], 1, 'Metals have delocalised electrons that transfer energy quickly.'),

  // Waves
  num('Waves', 2, 'A sound wave has frequency 50 Hz and wavelength 6.8 m. Calculate its speed.', 340, 'v = fλ = 50 × 6.8 = 340 m/s.', { unit: 'm/s' }),
  num('Waves', 1, 'A wave has a period of 0.02 s. Calculate its frequency.', 50, 'f = 1 ÷ T = 1 ÷ 0.02 = 50 Hz.', { unit: 'Hz', marks: 1 }),
  mcq('Waves', 1, 'Which electromagnetic wave has the highest frequency?', ['Microwaves', 'Ultraviolet', 'X-rays', 'Gamma rays'], 3, 'Order of increasing frequency: radio, microwave, infrared, visible, ultraviolet, X-ray, gamma.'),
  num('Waves', 3, 'Light enters glass with angle of incidence 40° and angle of refraction 25°. Calculate the refractive index to 2 decimal places.', 1.52, 'n = sin i ÷ sin r = sin 40° ÷ sin 25° = 0.6428 ÷ 0.4226 = 1.52.', { tol: 0.01 }),
  mcq('Waves', 1, 'Sound waves are...', ['transverse and travel through a vacuum', 'longitudinal and need a medium', 'transverse and need a medium', 'longitudinal and travel through a vacuum'], 1, 'Sound is a longitudinal wave made of compressions and rarefactions, so it needs particles to travel.'),
  num('Waves', 3, 'The refractive index of glass is 1.5. Calculate the critical angle to 1 decimal place.', 41.8, 'sin c = 1 ÷ n = 1 ÷ 1.5 = 0.667, so c = 41.8°.', { tol: 0.1, unit: '°' }),

  // Electricity
  num('Electricity', 1, 'A current of 2 A flows through a 6 Ω resistor. Calculate the potential difference.', 12, 'V = IR = 2 × 6 = 12 V.', { unit: 'V' }),
  num('Electricity', 1, 'Two resistors of 4 Ω and 8 Ω are in series. Calculate the total resistance.', 12, 'In series resistances add: 4 + 8 = 12 Ω.', { unit: 'Ω', marks: 1 }),
  num('Electricity', 2, 'Resistors of 6 Ω and 3 Ω are connected in parallel. Calculate the total resistance.', 2, '1/R = 1/6 + 1/3 = 1/6 + 2/6 = 3/6, so R = 2 Ω.', { unit: 'Ω', marks: 3 }),
  num('Electricity', 1, 'A mains appliance works at 230 V and draws 5 A. Calculate its power.', 1150, 'P = IV = 5 × 230 = 1150 W.', { unit: 'W' }),
  num('Electricity', 1, 'A current of 3 A flows for 20 s. Calculate the charge transferred.', 60, 'Q = It = 3 × 20 = 60 C.', { unit: 'C' }),
  num('Electricity', 2, 'A 2 kW kettle runs for 3 minutes. Calculate the energy transferred in joules.', 360000, 'E = Pt = 2000 W × 180 s = 360 000 J.', { unit: 'J' }),
  mcq('Electricity', 2, 'In a UK plug, which wire should the fuse be connected to?', ['Neutral', 'Earth', 'Live', 'Any wire'], 2, 'The fuse goes in the live wire so the appliance is isolated if the fuse blows.'),

  // Magnetism
  num('Magnetism', 2, 'A transformer has 200 turns on the primary coil and 50 on the secondary. The primary voltage is 240 V. Calculate the secondary voltage.', 60, 'Vp/Vs = Np/Ns so Vs = 240 × 50 ÷ 200 = 60 V.', { unit: 'V' }),
  mcq('Magnetism', 2, 'Which rule predicts the direction of the force on a current-carrying wire in a magnetic field?', ['Right-hand grip rule', "Fleming's left-hand rule", "Lenz's law", "Newton's third law"], 1, "Fleming's left-hand rule: first finger = field, second finger = current, thumb = force (motion)."),

  // Particles & Matter
  num('Particles & Matter', 1, 'A block has mass 540 g and volume 200 cm³. Calculate its density in g/cm³.', 2.7, 'density = mass ÷ volume = 540 ÷ 200 = 2.7 g/cm³.', { unit: 'g/cm³' }),
  num('Particles & Matter', 2, 'Calculate the energy needed to raise 0.5 kg of water by 20 °C. (specific heat capacity = 4200 J/kg°C)', 42000, 'ΔQ = mcΔθ = 0.5 × 4200 × 20 = 42 000 J.', { unit: 'J' }),
  num('Particles & Matter', 3, 'A gas at 100 kPa has volume 6 litres. At constant temperature it is compressed to 3 litres. Calculate the new pressure in kPa.', 200, 'p₁V₁ = p₂V₂ so p₂ = 100 × 6 ÷ 3 = 200 kPa.', { unit: 'kPa' }),

  // Radioactivity
  num('Radioactivity', 2, 'A sample contains 80 g of a radioactive isotope with a half-life of 5 days. How many grams remain after 15 days?', 10, '15 days = 3 half-lives: 80 → 40 → 20 → 10 g.', { unit: 'g' }),
  mcq('Radioactivity', 1, 'What is an alpha particle?', ['An electron', 'A helium nucleus', 'A high-energy photon', 'A neutron'], 1, 'An alpha particle is 2 protons and 2 neutrons, the same as a helium nucleus.'),
  mcq('Radioactivity', 1, 'Which type of radiation is the most penetrating?', ['Alpha', 'Beta', 'Gamma', 'They are equal'], 2, 'Gamma needs thick lead or concrete to reduce it. Alpha is stopped by paper.'),
  mcq('Radioactivity', 3, 'What happens to the nucleus in beta-minus decay?', ['Mass number −4, atomic number −2', 'Mass number unchanged, atomic number +1', 'Mass number unchanged, atomic number −1', 'Mass number +1, atomic number unchanged'], 1, 'A neutron changes into a proton and an electron is emitted, so the atomic number increases by 1.'),

  // Astrophysics
  mcq('Astrophysics', 2, 'What is the likely end of a star much more massive than the Sun?', ['White dwarf', 'Red giant then white dwarf', 'Supernova then neutron star or black hole', 'Protostar'], 2, 'Massive stars become red supergiants, explode as supernovae, then leave a neutron star or black hole.'),
  mcq('Astrophysics', 2, 'Red-shift of light from distant galaxies provides evidence for...', ['The Earth orbiting the Sun', 'An expanding universe', 'Stars being the same age', 'Gravity being constant'], 1, 'Galaxies moving away have longer wavelengths. Together with CMB it supports the Big Bang.'),
  num('Astrophysics', 3, 'The Earth orbits the Sun at radius 1.5 × 10¹¹ m in 3.16 × 10⁷ s. Calculate the orbital speed in m/s to the nearest 100.', 29800, 'v = 2πr ÷ T = 2π × 1.5 × 10¹¹ ÷ 3.16 × 10⁷ ≈ 29 800 m/s.', { tol: 150, unit: 'm/s' }),
  short('Waves', 1, 'What is the unit of frequency?', ['hertz', 'hz'], 'Frequency is measured in hertz (Hz), meaning waves per second.'),
]
