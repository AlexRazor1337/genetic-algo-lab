const closestToZero = (a, b) => Math.abs(a.getFitness()) - Math.abs(b.getFitness());

class Individual {
    constructor(chromosomeSize, targetX, targetY) {
        this.fitness = 0;
        this.chromosomeSize = chromosomeSize;

        this.chromosome = new Array(this.chromosomeSize).fill();
        this.chromosome = this.chromosome.map(() => Math.round(Math.random()));

        this.targetX = targetX;
        this.targetY = targetY;
    }

    getFitness() {
        this.x = parseInt(this.chromosome.slice(0, this.chromosome.length / 2).join(''), 2);
        this.y = parseInt(this.chromosome.slice(this.chromosome.length / 2).join(''), 2);

        this.fitness = Math.sqrt((this.targetX - this.x) ** 2 + (this.targetY - this.y) ** 2);

        return this.fitness;
    }
}

export default class Genetic {
    constructor(populationSize, chromosomeSize, mutationChance, crossoverChance, targetX, targetY) {
        this.chromosomeSize = chromosomeSize;
        this.populationSize = populationSize;
        this.mutationChance = mutationChance;
        this.crossoverChance = crossoverChance;

        this.population = new Population(populationSize, chromosomeSize, targetX, targetY);
        this.fittest; // Individual
        this.secondFittest; // Individual
        this.epochCount = 0;

        this.meanFitness = [];
        this.bestFitness = [];
        this.bestIndividuals = [];
        this.currentFitness = []
        this.points = []
    }

    selection() {
        this.fittest = this.population.getFittest();

        this.secondFittest = this.population.getSecondFittest();
    }

    crossover() {
        for (let i = 0; i < this.populationSize; i += 2) {
            if (Math.random() < this.crossoverChance) {
                const splitIndex = Math.floor(Math.random() * (this.chromosomeSize));
                const population = this.population.population;

                const firstChromosomeParts = [population[i].chromosome.slice(0, splitIndex), population[i].chromosome.slice(splitIndex)]
                const secondChromosomeParts = [population[i + 1].chromosome.slice(0, splitIndex), population[i + 1].chromosome.slice(splitIndex)]

                population[i].chromosome = firstChromosomeParts[0].concat(secondChromosomeParts[1]);
                population[i + 1].chromosome = secondChromosomeParts[0].concat(firstChromosomeParts[1]);
            }
        }
    }

    mutation() {
        for (let i = 0; i < this.populationSize; i++) {
            let chance = this.mutationChance;

            const medianFitness = this.currentFitness.reduce((acc, cur) => acc + cur, 0) / this.populationSize;
            if (this.population.population[i].fitness <= medianFitness) {
                chance **= 2;
            }

            if (Math.random() < chance) {
                for (let j = 0; j < this.chromosomeSize; j++) {
                    if (Math.random() < chance) {
                        this.population.population[i].chromosome[j] = 1 - this.population.population[i].chromosome[j];
                    }
                }
            }
        }
    }

    getFittestOffspring() {
        if (this.fittest.fitness < this.secondFittest.fitness) return this.fittest;
        return this.secondFittest;
    }

    // Replace least fittest individual from most fittest offspring
    addFittestOffspring() {
        this.fittest.getFitness();
        this.secondFittest.getFitness();

        this.population.population.sort(closestToZero);
        //Replace least fittest individual from most fittest offspring
        this.population.population[this.population.population.length - 1] = this.getFittestOffspring();
    }

    step() {
        this.epochCount += 1;

        this.selection();
        this.crossover();
        this.mutation();

        this.addFittestOffspring();

        this.population.calculateFitness();

        this.currentFitness = this.population.population.map(individual => individual.getFitness());
        this.meanFitness.push(this.currentFitness.reduce((acc, cur) => acc + cur, 0) / this.population.population.length);
        this.bestFitness.push(Math.min(...this.currentFitness));
        this.bestIndividuals.push(this.population.population.find(individual => individual.fitness === this.bestFitness[this.bestFitness.length - 1]))

        const point = this.population.population[Math.floor(this.populationSize / 3)]
        this.points.push({x: point.x, y: point.y});
    }
}

class Population {
    constructor(populationSize, chromosomeSize, targetX, targetY) {
        this.populationSize = populationSize;
        this.population = new Array(this.populationSize).fill();
        this.population = this.population.map(() => new Individual(chromosomeSize, targetX, targetY));
    }

    getFittest() {
        this.population.sort(closestToZero);
        this.fittes = this.population[0].fitness;

        return this.population[0];
    }

    getSecondFittest() {
        this.population.sort(closestToZero);

        return this.population[1];
    }

    calculateFitness() {
        for (let i = 0; i < this.population.length; i++) {
            this.population[i].getFitness();
        }

        this.getFittest();
    }
}
