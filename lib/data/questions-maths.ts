import { questionFactory } from './builders'

const { mcq, num, short } = questionFactory('maths', 'maths')

export const mathsQuestions = [
  // Number
  mcq('Number', 1, 'Write 84 as a product of its prime factors.', ['2 × 3 × 14', '2² × 3 × 7', '2 × 6 × 7', '4 × 21'], 1, '84 = 2 × 42 = 2 × 2 × 21 = 2² × 3 × 7. Only 2, 3 and 7 are prime.'),
  num('Number', 1, 'Find the highest common factor (HCF) of 36 and 60.', 12, '36 = 2² × 3² and 60 = 2² × 3 × 5. Common factors: 2² × 3 = 12.', { marks: 2 }),
  num('Number', 1, 'Find the lowest common multiple (LCM) of 12 and 18.', 36, '12 = 2² × 3 and 18 = 2 × 3². Take the highest powers: 2² × 3² = 36.', { marks: 2 }),
  num('Number', 2, 'Work out (2.4 × 10⁵) × (3 × 10⁻²). Give your answer as an ordinary number.', 7200, '2.4 × 3 = 7.2 and 10⁵ × 10⁻² = 10³, so 7.2 × 10³ = 7200.', { marks: 2 }),
  mcq('Number', 2, 'Simplify √48.', ['6√2', '4√3', '2√12', '3√4'], 1, '√48 = √(16 × 3) = 4√3. Look for the largest square factor.'),
  num('Number', 1, 'Increase £240 by 15%. Give your answer in pounds.', 276, 'Multiplier 1.15: 240 × 1.15 = 276.', { unit: '£', marks: 2 }),
  num('Number', 2, '£2000 is invested at 5% compound interest per year. Work out the value after 3 years, to the nearest penny.', 2315.25, '2000 × 1.05³ = 2000 × 1.157625 = £2315.25.', { tol: 0.01, unit: '£', marks: 3 }),
  num('Number', 2, 'After a 20% reduction in a sale, a coat costs £36. Work out the original price in pounds.', 45, 'The sale price is 80% of the original, so original = 36 ÷ 0.8 = £45.', { unit: '£', marks: 3 }),

  // Algebra
  num('Algebra', 1, 'Solve 3x − 7 = 11.', 6, 'Add 7: 3x = 18. Divide by 3: x = 6.', { marks: 2 }),
  mcq('Algebra', 1, 'Expand and simplify (x + 3)(x − 5).', ['x² − 2x − 15', 'x² + 2x − 15', 'x² − 2x + 15', 'x² − 8x − 15'], 0, 'x² − 5x + 3x − 15 = x² − 2x − 15.'),
  mcq('Algebra', 1, 'Factorise x² + 5x + 6.', ['(x + 1)(x + 6)', '(x − 2)(x − 3)', '(x + 2)(x + 3)', '(x + 5)(x + 1)'], 2, 'Find two numbers that multiply to 6 and add to 5: 2 and 3.'),
  num('Algebra', 2, 'Solve x² − 3x − 10 = 0. Give the larger solution.', 5, 'Factorise: (x − 5)(x + 2) = 0, so x = 5 or x = −2. The larger is 5.', { marks: 3 }),
  mcq('Algebra', 2, 'Make x the subject of y = 3x + 2.', ['x = 3y − 2', 'x = (y − 2)/3', 'x = (y + 2)/3', 'x = y/3 − 2/3 + 1'], 1, 'Subtract 2: y − 2 = 3x. Divide by 3: x = (y − 2)/3.'),
  num('Algebra', 2, 'x + y = 7 and x − y = 1. Find the value of x.', 4, 'Add the equations: 2x = 8, so x = 4 (and y = 3).', { marks: 3 }),
  mcq('Algebra', 1, 'Find the nth term of the sequence 5, 8, 11, 14, ...', ['n + 4', '3n + 2', '5n − 2', '3n + 5'], 1, 'The common difference is 3, so 3n + c. When n = 1 the term is 5, so c = 2.'),
  mcq('Algebra', 1, 'Solve the inequality 2x + 5 < 13.', ['x < 4', 'x > 4', 'x < 9', 'x < 3'], 0, 'Subtract 5: 2x < 8. Divide by 2: x < 4.'),
  num('Algebra', 3, 'Work out the discriminant b² − 4ac of x² + 4x + 1 = 0.', 12, 'a = 1, b = 4, c = 1: 16 − 4 = 12. It is positive, so there are two real roots.', { marks: 2 }),
  mcq('Algebra', 2, 'Expand and simplify 3(2x − 4) + 2(x + 1).', ['8x − 10', '8x − 14', '8x + 2', '6x − 10'], 0, '6x − 12 + 2x + 2 = 8x − 10.'),

  // Graphs
  num('Graphs', 1, 'Find the gradient of the line through (1, 3) and (5, 11).', 2, 'Gradient = change in y ÷ change in x = (11 − 3) ÷ (5 − 1) = 8 ÷ 4 = 2.', { marks: 2 }),
  mcq('Graphs', 1, 'A line has gradient 2 and passes through (0, −3). What is its equation?', ['y = −3x + 2', 'y = 2x − 3', 'y = 2x + 3', 'y = 3x − 2'], 1, 'y = mx + c with m = 2 and c = −3.'),
  mcq('Graphs', 2, 'Which line is parallel to y = 4x + 1 and passes through (0, 5)?', ['y = 4x + 5', 'y = −4x + 5', 'y = x/4 + 5', 'y = 5x + 4'], 0, 'Parallel lines have the same gradient (4). The y-intercept is 5.'),
  mcq('Graphs', 2, 'Find the midpoint of (2, 6) and (8, −2).', ['(5, 4)', '(6, 4)', '(5, 2)', '(10, 4)'], 2, 'Average the coordinates: ((2 + 8)/2, (6 − 2)/2) = (5, 2).'),

  // Ratio & Proportion
  num('Ratio & Proportion', 2, 'Share £120 in the ratio 2 : 3 : 7. How much is the largest share, in pounds?', 70, 'Total parts = 12, so one part = £10. Largest share = 7 × 10 = £70.', { unit: '£', marks: 2 }),
  num('Ratio & Proportion', 1, 'A car travels 150 km in 2.5 hours. Work out its average speed in km/h.', 60, 'Speed = distance ÷ time = 150 ÷ 2.5 = 60 km/h.', { unit: 'km/h', marks: 2 }),
  num('Ratio & Proportion', 2, 'y is directly proportional to x. y = 12 when x = 4. Find y when x = 7.', 21, 'y = kx, so k = 12 ÷ 4 = 3. When x = 7, y = 21.', { marks: 3 }),
  num('Ratio & Proportion', 1, '450 g of flour makes a recipe for 6 people. How many grams are needed for 10 people?', 750, '450 ÷ 6 = 75 g per person. 75 × 10 = 750 g.', { unit: 'g', marks: 2 }),

  // Geometry
  num('Geometry', 1, 'Work out the area of a circle with radius 6 cm. Give your answer to 1 decimal place.', 113.1, 'Area = πr² = π × 36 = 113.097... cm² ≈ 113.1 cm².', { tol: 0.05, unit: 'cm²', marks: 2 }),
  num('Geometry', 2, 'Work out the size of one interior angle of a regular hexagon, in degrees.', 120, 'Exterior angle = 360 ÷ 6 = 60°. Interior = 180 − 60 = 120°.', { unit: '°', marks: 2 }),
  num('Geometry', 2, 'A cylinder has radius 3 cm and height 10 cm. Work out its volume to 1 decimal place.', 282.7, 'V = πr²h = π × 9 × 10 = 282.74... cm³ ≈ 282.7 cm³.', { tol: 0.05, unit: 'cm³', marks: 2 }),
  num('Geometry', 1, 'A right-angled triangle has shorter sides 9 cm and 12 cm. Find the hypotenuse.', 15, '9² + 12² = 81 + 144 = 225, and √225 = 15 cm.', { unit: 'cm', marks: 2 }),
  num('Geometry', 1, 'Work out the circumference of a circle with diameter 14 cm. Give your answer to 1 decimal place.', 44, 'C = πd = π × 14 = 43.98 cm ≈ 44.0 cm.', { tol: 0.05, unit: 'cm', marks: 2 }),
  num('Geometry', 2, 'Work out the sum of the interior angles of an octagon, in degrees.', 1080, 'Sum = (n − 2) × 180 = 6 × 180 = 1080°.', { unit: '°', marks: 2 }),

  // Trigonometry
  mcq('Trigonometry', 1, 'What is the exact value of sin 30°?', ['√3/2', '1', '1/2', '√2/2'], 2, 'sin 30° = 1/2 is an exact value you must remember.'),
  num('Trigonometry', 2, 'In a right-angled triangle the side opposite angle θ is 7 cm and the hypotenuse is 10 cm. Find θ to 1 decimal place.', 44.4, 'sin θ = 7/10 = 0.7, so θ = sin⁻¹(0.7) = 44.427...° ≈ 44.4°.', { tol: 0.1, unit: '°', marks: 2 }),
  num('Trigonometry', 2, 'A right-angled triangle has hypotenuse 12 cm and an angle of 35°. Find the side adjacent to the angle, to 2 decimal places.', 9.83, 'cos 35° = adj/12, so adj = 12 × cos 35° = 9.83 cm.', { tol: 0.01, unit: 'cm', marks: 2 }),
  num('Trigonometry', 3, 'A triangle has sides 8 cm and 5 cm with an included angle of 30°. Work out its area.', 10, 'Area = ½ab sin C = ½ × 8 × 5 × sin 30° = 20 × 0.5 = 10 cm².', { unit: 'cm²', marks: 2 }),

  // Statistics & Probability
  num('Statistics & Probability', 1, 'Find the mean of 4, 7, 9, 12, 3.', 7, 'Sum = 35 and there are 5 values, so the mean is 7.', { marks: 2 }),
  num('Statistics & Probability', 1, 'Find the median of 3, 9, 4, 12, 7, 5.', 6, 'Order: 3, 4, 5, 7, 9, 12. The middle two are 5 and 7, so the median is 6.', { marks: 2 }),
  num('Statistics & Probability', 1, 'The probability that a counter is red is 0.3. What is the probability it is not red?', 0.7, 'Probabilities add to 1: 1 − 0.3 = 0.7.', { marks: 1 }),
  mcq('Statistics & Probability', 1, 'Two fair coins are thrown. What is the probability both land on heads?', ['1/2', '1/4', '1/3', '2/3'], 1, '1/2 × 1/2 = 1/4.'),
  mcq('Statistics & Probability', 3, 'A bag has 3 red and 5 blue counters. Two are taken without replacement. What is the probability both are red?', ['9/64', '3/28', '3/8', '6/8'], 1, '3/8 × 2/7 = 6/56 = 3/28. The second fraction changes because a counter has been removed.'),
  num('Statistics & Probability', 1, 'Find the range of 3, 9, 4, 12, 7, 5.', 9, 'Range = largest − smallest = 12 − 3 = 9.', { marks: 1 }),
  short('Number', 1, 'What do we call a number that has exactly two factors, 1 and itself?', ['prime', 'prime number', 'a prime number'], 'A prime number has exactly two factors. Note that 1 is not prime.'),
  short('Geometry', 1, 'What is the name of the longest side of a right-angled triangle?', ['hypotenuse', 'the hypotenuse'], 'The hypotenuse is opposite the right angle.'),
]
