class Individual {
    constructor(chromosomeSize) {
        this.chromosome = new Array(chromosomeSize).fill();
        this.chromosome = this.chromosome.map(() => Math.round(Math.random()));
    }

    getFitnes() {
        return this.chromosome.reduce((acc, cur) => acc + cur, 0);
    }
}

export default class Genetic {
    constructor(populationSize, eliteSize, chromosomeSize) {
        this.populationSize = populationSize;
        this.chromosomeSize = chromosomeSize;

        this.epochCount = 0;

        this.mutationProb = 0.1; // TODO pass as parameter
        this.crossoverProb = 0.9;

        this.population = new Array(this.populationSize).fill();
        this.population = this.population.map(() => new Individual(chromosomeSize));
        this.meanFitness = [];
        this.maxFitness = [];
        this.currentFitness = [];
    }

    step() {
        this.epochCount += 1;

        this.population = this.selection();
        this.crossover();
        this.mutation();

        this.currentFitness = this.population.map(individual => individual.getFitnes());
        this.meanFitness.push(this.currentFitness.reduce((acc, cur) => acc + cur, 0) / this.population.length);
        this.maxFitness.push(Math.max(...this.currentFitness));
    }

    selection() {
        const offspring = [];
        this.population.forEach(() => {
            let firstInd, secondInd, thirdInd;
            firstInd = secondInd = thirdInd = 0;
            while (firstInd === secondInd || firstInd === thirdInd || secondInd === thirdInd) {
                firstInd = Math.floor(Math.random() * this.population.length);
                secondInd = Math.floor(Math.random() * this.population.length);
                thirdInd = Math.floor(Math.random() * this.population.length);
            }

            // select idividual with max fitness
            // TODO optimize
            const maxFitness = Math.max(this.population[firstInd].getFitnes(), this.population[secondInd].getFitnes(), this.population[thirdInd].getFitnes());
            offspring.push(this.population.find(individual => individual.getFitnes() === maxFitness));
        });

        return offspring;
    }

    crossover() {
        for (let i = 0; i < this.population.length; i += 2) {
            if (Math.random() < this.crossoverProb) {
                const splitIndex = Math.floor(Math.random() * (this.chromosomeSize));
                const firstChromosomeParts = [this.population[i].chromosome.slice(0, splitIndex), this.population[i].chromosome.slice(splitIndex)]
                const secondChromosomeParts = [this.population[i + 1].chromosome.slice(0, splitIndex), this.population[i + 1].chromosome.slice(splitIndex)]

                this.population[i].chromosome = firstChromosomeParts[0].concat(secondChromosomeParts[1]);
                this.population[i + 1].chromosome = secondChromosomeParts[0].concat(firstChromosomeParts[1]);
            }
        }
    }

    mutation() {
        for (let i = 0; i < this.population.length; i++) {
            if (Math.random() < this.mutationProb) {
                for (let j = 0; j < this.chromosomeSize; j++) {
                    if (Math.random() < 0.01) {
                        this.population[i].chromosome[j] = Number(!this.population[i].chromosome[j]);
                    }
                }
            }
        }
    }
}