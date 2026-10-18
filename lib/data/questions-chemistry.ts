import { questionFactory } from './builders'

const { mcq, num, short } = questionFactory('chemistry', 'chem')

export const chemistryQuestions = [
  // Atomic Structure & Periodic Table
  num('Atomic Structure & Periodic Table', 1, 'An atom of sodium is written ²³₁₁Na. How many neutrons does it have?', 12, 'neutrons = mass number − atomic number = 23 − 11 = 12.', { marks: 1 }),
  mcq('Atomic Structure & Periodic Table', 1, 'What is the electronic configuration of chlorine (atomic number 17)?', ['2,8,8', '2,8,7', '2,7,8', '2,6,9'], 1, '17 electrons fill shells 2, then 8, leaving 7 in the third shell.'),
  num('Atomic Structure & Periodic Table', 1, 'An element has electronic configuration 2,8,2. Which group is it in?', 2, 'The number of outer electrons gives the group: 2 outer electrons means Group 2 (magnesium).', { marks: 1 }),
  mcq('Atomic Structure & Periodic Table', 1, 'Isotopes of an element have the same number of...', ['Neutrons', 'Protons', 'Nucleons', 'Mass number'], 1, 'Isotopes are atoms of the same element, so same protons, but different neutrons.'),
  num('Atomic Structure & Periodic Table', 2, 'Chlorine is 75% ³⁵Cl and 25% ³⁷Cl. Calculate the relative atomic mass to 1 decimal place.', 35.5, '(75 × 35 + 25 × 37) ÷ 100 = 35.5.', { tol: 0.05 }),
  mcq('Atomic Structure & Periodic Table', 1, 'Why are noble gases unreactive?', ['They have a full outer shell', 'They are gases', 'They have one outer electron', 'They have high melting points'], 0, 'A full outer shell is stable so they do not gain, lose or share electrons.'),
  mcq('Atomic Structure & Periodic Table', 2, 'How does reactivity change down Group 1?', ['It increases', 'It decreases', 'It stays the same', 'It increases then decreases'], 0, 'Going down, the outer electron is further from the nucleus and is lost more easily.'),
  mcq('Atomic Structure & Periodic Table', 2, 'Chlorine is bubbled through potassium bromide solution. What is formed?', ['Bromine', 'Iodine', 'Potassium chloride only', 'Nothing happens'], 0, 'Chlorine is more reactive than bromine so displaces it. The solution turns orange (and potassium chloride forms).'),

  // Bonding & Structure
  mcq('Bonding & Structure', 1, 'What type of bonding is present in sodium chloride?', ['Covalent', 'Metallic', 'Ionic', 'Hydrogen'], 2, 'A metal and a non-metal bond by transferring electrons, giving ions.'),
  mcq('Bonding & Structure', 2, 'Why does graphite conduct electricity?', ['It has free ions', 'It has delocalised electrons', 'It has metal atoms', 'It is very hard'], 1, 'Each carbon forms three bonds, leaving one delocalised electron that can carry charge.'),
  mcq('Bonding & Structure', 2, 'Why do simple molecular substances have low melting points?', ['Weak covalent bonds', 'Weak intermolecular forces', 'Strong ionic bonds', 'Delocalised electrons'], 1, 'Little energy is needed to overcome the weak forces between molecules. The covalent bonds do not break.'),
  mcq('Bonding & Structure', 1, 'What is the formula of magnesium chloride?', ['MgCl', 'Mg₂Cl', 'MgCl₂', 'Mg₂Cl₂'], 2, 'Mg²⁺ needs two Cl⁻ to balance the charge.'),
  num('Bonding & Structure', 1, 'How many covalent bonds does each carbon atom form in methane, CH₄?', 4, 'Carbon has four outer electrons and shares each with a hydrogen.', { marks: 1 }),
  mcq('Bonding & Structure', 2, 'Why is diamond very hard?', ['Each carbon is bonded to four others by strong covalent bonds', 'It has delocalised electrons', 'It has weak forces between layers', 'It is an ionic lattice'], 0, 'A giant covalent lattice with strong bonds in every direction.'),

  // Chemical Calculations
  num('Chemical Calculations', 1, 'Calculate the relative formula mass of CaCO₃. (Ca = 40, C = 12, O = 16)', 100, '40 + 12 + (3 × 16) = 100.', { marks: 1 }),
  num('Chemical Calculations', 1, 'Calculate the moles in 11 g of CO₂. (Mr = 44)', 0.25, 'moles = mass ÷ Mr = 11 ÷ 44 = 0.25 mol.', { unit: 'mol' }),
  num('Chemical Calculations', 1, 'Calculate the mass of 0.5 mol of NaOH. (Mr = 40)', 20, 'mass = moles × Mr = 0.5 × 40 = 20 g.', { unit: 'g' }),
  num('Chemical Calculations', 2, 'Calculate the percentage by mass of oxygen in MgO. (Mg = 24, O = 16)', 40, '16 ÷ 40 × 100 = 40%.', { unit: '%' }),
  mcq('Chemical Calculations', 2, 'A compound contains 2.4 g of carbon and 0.6 g of hydrogen. What is its empirical formula?', ['CH', 'CH₂', 'CH₃', 'C₂H₃'], 2, 'C: 2.4 ÷ 12 = 0.2 mol. H: 0.6 ÷ 1 = 0.6 mol. Ratio 1 : 3 gives CH₃.'),
  num('Chemical Calculations', 1, 'Calculate the concentration in mol/dm³ when 0.1 mol of solute is dissolved in 250 cm³.', 0.4, 'volume = 0.25 dm³, so concentration = 0.1 ÷ 0.25 = 0.4 mol/dm³.', { unit: 'mol/dm³' }),
  num('Chemical Calculations', 1, 'Calculate the moles in 6 dm³ of gas at room temperature and pressure. (1 mole = 24 dm³)', 0.25, 'moles = 6 ÷ 24 = 0.25 mol.', { unit: 'mol' }),
  num('Chemical Calculations', 1, 'The theoretical yield is 8 g but the actual yield is 6 g. Calculate the percentage yield.', 75, '6 ÷ 8 × 100 = 75%.', { unit: '%' }),
  num('Chemical Calculations', 3, 'For Fe₂O₃ + 3CO → 2Fe + 3CO₂, calculate the atom economy for iron to 1 decimal place. (Fe = 56, O = 16, C = 12)', 45.9, 'Mass of Fe = 2 × 56 = 112. Total reactants = 160 + 84 = 244. 112 ÷ 244 × 100 = 45.9%.', { tol: 0.1, unit: '%', marks: 3 }),

  // Reactions & Energetics
  mcq('Reactions & Energetics', 1, 'What happens in an exothermic reaction?', ['Temperature of the surroundings rises', 'Temperature of the surroundings falls', 'Energy is absorbed', 'Bonds only break'], 0, 'Exothermic reactions release energy to the surroundings.'),
  mcq('Reactions & Energetics', 1, 'Which describes reduction?', ['Loss of electrons', 'Gain of oxygen', 'Gain of electrons', 'Loss of protons'], 2, 'OIL RIG: Oxidation Is Loss, Reduction Is Gain of electrons.'),
  num('Reactions & Energetics', 2, 'Bonds broken need 2000 kJ/mol and bonds formed release 2300 kJ/mol. Calculate the energy change (give a negative value for exothermic).', -300, 'ΔH = energy in − energy out = 2000 − 2300 = −300 kJ/mol.', { unit: 'kJ/mol' }),
  mcq('Reactions & Energetics', 2, 'Which metal will displace copper from copper sulfate solution?', ['Silver', 'Gold', 'Zinc', 'Mercury'], 2, 'Zinc is above copper in the reactivity series.'),
  short('Reactions & Energetics', 2, 'What is produced at the cathode in the electrolysis of molten lead bromide?', ['lead', 'lead metal'], 'Pb²⁺ ions gain electrons at the negative electrode to form lead.'),

  // Acids, Bases & Salts
  mcq('Acids, Bases & Salts', 1, 'A solution has pH 3. What is it?', ['Strongly alkaline', 'Neutral', 'Weakly acidic', 'Weakly alkaline'], 2, 'pH below 7 is acidic. pH 3 is weak to moderately acidic.'),
  mcq('Acids, Bases & Salts', 1, 'What are the products when an acid reacts with a metal carbonate?', ['Salt and hydrogen', 'Salt, water and carbon dioxide', 'Salt and water only', 'Oxide and water'], 1, 'acid + carbonate → salt + water + carbon dioxide.'),
  num('Acids, Bases & Salts', 3, '25.0 cm³ of 0.100 mol/dm³ NaOH is neutralised by 20.0 cm³ of HCl. Calculate the HCl concentration in mol/dm³ (1:1 ratio).', 0.125, 'Moles NaOH = 0.025 × 0.1 = 0.0025. Moles HCl = 0.0025. Conc = 0.0025 ÷ 0.020 = 0.125 mol/dm³.', { tol: 0.001, unit: 'mol/dm³', marks: 3 }),
  mcq('Acids, Bases & Salts', 2, 'What is the positive test result for chloride ions?', ['Blue precipitate with NaOH', 'White precipitate with silver nitrate', 'Cream precipitate with barium chloride', 'Squeaky pop'], 1, 'Add dilute nitric acid then silver nitrate. A white precipitate of silver chloride forms.'),

  // Rates & Equilibrium
  mcq('Rates & Equilibrium', 2, 'Why does increasing temperature increase the rate of reaction?', ['Particles are bigger', 'Particles collide less often', 'More collisions have energy greater than the activation energy', 'Activation energy is lower'], 2, 'Particles move faster, so collide more often and more of the collisions are successful.'),
  mcq('Rates & Equilibrium', 1, 'What does a catalyst do?', ['Increases yield', 'Lowers the activation energy', 'Is used up', 'Changes the products'], 1, 'A catalyst provides an alternative pathway with lower activation energy and is not used up.'),
  mcq('Rates & Equilibrium', 2, 'What is true at dynamic equilibrium?', ['The reaction has stopped', 'Forward and reverse rates are equal', 'Concentrations are equal', 'Only products remain'], 1, 'The reaction continues in both directions at the same rate, so concentrations stay constant.'),
  mcq('Rates & Equilibrium', 2, 'Which are the typical conditions in the Haber process?', ['25 °C, 1 atm, nickel', '450 °C, 200 atm, iron', '1000 °C, 1 atm, platinum', '200 °C, 10 atm, vanadium oxide'], 1, 'About 450 °C, 200 atm and an iron catalyst is the compromise between rate and yield.'),

  // Organic Chemistry
  mcq('Organic Chemistry', 1, 'What is the general formula of the alkanes?', ['CₙH₂ₙ', 'CₙH₂ₙ₊₂', 'CₙH₂ₙ₋₂', 'CₙHₙ'], 1, 'Alkanes are saturated: CₙH₂ₙ₊₂.'),
  mcq('Organic Chemistry', 1, 'What is the molecular formula of pentane?', ['C₅H₁₀', 'C₅H₁₂', 'C₅H₈', 'C₄H₁₀'], 1, 'n = 5 so C₅H₁₂.'),
  mcq('Organic Chemistry', 1, 'What happens when an alkene is shaken with bromine water?', ['Stays orange', 'Turns decolourised', 'Turns green', 'A white precipitate forms'], 1, 'Bromine adds across the C=C double bond, so the orange colour disappears.'),
  mcq('Organic Chemistry', 1, 'Complete combustion of a hydrocarbon produces...', ['Carbon and water', 'Carbon monoxide and water', 'Carbon dioxide and water', 'Carbon dioxide and hydrogen'], 2, 'hydrocarbon + oxygen → carbon dioxide + water.'),
  mcq('Organic Chemistry', 1, 'Fractional distillation of crude oil separates it based on differences in...', ['Density', 'Boiling point', 'Colour', 'Solubility'], 1, 'Shorter chains have lower boiling points and rise higher in the column.'),
  short('Organic Chemistry', 2, 'Name the alcohol with formula C₂H₅OH.', ['ethanol'], 'Two carbons (eth-) with an -OH group gives ethanol.'),
  short('Organic Chemistry', 2, 'Name the polymer made from many ethene molecules.', ['poly(ethene)', 'polyethene', 'polythene', 'poly(ethylene)', 'polyethylene'], 'Addition polymerisation of ethene gives poly(ethene).'),

  // Inorganic & Analysis
  short('Inorganic & Analysis', 1, 'Which gas turns limewater cloudy?', ['carbon dioxide', 'co2', 'co₂'], 'CO₂ reacts with limewater to form insoluble calcium carbonate.'),
  mcq('Inorganic & Analysis', 1, 'A flame test gives a lilac flame. Which metal ion is present?', ['Sodium', 'Potassium', 'Calcium', 'Copper'], 1, 'Sodium is yellow, potassium lilac, calcium orange-red, copper green.'),
  mcq('Inorganic & Analysis', 1, 'What two substances are needed for iron to rust?', ['Oxygen and carbon dioxide', 'Water and nitrogen', 'Oxygen and water', 'Salt and heat'], 2, 'Both oxygen and water are needed.'),
  mcq('Inorganic & Analysis', 2, 'In the blast furnace, which substance is the main reducing agent?', ['Carbon monoxide', 'Limestone', 'Oxygen', 'Slag'], 0, 'CO reduces iron(III) oxide to iron.'),
  num('Inorganic & Analysis', 2, 'A spot travels 3.2 cm while the solvent front travels 8.0 cm. Calculate the Rf value.', 0.4, 'Rf = distance moved by spot ÷ distance moved by solvent = 3.2 ÷ 8.0 = 0.4.', { tol: 0.005, marks: 1 }),
  short('Inorganic & Analysis', 1, 'What separation technique removes an insoluble solid from a liquid?', ['filtration', 'filtering', 'filter'], 'Filtration traps the insoluble solid in the filter paper.'),
]
