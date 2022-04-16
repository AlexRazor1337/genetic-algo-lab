// import * as random from 'random';
// import * as plt from 'matplotlib/pyplot';
var MAX_GENERATIONS, ONE_MAX_LENGTH, POPULATION_SIZE, P_CROSSOVER, P_MUTATION, best_index, fitnessValues, freshFitnessValues, generationCounter, maxFitness, maxFitnessValues, meanFitness, meanFitnessValues, offspring, population;
ONE_MAX_LENGTH = 100;
POPULATION_SIZE = 200;
P_CROSSOVER = 0.9;
P_MUTATION = 0.1;
MAX_GENERATIONS = 50;

class FitnessMax {
    constructor() {
        this.values = [0];
    }

}

class Individual extends Array {
    constructor(...args) {
        super(...args);
        this.fitness = new FitnessMax();
    }

}

function oneMaxFitness(individual) {
    return sum(individual);
}

function individualCreator() {
    return new Individual(function () {
        var _pj_a = [],
                _pj_b = range(ONE_MAX_LENGTH);

        for (var _pj_c = 0, _pj_d = _pj_b.length; _pj_c < _pj_d; _pj_c += 1) {
            var _ = _pj_b[_pj_c];

            _pj_a.push(Math.floor(Math.random()));
        }

        return _pj_a;
    }.call(this));
}

function populationCreator(n = 0) {
    return function () {
        var _pj_a = [];
        for (let i = 0; i < n; i++) {
            _pj_a.push(individualCreator());
        }

        return _pj_a;
    }.call(this);
}

population = populationCreator({
    "n": POPULATION_SIZE
});
generationCounter = 0;

fitnessValues = population.map(individual => oneMaxFitness(individual));

for (var i = 0, _pj_a = population.length; i < _pj_a; i += 1) {
    population[i].fitness.values = fitnessValues[i];
}

maxFitnessValues = [];
meanFitnessValues = [];

function clone(value) {
    var ind;
    ind = new Individual(value.slice(0));
    ind.fitness.values = value.fitness.values[0];
    return ind;
}

function selTournament(population, p_len) {
    var i1, i2, i3;
    offspring = [];

    for (var n = 0, _pj_a = p_len; n < _pj_a; n += 1) {
        i1 = i2 = i3 = 0;

        while (i1 === i2 || i1 === i3 || i2 === i3) {
            i1 = Math.floor(Math.random() * p_len);
            i2 = Math.floor(Math.random() * p_len);
            i3 = Math.floor(Math.random() * p_len);
        }

        offspring.push(Math.max([population[i1], population[i2], population[i3]], {
            "key": x => {
                return x.fitness.values[0];
            }
        }));
    }

    return offspring;
}

function cxOnePoint(child1, child2) {
    var s, temp, temp2;
    s =  2 + Math.floor(Math.random() * child1.length - 3);
    temp = child1.slice(s);
    temp2 = child2.slice(s);
    child1 = child1.slice(0, s) + temp2;
    child2 = child2.slice(0, s) + temp;
}

function mutFlipBit(mutant, indpb = 0.01) {
    for (var i = 0, _pj_a = mutant.length; i < _pj_a; i += 1) {
        if (Math.random() < indpb) {
            mutant[i] = mutant[i] === 1 ? 0 : 1;
        }
    }
}

fitnessValues = function () {
    var _pj_a = [],
            _pj_b = population;

    for (var _pj_c = 0, _pj_d = _pj_b.length; _pj_c < _pj_d; _pj_c += 1) {
        var individual = _pj_b[_pj_c];

        _pj_a.push(individual.fitness.values[0]);
    }

    return _pj_a;
}.call(this);

console.log(population);
while (Math.max(fitnessValues) < ONE_MAX_LENGTH && generationCounter < MAX_GENERATIONS) {
    generationCounter += 1;
    offspring = selTournament(population, population.length).map(individual => clone(individual));
    console.log(offspring);
    for (var i = 0, _pj_a = offspring.length - 1; i < _pj_a; i += 1) {
        if (Math.random() < P_CROSSOVER) {
            cxOnePoint(offspring[i], offspring[i + 1]);
        }
    }

    for (var mutant, _pj_c = 0, _pj_a = offspring, _pj_b = _pj_a.length; _pj_c < _pj_b; _pj_c += 1) {
        mutant = _pj_a[_pj_c];

        if (Math.random() < P_MUTATION) {
            mutFlipBit(mutant, {
                "indpb": 1.0 / ONE_MAX_LENGTH
            });
        }
    }

    freshFitnessValues = offspring.map(individual => oneMaxFitness(individual));

    for (var i = 0, _pj_a = offspring.length; i < _pj_a; i += 1) {
        offspring[i].fitness.values = freshFitnessValues[i];
    }

    population = offspring;

    fitnessValues = function () {
        var _pj_a = [],
                _pj_b = population;

        for (var _pj_c = 0, _pj_d = _pj_b.length; _pj_c < _pj_d; _pj_c += 1) {
            var ind = _pj_b[_pj_c];

            _pj_a.push(ind.fitness.values[0]);
        }

        return _pj_a;
    }.call(this);

    maxFitness = Math.max(fitnessValues);
    console.log(fitnessValues)
    meanFitness = fitnessValues.reduce((acc, cur) => acc + cur, 0) / population.length;
    maxFitnessValues.push(maxFitness);
    meanFitnessValues.push(meanFitness);
    console.log(`Generation: ${generationCounter}, Max Fitness: ${maxFitness}, Mean Fitness: ${meanFitness}\n`);
    best_index = fitnessValues.indexOf(Math.max(fitnessValues));
    console.log(`Best individual: ${population[best_index]}\n`);
}

// plt.plot(maxFitnessValues, {
//     "label": "Max Fitness",
//     "color": "red"
// });
// plt.plot(meanFitnessValues, {
//     "label": "Mean Fitness",
//     "color": "blue"
// });
// plt.show();
