class Individual {
    constructor(chromosomeSize) {
        this.fitness = 0;
        this.chromosomeSize = chromosomeSize;

        this.chromosome = new Array(this.chromosomeSize).fill();
        this.chromosome = this.chromosome.map(() => Math.round(Math.random()));
    }

    getFitness() {
        this.fitness = this.chromosome.reduce((acc, cur) => acc + cur, 0);

        return this.fitness;
    }
}

export default class Genetic {
    constructor(populationSize, chromosomeSize, mutationChance, crossoverChance) {
        this.chromosomeSize = chromosomeSize;
        this.populationSize = populationSize;
        this.mutationChance = mutationChance;
        this.crossoverChance = crossoverChance;

        this.population = new Population(populationSize, chromosomeSize);
        this.fittest; // Individual
        this.secondFittest; // Individual
        this.epochCount = 0;

        this.meanFitness = [];
        this.maxFitness = [];
        this.currentFitness = []
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

            if (this.population.population[i].fitness >= this.secondFittest.fitness) {
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
        if (this.fittest.fitness > this.secondFittest.fitness) {
            return this.fittest;
        }
        return this.secondFittest;
    }

    // Replace least fittest individual from most fittest offspring
    addFittestOffspring() {
        this.fittest.getFitness();
        this.secondFittest.getFitness();

        this.population.population.sort((a, b) => a.fitness - b.fitness);

        //Replace least fittest individual from most fittest offspring
        this.population.population[0] = this.getFittestOffspring();
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
        this.maxFitness.push(Math.max(...this.currentFitness));
    }
}


class Population {
    constructor(populationSize, chromosomeSize) {
        this.populationSize = populationSize;
        this.population = new Array(this.populationSize).fill();
        this.population = this.population.map(() => new Individual(chromosomeSize));
        this.maxFitness = 0; // int, fitness of fittest individual
    }

    getFittest() {
        this.population.sort((a, b) => a.fitness - b.fitness);
        this.fittes = this.population[this.population.length - 1].fitness;
        return this.population[this.population.length - 1];
    }

    getSecondFittest() {
        this.population.sort((a, b) => a.fitness - b.fitness);

        return this.population[this.population.length - 2];
    }

    calculateFitness() {
        for (let i = 0; i < this.population.length; i++) {
            this.population[i].getFitness();
        }

        this.getFittest();
    }
}
